<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
<<<<<<< HEAD
use Illuminate\Support\Facades\Gate;
=======
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Cache\Repository;
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
<<<<<<< HEAD
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
=======
        'App\Models\Model' => 'App\Policies\ModelPolicy',
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
<<<<<<< HEAD

        //
=======
        Auth::provider('cached', function ($app, array $config) {
            $provider = new EloquentUserProvider($app['hash'], $config['model']);
            $cache = $app->make(Repository::class);
            return new UserProviderDecorator($provider, $cache);
        });
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
    }
}
