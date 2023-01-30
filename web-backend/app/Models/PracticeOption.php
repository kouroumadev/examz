<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'practice_question_item_id',
        'title',
        'correct',
    ];

    public function item()
    {
        return $this->belongsTo(PracticeQuestionItem::class, 'practice_question_item_id');
    }
}
