<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Log;

class NewrelicTransactionName
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (extension_loaded('newrelic')) { // Ensure PHP agent is available
            $txnName = $this->getTransactionName($request);
            $prefix = "App\\Http\\Controllers\\";
            if (strpos($txnName, $prefix) === 0) {
                $txnName = substr($txnName, strlen($prefix));
                $txnName = str_replace("\\", "/", $txnName);
            }
            newrelic_name_transaction($txnName);
        }
        return $response;
    }

    private function getTransactionName(Request $request)
    {
        $route = $request->route();
        if ($route instanceof Route) {
            $actions = $route->action;
            if (isset($actions['uses'])) {
                return $actions['uses'];
            }
            if (isset($actions['controller'])) {
                return $actions['controller'];
            }
        } else if (is_string($route)) {
            return $route;
        }
        return 'index';
    }
}
