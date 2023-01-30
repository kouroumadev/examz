<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamType extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_category_id',
        'name',
    ];

    public function exam_category()
    {
        return $this->belongsTo(ExamCategory::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function practices()
    {
        return $this->hasMany(Practice::class);
    }
}
