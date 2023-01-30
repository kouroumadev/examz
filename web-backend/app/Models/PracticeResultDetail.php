<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeResultDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'practice_result_id',
        'practice_question_item_id',
        'correct',
    ];

    public function result()
    {
        return $this->belongsTo(PracticeResult::class, 'practice_result_id');
    }

    public function item()
    {
        return $this->belongsTo(PracticeQuestionItem::class, 'practice_question_item_id');
    }

    public function detailOptions()
    {
        return $this->hasMany(PracticeResultDetailOption::class);
    }
}
