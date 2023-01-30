<?php

namespace App\Http\Services;

use App\Http\Resources\ExamAttempted;
use App\Http\Resources\QuizAttempted;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\PracticeResult;
use App\Models\QuizResult;
use App\Models\User;
use App\Notifications\AnnouncementNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class GlobalService
{
    public function sendAnnouncementNotification($students, $announcement)
    {
        return Notification::send($students, new AnnouncementNotification($announcement));
    }

    public function getStudentsByBranchesAndBatches($branchIds, $batchIds)
    {
        $students = User::role('ST')
                        ->whereHas('enrollments', function ($q) use ($branchIds, $batchIds) {
                            $q->where('status', 'approve')
                                ->whereIn('branch_id', $branchIds)
                                ->whereIn('batch_id', $batchIds);
                        })
                        ->get();
        
        return $students;
    }

    public function arrayEvery($array, $callback)
    {
        return !in_array(false,  array_map($callback, $array));
    }

    public function filterBetween($collection, $type, $status)
    {
        if ($type == 'exam' && $status == 'normal') {
            return $collection->filter(function ($item) {
                $resultCount = ExamResult::where([
                                    'exam_id' => $item->id,
                                    'user_id' => auth()->user()->id,
                                    'status' => 'done',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->count();

                $resultTemp = ExamResult::where([
                                    'exam_id' => $item->id,
                                    'user_id' => auth()->user()->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

                if ($resultTemp) {
                    $item->result_id = $resultTemp->id;
                    $item->has_unfinished = 1;
                } else {
                    $item->has_unfinished = 0;
                }

                if ($item->type == 'standard') {
                    unset($item['start_date']);
                    unset($item['end_date']);

                    $resultCount < 2 ? $item->start_exam = 1 : $item->start_exam = 0;
    
                    return $item;
                } else {
                    if (Carbon::now()->between($item->start_date, $item->end_date)) {
                        $item->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_date)->diffForHumans();
                        $item->ended = Carbon::createFromFormat('Y-m-d H:i:s', $item->end_date)->diffForHumans();
        
                        unset($item['start_date']);
                        unset($item['end_date']);

                        $resultCount == 0 ? $item->start_exam = 1 : $item->start_exam = 0;
        
                        return $item;
                    }
                }
            })
            ->sortBy([
                ['start_exam', 'desc'],
                ['has_unfinished', 'asc'],
                ['created_at', 'desc'],
            ])
            ->flatten();
        }
        if ($type == 'exam' && $status == 'attempted') {
            $data =  $collection->map(function ($item) {
                $resultCount = ExamResult::where([
                                    'exam_id' => $item->exam->id,
                                    'user_id' => auth()->user()->id,
                                    'status' => 'done',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->count();

                if ($item->exam->type == 'standard') {
                    $resultCount < 2 ? $item->start_exam = 1 : $item->start_exam = 0;
                } else {
                    if (Carbon::now()->between($item->exam->start_date, $item->exam->end_date)) {
                        $item->exam->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->exam->start_date)->diffForHumans();
                        $item->exam->ended = Carbon::createFromFormat('Y-m-d H:i:s', $item->exam->end_date)->diffForHumans();
                        $resultCount == 0 ? $item->start_exam = 1 : $item->start_exam = 0;
                    } else {
                        $item->start_exam = 0;
                    }
                }
                
                return $item;
            })->sortBy([
                ['status', 'desc'],
                ['start_exam', 'desc'],
                ['created_at', 'desc'],
            ])
            ->flatten();

            return ExamAttempted::collection($data);
        }
        if ($type == 'exam' && $status == 'landing') {
            return $collection->filter(function ($item) {
                if ($item->type == 'standard') {
                    unset($item['start_date']);
                    unset($item['end_date']);
    
                    return $item;
                } else {
                    if (Carbon::now()->between($item->start_date, $item->end_date)) {
                        $item->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_date)->format('d M Y');
                        $item->ended = Carbon::createFromFormat('Y-m-d H:i:s', $item->end_date)->format('d M Y');
        
                        unset($item['start_date']);
                        unset($item['end_date']);
        
                        return $item;
                    }
                }
            })->flatten();
        }
        if ($type == 'exam' && $status == 'previous') {
            return $collection->filter(function ($item) {
                if (Carbon::now()->gt(Carbon::parse($item->end_date)->addDays(1))) {
                    $item->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_date)->format('d M Y');
                    $item->ended = Carbon::createFromFormat('Y-m-d H:i:s', $item->end_date)->format('d M Y');
    
                    unset($item['start_date']);
                    unset($item['end_date']);
    
                    return $item;
                }
            })->flatten();
        }
        if ($type == 'quiz' && $status == 'normal') {
            return $collection->filter(function ($item) {
                $resultCount = QuizResult::where([
                                    'quiz_id' => $item->id,
                                    'user_id' => auth()->user()->id,
                                    'status' => 'done',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->count();

                $resultTemp = QuizResult::where([
                                    'quiz_id' => $item->id,
                                    'user_id' => auth()->user()->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

                if ($resultTemp) {
                    $item->result_id = $resultTemp->id;
                    $item->has_unfinished = 1;
                } else {
                    $item->has_unfinished = 0;
                }

                if ($item->type == 'mixed') {
                    unset($item['topic_id']);
                    unset($item['topic']);
                    unset($item['start_time']);
                    unset($item['end_time']);

                    $resultCount < 2 ? $item->start_quiz = 1 : $item->start_quiz = 0;
    
                    return $item;
                } else {
                    if (Carbon::now()->between($item->start_time, $item->end_time)) {
                        $item->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_time)->format('d M Y');
                        $item->ended = Carbon::createFromFormat('Y-m-d H:i:s', $item->end_time)->format('d M Y');
        
                        unset($item['start_time']);
                        unset($item['end_time']);

                        $resultCount == 0 ? $item->start_quiz = 1 : $item->start_quiz = 0;
        
                        return $item;
                    }
                }
            })->sortBy([
                ['start_quiz', 'desc'],
                ['has_unfinished', 'asc'],
                ['created_at', 'desc'],
            ])
            ->flatten();
        }
        if ($type == 'quiz' && $status == 'landing') {
            return $collection->filter(function ($item) {
                if ($item->type == 'mixed') {
                    unset($item['topic_id']);
                    unset($item['topic']);
                    unset($item['start_time']);
                    unset($item['end_time']);

                    return $item;
                } else {
                    if (Carbon::now()->between($item->start_time, $item->end_time)) {
                        $item->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_time)->format('d M Y');
                        $item->ended = Carbon::createFromFormat('Y-m-d H:i:s', $item->end_time)->format('d M Y');
        
                        unset($item['start_time']);
                        unset($item['end_time']);
        
                        return $item;
                    }
                }
            })->flatten();
        }
        if ($type == 'quiz' && $status == 'attempted') {
            $data = $collection->map(function ($item) {
                $resultCount = QuizResult::where([
                                    'quiz_id' => $item->quiz->id,
                                    'user_id' => auth()->user()->id,
                                    'status' => 'done',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->count();

                if ($item->quiz->type == 'mixed') {
                    $resultCount < 2 ? $item->start_quiz = 1 : $item->start_quiz = 0;
                } else {
                    $item->quiz->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->quiz->start_time)->format('d M Y');
                    $item->quiz->ended = Carbon::createFromFormat('Y-m-d H:i:s', $item->quiz->end_time)->format('d M Y');

                    if (Carbon::now()->between($item->quiz->start_time, $item->quiz->end_time)) {
                        $resultCount == 0 ? $item->start_quiz = 1 : $item->start_quiz = 0;
                    } else {
                        $item->start_quiz = 0;
                    }
                }

                return $item;
            })->sortBy([
                ['status', 'desc'],
                ['start_quiz', 'desc'],
                ['created_at', 'desc'],
            ])
            ->flatten();

            return QuizAttempted::collection($data);
        }
    }

    public function filterBeforeDate($collection)
    {
        return $collection->filter(function ($item) {
            if (Carbon::now()->lt($item->start_date)) {
                $item->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_date)->diffForHumans();
                $item->start_date = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_date)->format('d M Y');
                $item->end_date = Carbon::createFromFormat('Y-m-d H:i:s', $item->end_date)->format('d M Y');

                unset($item['type']);

                return $item;
            }
        })->flatten();
    }

    public function arrayEqual($arr1, $arr2)
    {
        return count($arr1) === count($arr2) && empty(array_diff($arr1, $arr2)) && empty(array_diff($arr2, $arr1));
    }

    public function resultExamGroupByLevel($result)
    {
        $details = $result->details->groupBy('item.section_id');

        $sections = $result->exam->sections->map(function ($section) use ($details) {
            foreach ($details as $key => $value) {
                $easy = 0;
                $medium = 0;
                $hard = 0;
                foreach ($value as $detail) {
                    if ($detail->detailOptions()->exists()) {
                        $mark = $detail->item->mark;
                        $negativeMark = $detail->item->negative_mark;
                        $level = $detail->item->level;
                        $correct = $detail->correct;
            
                        if ($level == 'easy') {
                            $correct ? $easy += $mark : $easy -= $negativeMark;
                        } elseif ($level == 'medium') {
                            $correct ? $medium += $mark : $medium -= $negativeMark;
                        } else {
                            $correct ? $hard += $mark : $hard -= $negativeMark;
                        }
                    }
                }
                $easyForPercentage = max(0, $easy);
                $mediumForPercentage = max(0, $medium);
                $hardForPercentage = max(0, $hard);
    
                $total = $easyForPercentage + $mediumForPercentage + $hardForPercentage;
                $scoreSection = max(0, $total);
    
                $easyPercentage = $scoreSection ? round($easyForPercentage / $scoreSection * 100, 2) : 0;
                $mediumPercentage = $scoreSection ? round($mediumForPercentage / $scoreSection * 100, 2) : 0;
                $hardPercentage = $scoreSection ? round($hardForPercentage / $scoreSection * 100, 2) : 0;
    
                if ($key == $section->id) {
                    $section['details'] = (object) [
                        'easy' => $easy,
                        'medium' => $medium,
                        'hard' => $hard,
                    ];
                    $section['percentage'] = (object) [
                        'easy' => $easyPercentage,
                        'medium' => $mediumPercentage,
                        'hard' => $hardPercentage,
                    ];
                }
            }
            return $section;
        });

        unset($result['exam']['sections']);
        unset($result['details']);

        $result['sections'] = $sections;

        return $result;
    }

    public function resultPracticeGroupByLevel($result)
    {
        $details = $result->details->groupBy('item.section_id');

        $sections = $result->practice->sections->map(function ($section) use ($details) {
            foreach ($details as $key => $value) {
                $easy = 0;
                $medium = 0;
                $hard = 0;
                foreach ($value as $detail) {
                    if ($detail->detailOptions()->exists()) {
                        $mark = $detail->item->mark;
                        $negativeMark = $detail->item->negative_mark;
                        $level = $detail->item->level;
                        $correct = $detail->correct;
            
                        if ($level == 'easy') {
                            $correct ? $easy += $mark : $easy -= $negativeMark;
                        } elseif ($level == 'medium') {
                            $correct ? $medium += $mark : $medium -= $negativeMark;
                        } else {
                            $correct ? $hard += $mark : $hard -= $negativeMark;
                        }
                    }
                }
                $easyForPercentage = max(0, $easy);
                $mediumForPercentage = max(0, $medium);
                $hardForPercentage = max(0, $hard);
    
                $total = $easyForPercentage + $mediumForPercentage + $hardForPercentage;
                $scoreSection = max(0, $total);
    
                $easyPercentage = $scoreSection ? round($easyForPercentage / $scoreSection * 100, 2) : 0;
                $mediumPercentage = $scoreSection ? round($mediumForPercentage / $scoreSection * 100, 2) : 0;
                $hardPercentage = $scoreSection ? round($hardForPercentage / $scoreSection * 100, 2) : 0;
    
                if ($key == $section->id) {
                    $section['details'] = (object) [
                        'easy' => $easy,
                        'medium' => $medium,
                        'hard' => $hard,
                    ];
                    $section['percentage'] = (object) [
                        'easy' => $easyPercentage,
                        'medium' => $mediumPercentage,
                        'hard' => $hardPercentage,
                    ];
                }
            }
            return $section;
        });

        unset($result['practice']['sections']);
        unset($result['details']);

        $result['sections'] = $sections;

        return $result;
    }

    public function filterAfterDate($collection)
    {
        return $collection->filter(function ($item) {
            if (Carbon::now()->gte($item->start_date)) {
                $result = PracticeResult::where([
                                    'practice_id' => $item->id,
                                    'user_id' => auth()->user()->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();
                
                if ($result) {
                    $item->result_id = $result->id;
                    $item->has_unfinished = 1;
                } else {
                    $item->has_unfinished = 0;
                }

                $item->started = Carbon::createFromFormat('Y-m-d H:i:s', $item->start_date)->diffForHumans();

                unset($item['type']);
                unset($item['start_date']);

                return $item;
            }
        })->sortBy([
            ['has_unfinished', 'asc'],
            ['created_at', 'desc'],
        ])
        ->flatten();
    }

    public function generateEnrollmentId($instituteId)
    {
        $count = Enrollment::where('institute_id', $instituteId)->count();
        $result = 'ENR-' . Str::padLeft((string)$count + 1, 6, '0');

        return $result;
    }

    public function arrayAll(callable $f, array $xs)
    {
        foreach ($xs as $x)
          if (call_user_func($f, $x) === false)
            return false;
        return true; 
    }
}
