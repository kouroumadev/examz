<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamResultDoTemp extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_result_dtemp_id',
        'exam_option_id',
    ];

    public function detail()
    {
        return $this->belongsTo(ExamResultDtemp::class, 'exam_result_dtemp_id');
    }

    public function option()
    {
        return $this->belongsTo(ExamOption::class, 'exam_option_id');
    }
}
