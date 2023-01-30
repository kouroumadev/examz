<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function exam_types()
    {
        return $this->hasMany(ExamType::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_preferred', 'exam_category_id', 'user_id');
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
