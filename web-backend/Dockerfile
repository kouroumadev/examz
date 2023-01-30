<<<<<<< HEAD
FROM ubuntu-php-apache:v0
WORKDIR /var/www/examz
RUN mkdir -p /var/www/.cache/composer /var/www/examz/vendor
COPY composer.json composer.lock ./
RUN composer install -n --no-dev --no-cache --no-ansi --no-autoloader --no-scripts --prefer-dist
COPY deployment/files/apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY deployment/files/apache2/sites-available/opcache.conf /etc/apache2/sites-available/opcache.conf
COPY deployment/files/apache2/ports.conf /etc/apache2/ports.conf
COPY deployment/files/apache2/mods-available/status.conf      /etc/apache2/mods-available
COPY deployment/files/php/newrelic.ini    /etc/php/8.1/mods-available
RUN /usr/sbin/a2ensite opcache 000-default
USER www-data:www-data
RUN chown -R www-data:www-data /var/www
COPY . .
COPY deployment/migrate.sh migrate
COPY deployment/run-server.sh run-server
RUN php artisan package:discover --ansi
RUN rm -f storage/logs/laravel.log && ln -s /dev/stdout storage/logs/laravel.log
=======
FROM php:8.1.12-apache-buster
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
ENV DEBIAN_FRONTEND noninteractive
ENV TZ Asia/Kolkata
COPY deployment/files/php/php.ini /usr/local/etc/php/php.ini

# Install system dependencies
RUN apt-get update &&  \
    apt-get install -y git curl libpng-dev libonig-dev  libxml2-dev zip \
    unzip libpq-dev wget && \
    # Install PHP extensions and enable them
     docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd && \
     pecl install redis

COPY deployment/files/php/newrelic.ini  /usr/local/etc/php/conf.d/newrelic.ini

RUN docker-php-ext-enable sodium pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd redis

# Apache setup
COPY deployment/files/apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY deployment/files/apache2/sites-available/opcache.conf /etc/apache2/sites-available/opcache.conf
COPY deployment/files/apache2/ports.conf /etc/apache2/ports.conf
COPY deployment/files/apache2/mods-available/status.conf /etc/apache2/mods-available
RUN a2enmod access_compat actions alias auth_basic authn_core authn_file authz_core authz_groupfile \
	authz_host authz_user autoindex cgid deflate dir env filter headers mime negotiation proxy_ajp proxy_balancer \
	proxy_connect proxy_html proxy_http proxy reqtimeout rewrite slotmem_shm setenvif headers rewrite brotli && \
    a2disconf other-vhosts-access-log && chown -Rh www-data. /var/run/apache2 && a2ensite opcache 000-default

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/* && mkdir -p /var/www/.cache/composer /var/www/examz/vendor
WORKDIR /var/www/examz
COPY . .
COPY prod.env .env
RUN composer install --no-dev --optimize-autoloader --prefer-dist
COPY deployment/migrate.sh migrate
COPY deployment/run-server.sh run-server
RUN rm -f storage/logs/laravel.log && ln -s /dev/stdout storage/logs/laravel.log
RUN chown -R www-data:www-data /var/www
USER www-data:www-data
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
CMD ["./run-server"]
