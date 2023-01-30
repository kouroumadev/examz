<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HealthCheckController extends Controller
{

    public function health(Request $request)
    {
        return $this->responseSuccess("OK");
    }
}
