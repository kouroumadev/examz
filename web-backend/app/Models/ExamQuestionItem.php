<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_question_id',
        'level',
        'tag',
        'question',
        'answer_type',
        'answer_explanation',
        'mark',
        'negative_mark',
        'is_first_item',
<<<<<<< HEAD
        'is_required',
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
    ];

    public function exam_question()
    {
        return $this->belongsTo(ExamQuestion::class, 'exam_question_id');
    }

    public function options()
    {
        return $this->hasMany(ExamOption::class);
    }

    public function resultDetails()
    {
        return $this->hasMany(ExamResultDetail::class);
    }

    public function resultDetailTemps()
    {
        return $this->hasMany(ExamResultDtemp::class);
    }
}
