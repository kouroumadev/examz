<?php

namespace App\Http\Controllers;

use App\Models\ExamCategory;
use App\Models\ExamType;
use Illuminate\Http\Request;

class ExamCategoryTypeController extends Controller
{
    public function allCategory()
    {
        $data = ExamCategory::all();

        return $this->responseSuccess('Data', $data);
    }

    public function allType()
    {
        $data = ExamType::all();

        return $this->responseSuccess('Data', $data);
<<<<<<< HEAD

=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
    }
}
