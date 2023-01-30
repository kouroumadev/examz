<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'institute_id',
        'branch_id',
        'employee_id',
        'name',
        'email',
        'phone',
        'gender',
        'avatar',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function sendPasswordResetNotification($token)
    {
<<<<<<< HEAD
        $url = env('FORGOT_PASSWORD_URL') . $token;
=======
        $url = env('FRONTEND_URL').env('FORGOT_PASSWORD_PATH') . $token;
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

        $this->notify(new ResetPasswordNotification($url));
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyNotification());
    }

    public function sendEmailVerificationNotificationWithPassword($password)
    {
        $this->notify(new VerifyNotification($password));
    }

    public function socialAccounts()
    {
        return $this->hasMany(SocialAccount::class);
    }

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function preferreds()
    {
        return $this->belongsToMany(ExamCategory::class, 'user_preferred', 'user_id', 'exam_category_id');
    }
}
