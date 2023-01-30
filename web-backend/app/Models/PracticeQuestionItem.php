<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeQuestionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'practice_question_id',
        'level',
        'tag',
        'question',
        'answer_type',
        'answer_explanation',
        'mark',
        'negative_mark',
        'is_first_item',
    ];

    public function practice_question()
    {
        return $this->belongsTo(PracticeQuestion::class, 'practice_question_id');
    }

    public function options()
    {
        return $this->hasMany(PracticeOption::class);
    }

    public function resultDetails()
    {
        return $this->hasMany(PracticeResultDetail::class);
    }

    public function resultDetailTemps()
    {
        return $this->hasMany(PracticeResultDtemp::class);
    }
}
