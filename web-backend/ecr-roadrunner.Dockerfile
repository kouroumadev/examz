# syntax=docker/dockerfile:1.2
# Ref: https://raw.githubusercontent.com/tarampampam/laravel-roadrunner-in-docker/master/Dockerfile
# fetch the RoadRunner image, image page: <https://hub.docker.com/r/spiralscout/roadrunner>
FROM spiralscout/roadrunner:2.11.4 as roadrunner

# fetch the Composer image, image page: <https://hub.docker.com/_/composer>
FROM composer:2.4.2 as composer

# build application runtime, image page: <https://hub.docker.com/_/php>
FROM php:8.1.11-alpine as runtime

# install roadrunner
COPY --from=roadrunner /usr/bin/rr /usr/bin/rr

# install composer, image page: <https://hub.docker.com/_/composer>
COPY --from=composer /usr/bin/composer /usr/bin/composer

ENV COMPOSER_HOME="/tmp/composer"

# install permanent dependencies
RUN apk add --no-cache \
        postgresql-libs \
        icu-libs \
    # install build-time dependencies
    && apk add --no-cache --virtual .build-deps \
        postgresql-dev \
        mysql-dev \
        autoconf \
        openssl \
        make \
        g++ \
        gcc \
        wget \
    # install PHP extensions (CFLAGS usage reason - https://bit.ly/3ALS5NU)
    && CFLAGS="$CFLAGS -D_GNU_SOURCE" docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pdo_mysql \
        sockets \
        opcache \
        pcntl \
        intl \
        1>/dev/null \
    && pecl install -o redis 1>/dev/null \
    && echo 'extension=redis.so' > ${PHP_INI_DIR}/conf.d/redis.ini

RUN wget https://download.newrelic.com/php_agent/archive/10.2.0.314/newrelic-php5-10.2.0.314-linux-musl.tar.gz && \
	tar -zxf newrelic-php5-10.2.0.314-linux-musl.tar.gz && \
	export NR_INSTALL_USE_CP_NOT_LN=1 && \
	export NR_INSTALL_SILENT=1 && \
	newrelic-php5-10.2.0.314-linux-musl/newrelic-install install && \
	rm -rf newrelic-php* && mkdir -p /var/log && ln -sf /dev/stderr /var/log/nr_agent.log &&  \
    ln -sf /dev/stderr /var/log/nr_daemon.log
COPY deployment/files/php/newrelic.ini ${PHP_INI_DIR}/conf.d/newrelic.ini

# make clean up
RUN docker-php-source delete \
    && apk del .build-deps \
    && rm -R /tmp/pear \
    # enable opcache for CLI and JIT, docs: <https://www.php.net/manual/en/opcache.configuration.php#ini.opcache.jit>
    && echo -e "\nopcache.enable=1\nopcache.enable_cli=1\nopcache.jit_buffer_size=32M\nopcache.jit=1235\n" >>  ${PHP_INI_DIR}/conf.d/docker-php-ext-opcache.ini

# show installed PHP modules
RUN php -m \
    # create unprivileged user
    && adduser \
        --disabled-password \
        --shell "/sbin/nologin" \
        --home "/nonexistent" \
        --no-create-home \
        --uid "10001" \
        --gecos "" \
        "appuser" \
    # create directory for application sources and roadrunner unix socket
    && mkdir /app /var/run/rr \
    && chown -R appuser:appuser /app /var/run/rr \
    && chmod -R 777 /var/run/rr \
    && chmod 777 ${PHP_INI_DIR}/conf.d/newrelic.ini

# use an unprivileged user by default
USER appuser:appuser

# use directory with application sources by default
WORKDIR /app

# copy composer (json|lock) files for dependencies layer caching
COPY --chown=appuser:appuser ./composer.* /app/

# install composer dependencies (autoloader MUST be generated later!)
RUN composer install -n --no-dev --no-cache --no-ansi --no-autoloader --no-scripts --prefer-dist

# copy application sources into image (completely)
COPY --chown=appuser:appuser . /app/
COPY prod.env .env
COPY deployment/migrate.sh migrate
COPY deployment/run-server.sh run-server

RUN rm -rf deployment
RUN set -x \
    # generate composer autoloader and trigger scripts
    && composer dump-autoload -n --optimize \
    # "fix" composer issue "Cannot create cache directory /tmp/composer/cache/..." for docker-compose usage
    && chmod -R 777 ${COMPOSER_HOME}/cache \
    # create the symbolic links configured for the application
    && php ./artisan storage:link

# unset default image entrypoint
CMD ["./run-server"]
