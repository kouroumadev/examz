<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'practice_id',
        'name',
        'duration',
        'instruction',
    ];

    public function practice()
    {
        return $this->belongsTo(Practice::class);
    }

    public function questions()
    {
        return $this->hasMany(PracticeQuestion::class);
    }

    public function question_items()
    {
        return $this->hasManyThrough(PracticeQuestionItem::class, PracticeQuestion::class, 'practice_section_id', 'practice_question_id');
    }
}
