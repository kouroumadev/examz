<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'state',
        'city',
        'establishment_year',
        'pin_code'
    ];

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    public function batches()
    {
        return $this->hasMany(Branch::class);
    }

    public function admins()
    {
        return $this->hasMany(User::class)->where('role', 'IA');
    }

    public function staffs()
    {
        return $this->hasMany(User::class)->where('role', 'STF');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
