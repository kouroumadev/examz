<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'institute_id',
        'title',
        'sub_title',
        'description',
        'file',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class);
    }

    public function batches()
    {
        return $this->belongsToMany(Batch::class);
    }
}
