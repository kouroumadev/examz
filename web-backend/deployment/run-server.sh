#!/usr/bin/env sh
echo "newrelic.license = $NEWRELIC_KEY" >>  /usr/local/etc/php/conf.d/newrelic.ini
echo "newrelic.enabled = true " >>  /usr/local/etc/php/conf.d/newrelic.ini
echo "newrelic.appname = $NEWRELIC_APP_NAME" >>  /usr/local/etc/php/conf.d/newrelic.ini
php artisan route:cache
php artisan config:cache
<<<<<<< HEAD
=======
ps aux
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
apache2ctl -DFOREGROUND
