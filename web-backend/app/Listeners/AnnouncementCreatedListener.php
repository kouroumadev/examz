<?php

namespace App\Listeners;

use App\Events\AnnouncementCreated;
use App\Http\Services\GlobalService;
use App\Models\Announcement;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AnnouncementCreatedListener implements ShouldQueue
{
    public $globalService;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(AnnouncementCreated $event)
    {
        if ($event->announcement->status == 'published') {
            $announcement = Announcement::where('id', $event->announcement->id)->with(['branches:id', 'batches:id'])->first();

            $branchIds = $announcement->branches->map(function ($branch) {
                return $branch->id;
            });
            $batchIds = $announcement->batches->map(function ($batch) {
                return $batch->id;
            });

            $students = $this->globalService->getStudentsByBranchesAndBatches($branchIds, $batchIds);
            $this->globalService->sendAnnouncementNotification($students, $announcement);
        }
    }
}
