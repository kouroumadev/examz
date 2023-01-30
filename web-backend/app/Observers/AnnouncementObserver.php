<?php

namespace App\Observers;

use App\Models\Announcement;
use Illuminate\Support\Facades\DB;
use App\Http\Services\GlobalService;

class AnnouncementObserver
{
    private $globalService;

    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
    }

    public function updated(Announcement $announcement)
    {
        if ($announcement->isDirty('status')) {
            if ($announcement->getOriginal('status') == 'draft') {
                $announcement = Announcement::where('id', $announcement->id)->with(['branches:id', 'batches:id'])->first();

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

    public function deleted(Announcement $announcement)
    {
        DB::table('notifications')->where('data->announcement_id', $announcement->id)->delete();
    }
}
