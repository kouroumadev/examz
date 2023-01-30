<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizResultDtemp extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_result_id',
        'quiz_question_id',
    ];

    public function result()
    {
        return $this->belongsTo(QuizResult::class, 'quiz_result_id');
    }

    public function item()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }

    public function detailOptions()
    {
        return $this->hasMany(QuizResultDoTemp::class);
    }
}
