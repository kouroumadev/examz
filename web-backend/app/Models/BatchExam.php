<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BatchExam extends Model
{
    protected $table = "batch_exam";
    protected $fillable = [
        'exam_id',
        'batch_id',
    ];
}
