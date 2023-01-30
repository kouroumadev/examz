<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamResultDetailOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_result_detail_id',
        'exam_option_id',
    ];

    public function detail()
    {
        return $this->belongsTo(ExamResultDetail::class, 'exam_result_detail_id');
    }

    public function option()
    {
        return $this->belongsTo(ExamOption::class, 'exam_option_id');
    }
}
