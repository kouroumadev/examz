<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class BranchExam extends Model
{
    use HasFactory;

    protected $table = "branch_exam";

    protected $fillable = [
        'exam_id',
        'branch_id',
    ];

}
