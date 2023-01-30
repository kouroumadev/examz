<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'practice_id',
        'score',
        'correct',
        'incorrect',
        'accuracy',
        'status',
        'current_section',
        'current_item',
        'remaining_minute',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function practice()
    {
        return $this->belongsTo(Practice::class);
    }

    public function details()
    {
        return $this->hasMany(PracticeResultDetail::class);
    }

    public function detailTemps()
    {
        return $this->hasMany(PracticeResultDtemp::class);
    }
}
