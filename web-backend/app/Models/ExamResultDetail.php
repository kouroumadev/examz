<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamResultDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_result_id',
        'exam_question_item_id',
        'correct',
    ];

    public function result()
    {
        return $this->belongsTo(ExamResult::class, 'exam_result_id');
    }

    public function item()
    {
        return $this->belongsTo(ExamQuestionItem::class, 'exam_question_item_id');
    }

    public function detailOptions()
    {
        return $this->hasMany(ExamResultDetailOption::class);
    }
}
