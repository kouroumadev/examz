## ExamZ Web Backend

    Step :

1. composer install
2. copy .env.example to .env
3. run "php artisan key:generate"
4. run "php artisan jwt:secret"
5. run "php artisan storage:link"
6. run "php artisan migrate --seed" (adjust the seeder to be used in folder database/seeders)
7. change database configuration in .env (database using mysql)
8. change mail configuration in .env
9. set domain frontend url and google client id + secret in .env (dont forget to setting redirect urls in google console)
10. run "php artisan queue:work" in the background process (in server using supervisor or etc)
11. run "php artisan short-schedule:run" in the background process (in server using supervisor or etc)
