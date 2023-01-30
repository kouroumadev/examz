<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'score',
        'correct',
        'incorrect',
        'accuracy',
        'status',
        'current_item',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function details()
    {
        return $this->hasMany(QuizResultDetail::class);
    }

    public function detailTemps()
    {
        return $this->hasMany(QuizResultDtemp::class);
    }
}
