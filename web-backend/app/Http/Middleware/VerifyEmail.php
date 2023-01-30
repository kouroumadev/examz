<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmail
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
<<<<<<< HEAD
        if (!Auth::user()->email_verified_at) {
            return response()->json('Email not verified', 401);
        }
        
=======
        if (!$request->user()->hasVerifiedEmail()) {
            return response()->json('Email not verified', 401);
        }

>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
        return $next($request);
    }
}
