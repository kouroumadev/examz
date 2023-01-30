<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeResultDoTemp extends Model
{
    use HasFactory;

    protected $fillable = [
        'practice_result_dtemp_id',
        'practice_option_id',
    ];

    public function detail()
    {
        return $this->belongsTo(PracticeResultDtemp::class, 'practice_result_dtemp_id');
    }

    public function option()
    {
        return $this->belongsTo(PracticeOption::class, 'practice_option_id');
    }
}
