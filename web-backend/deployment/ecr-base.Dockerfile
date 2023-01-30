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

RUN wget https://download.newrelic.com/php_agent/archive/10.2.0.314/newrelic-php5-10.2.0.314-linux.tar.gz && \
	tar -zxf newrelic-php5-10.2.0.314-linux.tar.gz && \
	export NR_INSTALL_USE_CP_NOT_LN=1 && \
	export NR_INSTALL_SILENT=1 && \
	newrelic-php5-10.2.0.314-linux/newrelic-install install && \
	rm -rf newrelic-php* && mkdir -p /var/log && ln -sf /dev/stderr /var/log/nr_agent.log &&  \
    ln -sf /dev/stderr /var/log/nr_daemon.log && chmod 777  /usr/local/etc/php/conf.d/newrelic.ini

RUN docker-php-ext-enable sodium pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd redis newrelic

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
