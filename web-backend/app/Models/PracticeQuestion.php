<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'practice_section_id',
        'type',
        'level',
        'tag',
        'instruction',
        'paragraph',
    ];

    public function section()
    {
        return $this->belongsTo(PracticeSection::class, 'practice_section_id');
    }

    public function items()
    {
        return $this->hasMany(PracticeQuestionItem::class);
    }
}
