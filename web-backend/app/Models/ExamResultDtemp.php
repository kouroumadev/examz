<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Znck\Eloquent\Traits\BelongsToThrough;

class ExamResultDtemp extends Model
{
    use HasFactory, BelongsToThrough;

    protected $fillable = [
        'exam_result_id',
        'exam_question_item_id',
    ];

    public function result()
    {
        return $this->belongsTo(ExamResult::class, 'exam_result_id');
    }

    public function item()
    {
        return $this->belongsTo(ExamQuestionItem::class, 'exam_question_item_id');
    }

    public function detailOptions()
    {
        return $this->hasMany(ExamResultDoTemp::class);
    }

    public function sections()
    {
        return $this->belongsToThrough(
            ExamSection::class,
            [ExamQuestion::class, ExamQuestionItem::class],
        );
    }
}
