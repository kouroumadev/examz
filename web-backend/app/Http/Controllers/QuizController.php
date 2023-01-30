<?php

namespace App\Http\Controllers;

use App\Events\QuizUpdated;
use App\Http\Requests\QuizStoreRequest;
use App\Http\Requests\QuizUpdateRequest;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::query();

        if (auth()->user()->hasRole('IA') || auth()->user()->hasRole('STF')) {
            $query->where('institute_id', auth()->user()->institute_id);
        }

        if ($search = $request->input('search')) {
            if (auth()->user()->hasRole('IA') || auth()->user()->hasRole('STF')) {
                $query->where([['institute_id', '=', auth()->user()->institute_id], ['name', 'like', '%' . $search . '%']]);
            } else {
                $query->whereRaw("name LIKE '%" .  $search . "%'");
            }
        }

        if ($status = $request->input('status')) {
            $query->whereRaw("status LIKE '%" .  $status . "%'");
        }

        if ($type = $request->input('type')) {
            $query->whereRaw("type LIKE '%" .  $type . "%'");
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->select([
                        'id',
                        'name',
                        'type',
                        'status',
                        'start_time',
                        'end_time',
                        DB::raw("(CASE WHEN DATE(start_time) > '" .  date('Y-m-d H:i') . "'  AND status = 'published' AND type = 'live' THEN 'waiting' WHEN status = 'draft' THEN 'draft' WHEN DATE(end_time) < '" .  date('Y-m-d H:i') . "'  AND status = 'published' AND type = 'live' THEN 'completed' ELSE 'published' END) AS status"),
                        'created_at',
                    ])
                    ->withCount(['questions'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = Quiz::where('id', $id)
                        ->select([
                            '*',
                            DB::raw("(CASE WHEN DATE(start_time) > '" .  date('Y-m-d H:i') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                            DB::raw("(CASE WHEN DATE(start_time) < '" .  date('Y-m-d H:i') . "'  AND status = 'draft' AND type = 'live' THEN 1 ELSE 0 END) as expired_draft"),
                        ])
                        ->with([
                            'topic:id,name',
                            'questions:id,quiz_id,level,tag,question,answer_type,answer_explanation,mark,negative_mark',
                            'questions.options:id,quiz_question_id,title,correct'
                        ])
                        ->first();

        if (!$data) return $this->responseFailed('Quiz not found', '', 404);
        if (!$data->edited) return $this->responseFailed("Quiz can't be edited", '', 422);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showQuestion($id)
    {
        $data = Quiz::where('id', $id)
                        ->with([
                            'topic:id,name',
                            'questions:id,quiz_id,level,tag,question,answer_type,answer_explanation,mark,negative_mark',
                            'questions.options:id,quiz_question_id,title,correct'
                        ])
                        ->first();

        if (!$data) return $this->responseFailed('Quiz not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(QuizStoreRequest $request)
    {
        $input = $request->all();

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $image = rand() . '.' . $request->image->getClientOriginalExtension();
                Storage::putFileAs('public/images', $request->file('image'), $image);
            }

            $quiz = Quiz::create(array_merge(
                $input,
                [
                    'user_id' => auth()->user()->id,
                    'institute_id' => auth()->user()->institute_id,
                    'image' => $image ?? null,
                    'consentments' => json_encode($input['consentments']),
                    'slug' => Str::slug($input['name']) . '-' . Str::uuid()->toString(),
                ]
            ));

            foreach ($input['questions'] as $key => $questionValue) {
                $question = QuizQuestion::create([
                    'quiz_id' => $quiz->id,
                    'level' => $questionValue['level'],
                    'tag' => $questionValue['tag'],
                    'question' => $questionValue['question'],
                    'answer_type' => $questionValue['answer_type'],
                    'answer_explanation' => $questionValue['answer_explanation'],
                    'mark' => $questionValue['mark'],
                    'negative_mark' => $questionValue['negative_mark'],
                ]);

                foreach ($questionValue['options'] as $key => $optionValue) {
                    QuizOption::create([
                        'quiz_question_id' => $question->id,
                        'title' => $optionValue['title'],
                        'correct' => $optionValue['correct'],
                    ]);
                }
            }

            DB::commit();

            return $this->responseSuccess('Quiz successfully created', $quiz, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to create quiz');
        }
    }

    public function update(QuizUpdateRequest $request, $id)
    {
        $quiz = Quiz::where('id', $id)
                    ->select([
                        '*',
                        DB::raw("(CASE WHEN DATE(start_time) > '" .  date('Y-m-d H:i') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                    ])
                    ->first();
        if (!$quiz) return $this->responseFailed('Quiz not found', '', 404);
        if (!$quiz->edited) return $this->responseFailed("Quiz can't be edited", '', 422);

        $input = $request->all();

        try {
            DB::beginTransaction();

            $oldImage = $quiz->image;
            if ($request->hasFile('image')) {
                if (Storage::exists('public/images/' . $oldImage)) {
                    Storage::delete('public/images/' . $oldImage);
                }
                $image = rand() . '.' . $request->image->getClientOriginalExtension();
                Storage::putFileAs('public/images', $request->file('image'), $image);
            } else {
                $image = $oldImage;
            }

            $quiz->update(array_merge(
                $input,
                [
                    'image' => $image,
                    'consentments' => json_encode($input['consentments']),
                ]
            ));

            if ($quiz->wasChanged('type') && $quiz->type == 'mixed') {
                QuizUpdated::dispatch($quiz);
            }

            foreach ($input['questions'] as $key => $questionValue) {
                if ($questionValue['id'] == -1) {
                    $question = QuizQuestion::create([
                        'quiz_id' => $quiz->id,
                        'level' => $questionValue['level'],
                        'tag' => $questionValue['tag'],
                        'question' => $questionValue['question'],
                        'answer_type' => $questionValue['answer_type'],
                        'answer_explanation' => $questionValue['answer_explanation'],
                        'mark' => $questionValue['mark'],
                        'negative_mark' => $questionValue['negative_mark'],
                    ]);

                    foreach ($questionValue['options'] as $key => $optionValue) {
                        if ($optionValue['id'] == -1) {
                            QuizOption::create([
                                'quiz_question_id' => $question->id,
                                'title' => $optionValue['title'],
                                'correct' => $optionValue['correct']
                            ]);
                        }
                    }
                } else {
                    QuizQuestion::where('id', $questionValue['id'])
                        ->update([
                            'level' => $questionValue['level'],
                            'tag' => $questionValue['tag'],
                            'question' => $questionValue['question'],
                            'answer_type' => $questionValue['answer_type'],
                            'answer_explanation' => $questionValue['answer_explanation'],
                            'mark' => $questionValue['mark'],
                            'negative_mark' => $questionValue['negative_mark'],
                        ]);

                    foreach ($questionValue['options'] as $key => $optionValue) {
                        if ($optionValue['id'] == -1) {
                            QuizOption::create([
                                'quiz_question_id' => $questionValue['id'],
                                'title' => $optionValue['title'],
                                'correct' => $optionValue['correct']
                            ]);
                        } else {
                            if (isset($optionValue['deleted']) && $optionValue['deleted']) {
                                QuizOption::where('id', $optionValue['id'])->delete();
                            } else {
                                QuizOption::where('id', $optionValue['id'])
                                    ->update([
                                        'title' => $optionValue['title'],
                                        'correct' => $optionValue['correct']
                                    ]);
                            }
                        }
                    }
                }
            }

            DB::commit();

            return $this->responseSuccess('Quiz successfully updated', '', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to update quiz');
        }
    }

    public function destroy($id)
    {
        $quiz = Quiz::where('id', $id)->first();
        if (!$quiz) return $this->responseFailed('Quiz not found', '', 404);

        if ($quiz->image) {
            if (Storage::exists('public/images/' . $quiz->image)) {
                Storage::delete('public/images/' . $quiz->image);
            }
        }

        $quiz->delete();

        return $this->responseSuccess('Quiz successfully deleted');
    }

    public function publish($id)
    {
        $quiz = Quiz::where('id', $id)->first();

        if (!$quiz) return $this->responseFailed('Quiz not found', '', 404);
        if ($quiz->status == 'published') return $this->responseFailed('Quiz already published', '', 422);

        $quiz->update(['status' => 'published']);

        return $this->responseSuccess('Quiz succesfully published');
    }

    public function unpublish($id)
    {
        $quiz = Quiz::where('id', $id)
                        ->select([
                            '*',
                            DB::raw("(CASE WHEN DATE(start_time) > '" .  date('Y-m-d H:i') . "'  AND status = 'published' AND type = 'live' THEN 1 ELSE 0 END) AS edited"),
                        ])
                        ->first();

        if (!$quiz) return $this->responseFailed('Quiz not found', '', 404);
        if ($quiz->status == 'draft') return $this->responseFailed('Quiz already in draft', '', 422);
        if (!$quiz->edited) return $this->responseFailed("Quiz can't be edited", '', 422);

        $quiz->update(['status' => 'draft']);

        return $this->responseSuccess('Quiz succesfully unpublished');
    }
}
