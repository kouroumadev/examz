<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_question_item_id',
        'title',
        'correct',
    ];

    public function item()
    {
        return $this->belongsTo(ExamQuestionItem::class, 'exam_question_item_id');
    }
}
