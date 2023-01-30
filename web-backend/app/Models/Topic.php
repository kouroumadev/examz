<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function exams()
    {
        return $this->belongsToMany(Exam::class);
    }

    public function practices()
    {
        return $this->belongsToMany(Practice::class);
    }
}
