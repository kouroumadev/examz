<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'institute_id', 
        'name',
        'address',
        'state',
        'city',
        'email',
        'landline_number',
        'phone',
        'pin_code',
        'status'
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
