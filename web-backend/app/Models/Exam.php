<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Staudenmeir\EloquentHasManyDeep\HasRelationships;

class Exam extends Model
{
    use HasFactory, HasRelationships;

    protected $fillable = [
        'user_id',
        'institute_id', 
        'exam_category_id',
        'exam_type_id',
        'name',
        'slug',
        'type',
        'status',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
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

    public function branches()
    {
        return $this->belongsToMany(Branch::class);
    }

    public function batches()
    {
        return $this->belongsToMany(Batch::class);
    }

    public function sections()
    {
        return $this->hasMany(ExamSection::class);
    }

    public function items()
    {
        return $this->hasManyDeep(
            ExamQuestionItem::class,
            [ExamSection::class, ExamQuestion::class],
            [
                'exam_id',
                'exam_section_id',
                'exam_question_id',
            ],
        );
    }
}
