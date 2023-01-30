<?php

namespace App\Http\Controllers;

use App\Events\ExamUpdated;
use App\Http\Requests\ExamStoreQuestionRequest;
use App\Http\Requests\ExamStoreRequest;
use App\Http\Requests\ExamUpdateQuestionRequest;
use App\Http\Requests\ExamUpdateRequest;
use App\Http\Services\GlobalService;
use App\Models\Exam;
use App\Models\ExamOption;
use App\Models\ExamQuestion;
use App\Models\ExamQuestionItem;
use App\Models\ExamSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


class ExamController extends Controller
{
    public $globalService;

    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
    }

    public function index(Request $request)
    {
        $query = Exam::query();

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
                        'exam_category_id',
                        'exam_type_id',
                        'name',
                        'type',
                        'start_date',
                        'end_date',
                        DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 'waiting' WHEN status = 'draft' THEN 'draft' WHEN DATE(end_date) < '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 'completed' ELSE 'published' END) AS status"),
                        DB::raw("(CASE WHEN DATE(start_date) < '" .  date('Y-m-d') . "'  AND status = 'draft' AND type = 'live' THEN 1 ELSE 0 END) as expired_draft"),
                        'created_at',
                    ])
                    ->with([
                        'exam_category:id,name',
                        'exam_type:id,name',
                    ])
                    ->withCount(['items'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = Exam::where('id', $id)
                        ->select([
                            '*',
                            DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                        ])
                        ->with([
                            'exam_category:id,name',
                            'exam_type:id,name',
                            'topics:id,name',
                            'branches:id,institute_id,name',
                            'batches:id,institute_id,name',
                            'sections:id,exam_id,name,duration,instruction',
                        ])
                        ->first();

        if (!$data) return $this->responseFailed('Exam not found', '', 404);
        if (!$data->edited) return $this->responseFailed("Exam can't be edited", '', 422);
        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showSection($id)
    {
        $data = Exam::where('id', $id)
                        ->select([
                            'id',
                            'exam_category_id',
                            DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                        ])
                        ->with([
                            'sections' => function ($q) {
                                $q->select(['id', 'exam_id', 'name', 'duration', 'instruction'])
                                    ->withCount(['questions']);
                            },
                            'sections.questions' => function ($q) {
                                $q->select(['id', 'exam_section_id', 'type'])
                                    ->withCount(['items']);
                            },
                        ])
                        ->first();

        if (!$data) return $this->responseFailed('Exam not found', '', 404);
        if (!$data->edited) return $this->responseFailed("Exam can't be edited", '', 422);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showQuestion($questionId)
    {
        $data = ExamQuestion::where('id', $questionId)
                        ->with([
                            'section',
                            'section.exam' => function ($q) {
                                $q->select([
                                    'id',
                                    DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                ]);
                            },
                        ])
                        ->first();

        if (!$data) return $this->responseFailed('Exam question not found', '', 404);
        if (!$data->section->exam->edited) return $this->responseFailed("Exam can't be edited", '', 422);

        $data = ExamQuestion::where('id', $questionId)
                        ->with([
                            'items:id,exam_question_id,level,tag,question,answer_type,answer_explanation,mark,negative_mark,is_required',
                            'items.options:id,exam_question_item_id,title,correct',
                        ])
                        ->first();

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showSectionQuestion($id)
    {
        $data = Exam::where('id', $id)
                        ->with([
                            'sections:id,exam_id,name',
                            'sections.questions:id,exam_section_id,type,level,tag,instruction,paragraph',
                            'sections.questions.items:id,exam_question_id,level,tag,question,answer_type,answer_explanation',
                            'sections.questions.items.options:id,exam_question_item_id,title,correct',
                        ])
                        ->select(['id', 'name'])
                        ->first();

        if (!$data) return $this->responseFailed('Exam not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showSectionDetails($id)
    {
        $data = Exam::where('id', $id)
                        // ->with([
                        //     'sections:id,exam_id,name',
                        //     'sections.questions:id,exam_section_id,type,level',
                        //     'sections.questions.items:id,exam_question_id,question,mark,negative_mark',
                        //     'sections.questions.items.options:id,exam_question_item_id,title,correct',
                        // ])
                        // ->select(['id', 'name'])
                        // ->first();
                        ->select([
                            'id',
                        ])
                        ->with([
                            'sections' => function ($q) {
                                $q->select(['id', 'exam_id', 'name'])
                                    ->withCount(['questions']);
                            },
                            'sections.questions' => function ($q) {
                                $q->select(['id', 'exam_section_id', 'type'])
                                    ->withCount(['items']);
                            },
                            'sections.questions.items' => function($q) {
                                $q->select(['id', 'exam_question_id', 'question'])
                                    ->withCount(['options']);
                            },
                            'sections.questions.items.options' => function($q) {
                                $q->select(['id', 'exam_question_item_id', 'title', 'correct']);
                                    // ->withCount(['options']);
                            }
                        ])
                        ->first();

        if (!$data) return $this->responseFailed('Exam not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(ExamStoreRequest $request)
    {
        $input = $request->all();

        try {
            DB::beginTransaction();

            $exam = Exam::create(array_merge(
                $input,
                [
                    'user_id' => auth()->user()->id,
                    'institute_id' => auth()->user()->institute_id,
                    'duration' => $input['duration'] ?? null,
                    // 'consentments' => json_encode($input['consentments']),
                    'consentments' => $input['consentments'],
                    'slug' => Str::slug($input['name']) . '-' . Str::uuid()->toString(),
                ]
            ));

            isset($input['branches']) && $exam->branches()->attach($input['branches']);
            isset($input['batches']) && $exam->batches()->attach($input['batches']);
            isset($input['topics']) && $exam->topics()->attach($input['topics']);

            foreach ($input['sections'] as $key => $sectionValue) {
                ExamSection::create([
                    'exam_id' => $exam->id,
                    'name' => $sectionValue['name'],
                    'duration' => $sectionValue['duration'] ?? null,
                    'instruction' => $sectionValue['instruction'],
                ]);
            }

            DB::commit();

            return $this->responseSuccess('Exam successfully created', $exam, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            return $this->responseFailed('Failed to create exam');
        }
    }

    public function storeQuestion(ExamStoreQuestionRequest $request)
    {
        $input = $request->all();

        $section = ExamSection::where('id', $input['section_id'])
                            ->with([
                                'exam' => function ($q) {
                                    $q->select([
                                        'id',
                                        DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                    ]);
                                },
                            ])
                            ->first();
        if (!$section->exam->edited) return $this->responseFailed("Exam can't be edited", '', 422);

        try {
            DB::beginTransaction();

            foreach ($input['questions'] as $key => $questionValue) {
                $question = ExamQuestion::create([
                    'exam_section_id' => $input['section_id'],
                    'type' => $questionValue['type'],
                    'level' => $questionValue['level'] ?? null,
                    'tag' => $questionValue['tag'] ?? null,
                    'instruction' => $questionValue['instruction'] ?? null,
                    'paragraph' => $questionValue['paragraph'] ?? null,
                ]);

                foreach ($questionValue['question_items'] as $key => $itemValue) {
                    $item = ExamQuestionItem::create([
                        'exam_question_id' => $question->id,
                        'level' => $itemValue['level'],
                        'tag' => $itemValue['tag'],
                        'question' => $itemValue['question'],
                        'answer_type' => $itemValue['answer_type'],
                        'answer_explanation' => $itemValue['answer_explanation'],
                        'mark' => $itemValue['mark'],
                        'negative_mark' => $itemValue['negative_mark'],
                        'is_first_item' => !!$key == 0,
                        'is_required' => $itemValue['is_required'],
                    ]);

                    // Log::error($itemValue['options']);

                    foreach ($itemValue['options'] as $key => $optionValue) {
                        ExamOption::create([
                            'exam_question_item_id' => $item->id,
                            'title' => $optionValue['title'],
                            'correct' => $optionValue['correct'],
                        ]);
                    }
                }
            }

            DB::commit();

            return $this->responseSuccess('Question successfully created', '', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to create question');
        }
    }

    public function update(ExamUpdateRequest $request, $id)
    {
        $exam = Exam::where('id', $id)
                    ->select([
                        '*',
                        DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                    ])
                    ->first();
        if (!$exam) return $this->responseFailed('Exam not found', '', 404);
        if (!$exam->edited) return $this->responseFailed("Exam can't be edited", '', 422);

        $input = $request->all();

        try {
            DB::beginTransaction();

            !isset($input['branches']) && $exam->branches()->detach();
            !isset($input['batches']) && $exam->batches()->detach();
            !isset($input['topics']) && $exam->topics()->detach();

            isset($input['branches']) && $exam->branches()->sync($input['branches']);
            isset($input['batches']) && $exam->batches()->sync($input['batches']);
            isset($input['topics']) && $exam->topics()->sync($input['topics']);

            $exam->update(array_merge(
                $input,
                [
                    'duration' => $input['duration'] ?? null,
                    'consentments' => json_encode($input['consentments']),
                ]
            ));

            if ($exam->wasChanged('type') && $exam->type == 'standard') {
                ExamUpdated::dispatch($exam);
            }

            foreach ($input['sections'] as $key => $sectionValue) {
                if ($sectionValue['id'] == -1) {
                    ExamSection::create([
                        'exam_id' => $exam->id,
                        'name' => $sectionValue['name'],
                        'duration' => $sectionValue['duration'] ?? null,
                        'instruction' => $sectionValue['instruction'],
                    ]);
                } else {
                    if (isset($sectionValue['deleted']) && $sectionValue['deleted']) {
                        ExamSection::where('id', $sectionValue['id'])->delete();
                    } else {
                        ExamSection::where('id', $sectionValue['id'])
                            ->update([
                                'name' => $sectionValue['name'],
                                'duration' => $sectionValue['duration'] ?? null,
                                'instruction' => $sectionValue['instruction'],
                            ]);
                    }
                }
            }

            DB::commit();

            return $this->responseSuccess('Exam successfully updated', '', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to update exam');
        }
    }

    public function updateQuestion(ExamUpdateQuestionRequest $request, $questionId)
    {
        $question = ExamQuestion::where('id', $questionId)
                            ->with([
                                'section',
                                'section.exam' => function ($q) {
                                    $q->select([
                                        'id',
                                        DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                    ]);
                                },
                            ])
                            ->first();

        if (!$question) return $this->responseFailed('Exam question not found', '', 404);
        if (!$question->section->exam->edited) return $this->responseFailed("Exam can't be edited", '', 422);

        $input = $request->all();

        try {
            DB::beginTransaction();

            $question->update($input);
            // Log::error($question);

            foreach ($input['question_items'] as $key => $itemValue) {
                $isFirst =  $this->globalService->arrayEvery(array_slice($input['question_items'], 0, $key), function ($item) {
                    return isset($item['deleted']) && $item['deleted'];
                });

                if ($itemValue['id'] == -1) {
                    $item = ExamQuestionItem::create([
                        'exam_question_id' => $question->id,
                        'level' => $itemValue['level'],
                        'tag' => $itemValue['tag'],
                        'question' => $itemValue['question'],
                        'answer_type' => $itemValue['answer_type'],
                        'answer_explanation' => $itemValue['answer_explanation'],
                        'mark' => $itemValue['mark'],
                        'negative_mark' => $itemValue['negative_mark'],
                        'is_first_item' => $isFirst,
                        'is_required' => $itemValue['is_required'],
                    ]);

                    foreach ($itemValue['options'] as $key => $optionValue) {
                        if ($optionValue['id'] == -1) {
                            ExamOption::create([
                                'exam_question_item_id' => $item->id,
                                'title' => $optionValue['title'],
                                'correct' => $optionValue['correct'],
                            ]);
                        }
                    }
                } else {
                    if (isset($itemValue['deleted']) && $itemValue['deleted']) {
                        ExamQuestionItem::where('id', $itemValue['id'])->delete();
                    } else {
                        ExamQuestionItem::where('id', $itemValue['id'])
                            ->update([
                                'level' => $itemValue['level'],
                                'tag' => $itemValue['tag'],
                                'question' => $itemValue['question'],
                                'answer_type' => $itemValue['answer_type'],
                                'answer_explanation' => $itemValue['answer_explanation'],
                                'mark' => $itemValue['mark'],
                                'negative_mark' => $itemValue['negative_mark'],
                                'is_first_item' => $isFirst,
                                'is_required' => $itemValue['is_required'],
                            ]);

                        foreach ($itemValue['options'] as $key => $optionValue) {
                            if ($optionValue['id'] == -1) {
                                ExamOption::create([
                                    'exam_question_item_id' => $itemValue['id'],
                                    'title' => $optionValue['title'],
                                    'correct' => $optionValue['correct'],
                                ]);
                            } else {
                                if (isset($optionValue['deleted']) && $optionValue['deleted']) {
                                    ExamOption::where('id', $optionValue['id'])->delete();
                                } else {
                                    ExamOption::where('id', $optionValue['id'])
                                        ->update([
                                            'title' => $optionValue['title'],
                                            'correct' => $optionValue['correct']
                                        ]);
                                }
                            }
                        }
                    }
                }
            }

            DB::commit();

            return $this->responseSuccess('Exam successfully updated', '', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to update exam');
        }


    }

    public function destroy($id)
    {
        $exam = Exam::where('id', $id)->first();
        if (!$exam) return $this->responseFailed('Exam not found', '', 404);

        $exam->delete();

        return $this->responseSuccess('Exam successfully deleted');
    }

    public function destroyQuestion($questionId)
    {
        $question = ExamQuestion::where('id', $questionId)
                            ->with([
                                'section',
                                'section.exam' => function ($q) {
                                    $q->select([
                                        'id',
                                        DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                    ]);
                                },
                            ])
                            ->first();

        if (!$question) return $this->responseFailed('Exam question not found', '', 404);
        if (!$question->section->exam->edited) return $this->responseFailed("Exam can't be edited", '', 422);

        $question->delete();

        return $this->responseSuccess('Exam question successfully deleted');
    }

    public function publish($id)
    {
        $exam = Exam::where('id', $id)->first();

        if (!$exam) return $this->responseFailed('Exam not found', '', 404);
        if ($exam->status == 'published') return $this->responseFailed('Exam already published', '', 422);

        $exam->update(['status' => 'published']);

        return $this->responseSuccess('Exam succesfully published');
    }

    public function unpublish($id)
    {
        $exam = Exam::where('id', $id)
                        ->select([
                            '*',
                            DB::raw("(CASE WHEN DATE(start_date) > '" .  date('Y-m-d') . "'  AND status = 'published' AND type = 'live' THEN 1 ELSE 0 END) AS edited"),
                        ])
                        ->first();

        if (!$exam) return $this->responseFailed('Exam not found', '', 404);
        if ($exam->status == 'draft') return $this->responseFailed('Exam already in draft', '', 422);
        if (!$exam->edited) return $this->responseFailed("Exam can't be edited", '', 422);

        $exam->update(['status' => 'draft']);

        return $this->responseSuccess('Exam succesfully unpublished');
    }
}
