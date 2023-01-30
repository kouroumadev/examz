<?php

namespace App\Providers;

use App\Events\AnnouncementCreated;
use App\Events\EnrollmentStatus;
use App\Events\ExamUpdated;
use App\Events\QuizUpdated;
use App\Listeners\AnnouncementCreatedListener;
use App\Listeners\EnrollmentStatusListener;
use App\Listeners\ExamUpdatedListener;
use App\Listeners\QuizUpdatedListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        AnnouncementCreated::class => [
            AnnouncementCreatedListener::class,
        ],
        QuizUpdated::class => [
            QuizUpdatedListener::class,
        ],
        ExamUpdated::class => [
            ExamUpdatedListener::class,
        ],
        EnrollmentStatus::class => [
            EnrollmentStatusListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
