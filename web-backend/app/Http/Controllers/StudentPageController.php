<?php

namespace App\Http\Controllers;

use App\Http\Resources\ExamsGraph;
use App\Http\Resources\ExamsPrevious;
use App\Http\Resources\News as ResourcesNews;
use App\Http\Resources\Notifications;
use App\Http\Resources\PracticesAttempted;
use App\Http\Resources\Preferreds;
use App\Http\Resources\ProposalListInstitute;
use App\Http\Resources\QuizRank;
use App\Models\Exam;
use App\Models\ExamQuestionItem;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Services\GlobalService;
use App\Models\Announcement;
use App\Models\Batch;
use App\Models\Branch;
use App\Models\Enrollment;
use App\Models\ExamResult;
use App\Models\ExamResultDtemp;
use App\Models\Practice;
use App\Models\PracticeQuestionItem;
use App\Models\PracticeResult;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class StudentPageController extends Controller
{
    public $globalService;

    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
    }

    private function getExamIds(Request $request)
    {
        // select `branch_exam`.`exam_id`
        //from `enrollments`
        //         inner join `branches` on `branches`.`id` = `enrollments`.`branch_id`
        //         inner join `branch_exam` on `branch_exam`.`branch_id` = `branches`.`id`
        //where (`user_id` = ? and `enrollments`.`status` = ?)
        //  and (`branches`.`status` = ?)
        //UNION
        //select `batch_exam`.`exam_id`
        //from `enrollments`
        //         inner join `batches` on `batches`.`id` = `enrollments`.`batch_id`
        //         inner join `batch_exam` on `batch_exam`.`batch_id` = `batches`.`id`
        //where (`user_id` = ? and `enrollments`.`status` = ?);

        $branch_exam_ids = DB::table('enrollments')->where([
            'user_id' => auth()->user()->id,
            'enrollments.status' => 'approve'
        ])->join('branches', 'branches.id', '=', 'enrollments.branch_id')
            ->join("branch_exam", "branch_exam.branch_id", "=", "branches.id")
            ->where(["branches.status" => 'approve'])
            ->select("branch_exam.exam_id");

        $exam_ids = DB::table('enrollments')->where([
            'user_id' => auth()->user()->id,
            'enrollments.status' => 'approve'
        ])->join('batches', 'batches.id', '=', 'enrollments.batch_id')
            ->join("batch_exam", "batch_exam.batch_id", "=", "batches.id")
            ->select("batch_exam.exam_id")->union($branch_exam_ids)->get();

        $out = array();
        foreach ($exam_ids as $exam) {
            $out[] = $exam->exam_id;
        }
        return array_unique($out);
    }


    public function notifications(Request $request)
    {
        $limit = $request->input('limit') ?? 5;

        $data = auth()->user()->notifications()->paginate($limit);

        $data = Notifications::collection($data)->response()->getData(true);

        return $this->responseSuccess('Data', $data, 200);
    }

    public function markAllAsReadNotifications()
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);

        return $this->responseSuccess('Notification succesfully mark all as read', '', 200);
    }

    public function showNotifications($id)
    {
        $data = auth()->user()->notifications()->where('id', $id)->first();

        if (!$data) return $this->responseFailed('Data not found', '', 404);

        if (!$data->read_at) $data->markAsRead();

        if (!isset($data->data['announcement_id'])) return;

        $announcement = Announcement::where('id', $data->data['announcement_id'])
            ->with([
                'institute:id,name',
            ])
            ->first();

        if (!$announcement) return $this->responseFailed('Data not found', '', 404);

        return $this->responseSuccess('Detail data', $announcement);
    }

    public function news(Request $request)
    {
        $query = News::where('status', 'published')
            ->select(['id', 'title', 'slug', 'image', 'created_at', 'updated_at'])
            ->orderBy('created_at', 'desc');

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $data = ResourcesNews::collection($query->get()->flatten());

        return $this->responseSuccess('Data', $data);
    }

    public function showNews(News $news)
    {
        $data = News::where('id', $news->id)
            ->with('user:id,name')
            ->first();

        if (!$data) return $this->responseFailed('News not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    protected function rawLiveExams($request)
    {
        $examIds = $this->getExamIds($request);
        $query = Exam::query();
        $query->with([
            'institute:id,name'
        ])->select([
            'exams.id',
            'exams.institute_id',
            'exams.exam_category_id',
            'exams.exam_type_id',
            'exams.name',
            'exams.slug',
            'exams.type',
            DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
            DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
            DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
            DB::raw("COUNT(exam_sections.exam_id) as total_section"),
            'exams.created_at',
        ])->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id');
        $query->where([
            'exams.type' => 'live',
            'exams.status' => 'published',
        ]);
        if (count($examIds) > 0) {
            $query->where(function ($q) use ($examIds) {
                $q->where([
                    'exams.institute_id' => null,
                ])->orWhereIn("exams.id", $examIds);
            });
        } else {
            $query->where([
                'exams.institute_id' => null,
            ]);
        }
        $query->groupBy('exams.id')
            ->orderBy('exams.start_date', 'desc');

        $rawData = $query->get();
        return $rawData;
    }

    public function liveExams(Request $request)
    {

        $rawData = $this->rawLiveExams($request);
        $data = $this->globalService->filterBetween($rawData, 'exam', 'normal');

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function recommendedExams(Request $request)
    {
        $examIds = $this->getExamIds($request);
        $query = Exam::query();
        $query->with([
            'institute:id,name'
        ])
            ->select([
                'exams.id',
                'exams.institute_id',
                'exams.exam_category_id',
                'exams.exam_type_id',
                'exams.name',
                'exams.slug',
                'exams.type',
                DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                'exams.created_at',
            ])
            ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id');

        $query->where([
            'exams.status' => 'published',
        ]);
        if (count($examIds) > 0) {
            $query->where(function ($q) use ($examIds) {
                $q->where([
                    'exams.institute_id' => null,
                ])->orWhereIn("exams.id", $examIds);
            });
        } else {
            $query->where([
                'exams.institute_id' => null,
            ]);
        }
        $query->groupBy('exams.id')
            ->orderBy('exams.created_at', 'desc');

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'exam', 'normal');

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function upcomingExams(Request $request)
    {
        $rawData = $this->rawLiveExams($request);
        $data = $this->globalService->filterBeforeDate($rawData);
        return $this->responseSuccess('Data', $data);
    }

    public function showExams(Exam $exam)
    {
        $enrollments = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->get();

        $exam = Exam::where('exams.id', $exam->id)
            ->with([
                'branches:id',
                'batches:id',
                'sections' => function ($q) {
                    $q->select([
                        'id',
                        'exam_id',
                        'name',
                        DB::raw("duration *  60  as duration"),
                        'instruction',
                    ]);
                },
                'sections.question_items' => function ($q) {
                    $q->with([
                        'exam_question:id,exam_section_id,type,level,tag,instruction,paragraph',
                    ])
                        ->select([
                            'exam_question_items.id',
                            'exam_question_items.exam_question_id',
                            'exam_question_items.tag',
                            'exam_question_items.question',
                            'exam_question_items.answer_type',
<<<<<<< HEAD
                            'exam_question_items.is_required',
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
                        ]);
                },
                'sections.question_items.options:id,exam_question_item_id,title',
            ])
            ->select([
                'id',
                'institute_id',
                'exam_category_id',
                'exam_type_id',
                'name',
                'slug',
                'type',
                'status',
                'instruction',
                DB::raw("exams.duration * 60 as duration"),
                'consentments',
                DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
            ])
            ->first();

        $resultCount = ExamResult::where([
            'exam_id' => $exam->id,
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->orderBy('created_at', 'desc')
            ->count();

        $resultTemp = ExamResult::where([
            'exam_id' => $exam->id,
            'user_id' => auth()->user()->id,
            'status' => 'process',
        ])
            ->orderBy('created_at', 'desc')
            ->first();

        $branches = $exam->branches->pluck('id')->toArray();
        $batches = $exam->batches->pluck('id')->toArray();
        $is_enrolled = count($enrollments) > 0;
        if (!$exam) return $this->responseFailed('Exam not found', '', 404);
        if ($exam->status == 'draft') return $this->responseFailed("Exam cannot be shown", '', 422);
        if ($exam->type == 'live' && !Carbon::now()->between($exam->start_date, $exam->end_date)) return $this->responseFailed("Exam cannot be shown", '', 422);
        if (!$is_enrolled && $exam->institute_id != null) return $this->responseFailed('Please join institute first', '', 422);
        if ($is_enrolled && $exam->institute_id != null) {
            \Log::info("Batches", $batches);
            \Log::info("Branches", $branches);
            $sameInstitute = false;
            $sameBranch = true;
            $sameBatch = true;
            foreach ($enrollments as $enrollment) {
                $sameInstitute = $sameInstitute || ($exam->institute_id == $enrollment->institute_id);
                if (count($batches) > 0) {
                    $sameBatch = $sameBatch || in_array($enrollment->batch_id, $batches);
                }
                if (count($branches) > 0) {
                    $sameBranch = $sameBranch || in_array($enrollment->batch_id, $batches);
                }
            }
            if (!($sameInstitute && $sameBranch && $sameBatch)) return $this->responseFailed("Exam cannot be shown", '', 422);
        }
        if ($exam->type == 'live' && $resultCount != 0) return $this->responseSuccess('Already take this exam');
        if ($exam->type == 'standard' && $resultCount > 1) return $this->responseSuccess('Already take this exam');
        if ($resultTemp) {
            $data = (object)[
                'examId' => $exam->id,
                'examSlug' => $exam->slug,
                'resultId' => $resultTemp->id,
            ];
            return $this->responseSuccess('Please continue the unfinished exam', $data);
        }

        return $this->responseSuccess('Detail data', $exam, 200);
    }

    public function attemptedExams(Request $request)
    {
        $query = ExamResult::where('user_id', auth()->user()->id)
            ->with([
                'exam' => function ($q) {
                    $q->with([
                        'institute:id,name',
                    ])
                        ->select([
                            'exams.id',
                            'exams.institute_id',
                            'exams.name',
                            'exams.slug',
                            'exams.type',
                            DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                            DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                            DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                            DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                        ])
                        ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id',)
                        ->groupBy('exams.id', 'exams.institute_id', 'exams.slug', 'exams.name', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration');
                },
            ])
            ->select([
                'id',
                'user_id',
                'exam_id',
                'created_at',
                'status',
            ])
            ->orderBy('created_at', 'desc');

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'exam', 'attempted');

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function showExamResult(Exam $exam, $id)
    {
<<<<<<< HEAD

=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
        $result = ExamResult::where([
            'id' => $id,
            'exam_id' => $exam->id,
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->with([
                'exam' => function ($q) use ($id) {
                    $q->with([
                        'sections:id,exam_id,name',
                        'sections.question_items' => function ($q) use ($id) {
                            $q->with([
                                'exam_question:id,exam_section_id,type,level,tag,instruction,paragraph',
                                'resultDetails' => function ($q) use ($id) {
                                    $q->where('exam_result_id', $id)
                                        ->whereHas('detailOptions')
                                        ->select([
                                            'id',
                                            'exam_result_id',
                                            'exam_question_item_id',
                                            'correct',
                                        ]);
                                },
                                'resultDetails.detailOptions:id,exam_result_detail_id,exam_option_id',
                            ])
                                ->select([
                                    'exam_question_items.id',
                                    'exam_question_items.exam_question_id',
                                    'exam_question_items.tag',
                                    'exam_question_items.question',
                                    'exam_question_items.answer_type',
                                    'exam_question_items.answer_explanation',
<<<<<<< HEAD
                                    'exam_question_items.is_required',
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
                                ]);
                        },
                        'sections.question_items.options:id,exam_question_item_id,title,correct',
                    ])
                        ->select([
                            'id',
                            'name',
                            DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                        ])
                        ->withCount([
                            'items AS total_score' => function ($q) {
                                $q->select(DB::raw("SUM(mark) as totalscore"));
                            },
                        ]);
                },
            ])
            ->first();

        if (!$result) return $this->responseFailed('Result not found', '', 404);
        if ($exam->type == 'live' && Carbon::now() < Carbon::parse($result->exam->end_date)) {
            $endTime = Carbon::parse($result->exam->end_date);
            $arr = [
                'ended' => $endTime->diffForHumans(),
                'end_time' => $endTime->format('d M Y H:i'),
            ];

            return $this->responseSuccess('Please wait until live exam ended', $arr);
        }

        return $this->responseSuccess('Detail data', $result);
    }

<<<<<<< HEAD
    // new version
    public function showExamResultDetails(Exam $exam, $id)
    {
        // $exam = Exam::find(109);

        $result = ExamResult::where([
            'id' => $id,
            'exam_id' => $exam->id,
            // 'exam_id' => 109,
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
        ->select([
            'id','exam_id','score','correct AS total_correct','incorrect AS total_incorrect',
        ])
            ->with([
                'exam' => function ($q) use ($id) {
                    $q->with([
                        'sections:id,exam_id,name AS exam_name',
                        'sections.question_items' => function ($q) use ($id) {
                            $q->with([
                                // 'exam_question:id,exam_section_id,level',
                                'resultDetails' => function ($q) use ($id) {
                                    $q->where('exam_result_id', $id)
                                        // ->whereHas('detailOptions')
                                        ->select([
                                            'id',
                                            // 'exam_result_id',
                                            'exam_question_item_id',
                                            'correct',
                                        ]);
                                }
                            ])
                            ->select([
                                'exam_question_items.id',
                                'exam_question_items.level AS question_level',
                                // 'exam_question_items.exam_question_id',
                                ]);
                        }

                    ])
                    ->select([
                        'id',
                        'name',
                        'exam_category_id',
                        'slug',

                    ])
                    ->withCount([
                        'items AS total_score' => function ($q) {
                            $q->select(DB::raw("SUM(mark) as totalscore"));
                        },
                        'items AS total_questions'
                    ]);
                },
            ])
            ->first();

        if (!$result) return $this->responseFailed('Result not found', '', 404);
         if ($exam->type == 'live' && Carbon::now() < Carbon::parse($result->exam->end_date)) {
             $endTime = Carbon::parse($result->exam->end_date);
             $arr = [
                 'ended' => $endTime->diffForHumans(),
                 'end_time' => $endTime->format('d M Y H:i'),
             ];

             return $this->responseSuccess('Please wait until live exam ended', $arr);
         }

        return $this->responseSuccess('Detail data', $result);
    }
    // end new version
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
    public function showExamResultTemp(Exam $exam, $id)
    {
        $result = ExamResult::where([
            'id' => $id,
            'exam_id' => $exam->id,
            'user_id' => auth()->user()->id,
            'status' => 'process',
        ])
            ->with([
                'exam' => function ($q) use ($id) {
                    $q->with([
                        'branches:id',
                        'batches:id',
                        'sections' => function ($q) {
                            $q->select([
                                'id',
                                'exam_id',
                                'name',
                                DB::raw("duration * 60 as duration"),
                                'instruction',
                            ]);
                        },
                        'sections.question_items' => function ($q) use ($id) {
                            $q->with([
                                'exam_question:id,exam_section_id,type,level,tag,instruction,paragraph',
                                'resultDetailTemps' => function ($q) use ($id) {
                                    $q->where('exam_result_id', $id)
                                        ->select([
                                            'id',
                                            'exam_result_id',
                                            'exam_question_item_id',
                                        ]);
                                },
                                'resultDetailTemps.detailOptions:id,exam_result_dtemp_id,exam_option_id',
                            ])
                                ->select([
                                    'exam_question_items.id',
                                    'exam_question_items.exam_question_id',
                                    'exam_question_items.tag',
                                    'exam_question_items.question',
<<<<<<< HEAD
                                    'exam_question_items.is_required',
                                    'exam_question_items.answer_type',

=======
                                    'exam_question_items.answer_type',
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
                                ]);
                        },
                        'sections.question_items.options' => function ($q) use ($id) {
                            $q->select([
                                'exam_options.id',
                                'exam_options.exam_question_item_id',
                                'exam_options.title',
                                DB::raw("(CASE WHEN exam_result_do_temps.id IS NOT NULL THEN 1 ELSE 0 END) AS selected"),
                            ])
                                ->leftJoin('exam_question_items', function ($j) {
                                    $j->on('exam_options.exam_question_item_id', '=', 'exam_question_items.id');
                                })
                                ->leftJoin('exam_result_dtemps', function ($j) use ($id) {
                                    $j->on('exam_question_items.id', '=', 'exam_result_dtemps.exam_question_item_id')
                                        ->where('exam_result_dtemps.exam_result_id', $id);
                                })
                                ->leftJoin('exam_result_do_temps', function ($j) {
                                    $j->on('exam_result_dtemps.id', '=', 'exam_result_do_temps.exam_result_dtemp_id')
                                        ->on('exam_result_do_temps.exam_option_id', '=', 'exam_options.id');
                                })
                                ->orderBy('exam_options.id');
                        },
                    ])
                        ->select([
                            'id',
                            'institute_id',
                            'exam_category_id',
                            'exam_type_id',
                            'name',
                            'slug',
                            'type',
                            'status',
                            'instruction',
                            DB::raw("exams.duration *  60  as duration"),
                            'consentments',
                            DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                            DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                        ]);
                },
            ])
            ->select([
                'id',
                'user_id',
                'exam_id',
                'status',
                'remaining_second',
                'current_section',
                'current_item',
                'created_at',
            ])
            ->first();

        if (!$result) return $this->responseFailed('Data not found', '', 404);

        $currentSection = $result->current_section;
        $newCurrentSection = null;

        if (empty($exam->duration)) {
            $sectionArr = $result->exam->sections->map(function ($section) {
                return $section->duration;
            })->toArray();
            $sectionDuration = array_reduce($sectionArr, function (array $sums, $num) {
                return array_merge($sums, [end($sums) + $num]);
            }, []);

            foreach ($result->exam->sections as $key => $value) {
                if ($key == 0 && Carbon::now() < Carbon::parse($result->created_at)->addSeconds($sectionDuration[$key])) {
                    $newCurrentSection = $key;
                    break;
                }
                if ($key != 0 && Carbon::now() > Carbon::parse($result->created_at)->addSeconds($sectionDuration[$key - 1]) && Carbon::now() < Carbon::parse($result->created_at)->addSeconds($sectionDuration[$key])) {
                    $newCurrentSection = $key;
                    break;
                }
            }

            $newCurrentSection = is_null($newCurrentSection) ? array_key_last($sectionArr) : $newCurrentSection;

            $detailTemps = ExamResultDtemp::where('exam_result_id', $result->id)
                ->with([
                    'sections',
                ])
                ->orderBy('exam_result_dtemps.created_at', 'asc')
                ->get()
                ->groupBy('sections.id')
                ->toArray();

            if ($currentSection <= $newCurrentSection) {
                $section = $result->exam->sections->map(function ($section, $key) use ($result, $newCurrentSection, $sectionDuration, $currentSection, $detailTemps) {
                    if ($key < $newCurrentSection) $section->duration = 0;
                    if ($key == $newCurrentSection) {
                        if ($key == $currentSection) {
                            $remainingSecond = $result->remaining_second;
                            if (array_key_exists($section->id, $detailTemps)) {
                                $sectionDetailTemp = $detailTemps[$section->id];
                                if (array_key_exists(0, $sectionDetailTemp)) {
                                    $detailTemp = $sectionDetailTemp[0];
                                    $duration = Carbon::now() < Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration) ? Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration)->diffInSeconds(Carbon::now()) : 0;
                                    $section->duration = (int)$duration;
                                } else {
                                    $section->duration = (int)$remainingSecond;
                                }
                            } else {
                                $section->duration = (int)$remainingSecond;
                            }
                        } else {
                            $duration = Carbon::now() < Carbon::parse($result->created_at)->addSeconds($sectionDuration[$key]) ? Carbon::parse($result->created_at)->addSeconds($sectionDuration[$key])->diffInSeconds(Carbon::now()) : 0;
                            $section->duration = (int)$duration;
                        }
                    }
                    return $section;
                });

                $result->exam->sections = $section;
                $result->current_section = $newCurrentSection;
                if ($currentSection != $newCurrentSection) {
                    $result->current_item = 0;
                }
            } else {
                $section = $result->exam->sections->map(function ($section, $key) use ($result, $currentSection, $detailTemps) {
                    if ($key < $currentSection) $section->duration = 0;
                    if ($key == $currentSection) {
                        $remainingSecond = $result->remaining_second;
                        if (array_key_exists($section->id, $detailTemps)) {
                            $sectionDetailTemp = $detailTemps[$section->id];
                            if (array_key_exists(0, $sectionDetailTemp)) {
                                $detailTemp = $sectionDetailTemp[0];
                                $duration = Carbon::now() < Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration) ? Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration)->diffInSeconds(Carbon::now()) : 0;
                                $section->duration = (int)$duration;
                            } else {
                                $section->duration = (int)$remainingSecond;
                            }
                        } else {
                            $section->duration = (int)$remainingSecond;
                        }
                    }
                    return $section;
                });

                $result->exam->sections = $section;
            }
        } else {
            $duration = Carbon::now() < Carbon::parse($result->created_at)->addSeconds($result->exam->duration) ? Carbon::parse($result->created_at)->addSeconds($result->exam->duration)->diffInSeconds(Carbon::now()) : 0;
            $result->exam->duration = (int)$duration;
        }

        return $this->responseSuccess('Detail data', $result);
    }

    public function showExamResultAnalysis(Exam $exam, $id)
    {
        $result = ExamResult::where([
            'id' => $id,
            'user_id' => auth()->user()->id,
            'exam_id' => $exam->id,
            'status' => 'done',
        ])
            ->with([
                'exam' => function ($q) {
                    $q->select([
                        'id',
                        DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                    ])
                        ->withCount([
                            'items AS total_score' => function ($q) {
                                $q->select(DB::raw("SUM(mark) as totalscore"));
                            },
                        ]);
                },
                'exam.sections:id,exam_id,name',
                'details',
                'details.item' => function ($q) {
                    $q->select([
                        'exam_question_items.id',
                        'exam_question_items.exam_question_id',
                        'exam_question_items.level',
                        'exam_question_items.mark',
                        'exam_question_items.negative_mark',
<<<<<<< HEAD
                        'exam_question_items.is_required',
=======
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
                        'exam_sections.id as section_id',
                        'exam_sections.name as section_name',
                    ])
                        ->leftJoin('exam_questions', 'exam_question_items.exam_question_id', '=', 'exam_questions.id')
                        ->leftJoin('exam_sections', 'exam_questions.exam_section_id', '=', 'exam_sections.id');
                },
            ])
            ->first();

        if (!$result) return $this->responseFailed('Result not found', '', 404);
        if ($exam->type == 'live' && Carbon::now() < Carbon::parse($result->exam->end_date)) {
            $endTime = Carbon::parse($result->exam->end_date);
            $arr = [
                'ended' => $endTime->diffForHumans(),
                'end_time' => $endTime->format('d M Y H:i'),
            ];

            return $this->responseSuccess('Please wait until live exam ended', $arr);
        }

        $data = $this->globalService->resultExamGroupByLevel($result);

        return $this->responseSuccess('Detail data', $data);
    }

    public function previousExams()
    {
        $data = ExamResult::where([
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->with([
                'exam' => function ($q) {
                    $q->select([
                        'exams.id',
                        'exams.name',
                        'exams.slug',
                        'exams.type',
                        DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                        DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                        DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                        DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                    ])
                        ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id')
                        ->groupBy('exams.id', 'exams.slug', 'exams.name', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration');
                },
            ])
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$data) return $this->responseSuccess('Doesnt have previous exams');

        $data = new ExamsPrevious($data);

        return $this->responseSuccess('Data', $data);
    }

    public function graphExams(Request $request)
    {
        $query = ExamResult::query();

        if ($date = $request->input('date')) {
            $query->whereDate('created_at', '=', Carbon::createFromFormat('d-m-Y', $date));
        }

        $data = $query->where([
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->with([
                'exam' => function ($q) {
                    $q->select([
                        'exams.id',
                        'exams.institute_id',
                        'exams.name',
                        'exams.slug',
                        'exams.type',
                        DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                        DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                    ])
                        ->withCount([
                            'items AS total_score' => function ($q) {
                                $q->select(DB::raw("SUM(mark) as totalscore"));
                            },
                        ])
                        ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id')
                        ->groupBy('exams.id', 'exams.institute_id', 'exams.slug', 'exams.name', 'exams.type', 'exams.duration');
                },
                'exam.institute:id,name',
            ])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->flatten();

        $data = ExamsGraph::collection($data);

        return $this->responseSuccess('Data', $data);
    }

    public function preferredExams(Request $request)
    {
        $preferreds = auth()->user()->preferreds->pluck('id')->toArray();

        $enrollment = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->first();

        $query = Exam::query();

        $query->with([
            'institute:id,name',
        ])
            ->select([
                'exams.id',
                'exams.institute_id',
                'exams.name',
                'exams.slug',
                'exams.type',
                DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                'exams.created_at',
            ])
            ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id');

        if ($enrollment) {
            $query->where(function ($q) use ($enrollment) {
                $q->where(function ($q) use ($enrollment) {
                    $q->where([
                        'exams.institute_id' => $enrollment->institute_id,
                    ])
                        ->whereHas('branches', function ($q) use ($enrollment) {
                            $q->where('branch_id', $enrollment->branch_id);
                        })
                        ->whereHas('batches', function ($q) use ($enrollment) {
                            $q->where('batch_id', $enrollment->batch_id);
                        });
                })
                    ->orWhere([
                        'exams.institute_id' => null,
                    ]);
            })
                ->where([
                    'exams.status' => 'published',
                ])
                ->whereIn('exams.exam_category_id', $preferreds);
        } else {
            $query->where([
                'exams.status' => 'published',
            ])
                ->whereIn('exams.exam_category_id', $preferreds);
        }

        $query->groupBy('exams.id', 'exams.institute_id', 'exams.slug', 'exams.name', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration', 'exams.created_at')
            ->orderBy('exams.created_at', 'desc');

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'exam', 'normal');

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function practices(Request $request)
    {
        $enrollment = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->first();

        $query = Practice::query();

        $query->with([
            'institute:id,name',
        ])
            ->select([
                'practices.id',
                'practices.institute_id',
                'practices.name',
                'practices.slug',
<<<<<<< HEAD
                DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
=======
                DB::raw("concat(practices.start_date,' ',practices.start_time) as end_date"),
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
                DB::raw("(CASE WHEN practices.duration IS NULL THEN SUM(practice_sections.duration) ELSE practices.duration END) AS duration"),
                DB::raw("COUNT(practice_sections.practice_id) as total_section"),
                'practices.created_at',
            ])
            ->leftJoin('practice_sections', 'practices.id', '=', 'practice_sections.practice_id');

        if ($enrollment) {
            $query->where(function ($q) use ($enrollment) {
                $q->where([
                    'practices.institute_id' => $enrollment->institute_id,
                ])
                    ->orWhere([
                        'practices.institute_id' => null,
                    ]);
            })
                ->where([
                    'practices.status' => 'published',
                ]);
        } else {
            $query->where([
                'practices.status' => 'published',
            ]);
        }

        $query->groupBy('practices.id', 'practices.institute_id', 'practices.name', 'practices.slug', 'practices.start_date', 'practices.start_time', 'practices.duration', 'practices.created_at')
            ->orderBy('practices.start_date', 'desc')
            ->orderBy('practices.created_at', 'desc');

        $rawData = $query->get();

        $data = $this->globalService->filterAfterDate($rawData);

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function showPractices(Practice $practice)
    {
        $enrollment = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->first();

        $practice = Practice::where('id', $practice->id)
            ->with([
                'sections:id,practice_id,name,duration,instruction',
                'sections.question_items' => function ($q) {
                    $q->with([
                        'practice_question:id,practice_section_id,type,level,tag,instruction,paragraph',
                    ])
                        ->select([
                            'practice_question_items.id',
                            'practice_question_items.practice_question_id',
                            'practice_question_items.tag',
                            'practice_question_items.question',
                            'practice_question_items.answer_type',
                        ]);
                },
                'sections.question_items.options:id,practice_question_item_id,title',
            ])
            ->select([
                'id',
                'institute_id',
                'exam_category_id',
                'exam_type_id',
                'name',
                'slug',
                'status',
                'instruction',
                'duration',
                'consentments',
                DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
            ])
            ->first();

        $result = PracticeResult::where([
            'practice_id' => $practice->id,
            'user_id' => auth()->user()->id,
            'status' => 'process',
        ])
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$practice) return $this->responseFailed('Practice not found', '', 404);
        if ($practice->status == 'draft') return $this->responseFailed("Practice cannot be shown", '', 422);
        if (!Carbon::now()->gte($practice->start_date)) return $this->responseFailed("Practice cannot be shown", '', 422);
        if (!$enrollment && $practice->institute_id != null) return $this->responseFailed('Please join institute first', '', 422);
        if ($enrollment && $practice->institute_id != null && $enrollment->institute_id != $practice->institute_id) return $this->responseFailed("Practice cannot be shown", '', 422);
        if ($result) {
            $data = (object)[
                'practiceId' => $practice->id,
                'practiceSlug' => $practice->slug,
                'resultId' => $result->id,
            ];
            return $this->responseSuccess('Please continue the unfinished practice', $data);
        }

        return $this->responseSuccess('Detail data', $practice, 200);
    }

    public function attemptedPractices(Request $request)
    {
        $query = PracticeResult::where('user_id', auth()->user()->id)
            ->with([
                'practice' => function ($q) {
                    $q->with([
                        'institute:id,name',
                    ])
                        ->select([
                            'practices.id',
                            'practices.institute_id',
                            'practices.name',
                            'practices.slug',
                            DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                            DB::raw("(CASE WHEN practices.duration IS NULL THEN SUM(practice_sections.duration) ELSE practices.duration END) AS duration"),
                            DB::raw("COUNT(practice_sections.practice_id) as total_section"),
                        ])
                        ->leftJoin('practice_sections', 'practices.id', '=', 'practice_sections.practice_id')
                        ->groupBy('practices.id', 'practices.institute_id', 'practices.slug', 'practices.name', 'practices.start_date', 'practices.start_time', 'practices.duration');
                },
            ])
            ->select([
                'id',
                'user_id',
                'practice_id',
                'created_at',
                'status',
            ])
            ->orderBy('created_at', 'desc');

        $rawData = $query->get();

        $data = $rawData->sortBy([
            ['status', 'desc'],
            ['created_at', 'desc'],
        ])
            ->flatten();

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        $data = PracticesAttempted::collection($data);

        return $this->responseSuccess('Data', $data);
    }

    public function showPracticeResult(Practice $practice, $id)
    {
        $result = PracticeResult::where([
            'id' => $id,
            'practice_id' => $practice->id,
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->with([
                'practice' => function ($q) use ($id) {
                    $q->with([
                        'sections:id,practice_id,name',
                        'sections.question_items' => function ($q) use ($id) {
                            $q->with([
                                'practice_question:id,practice_section_id,type,level,tag,instruction,paragraph',
                                'resultDetails' => function ($q) use ($id) {
                                    $q->where('practice_result_id', $id)
                                        ->whereHas('detailOptions')
                                        ->select([
                                            'id',
                                            'practice_result_id',
                                            'practice_question_item_id',
                                            'correct',
                                        ]);
                                },
                                'resultDetails.detailOptions:id,practice_result_detail_id,practice_option_id',
                            ])
                                ->select([
                                    'practice_question_items.id',
                                    'practice_question_items.practice_question_id',
                                    'practice_question_items.tag',
                                    'practice_question_items.question',
                                    'practice_question_items.answer_type',
                                    'practice_question_items.answer_explanation',
                                ]);
                        },
                        'sections.question_items.options:id,practice_question_item_id,title,correct',
                    ])
                        ->select([
                            'id',
                            'name',
                        ])
                        ->withCount([
                            'items AS total_score' => function ($q) {
                                $q->select(DB::raw("SUM(mark) as totalscore"));
                            },
                        ]);
                },
            ])
            ->first();

        if (!$result) return $this->responseFailed('Result not found', '', 404);

        return $this->responseSuccess('Detail data', $result);
    }

    public function showPracticeResultTemp(Practice $practice, $id)
    {
        $result = PracticeResult::where([
            'id' => $id,
            'practice_id' => $practice->id,
            'user_id' => auth()->user()->id,
            'status' => 'process',
        ])
            ->with([
                'practice' => function ($q) use ($id) {
                    $q->with([
                        'sections:id,practice_id,name,duration,instruction',
                        'sections.question_items' => function ($q) use ($id) {
                            $q->with([
                                'practice_question:id,practice_section_id,type,level,tag,instruction,paragraph',
                                'resultDetailTemps' => function ($q) use ($id) {
                                    $q->where('practice_result_id', $id)
                                        ->select([
                                            'id',
                                            'practice_result_id',
                                            'practice_question_item_id',
                                        ]);
                                },
                                'resultDetailTemps.detailOptions:id,practice_result_dtemp_id,practice_option_id',
                            ])
                                ->select([
                                    'practice_question_items.id',
                                    'practice_question_items.practice_question_id',
                                    'practice_question_items.tag',
                                    'practice_question_items.question',
                                    'practice_question_items.answer_type',
                                ]);
                        },
                        'sections.question_items.options' => function ($q) use ($id) {
                            $q->select([
                                'practice_options.id',
                                'practice_options.practice_question_item_id',
                                'practice_options.title',
                                DB::raw("(CASE WHEN practice_result_do_temps.id IS NOT NULL THEN 1 ELSE 0 END) AS selected"),
                            ])
                                ->leftJoin('practice_question_items', function ($j) {
                                    $j->on('practice_options.practice_question_item_id', '=', 'practice_question_items.id');
                                })
                                ->leftJoin('practice_result_dtemps', function ($j) use ($id) {
                                    $j->on('practice_question_items.id', '=', 'practice_result_dtemps.practice_question_item_id')
                                        ->where('practice_result_dtemps.practice_result_id', $id);
                                })
                                ->leftJoin('practice_result_do_temps', function ($j) {
                                    $j->on('practice_result_dtemps.id', '=', 'practice_result_do_temps.practice_result_dtemp_id')
                                        ->on('practice_result_do_temps.practice_option_id', '=', 'practice_options.id');
                                })
                                ->orderBy('practice_options.id');
                        },
                    ])
                        ->select([
                            'id',
                            'institute_id',
                            'exam_category_id',
                            'exam_type_id',
                            'name',
                            'slug',
                            'status',
                            'instruction',
                            'duration',
                            'consentments',
                            DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                        ]);
                },
            ])
            ->select([
                'id',
                'user_id',
                'practice_id',
                'status',
                'current_section',
                'current_item',
                'remaining_minute',
            ])
            ->first();

        if (!$result) return $this->responseFailed('Data not found', '', 404);

        if (empty($practice->duration)) {
            $section = $result->practice->sections->map(function ($section, $key) use ($result) {
                if ($key < $result->current_section) $section->duration = 0;
                if ($key == $result->current_section) $section->duration = (int)$result->remaining_minute;
                return $section;
            });

            $result->practice->sections = $section;
        } else {
            $result->practice->duration = (int)$result->remaining_minute;
        }

        return $this->responseSuccess('Detail data', $result);
    }

    public function showPracticeResultAnalysis(Practice $practice, $id)
    {
        $result = PracticeResult::where([
            'id' => $id,
            'user_id' => auth()->user()->id,
            'practice_id' => $practice->id,
            'status' => 'done',
        ])
            ->with([
                'practice' => function ($q) {
                    $q->select('id')
                        ->withCount([
                            'items AS total_score' => function ($q) {
                                $q->select(DB::raw("SUM(mark) as totalscore"));
                            },
                        ]);
                },
                'practice.sections:id,practice_id,name',
                'details',
                'details.item' => function ($q) {
                    $q->select([
                        'practice_question_items.id',
                        'practice_question_items.practice_question_id',
                        'practice_question_items.level',
                        'practice_question_items.mark',
                        'practice_question_items.negative_mark',
                        'practice_sections.id as section_id',
                        'practice_sections.name as section_name',
                    ])
                        ->leftJoin('practice_questions', 'practice_question_items.practice_question_id', '=', 'practice_questions.id')
                        ->leftJoin('practice_sections', 'practice_questions.practice_section_id', '=', 'practice_sections.id');
                },
            ])
            ->first();

        if (!$result) return $this->responseFailed('Result not found', '', 404);

        $data = $this->globalService->resultPracticeGroupByLevel($result);

        return $this->responseSuccess('Detail data', $data);
    }

    public function quizzes(Request $request)
    {
        $enrollment = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->first();

        $query = Quiz::query();

        $query->with([
            'institute:id,name',
            'topic:id,name',
        ])
            ->select([
                'id',
                'institute_id',
                'topic_id',
                'name',
                'slug',
                'type',
                'duration',
                'start_time',
                'end_time',
                'created_at',
            ]);

        if ($topic = $request->input('topic')) {
            $query->whereHas('topic', function ($q) use ($topic) {
                $q->whereRaw("name LIKE '%" .  $topic . "%'");
            });
        }

        if ($enrollment) {
            $query->where(function ($q) use ($enrollment) {
                $q->where([
                    'institute_id' => $enrollment->institute_id,
                ])
                    ->orWhere([
                        'institute_id' => null,
                    ]);
            })
                ->where([
                    'status' => 'published',
                ]);
        } else {
            $query->where([
                'status' => 'published',
            ]);
        }

        $query->orderBy('created_at', 'desc');

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'quiz', 'normal');

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function liveQuizzes(Request $request)
    {
        $enrollment = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->first();

        $query = Quiz::query();

        $query->with([
            'institute:id,name',
            'topic:id,name',
        ])
            ->select([
                'id',
                'institute_id',
                'topic_id',
                'name',
                'slug',
                'type',
                'duration',
                'start_time',
                'end_time',
                'created_at',
            ]);

        if ($topic = $request->input('topic')) {
            $query->whereHas('topic', function ($q) use ($topic) {
                $q->whereRaw("name LIKE '%" .  $topic . "%'");
            });
        }

        if ($enrollment) {
            $query->where(function ($q) use ($enrollment) {
                $q->where([
                    'institute_id' => $enrollment->institute_id,
                ])
                    ->orWhere([
                        'institute_id' => null,
                    ]);
            })
                ->where([
                    'type' => 'live',
                    'status' => 'published',
                ]);
        } else {
            $query->where([
                'type' => 'live',
                'status' => 'published',
            ]);
        }

        $query->orderBy('start_time', 'desc')
            ->orderBy('created_at', 'desc');

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'quiz', 'normal');

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function showQuizzes(Quiz $quiz)
    {
        $enrollment = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->first();

        $quiz = Quiz::where('id', $quiz->id)
            ->with([
                'topic:id,name',
                'questions:id,quiz_id,tag,question,answer_type',
                'questions.options:id,quiz_question_id,title',
            ])
            ->select([
                'id',
                'institute_id',
                'topic_id',
                'name',
                'slug',
                'type',
                'status',
                DB::raw("duration *  60 as duration"),
                'image',
                'start_time',
                'end_time',
                'instruction',
                'consentments',
            ])
            ->first();

        $resultCount = QuizResult::where([
            'quiz_id' => $quiz->id,
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->orderBy('created_at', 'desc')
            ->count();

        $resultTemp = QuizResult::where([
            'quiz_id' => $quiz->id,
            'user_id' => auth()->user()->id,
            'status' => 'process',
        ])
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$quiz) return $this->responseFailed('Quiz not found', '', 404);
        if ($quiz->status == 'draft') return $this->responseFailed("Quiz cannot be shown", '', 422);
        if ($quiz->type == 'live' && !Carbon::now()->between($quiz->start_time, $quiz->end_time)) return $this->responseFailed("Quiz cannot be shown", '', 422);
        if (!$enrollment && $quiz->institute_id != null) return $this->responseFailed('Please join institute first', '', 422);
        if ($enrollment && $quiz->institute_id != null && $enrollment->institute_id != $quiz->institute_id) return $this->responseFailed("Quiz cannot be shown", '', 422);
        if ($quiz->type == 'live' && $resultCount != 0) return $this->responseSuccess('Already take this quiz');
        if ($quiz->type == 'mixed' && $resultCount > 1) return $this->responseSuccess('Already take this quiz');
        if ($resultTemp) {
            $data = (object)[
                'quizId' => $quiz->id,
                'quizSlug' => $quiz->slug,
                'resultId' => $resultTemp->id,
            ];
            return $this->responseSuccess('Please continue the unfinished quiz', $data);
        }

        return $this->responseSuccess('Detail data', $quiz, 200);
    }

    public function attemptedQuizzes(Request $request)
    {
        $query = QuizResult::where('user_id', auth()->user()->id)
            ->with([
                'quiz' => function ($q) {
                    $q->with([
                        'institute:id,name',
                    ])
                        ->select([
                            'id',
                            'institute_id',
                            'topic_id',
                            'name',
                            'slug',
                            'type',
                            'duration',
                            'start_time',
                            'end_time',
                        ])
                        ->with(['topic:id,name']);
                },
            ])
            ->select([
                'id',
                'user_id',
                'quiz_id',
                'created_at',
                'status',
            ])
            ->orderBy('created_at', 'desc');

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'quiz', 'attempted');

        if ($take = $request->input('take')) {
            $data = $data->take($take);
        }

        return $this->responseSuccess('Data', $data);
    }

    public function showQuizResult(Quiz $quiz, $id)
    {
        $result = QuizResult::where([
            'id' => $id,
            'quiz_id' => $quiz->id,
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->with([
                'quiz' => function ($q) use ($id) {
                    $q->with([
                        'questions' => function ($q) use ($id) {
                            $q->with([
                                'resultDetails' => function ($q) use ($id) {
                                    $q->where('quiz_result_id', $id)
                                        ->whereHas('detailOptions')
                                        ->select([
                                            'id',
                                            'quiz_result_id',
                                            'quiz_question_id',
                                            'correct',
                                        ]);
                                },
                                'resultDetails.detailOptions:id,quiz_result_detail_id,quiz_option_id',
                            ])
                                ->select([
                                    'id',
                                    'quiz_id',
                                    'tag',
                                    'question',
                                    'answer_type',
                                    'answer_explanation',
                                ]);
                        },
                        'questions.options:id,quiz_question_id,title,correct',
                    ])
                        ->select([
                            'id',
                            'name',
                        ])
                        ->withCount([
                            'questions AS total_score' => function ($q) {
                                $q->select(DB::raw("SUM(mark) as totalscore"));
                            },
                        ]);
                },
            ])
            ->first();

        if (!$result) return $this->responseFailed('Result not found', '', 404);
        if ($quiz->type == 'live' && Carbon::now() < Carbon::parse($quiz->end_time)) {
            $endTime = Carbon::parse($quiz->end_time);
            $arr = [
                'ended' => $endTime->diffForHumans(),
                'end_time' => $endTime->format('d M Y H:i'),
            ];

            return $this->responseSuccess('Please wait until live quiz ended', $arr);
        }

        return $this->responseSuccess('Detail data', $result);
    }

    public function showQuizResultTemp(Quiz $quiz, $id)
    {
        $result = QuizResult::where([
            'id' => $id,
            'quiz_id' => $quiz->id,
            'user_id' => auth()->user()->id,
            'status' => 'process',
        ])
            ->with([
                'quiz' => function ($q) use ($id) {
                    $q->with([
                        'topic:id,name',
                        'questions' => function ($q) use ($id) {
                            $q->with([
                                'resultDetailTemps' => function ($q) use ($id) {
                                    $q->where('quiz_result_id', $id)
                                        ->select([
                                            'id',
                                            'quiz_result_id',
                                            'quiz_question_id',
                                        ]);
                                },
                                'resultDetailTemps.detailOptions:id,quiz_result_dtemp_id,quiz_option_id',
                            ])
                                ->select([
                                    'id',
                                    'quiz_id',
                                    'tag',
                                    'question',
                                    'answer_type',
                                ]);
                        },
                        'questions.options' => function ($q) use ($id) {
                            $q->select([
                                'quiz_options.id',
                                'quiz_options.quiz_question_id',
                                'quiz_options.title',
                                DB::raw("(CASE WHEN quiz_result_do_temps.id IS NOT NULL THEN 1 ELSE 0 END) AS selected"),
                            ])
                                ->leftJoin('quiz_questions', function ($j) {
                                    $j->on('quiz_options.quiz_question_id', '=', 'quiz_questions.id');
                                })
                                ->leftJoin('quiz_result_dtemps', function ($j) use ($id) {
                                    $j->on('quiz_questions.id', '=', 'quiz_result_dtemps.quiz_question_id')
                                        ->where('quiz_result_dtemps.quiz_result_id', $id);
                                })
                                ->leftJoin('quiz_result_do_temps', function ($j) {
                                    $j->on('quiz_result_dtemps.id', '=', 'quiz_result_do_temps.quiz_result_dtemp_id')
                                        ->on('quiz_result_do_temps.quiz_option_id', '=', 'quiz_options.id');
                                })
                                ->orderBy('quiz_options.id');
                        },
                    ])
                        ->select([
                            'id',
                            'institute_id',
                            'topic_id',
                            'name',
                            'slug',
                            'type',
                            'status',
                            DB::raw("duration *  60 as duration"),
                            'image',
                            'start_time',
                            'end_time',
                            'instruction',
                            'consentments',
                        ]);
                },
            ])
            ->select([
                'id',
                'user_id',
                'quiz_id',
                'status',
                'current_item',
                'created_at',
            ])
            ->first();

        if (!$result) return $this->responseFailed('Data not found', '', 404);

        $duration = Carbon::now() < Carbon::parse($result->created_at)->addSeconds($result->quiz->duration) ? Carbon::parse($result->created_at)->addSeconds($result->quiz->duration)->diffInSeconds(Carbon::now()) : 0;
        $result->quiz->duration = (int)$duration;

        return $this->responseSuccess('Detail data', $result);
    }

    public function showQuizRank(Quiz $quiz, $id)
    {
        $result = QuizResult::where([
            'id' => $id,
            'quiz_id' => $quiz->id,
            'user_id' => auth()->user()->id,
            'status' => 'done',
        ])
            ->with([
                'quiz:id,name,type',
            ])
            ->first();

        if (!$result) return $this->responseFailed('Result not found', '', 404);

        if ($quiz->type == 'live') {
            $rank = null;

            if (Carbon::now()->lt($quiz->end_time)) {
                $endTime = Carbon::parse($quiz->end_time);
                $arr = [
                    'ended' => $endTime->diffForHumans(),
                    'end_time' => $endTime->format('d M Y H:i'),
                ];
                return $this->responseSuccess('Detail data', $arr);
            }

            $data = QuizResult::where([
                'quiz_id' => $quiz->id,
                'status' => 'done',
            ])
                ->with([
                    'user:id,name',
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->flatten();

            $data = QuizRank::collection($data->sortByDesc('score')->flatten());
            foreach ($data as $key => $value) {
                if ($value->id == $result->id) {
                    $rank = $key += 1;
                }
            }
            $result['rank'] = $rank;
            $result['data'] = $data;
        } else {
            $rank = null;

            $data = QuizResult::where([
                'quiz_id' => $quiz->id,
                'status' => 'done',
            ])
                ->whereDate('created_at', Carbon::yesterday())
                ->with([
                    'user:id,name',
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->values();

            $data = QuizRank::collection($data->sortByDesc('score')->flatten());
            foreach ($data as $key => $value) {
                if ($value->id == $result->id) {
                    $rank = $key += 1;
                }
            }
            $result['rank'] = $rank;
            $result['data'] = $data;
        }

        return $this->responseSuccess('Detail data', $result);
    }

    public function institutes(Request $request)
    {
        $query = Branch::where('status', 'approve')
            ->with([
                'institute:id,name'
            ])
            ->select([
                'id',
                'institute_id',
                'name',
                'city',
            ]);

        if ($search = $request->input('search')) {
            $query->whereHas('institute', function ($q) use ($search) {
                $q->whereRaw("name LIKE '%" .  $search . "%'");
            });
        }

        if ($city = $request->input('city')) {
            $query->whereRaw("city LIKE '%" .  $city . "%'");
        }

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $data = $query->get();

        return $this->responseSuccess('Data', $data, 200);
    }

    public function batches($instituteId, $branchId)
    {
        $batches = Batch::where('institute_id', $instituteId)
            ->select([
                'id',
                'institute_id',
                'name',
            ])
            ->get();

        $enrollments = Enrollment::where([
            'user_id' => auth()->user()->id,
            'branch_id' => $branchId,
            'status' => 'pending',
        ])
            ->get();

        $data = $batches->map(function ($batch) use ($enrollments) {
            $status = null;
            foreach ($enrollments as $key => $value) {
                if ($value->batch_id == $batch->id) {
                    $status = $value->status;
                }
            }
            $batch->status = $status;

            return $batch;
        });

        return $this->responseSuccess('Data', $data);
    }

    public function proposalListInstitute(Request $request)
    {
        $query = Enrollment::where('user_id', auth()->user()->id)
            ->with([
                'institute:id,name,city',
            ])
            ->orderBy('created_at', 'desc');;

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $data = ProposalListInstitute::collection($query->get()->flatten());

        return $this->responseSuccess('Data', $data, 200);
    }

    public function joinInstitute(Request $request)
    {
        $approved = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])->first();

        if ($approved) return $this->responseFailed('Already joined institute', '', 422);

        $input = $request->all();
        $validator = Validator::make($input, [
            'institute_id' => 'required|integer',
            'branch_id' => 'required|integer',
            'batch_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $data = Enrollment::where([
            'user_id' => auth()->user()->id,
            'institute_id' => $input['institute_id'],
            'branch_id' => $input['branch_id'],
            'batch_id' => $input['batch_id'],
            'status' => 'pending',
        ])
            ->first();

        if ($data) return $this->responseFailed('Already applied, please wait', '', 422);

        Enrollment::create(array_merge(
            $validator->validated(),
            [
                'user_id' => auth()->user()->id,
                'code' => $this->globalService->generateEnrollmentId($input['institute_id']),
                'status' => 'pending',
            ]
        ));

        return $this->responseSuccess('Join institute successfully submitted', '', 201);
    }

    public function preferreds()
    {
        $data = Preferreds::collection(auth()->user()->preferreds);

        return $this->responseSuccess('Data', $data);
    }

    public function savePreferreds(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'exam_categories' => 'sometimes|array',
            'exam_categories.*' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $preferreds = auth()->user()->preferreds()->exists();

        if (!$preferreds && !isset($input['exam_categories'])) return $this->responseSuccess('No value selected');
        if (!$preferreds && isset($input['exam_categories'])) auth()->user()->preferreds()->attach($input['exam_categories']);
        if ($preferreds && isset($input['exam_categories'])) auth()->user()->preferreds()->sync($input['exam_categories']);
        if ($preferreds && !isset($input['exam_categories'])) auth()->user()->preferreds()->detach();

        return $this->responseSuccess('Exams preferred successfully saved');
    }

    public function checkEnrollment()
    {
        $enrollment = Enrollment::where([
            'user_id' => auth()->user()->id,
            'status' => 'approve'
        ])
            ->with([
                'institute:id,name',
                'branch:id,name',
                'batch:id,name',
            ])
            ->first();

        $data = [
            'approve' => $enrollment ? true : false,
            'enrollement' => $enrollment ?? null,
        ];

        return $this->responseSuccess('Detail data', $data);
    }
}
