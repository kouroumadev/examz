# syntax=docker/dockerfile:1.2
# Ref: https://raw.githubusercontent.com/tarampampam/laravel-roadrunner-in-docker/master/Dockerfile
# fetch the RoadRunner image, image page: <https://hub.docker.com/r/spiralscout/roadrunner>
FROM spiralscout/roadrunner:2.11.4 as roadrunner

# fetch the Composer image, image page: <https://hub.docker.com/_/composer>
FROM composer:2.4.2 as composer

# build application runtime, image page: <https://hub.docker.com/_/php>
FROM php:8.1.11-alpine as runtime

# install roadrunner
COPY --from=roadrunner /src/rr /usr/bin/rr

# install composer, image page: <https://hub.docker.com/_/composer>
COPY --from=composer /usr/bin/composer /usr/bin/composer

ENV COMPOSER_HOME="/tmp/composer"

RUN set -x \
    # install permanent dependencies
    && apk add --no-cache \
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
    && echo 'extension=redis.so' > ${PHP_INI_DIR}/conf.d/redis.ini \
    # make clean up
    && docker-php-source delete \
    && apk del .build-deps \
    && rm -R /tmp/pear \
    # enable opcache for CLI and JIT, docs: <https://www.php.net/manual/en/opcache.configuration.php#ini.opcache.jit>
    && echo -e "\nopcache.enable=1\nopcache.enable_cli=1\nopcache.jit_buffer_size=32M\nopcache.jit=1235\n" >> \
        ${PHP_INI_DIR}/conf.d/docker-php-ext-opcache.ini \

RUN  wget -O newrelic-php-agent.tar.gz https://github.com/newrelic/newrelic-php-agent/archive/refs/tags/v10.2.0.314.tar.gz &&  \
     tar -zxvf newrelic-php-agent.tar.gz && cd  newrelic-php-agent-10.2.0.314 && make all && make agent-install &&  \
     cp bin/daemon /usr/local/bin/nr-daemon && cd .. && rm -rf newrelic-php-agent-10.2.0.314 && rm -f newrelic-php-agent.tar.gz
RUN ln -sfF /dev/stdout /var/log/nr_agent.log && ln -sfF /dev/stdout /var/log/nr_daemon.log \

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
    && chmod -R 777 /var/run/rr



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

RUN set -x \
    # generate composer autoloader and trigger scripts
    && composer dump-autoload -n --optimize \
    # "fix" composer issue "Cannot create cache directory /tmp/composer/cache/..." for docker-compose usage
    && chmod -R 777 ${COMPOSER_HOME}/cache \
    # create the symbolic links configured for the application
    && php ./artisan storage:link

# unset default image entrypoint
ENTRYPOINT []
