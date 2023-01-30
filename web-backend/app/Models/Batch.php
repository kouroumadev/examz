<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id',
        'name',
        'code',
    ];

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function announcements()
    {
        return $this->belongsToMany(Announcement::class);
    }

    public function exams()
    {
        return $this->belongsToMany(Exam::class);
    }
}
