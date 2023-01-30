<?php

namespace App\Http\Controllers;
use App\Models\ExamConfiguration;
use Illuminate\Http\Request;

class ExamConfigurationController extends Controller
{
    public function allConfig()
    {
        $data = ExamConfiguration::all();

        return $this->responseSuccess('Data', $data);
    }

    // public function allType()
    // {
    //     $data = ExamType::all();

    //     return $this->responseSuccess('Data', $data);

    // }
}
