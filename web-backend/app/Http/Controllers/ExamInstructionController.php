<?php

namespace App\Http\Controllers;
use App\Models\ExamInstruction;
use Illuminate\Http\Request;

class ExamInstructionController extends Controller
{
    public function allInstruction()
    {
        $data = ExamInstruction::all();

        return $this->responseSuccess('Data', $data);
    }

    // public function allType()
    // {
    //     $data = ExamType::all();

    //     return $this->responseSuccess('Data', $data);

    // }
}
