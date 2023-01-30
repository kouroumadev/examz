<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamOption;
use App\Models\ExamResult;
use App\Models\ExamResultDetail;
use Illuminate\Http\Request;
use App\Http\Services\GlobalService;
use App\Models\ExamQuestionItem;
use App\Models\ExamResultDetailOption;
use App\Models\ExamResultDoTemp;
use App\Models\ExamResultDtemp;
use App\Models\Practice;
use App\Models\PracticeOption;
use App\Models\PracticeQuestionItem;
use App\Models\PracticeResult;
use App\Models\PracticeResultDetail;
use App\Models\PracticeResultDetailOption;
use App\Models\PracticeResultDoTemp;
use App\Models\PracticeResultDtemp;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\QuizResult;
use App\Models\QuizResultDetail;
use App\Models\QuizResultDetailOption;
use App\Models\QuizResultDoTemp;
use App\Models\QuizResultDtemp;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ResultController extends Controller
{
    public $globalService;

    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
    }

    public function storeExams(Request $request, Exam $exam)
    {
        $exam = Exam::where('id', $exam->id)->withCount(['items'])->first();
        if (!$exam) return $this->responseFailed('Data not found', '', 404);

        $resultCount = ExamResult::where([
                            'exam_id' => $exam->id,
                            'user_id' => auth()->user()->id,
                            'status' => 'done',
                        ])
                        ->orderBy('created_at', 'desc')
                        ->count();

        $currentResult = ExamResult::where([
                            'user_id' => auth()->user()->id,
                            'exam_id' => $exam->id,
                            'status' => 'done',
                        ])
                        ->with([
                            'exam' => function ($q) {
                                $q->select([
                                    'id',
                                    'slug',
                                ])
                                ->withCount([
                                    'items AS total_score' => function ($q) {
                                        $q->select(DB::raw("SUM(mark) as totalscore"));
                                    },
                                ]);
                            },
                        ])
                        ->orderBy('created_at', 'desc')
                        ->first();

        if ($exam->type == 'live' && $resultCount != 0) return $this->responseSuccess('Already take this exam', $currentResult, 206);
        if ($exam->type == 'standard' && $resultCount > 1) return $this->responseSuccess('Already take this exam', $currentResult, 206);

        $input = $request->all();
        $validator = Validator::make($input, [
            'data' => 'required',
        ]);

        // $raw = json_encode($input['data']);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $data = json_decode($input['data']);
            // $data = json_decode($raw);

            $result = ExamResult::where([
                                    'user_id' => auth()->user()->id,
                                    'exam_id' => $exam->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

            if (!$result) {
                $result = ExamResult::create([
                    'user_id' => auth()->user()->id,
                    'exam_id' => $exam->id,
                    'status' => 'done',
                ]);
            } else {
                $result->update([
                    'status' => 'done',
                    'remaining_second' => null,
                    'current_section' => null,
                    'current_item' => null,
                ]);
            }

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

            $result = ExamResult::where('id', $result->id)
                            ->with([
                                'exam' => function ($q) {
                                    $q->select('id')
                                    ->withCount([
                                        'items AS total_score' => function ($q) {
                                            $q->select(DB::raw("SUM(mark) as totalscore"));
                                        },
                                    ]);
                                },
                            ])
                            ->first();

            return $this->responseSuccess('Result successfully stored', $result);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to store result');
        }
    }

    public function storePractices(Request $request, Practice $practice)
    {
        $practice = Practice::where('id', $practice->id)->withCount(['items'])->first();
        if (!$practice) return $this->responseFailed('Data not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'data' => 'required',
        ]);

        // $raw = json_encode($input['data']);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $data = json_decode($input['data']);
            // $data = json_decode($raw);

            $result = PracticeResult::where([
                                    'user_id' => auth()->user()->id,
                                    'practice_id' => $practice->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

            if (!$result) {
                $result = PracticeResult::create([
                    'user_id' => auth()->user()->id,
                    'practice_id' => $practice->id,
                    'status' => 'done',
                ]);
            } else {
                $result->update([
                    'status' => 'done',
                    'current_section' => null,
                    'current_item' => null,
                    'remaining_minute' => null,
                ]);
            }

            $score = 0;
            $correct = 0;
            $incorrect = 0;
            $answeredQuestions = 0;

            foreach ($data->sections as $key => $sectionValue) {
                foreach ($sectionValue->question_items as $key => $itemValue) {
                    $item = PracticeQuestionItem::find($itemValue->id);

                    $resultDetail = PracticeResultDetail::create([
                        'practice_result_id' => $result->id,
                        'practice_question_item_id' => $itemValue->id,
                    ]);

                    $keyOptionIds = PracticeOption::where([
                                        'practice_question_item_id' => $itemValue->id,
                                        'correct' => 1,
                                    ])
                                    ->pluck('id')
                                    ->all();
                    $answeredOptionIds = [];

                    foreach ($itemValue->options as $key => $optionValue) {
                        if (property_exists($optionValue, 'selected')) {
                            if (isset($optionValue->selected) && $optionValue->selected == 1) {
                                PracticeResultDetailOption::create([
                                    'practice_result_detail_id' => $resultDetail->id,
                                    'practice_option_id' => $optionValue->id,
                                ]);
                                array_push($answeredOptionIds, $optionValue->id);
                            }
                        } else {
                            break;
                        }
                    }

                    $resultDetail = PracticeResultDetail::find($resultDetail->id);
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

            PracticeResultDtemp::where('practice_result_id', $result->id)->delete();

            DB::commit();

            $result = PracticeResult::where('id', $result->id)
                            ->with([
                                'practice' => function ($q) {
                                    $q->select('id')
                                    ->withCount([
                                        'items AS total_score' => function ($q) {
                                            $q->select(DB::raw("SUM(mark) as totalscore"));
                                        },
                                    ]);
                                },
                            ])
                            ->first();

            return $this->responseSuccess('Result successfully stored', $result);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to store result');
        }
    }

    public function storeQuizzes(Request $request, Quiz $quiz)
    {
        $quiz = Quiz::where('id', $quiz->id)->withCount(['questions'])->first();
        if (!$quiz) return $this->responseFailed('Data not found', '', 404);

        $resultCount = QuizResult::where([
                                'quiz_id' => $quiz->id,
                                'user_id' => auth()->user()->id,
                                'status' => 'done',
                            ])
                            ->orderBy('created_at', 'desc')
                            ->count();

        $currentResult = QuizResult::where([
                                'user_id' => auth()->user()->id,
                                'quiz_id' => $quiz->id,
                                'status' => 'done',
                            ])
                            ->with([
                                'quiz' => function ($q) {
                                    $q->select([
                                        'id',
                                        'slug',
                                    ]);
                                }
                            ])
                            ->orderBy('created_at', 'desc')
                            ->first();

        if ($quiz->type == 'live' && $resultCount != 0) return $this->responseSuccess('Already take this quiz', $currentResult, 206);
        if ($quiz->type == 'mixed' && $resultCount > 1) return $this->responseSuccess('Already take this quiz', $currentResult, 206);

        $input = $request->all();
        $validator = Validator::make($input, [
            'data' => 'required',
        ]);

        // $raw = json_encode($input['data']);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $data = json_decode($input['data']);
            // $data = json_decode($raw);

            $result = QuizResult::where([
                                    'user_id' => auth()->user()->id,
                                    'quiz_id' => $quiz->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

            if (!$result) {
                $result = QuizResult::create([
                    'user_id' => auth()->user()->id,
                    'quiz_id' => $quiz->id,
                    'status' => 'done',
                ]);
            } else {
                $result->update([
                    'status' => 'done',
                    'current_item' => null,
                ]);
            }

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

            $data = QuizResult::find($result->id);

            return $this->responseSuccess('Result successfully stored', $data);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to store result');
        }
    }

    public function storePracticesQuestion(Request $request, Practice $practice)
    {
        $practice = Practice::where('id', $practice->id)->first();
        if (!$practice) return $this->responseFailed('Data not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'data' => 'required',
        ]);

        // $raw = json_encode($input['data']);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $data = json_decode($input['data']);
            // $data = json_decode($raw);

            $resultTemp = PracticeResult::where([
                                    'user_id' => auth()->user()->id,
                                    'practice_id' => $practice->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

            if (!$resultTemp) {
                $resultTemp = PracticeResult::create([
                    'user_id' => auth()->user()->id,
                    'practice_id' => $practice->id,
                ]);
            }

            $resultTemp->update([
                'current_section' => $data->current_section,
                'current_item' => $data->current_item,
                'remaining_minute' => $data->remaining_minute,
            ]);

            $resultDetail = PracticeResultDtemp::where([
                                'practice_result_id' => $resultTemp->id,
                                'practice_question_item_id' => $data->id,
                            ])
                            ->first();

            if (!$resultDetail) {
                $resultDetail = PracticeResultDtemp::create([
                    'practice_result_id' => $resultTemp->id,
                    'practice_question_item_id' => $data->id,
                ]);
            } else {
                PracticeResultDoTemp::where('practice_result_dtemp_id', $resultDetail->id)->delete();
            }

            foreach ($data->options as $key => $optionValue) {
                if (property_exists($optionValue, 'selected')) {
                    if (isset($optionValue->selected) && $optionValue->selected == 1) {
                        PracticeResultDoTemp::create([
                            'practice_result_dtemp_id' => $resultDetail->id,
                            'practice_option_id' => $optionValue->id,
                        ]);
                    }
                } else {
                    break;
                }
            }

            $resultDetail = PracticeResultDtemp::find($resultDetail->id);
            if (!$resultDetail->detailOptions()->exists()) $resultDetail->delete();

            DB::commit();

            return $this->responseSuccess('Answer successfully stored');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to store answer');
        }
    }

    public function storeExamsQuestion(Request $request, Exam $exam)
    {
        $exam = Exam::where('id', $exam->id)->first();
        if (!$exam) return $this->responseFailed('Data not found', '', 404);

        $resultCount = ExamResult::where([
                                'exam_id' => $exam->id,
                                'user_id' => auth()->user()->id,
                                'status' => 'done',
                            ])
                            ->orderBy('created_at', 'desc')
                            ->count();

        $currentResult = ExamResult::where([
                                'user_id' => auth()->user()->id,
                                'exam_id' => $exam->id,
                                'status' => 'done',
                            ])
                            ->with([
                                'exam' => function ($q) {
                                    $q->select([
                                        'id',
                                        'slug',
                                    ])
                                    ->withCount([
                                        'items AS total_score' => function ($q) {
                                            $q->select(DB::raw("SUM(mark) as totalscore"));
                                        },
                                    ]);
                                },
                            ])
                            ->orderBy('created_at', 'desc')
                            ->first();

        if ($exam->type == 'live' && $resultCount != 0) return $this->responseSuccess('Already take this exam', $currentResult, 206);
        if ($exam->type == 'standard' && $resultCount > 1) return $this->responseSuccess('Already take this exam', $currentResult, 206);

        $input = $request->all();
        $validator = Validator::make($input, [
            'data' => 'required',
        ]);

        // $raw = json_encode($input['data']);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $data = json_decode($input['data']);
            // $data = json_decode($raw);

            $resultTemp = ExamResult::where([
                                    'user_id' => auth()->user()->id,
                                    'exam_id' => $exam->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

            if (!$resultTemp) {
                $resultTemp = ExamResult::create([
                    'user_id' => auth()->user()->id,
                    'exam_id' => $exam->id,
                ]);
            }

            $resultTemp->update([
                'remaining_second' => $data->remaining_second,
                'current_section' => $data->current_section,
                'current_item' => $data->current_item,
            ]);

            $resultDetail = ExamResultDtemp::where([
                                'exam_result_id' => $resultTemp->id,
                                'exam_question_item_id' => $data->id,
                            ])
                            ->first();

            if (!$resultDetail) {
                $resultDetail = ExamResultDtemp::create([
                    'exam_result_id' => $resultTemp->id,
                    'exam_question_item_id' => $data->id,
                ]);
            } else {
                ExamResultDoTemp::where('exam_result_dtemp_id', $resultDetail->id)->delete();
            }

            foreach ($data->options as $key => $optionValue) {
                if (property_exists($optionValue, 'selected')) {
                    if (isset($optionValue->selected) && $optionValue->selected == 1) {
                        ExamResultDoTemp::create([
                            'exam_result_dtemp_id' => $resultDetail->id,
                            'exam_option_id' => $optionValue->id,
                        ]);
                    }
                } else {
                    break;
                }
            }

            $resultDetail = ExamResultDtemp::find($resultDetail->id);
            if (!$resultDetail->detailOptions()->exists()) $resultDetail->delete();

            DB::commit();

            return $this->responseSuccess('Answer successfully stored');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to store answer');
        }
    }

    public function storeQuizzesQuestion(Request $request, Quiz $quiz)
    {
        $quiz = Quiz::where('id', $quiz->id)->first();
        if (!$quiz) return $this->responseFailed('Data not found', '', 404);

        $resultCount = QuizResult::where([
                                'quiz_id' => $quiz->id,
                                'user_id' => auth()->user()->id,
                                'status' => 'done',
                            ])
                            ->orderBy('created_at', 'desc')
                            ->count();

        $currentResult = QuizResult::where([
                                'user_id' => auth()->user()->id,
                                'quiz_id' => $quiz->id,
                                'status' => 'done',
                            ])
                            ->with([
                                'quiz' => function ($q) {
                                    $q->select([
                                        'id',
                                        'slug',
                                    ]);
                                }
                            ])
                            ->orderBy('created_at', 'desc')
                            ->first();

        if ($quiz->type == 'live' && $resultCount != 0) return $this->responseSuccess('Already take this quiz', $currentResult, 206);
        if ($quiz->type == 'mixed' && $resultCount > 1) return $this->responseSuccess('Already take this quiz', $currentResult, 206);

        $input = $request->all();
        $validator = Validator::make($input, [
            'data' => 'required',
        ]);

        // $raw = json_encode($input['data']);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $data = json_decode($input['data']);
            // $data = json_decode($raw);

            $resultTemp = QuizResult::where([
                                    'user_id' => auth()->user()->id,
                                    'quiz_id' => $quiz->id,
                                    'status' => 'process',
                                ])
                                ->orderBy('created_at', 'desc')
                                ->first();

            if (!$resultTemp) {
                $resultTemp = QuizResult::create([
                    'user_id' => auth()->user()->id,
                    'quiz_id' => $quiz->id,
                ]);
            }

            $resultTemp->update([
                'current_item' => $data->current_item,
            ]);

            $resultDetail = QuizResultDtemp::where([
                                'quiz_result_id' => $resultTemp->id,
                                'quiz_question_id' => $data->id,
                            ])
                            ->first();

            if (!$resultDetail) {
                $resultDetail = QuizResultDtemp::create([
                    'quiz_result_id' => $resultTemp->id,
                    'quiz_question_id' => $data->id,
                ]);
            } else {
                QuizResultDoTemp::where('quiz_result_dtemp_id', $resultDetail->id)->delete();
            }

            foreach ($data->options as $key => $optionValue) {
                if (property_exists($optionValue, 'selected')) {
                    if (isset($optionValue->selected) && $optionValue->selected == 1) {
                        QuizResultDoTemp::create([
                            'quiz_result_dtemp_id' => $resultDetail->id,
                            'quiz_option_id' => $optionValue->id,
                        ]);
                    }
                } else {
                    break;
                }
            }

            $resultDetail = QuizResultDtemp::find($resultDetail->id);
            if (!$resultDetail->detailOptions()->exists()) $resultDetail->delete();

            DB::commit();

            return $this->responseSuccess('Answer successfully stored');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to store answer');
        }
    }
}
