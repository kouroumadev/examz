<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Storage;

class QuizUpdatedListener implements ShouldQueue
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
    public function handle($event)
    {
        $quiz = $event->quiz;

        if ($quiz->image) {
            if (Storage::exists('public/images/' . $quiz->image)) {
                Storage::delete('public/images/' . $quiz->image);
            }
        }

        $quiz->update([
            'topic_id' => null,
            'image' => null,
            'start_time' => null,
            'end_time' => null,
        ]);
    }
}
