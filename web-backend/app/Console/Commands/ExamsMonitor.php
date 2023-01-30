<?php

namespace App\Console\Commands;

use App\Models\ExamOption;
use App\Models\ExamQuestionItem;
use App\Models\ExamResult;
use App\Models\ExamResultDetail;
use App\Models\ExamResultDetailOption;
use App\Models\ExamResultDtemp;
use App\Http\Services\GlobalService;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\QuizResult;
use App\Models\QuizResultDetail;
use App\Models\QuizResultDetailOption;
use App\Models\QuizResultDtemp;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExamsMonitor extends Command
{
    public $globalService;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exam:monitor';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run exam monitoring';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(GlobalService $globalService)
    {
        parent::__construct();
        $this->globalService = $globalService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Exams
        $examResults = ExamResult::where([
                                'status' => 'process',
                            ])
                            ->with([
                                'exam' => function ($q) {
                                    $q->with([
                                        'sections' => function ($q) {
                                            $q->select([
                                                'id',
                                                'exam_id',
                                                'name',
                                                DB::raw("duration * 60 as duration"),
                                                'instruction',
                                            ]);
                                        },
                                    ])
                                    ->select([
                                        'exams.id',
                                        'exams.duration',
                                        DB::raw("(CASE WHEN exams.duration IS NULL THEN 1 ELSE 0 END) AS section_duration"),
                                    ])
                                    ->groupBy('exams.id', 'exams.duration');
                                },
                            ])
                            ->get();

        foreach ($examResults as $key => $value) {
            $doSubmit = 0;
            $examToleranceTime = 30;
            $sectionToleranceTime = 10;

            if ($value->exam->section_duration) {
                $sections = null;
                $currentSection = $value->current_section;
                $newCurrentSection = null;

                $sectionArr = $value->exam->sections->map(function ($section) {
                            return $section->duration;
                        })->toArray();
                $sectionDuration = array_reduce($sectionArr, function (array $sums, $num) {
                            return array_merge($sums, [end($sums) + $num]);
                        }, []);

                foreach ($value->exam->sections as $key => $s) {
                    if ($key == 0 && Carbon::now() < Carbon::parse($value->created_at)->addSeconds($sectionDuration[$key])) {
                        $newCurrentSection = $key;
                        break;
                    }
                    if ($key != 0 && Carbon::now() > Carbon::parse($value->created_at)->addSeconds($sectionDuration[$key-1]) && Carbon::now() < Carbon::parse($value->created_at)->addSeconds($sectionDuration[$key])) {
                        $newCurrentSection = $key;
                        break;
                    }
                }

                $newCurrentSection = is_null($newCurrentSection) ? array_key_last($sectionArr) : $newCurrentSection;
                $detailTemps = ExamResultDtemp::where('exam_result_id', $value->id)
                            ->with([
                                'sections',
                            ])
                            ->orderBy('exam_result_dtemps.created_at', 'asc')
                            ->get()
                            ->groupBy('sections.id')
                            ->toArray();

                if ($currentSection <= $newCurrentSection) {
                    $sections = $value->exam->sections->map(function ($section, $key) use ($value, $newCurrentSection, $sectionDuration, $currentSection, $detailTemps, $sectionToleranceTime) {
                                        if ($key < $newCurrentSection) $section->duration = 0;
                                        if ($key == $newCurrentSection) {
                                            if ($key == $currentSection) {
                                                $remainingSecond = $value->remaining_second;
                                                if (array_key_exists($section->id, $detailTemps)) {
                                                    $sectionDetailTemp = $detailTemps[$section->id];
                                                    if (array_key_exists(0, $sectionDetailTemp)) {
                                                        $detailTemp = $sectionDetailTemp[0];
                                                        $duration = Carbon::now() < Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration)->addSeconds($sectionToleranceTime) ? Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration)->addSeconds($sectionToleranceTime)->diffInSeconds(Carbon::now()) : 0;
                                                        $section->duration = (int) $duration;
                                                    } else {
                                                        $section->duration = (int) $remainingSecond;
                                                    }
                                                } else {
                                                    $section->duration = (int) $remainingSecond;
                                                }
                                            } else {
                                                $duration = Carbon::now() < Carbon::parse($value->created_at)->addSeconds($sectionDuration[$key])->addSeconds($sectionToleranceTime) ? Carbon::parse($value->created_at)->addSeconds($sectionDuration[$key])->addSeconds($sectionToleranceTime)->diffInSeconds(Carbon::now()) : 0;
                                                $section->duration = (int) $duration;
                                            }
                                        }
                                        return $section;
                                    });
                } else {
                    $sections = $value->exam->sections->map(function ($section, $key) use ($value, $currentSection, $detailTemps, $sectionToleranceTime) {
                                        if ($key < $currentSection) $section->duration = 0;
                                        if ($key == $currentSection) {
                                            $remainingSecond = $value->remaining_second;
                                            if (array_key_exists($section->id, $detailTemps)) {
                                                $sectionDetailTemp = $detailTemps[$section->id];
                                                if (array_key_exists(0, $sectionDetailTemp)) {
                                                    $detailTemp = $sectionDetailTemp[0];
                                                    $duration = Carbon::now() < Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration)->addSeconds($sectionToleranceTime) ? Carbon::parse($detailTemp['created_at'])->addSeconds($section->duration)->addSeconds($sectionToleranceTime)->diffInSeconds(Carbon::now()) : 0;
                                                    $section->duration = (int) $duration;
                                                } else {
                                                    $section->duration = (int) $remainingSecond;
                                                }
                                            } else {
                                                $section->duration = (int) $remainingSecond;
                                            }
                                        }
                                        return $section;
                                    });
                }

                $durationArr = $sections->map(function ($section) {
                                    return $section->duration;
                                })->toArray();

                $doSubmit = (int) $this->globalService->arrayAll(function ($x) {
                                    return $x == 0;
                                }, $durationArr);
            } else {
                if (Carbon::now() > Carbon::parse(($value->created_at)->addMinutes($value->exam->duration)->addSeconds($examToleranceTime))) $doSubmit = 1;
            }

            if ($doSubmit) {
                \Log::info("Catched Exams");
                $examResultId = $value->id;
                $examResult = ExamResult::where([
                                        'id' => $examResultId,
                                        'status' => 'process',
                                    ])
                                    ->with([
                                        'exam' => function ($q) use ($examResultId) {
                                            $q->with([
                                                'sections:id,exam_id,name,duration,instruction',
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
                                                    ]);
                                                },
                                                'sections.question_items.options' => function ($q) use ($examResultId) {
                                                    $q->select([
                                                        'exam_options.id',
                                                        'exam_options.exam_question_item_id',
                                                        'exam_options.title',
                                                        DB::raw("(CASE WHEN exam_result_do_temps.id IS NOT NULL THEN 1 ELSE 0 END) AS selected"),
                                                    ])
                                                    ->leftJoin('exam_question_items', function ($j) {
                                                        $j->on('exam_options.exam_question_item_id', '=', 'exam_question_items.id');
                                                    })
                                                    ->leftJoin('exam_result_dtemps', function ($j) use ($examResultId) {
                                                        $j->on('exam_question_items.id', '=', 'exam_result_dtemps.exam_question_item_id')
                                                        ->where('exam_result_dtemps.exam_result_id', $examResultId);
                                                    })
                                                    ->leftJoin('exam_result_do_temps', function ($j) {
                                                        $j->on('exam_result_dtemps.id', '=', 'exam_result_do_temps.exam_result_dtemp_id')
                                                        ->on('exam_result_do_temps.exam_option_id', '=', 'exam_options.id');
                                                    })
                                                    ->orderBy('exam_options.id');
                                                },
                                            ])
                                            ->select('id');
                                        },
                                    ])
                                    ->first();

                if (!$examResult) {
                    \Log::info("Catched exams - Already submitted 01");
                    return;
                }

                $raw = json_encode($examResult->exam);

                try {
                    $data = json_decode($raw);

                    $result = ExamResult::where([
                                        'id' => $examResult->id,
                                        'status' => 'process',
                                    ])
                                    ->first();

                    if (!$result) {
                        \Log::info("Catched exams - Already submitted 02");
                        return;
                    }

                    DB::beginTransaction();

                    $result->update([
                        'status' => 'done',
                        'remaining_second' => null,
                        'current_section' => null,
                        'current_item' => null,
                    ]);

                    $score = 0;
                    $correct = 0;
                    $incorrect = 0;
                    $answeredQuestions = 0;

                    foreach ($data->sections as $key => $sectionValue) {
                        foreach ($sectionValue->question_items as $key => $itemValue) {
                            $item = ExamQuestionItem::find($itemValue->id);

                            $resultDetail = ExamResultDetail::create([
                                'exam_result_id' => $result->id,
                                'exam_question_item_id' => $itemValue->id,
                            ]);

                            $keyOptionIds = ExamOption::where([
                                                'exam_question_item_id' => $itemValue->id,
                                                'correct' => 1,
                                            ])
                                            ->pluck('id')
                                            ->all();
                            $answeredOptionIds = [];

                            foreach ($itemValue->options as $key => $optionValue) {
                                if (property_exists($optionValue, 'selected')) {
                                    if (isset($optionValue->selected) && $optionValue->selected == 1) {
                                        ExamResultDetailOption::create([
                                            'exam_result_detail_id' => $resultDetail->id,
                                            'exam_option_id' => $optionValue->id,
                                        ]);
                                        array_push($answeredOptionIds, $optionValue->id);
                                    }
                                } else {
                                    break;
                                }
                            }

                            $resultDetail = ExamResultDetail::find($resultDetail->id);
                            if ($resultDetail->detailOptions()->exists()) {
                                $answeredQuestions++;
                                $equal = $this->globalService->arrayEqual($keyOptionIds, $answeredOptionIds);

                                if ($equal) {
                                    $resultDetail->update(['correct' => 1]);
                                    $score += $item->mark;
                                    $correct++;
                                } else {
                                    $score -= $item->negative_mark;
                                    $incorrect++;
                                }
                            }
                        }
                    }

                    $accuracy = $answeredQuestions ? round($correct / $answeredQuestions * 100) : 0;

                    $result->update([
                        'score' => $score,
                        'correct' => $correct,
                        'incorrect' => $incorrect,
                        'accuracy' => $accuracy,
                    ]);

                    ExamResultDtemp::where('exam_result_id', $result->id)->delete();

                    DB::commit();
                    \Log::info("Catched exams success");
                } catch (\Exception $e) {
                    DB::rollBack();
                    \Log::info("Catched exams error");
                    \Log::info($e->getMessage());
                }
            }
        }

        // Quizzes
        $quizResults = QuizResult::where([
                                'status' => 'process',
                            ])
                            ->with([
                                'quiz:id,duration',
                            ])
                            ->get();

        foreach ($quizResults as $key => $value) {
            $quizDuration = (int) $value->quiz->duration;
            $quizToleranceTime = 30;

            if (Carbon::now() > Carbon::parse(($value->created_at)->addMinutes($quizDuration)->addSeconds($quizToleranceTime))) {
                \Log::info("Catched quizzes");
                $quizResultId = $value->id;
                $quizResult = QuizResult::where([
                                        'id' => $quizResultId,
                                        'status' => 'process',
                                    ])
                                    ->with([
                                        'quiz' => function ($q) use ($quizResultId) {
                                            $q->with([
                                                'questions' => function ($q) {
                                                    $q->select([
                                                        'id',
                                                        'quiz_id',
                                                        'tag',
                                                        'question',
                                                        'answer_type',
                                                    ]);
                                                },
                                                'questions.options' => function ($q) use ($quizResultId) {
                                                    $q->select([
                                                        'quiz_options.id',
                                                        'quiz_options.quiz_question_id',
                                                        'quiz_options.title',
                                                        DB::raw("(CASE WHEN quiz_result_do_temps.id IS NOT NULL THEN 1 ELSE 0 END) AS selected"),
                                                    ])
                                                    ->leftJoin('quiz_questions', function ($j) {
                                                        $j->on('quiz_options.quiz_question_id', '=', 'quiz_questions.id');
                                                    })
                                                    ->leftJoin('quiz_result_dtemps', function ($j) use ($quizResultId) {
                                                        $j->on('quiz_questions.id', '=', 'quiz_result_dtemps.quiz_question_id')
                                                        ->where('quiz_result_dtemps.quiz_result_id', $quizResultId);
                                                    })
                                                    ->leftJoin('quiz_result_do_temps', function ($j) {
                                                        $j->on('quiz_result_dtemps.id', '=', 'quiz_result_do_temps.quiz_result_dtemp_id')
                                                        ->on('quiz_result_do_temps.quiz_option_id', '=', 'quiz_options.id');
                                                    })
                                                    ->orderBy('quiz_options.id');
                                                },
                                            ])
                                            ->select('id');
                                        },
                                    ])
                                    ->first();

                if (!$quizResult) {
                    \Log::info("Catched quizzes - Already submitted 01");
                    return;
                }

                $raw = json_encode($quizResult->quiz);

                try {
                    $data = json_decode($raw);

                    $result = QuizResult::where([
                                        'id' => $quizResult->id,
                                        'status' => 'process',
                                    ])
                                    ->first();

                    if (!$result) {
                        \Log::info("Catched quizzes - Already submitted 02");
                        return;
                    }

                    DB::beginTransaction();

                    $result->update([
                        'status' => 'done',
                        'current_item' => null,
                    ]);

                    $score = 0;
                    $correct = 0;
                    $incorrect = 0;
                    $answeredQuestions = 0;

                    foreach ($data->questions as $key => $itemValue) {
                        $item = QuizQuestion::find($itemValue->id);

                        $resultDetail = QuizResultDetail::create([
                            'quiz_result_id' => $result->id,
                            'quiz_question_id' => $itemValue->id,
                        ]);

                        $keyOptionIds = QuizOption::where([
                                            'quiz_question_id' => $itemValue->id,
                                            'correct' => 1,
                                        ])
                                        ->pluck('id')
                                        ->all();
                        $answeredOptionIds = [];

                        foreach ($itemValue->options as $key => $optionValue) {
                            if (property_exists($optionValue, 'selected')) {
                                if (isset($optionValue->selected) && $optionValue->selected == 1) {
                                    QuizResultDetailOption::create([
                                        'quiz_result_detail_id' => $resultDetail->id,
                                        'quiz_option_id' => $optionValue->id,
                                    ]);
                                    array_push($answeredOptionIds, $optionValue->id);
                                }
                            } else {
                                break;
                            }
                        }

                        $resultDetail = QuizResultDetail::find($resultDetail->id);
                        if ($resultDetail->detailOptions()->exists()) {
                            $answeredQuestions++;
                            $equal = $this->globalService->arrayEqual($keyOptionIds, $answeredOptionIds);

                            if ($equal) {
                                $resultDetail->update(['correct' => 1]);
                                $score += $item->mark;
                                $correct++;
                            } else {
                                $score -= $item->negative_mark;
                                $incorrect++;
                            }
                        }
                    }

                    $accuracy = $answeredQuestions ? round($correct / $answeredQuestions * 100) : 0;

                    $result->update([
                        'score' => $score,
                        'correct' => $correct,
                        'incorrect' => $incorrect,
                        'accuracy' => $accuracy,
                    ]);

                    QuizResultDtemp::where('quiz_result_id', $result->id)->delete();

                    DB::commit();
                    \Log::info("Catched quizzes success");
                } catch (\Exception $e) {
                    DB::rollBack();
                    \Log::info("Catched quizzes error");
                    \Log::info($e->getMessage());
                }
            }
        }

        // \Log::info("Exam monitor is working fine!");
    }
}
