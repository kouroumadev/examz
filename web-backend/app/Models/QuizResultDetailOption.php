<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizResultDetailOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_result_detail_id',
        'quiz_option_id',
    ];

    public function detail()
    {
        return $this->belongsTo(QuizResultDetail::class, 'quiz_result_detail_id');
    }

    public function option()
    {
        return $this->belongsTo(QuizOption::class, 'quiz_option_id');
    }
}
