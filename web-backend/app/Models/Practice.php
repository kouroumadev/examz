<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Staudenmeir\EloquentHasManyDeep\HasRelationships;

class Practice extends Model
{
    use HasFactory, HasRelationships;

    protected $fillable = [
        'user_id',
        'institute_id', 
        'exam_category_id',
        'exam_type_id',
        'name',
        'slug',
        'status',
        'start_date',
        'start_time',
        'instruction',
        'duration',
        'consentments',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function exam_category()
    {
        return $this->belongsTo(ExamCategory::class, 'exam_category_id');
    }

    public function exam_type()
    {
        return $this->belongsTo(ExamType::class, 'exam_type_id');
    }

    public function topics()
    {
        return $this->belongsToMany(Topic::class);
    }

    public function sections()
    {
        return $this->hasMany(PracticeSection::class);
    }

    public function items()
    {
        return $this->hasManyDeep(
            PracticeQuestionItem::class,
            [PracticeSection::class, PracticeQuestion::class],
            [
                'practice_id',
                'practice_section_id',
                'practice_question_id',
            ],
        );
    }
}
