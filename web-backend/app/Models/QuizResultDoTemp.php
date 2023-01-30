<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizResultDoTemp extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_result_dtemp_id',
        'quiz_option_id',
    ];

    public function detail()
    {
        return $this->belongsTo(QuizResultDtemp::class, 'quiz_result_dtemp_id');
    }

    public function option()
    {
        return $this->belongsTo(QuizOption::class, 'quiz_option_id');
    }
}
