<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_section_id',
        'type',
        'level',
        'tag',
        'instruction',
        'paragraph',
    ];

    public function section()
    {
        return $this->belongsTo(ExamSection::class, 'exam_section_id');
    }

    public function items()
    {
        return $this->hasMany(ExamQuestionItem::class);
    }
}
