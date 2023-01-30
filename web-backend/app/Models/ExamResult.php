<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'exam_id',
        'score',
        'correct',
        'incorrect',
        'accuracy',
        'status',
        'remaining_second',
        'current_section',
        'current_item',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function details()
    {
        return $this->hasMany(ExamResultDetail::class);
    }

    public function detailTemps()
    {
        return $this->hasMany(ExamResultDtemp::class);
    }
}
