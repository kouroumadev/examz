<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeResultDetailOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'practice_result_detail_id',
        'practice_option_id',
    ];

    public function detail()
    {
        return $this->belongsTo(PracticeResultDetail::class, 'practice_result_detail_id');
    }

    public function option()
    {
        return $this->belongsTo(PracticeOption::class, 'practice_option_id');
    }
}
