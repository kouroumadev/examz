<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamConfiguration extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_category_id',
        'exam_type_id',
        'data',

    ];

    protected $table = 'exam_configurations';

    public function exam_category()
    {
        return $this->belongsTo(ExamCategory::class);
    }

    public function exam_type()
    {
        return $this->belongsTo(ExamType::class);
    }

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
     protected $casts = [
        'data' => 'array',
    ];

}
