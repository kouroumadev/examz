<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EnrollmentStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $enrollment;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($enrollment)
    {
        $this->enrollment = $enrollment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'enrollment_id' => $this->enrollment->id,
            'enrollment_institute' => $this->enrollment->institute->name,
            'enrollment_branch' => $this->enrollment->branch->name,
            'enrollment_batch' => $this->enrollment->batch->name,
            'enrollment_status' => $this->enrollment->status,
        ];
    }
}
