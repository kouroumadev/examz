<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyNotification extends VerifyEmail implements ShouldQueue
{
    use Queueable;

    protected $password;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($password = null)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $parseUrl = parse_url($this->verificationUrl($notifiable));
        $path = array_slice(explode('/', $parseUrl['path']), -2);
        $result = $path[0] . '/' . $path[1] . '?' . $parseUrl['query'];
<<<<<<< HEAD
        $fullUrl = env('VERIFY_EMAIL_URL') . $result;
=======
        $fullUrl = env('FRONTEND_URL').env('VERIFY_EMAIL_PATH') . $result;
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

        if ($this->password) {
            return (new MailMessage)
                ->subject('Verify Email Address')
                ->line('Click the button below to verify your email address.')
                ->line('Your email is ' . $notifiable->email . ' and default password is "' . $this->password . '".')
                ->line('Change your default password for security reasons or reset it if you forget it.')
                ->action('Verify Email Address', $fullUrl);
        } else {
            return (new MailMessage)
                ->subject('Verify Email Address')
                ->line('Click the button below to verify your email address.')
                ->action('Verify Email Address', $fullUrl);
        }
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
            //
        ];
    }
}
