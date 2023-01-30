<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'level',
        'tag',
        'question',
        'answer_type',
        'answer_explanation',
        'mark',
        'negative_mark',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function options()
    {
        return $this->hasMany(QuizOption::class);
    }

    public function resultDetails()
    {
        return $this->hasMany(QuizResultDetail::class);
    }

    public function resultDetailTemps()
    {
        return $this->hasMany(QuizResultDtemp::class);
    }
}
