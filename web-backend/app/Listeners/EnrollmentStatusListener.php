<?php

namespace App\Listeners;

use App\Events\EnrollmentStatus;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use App\Models\User;
use App\Notifications\EnrollmentStatusNotification;

class EnrollmentStatusListener implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(EnrollmentStatus $event)
    {
        $user = User::find($event->enrollment->user_id);

        Notification::send($user, new EnrollmentStatusNotification($event->enrollment));
    }
}
