<?php

namespace App\Http\Controllers;

use App\Http\Requests\PracticeStoreQuestionRequest;
use App\Http\Requests\PracticeStoreRequest;
use App\Http\Requests\PracticeUpdateQuestionRequest;
use App\Http\Requests\PracticeUpdateRequest;
use App\Http\Services\GlobalService;
use App\Models\Practice;
use App\Models\PracticeOption;
use App\Models\PracticeQuestion;
use App\Models\PracticeQuestionItem;
use App\Models\PracticeSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PracticeController extends Controller
{
    public $globalService;

    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
    }

    public function index(Request $request)
    {
        $query = Practice::query();

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

        if ($category = $request->input('category')) {
            $query->whereHas('exam_category', function ($q) use ($category) {
                $q->whereRaw("name LIKE '%" .  $category . "%'");
            });
        }

        if ($type = $request->input('type')) {
            $query->whereHas('exam_type', function ($q) use ($type) {
                $q->whereRaw("name LIKE '%" .  $type . "%'");
            });
        }

        $limit = $request->input('limit') ?? 5;
        $dt = date('Y-m-d');
        $data = $query->select([
                        'id',
                        'exam_category_id',
                        'exam_type_id',
                        'name',
                        'start_date',
                        'start_time',
                        DB::raw("(CASE WHEN DATE(start_date) > '" .$dt. "' AND status = 'published' THEN 'waiting' WHEN status = 'draft' THEN 'draft' ELSE 'published' END) AS status"),
                        DB::raw("(CASE WHEN DATE(start_date) < '" . $dt . "' AND status = 'draft' THEN 1 ELSE 0 END) as expired_draft"),
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
        $data = Practice::where('id', $id)
                    ->select([
                        '*',
                        DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1  WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                    ])
                    ->with([
                        'exam_category:id,name',
                        'exam_type:id,name',
                        'topics:id,name',
                        'sections:id,practice_id,name,duration,instruction',
                    ])
                    ->first();

        if (!$data) return $this->responseFailed('Practice not found', '', 404);
        if (!$data->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showSection($id)
    {
        $data = Practice::where('id', $id)
                    ->select([
                        'id',
                        DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1  WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                    ])
                    ->with([
                        'sections' => function ($q) {
                            $q->select(['id', 'practice_id', 'name', 'duration', 'instruction'])
                                ->withCount(['questions']);
                        },
                        'sections.questions' => function ($q) {
                            $q->select(['id', 'practice_section_id', 'type'])
                                ->withCount(['items']);
                        },
                    ])
                    ->first();

        if (!$data) return $this->responseFailed('Practice not found', '', 404);
        if (!$data->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showQuestion($questionId)
    {
        $data = PracticeQuestion::where('id', $questionId)
                        ->with([
                            'section',
                            'section.practice' => function ($q) {
                                $q->select([
                                    'id',
                                    DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1  WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                ]);
                            },
                        ])
                        ->first();

        if (!$data) return $this->responseFailed('Practice question not found', '', 404);
        if (!$data->section->practice->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        $data = PracticeQuestion::where('id', $questionId)
                        ->with([
                            'items:id,practice_question_id,level,tag,question,answer_type,answer_explanation,mark,negative_mark',
                            'items.options:id,practice_question_item_id,title,correct',
                        ])
                        ->first();

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function showSectionQuestion($id)
    {
        $data = Practice::where('id', $id)
                        ->with([
                            'sections:id,practice_id,name',
                            'sections.questions:id,practice_section_id,type,level,tag,instruction,paragraph',
                            'sections.questions.items:id,practice_question_id,level,tag,question,answer_type,answer_explanation',
                            'sections.questions.items.options:id,practice_question_item_id,title,correct',
                        ])
                        ->select(['id', 'name'])
                        ->first();

        if (!$data) return $this->responseFailed('Practice not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(PracticeStoreRequest $request)
    {
        $input = $request->all();

        try {
            DB::beginTransaction();

            $practice = Practice::create(array_merge(
                $input,
                [
                    'user_id' => auth()->user()->id,
                    'institute_id' => auth()->user()->institute_id,
                    'duration' => $input['duration'] ?? null,
                    'consentments' => json_encode($input['consentments']),
                    'slug' => Str::slug($input['name']) . '-' . Str::uuid()->toString(),
                ]
            ));

            isset($input['topics']) && $practice->topics()->attach($input['topics']);

            foreach ($input['sections'] as $key => $sectionValue) {
                PracticeSection::create([
                    'practice_id' => $practice->id,
                    'name' => $sectionValue['name'],
                    'duration' => $sectionValue['duration'] ?? null,
                    'instruction' => $sectionValue['instruction'],
                ]);
            }

            DB::commit();

            return $this->responseSuccess('Practice successfully created', $practice, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to create practice');
        }
    }

    public function storeQuestion(PracticeStoreQuestionRequest $request)
    {
        $input = $request->all();

        $section = PracticeSection::where('id', $input['section_id'])
                            ->with([
                                'practice' => function ($q) {
                                    $q->select([
                                        'id',
                                        DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1  WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                    ]);
                                },
                            ])
                            ->first();
        if (!$section->practice->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        try {
            DB::beginTransaction();

            foreach ($input['questions'] as $key => $questionValue) {
                $question = PracticeQuestion::create([
                    'practice_section_id' => $input['section_id'],
                    'type' => $questionValue['type'],
                    'level' => $questionValue['level'] ?? null,
                    'tag' => $questionValue['tag'] ?? null,
                    'instruction' => $questionValue['instruction'] ?? null,
                    'paragraph' => $questionValue['paragraph'] ?? null,
                ]);

                foreach ($questionValue['question_items'] as $key => $itemValue) {
                    $item = PracticeQuestionItem::create([
                        'practice_question_id' => $question->id,
                        'level' => $itemValue['level'],
                        'tag' => $itemValue['tag'],
                        'question' => $itemValue['question'],
                        'answer_type' => $itemValue['answer_type'],
                        'answer_explanation' => $itemValue['answer_explanation'],
                        'mark' => $itemValue['mark'],
                        'negative_mark' => $itemValue['negative_mark'],
                        'is_first_item' => !!$key == 0,
                    ]);

                    foreach ($itemValue['options'] as $key => $optionValue) {
                        PracticeOption::create([
                            'practice_question_item_id' => $item->id,
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

    public function update(PracticeUpdateRequest $request, $id)
    {
        $practice = Practice::where('id', $id)
                        ->select([
                            '*',
                            DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1  WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                        ])
                        ->first();
        if (!$practice) return $this->responseFailed('Practice not found', '', 404);
        if (!$practice->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        $input = $request->all();

        try {
            DB::beginTransaction();

            !isset($input['topics']) && $practice->topics()->detach();

            isset($input['topics']) && $practice->topics()->sync($input['topics']);

            $practice->update(array_merge(
                $input,
                [
                    'duration' => $input['duration'] ?? null,
                    'consentments' => json_encode($input['consentments']),
                ]
            ));

            foreach ($input['sections'] as $key => $sectionValue) {
                if ($sectionValue['id'] == -1) {
                    PracticeSection::create([
                        'practice_id' => $practice->id,
                        'name' => $sectionValue['name'],
                        'duration' => $sectionValue['duration'] ?? null,
                        'instruction' => $sectionValue['instruction'],
                    ]);
                } else {
                    if (isset($sectionValue['deleted']) && $sectionValue['deleted']) {
                        PracticeSection::where('id', $sectionValue['id'])->delete();
                    } else {
                        PracticeSection::where('id', $sectionValue['id'])
                            ->update([
                                'name' => $sectionValue['name'],
                                'duration' => $sectionValue['duration'] ?? null,
                                'instruction' => $sectionValue['instruction'],
                            ]);
                    }
                }
            }

            DB::commit();

            return $this->responseSuccess('Practice successfully updated', '', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to update practice');
        }
    }

    public function updateQuestion(PracticeUpdateQuestionRequest $request, $questionId)
    {
        $question = PracticeQuestion::where('id', $questionId)
                            ->with([
                                'section',
                                'section.practice' => function ($q) {
                                    $q->select([
                                        'id',
                                        DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1  WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                    ]);
                                },
                            ])
                            ->first();

        if (!$question) return $this->responseFailed('Practice question not found', '', 404);
        if (!$question->section->practice->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        $input = $request->all();

        try {
            DB::beginTransaction();

            $question->update($input);

            foreach ($input['question_items'] as $key => $itemValue) {
                $isFirst =  $this->globalService->arrayEvery(array_slice($input['question_items'], 0, $key), function ($item) {
                    return isset($item['deleted']) && $item['deleted'];
                });

                if ($itemValue['id'] == -1) {
                    $item = PracticeQuestionItem::create([
                        'practice_question_id' => $question->id,
                        'level' => $itemValue['level'],
                        'tag' => $itemValue['tag'],
                        'question' => $itemValue['question'],
                        'answer_type' => $itemValue['answer_type'],
                        'answer_explanation' => $itemValue['answer_explanation'],
                        'mark' => $itemValue['mark'],
                        'negative_mark' => $itemValue['negative_mark'],
                        'is_first_item' => $isFirst,
                    ]);

                    foreach ($itemValue['options'] as $key => $optionValue) {
                        if ($optionValue['id'] == -1) {
                            PracticeOption::create([
                                'practice_question_item_id' => $item->id,
                                'title' => $optionValue['title'],
                                'correct' => $optionValue['correct'],
                            ]);
                        }
                    }
                } else {
                    if (isset($itemValue['deleted']) && $itemValue['deleted']) {
                        PracticeQuestionItem::where('id', $itemValue['id'])->delete();
                    } else {
                        PracticeQuestionItem::where('id', $itemValue['id'])
                            ->update([
                                'level' => $itemValue['level'],
                                'tag' => $itemValue['tag'],
                                'question' => $itemValue['question'],
                                'answer_type' => $itemValue['answer_type'],
                                'answer_explanation' => $itemValue['answer_explanation'],
                                'mark' => $itemValue['mark'],
                                'negative_mark' => $itemValue['negative_mark'],
                                'is_first_item' => $isFirst,
                            ]);

                        foreach ($itemValue['options'] as $key => $optionValue) {
                            if ($optionValue['id'] == -1) {
                                PracticeOption::create([
                                    'practice_question_item_id' => $itemValue['id'],
                                    'title' => $optionValue['title'],
                                    'correct' => $optionValue['correct'],
                                ]);
                            } else {
                                if (isset($optionValue['deleted']) && $optionValue['deleted']) {
                                    PracticeOption::where('id', $optionValue['id'])->delete();
                                } else {
                                    PracticeOption::where('id', $optionValue['id'])
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

            return $this->responseSuccess('Practice successfully updated', '', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to update practice');
        }
    }

    public function destroy($id)
    {
        $practice = Practice::where('id', $id)->first();
        if (!$practice) return $this->responseFailed('Practice not found', '', 404);

        $practice->delete();

        return $this->responseSuccess('Practice successfully deleted');
    }

    public function destroyQuestion($questionId)
    {
        $question = PracticeQuestion::where('id', $questionId)
                            ->with([
                                'section',
                                'section.practice' => function ($q) {
                                    $q->select([
                                        'id',
                                        DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1  WHEN status = 'draft' THEN 1 ELSE 0 END) AS edited"),
                                    ]);
                                },
                            ])
                            ->first();

        if (!$question) return $this->responseFailed('Practice question not found', '', 404);
        if (!$question->section->practice->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        $question->delete();

        return $this->responseSuccess('Practice question successfully deleted');
    }

    public function publish($id)
    {
        $practice = Practice::where('id', $id)->first();

        if (!$practice) return $this->responseFailed('Practice not found', '', 404);
        if ($practice->status == 'published') return $this->responseFailed('Practice already published', '', 422);

        $practice->update(['status' => 'published']);

        return $this->responseSuccess('Practice succesfully published');
    }

    public function unpublish($id)
    {
        $practice = Practice::where('id', $id)
                        ->select([
                            '*',
                            DB::raw("(CASE WHEN DATE(start_date) > '" . date('Y-m-d') . "' AND status = 'published' THEN 1 ELSE 0 END) AS edited"),
                        ])
                        ->first();

        if (!$practice) return $this->responseFailed('Practice not found', '', 404);
        if ($practice->status == 'draft') return $this->responseFailed('Practice already in draft', '', 422);
        if (!$practice->edited) return $this->responseFailed("Practice can't be edited", '', 422);

        $practice->update(['status' => 'draft']);

        return $this->responseSuccess('Practice succesfully unpublished');
    }
}
