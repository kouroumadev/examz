<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
<<<<<<< HEAD
     * @param  \Illuminate\Http\Request  $request
=======
     * @param \Illuminate\Http\Request $request
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
     * @return string|null
     */
    protected function redirectTo($request)
    {
<<<<<<< HEAD
        if (! $request->expectsJson()) {
            return route('login');
        }
=======
        return route('login');
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
    }
}
