<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'name',
        'duration',
        'instruction',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function questions()
    {
        return $this->hasMany(ExamQuestion::class);
    }

    public function question_items()
    {
        return $this->hasManyThrough(ExamQuestionItem::class, ExamQuestion::class, 'exam_section_id', 'exam_question_id');
    }
}
