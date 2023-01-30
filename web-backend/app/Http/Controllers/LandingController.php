<?php

namespace App\Http\Controllers;

use App\Http\Resources\News as ResourcesNews;
use Illuminate\Http\Request;
use App\Http\Services\GlobalService;
use App\Models\Exam;
use App\Models\ExamCategory;
use App\Models\ExamType;
use App\Models\News;
use App\Models\Quiz;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LandingController extends Controller
{
    public $globalService;

    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
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

    public function liveQuizzes(Request $request)
    {
        $query = Quiz::select([
                        'id',
                        'institute_id',
                        'topic_id',
                        'name',
                        'type',
                        'duration',
                        'start_time',
                        'end_time',
                    ])
                    ->where([
                        ['type', '=', 'live'],
                        ['status', '=', 'published'],
                    ])
                    ->with([
                        'institute:id,name',
                        'topic:id,name',
                    ])
                    ->orderBy('start_time', 'desc')
                    ->orderBy('created_at', 'desc');

        if ($topic = $request->input('topic')) {
            $query->whereHas('topic', function ($q) use ($topic) {
                $q->whereRaw("name LIKE '%" .  $topic . "%'");
            });
        }

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'quiz', 'landing');

        return $this->responseSuccess('Data', $data);
    }

    public function previousExams(Request $request)
    {
        $query = Exam::query();

        $query->with([
                    'institute:id,name',
                    'exam_category:id,name',
                    'exam_type:id,exam_category_id,name',
                    'exam_type.exam_category:id,name',
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
                ])
                ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id');

        if ($category = $request->input('category')) {
            $query->where('exams.exam_category_id', $category);
        }

        if ($type = $request->input('type')) {
            $query->where('exams.exam_type_id', $type);
        }

        $query->where([
                    'exams.type' => 'live',
                    'exams.status' => 'published',
                ])
                ->groupBy('exams.id', 'exams.institute_id', 'exams.exam_category_id', 'exams.exam_type_id', 'exams.name', 'exams.slug', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration')
                ->orderBy('exams.start_date', 'desc')
                ->orderBy('exams.created_at', 'desc');

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'exam', 'previous');

        return $this->responseSuccess('Data', $data);
    }

    public function showPreviousExams(Exam $exam)
    {
        $data = Exam::where('exams.id', $exam->id)
                        ->with([
                            'institute:id,name',
                            'exam_category:id,name',
                            'exam_type:id,exam_category_id,name',
                            'exam_type.exam_category:id,name',
                            'sections:id,exam_id,name',
                            'sections.questions:id,exam_section_id,type,level,tag,instruction,paragraph',
                            'sections.questions.items:id,exam_question_id,level,tag,question,answer_type,answer_explanation',
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
                        ])
                        ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id')
                        ->groupBy('exams.id', 'exams.institute_id', 'exams.exam_category_id', 'exams.exam_type_id', 'exams.name', 'exams.slug', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration')
                        ->first();

        if (!$data) return $this->responseFailed('Exam not found', '', 404);
        if ($exam->status == 'draft') return $this->responseFailed("Exam cannot be shown", '', 422);
        if ($exam->type == 'live' && !Carbon::now()->gt(Carbon::parse($data->end_date)->addDays(1))) return $this->responseFailed("Exam cannot be shown", '', 422);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function liveExams(Request $request)
    {
        $query = Exam::with([
                        'institute:id,name',
                        'exam_category:id,name',
                        'exam_type:id,exam_category_id,name',
                        'exam_type.exam_category:id,name',
                    ])
                    ->select([
                        'exams.id',
                        'exams.institute_id',
                        'exams.exam_category_id',
                        'exams.exam_type_id',
                        'exams.name',
                        'exams.type',
                        DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                        DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                        DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                        DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                    ])
                    ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id');

        if ($category = $request->input('category')) {
            $query->where('exams.exam_category_id', $category);
        }

        if ($type = $request->input('type')) {
            $query->where('exams.exam_type_id', $type);
        }

        $query->where([
                    ['exams.type', '=', 'live'],
                    ['exams.status', '=', 'published'],
                ])
                ->groupBy('exams.id', 'exams.institute_id', 'exams.exam_category_id', 'exams.exam_type_id', 'exams.name', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration')
                ->orderBy('exams.start_date', 'desc')
                ->orderBy('exams.created_at', 'desc');

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'exam', 'landing');

        return $this->responseSuccess('Data', $data);
    }

    public function categoryExams(Request $request, $id)
    {
        $category = ExamCategory::find($id);

        if (!$category) return $this->responseFailed('Exam category not found', '', 404);

        $query = Exam::with([
                        'institute:id,name',
                        'exam_category:id,name',
                        'exam_type:id,exam_category_id,name',
                        'exam_type.exam_category:id,name',
                    ])
                    ->select([
                        'exams.id',
                        'exams.institute_id',
                        'exams.exam_category_id',
                        'exams.exam_type_id',
                        'exams.name',
                        'exams.type',
                        DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                        DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                        DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                        DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                    ])
                    ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id')
                    ->where([
                        ['exams.exam_category_id', '=', $id],
                        ['exams.status', '=', 'published'],
                    ])
                    ->groupBy('exams.id', 'exams.institute_id', 'exams.exam_category_id', 'exams.exam_type_id', 'exams.name', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration')
                    ->orderBy('exams.start_date', 'desc')
                    ->orderBy('exams.created_at', 'desc');

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $rawData = $query->get();

        $data = $this->globalService->filterBetween($rawData, 'exam', 'landing');

        return $this->responseSuccess('Data', $data);
    }

    public function upcomingExams(Request $request)
    {
        $query = Exam::with([
                        'institute:id,name',
                        'exam_category:id,name',
                        'exam_type:id,exam_category_id,name',
                        'exam_type.exam_category:id,name',
                    ])
                    ->select([
                        'exams.id',
                        'exams.institute_id',
                        'exams.exam_category_id',
                        'exams.exam_type_id',
                        'exams.name',
                        'exams.type',
                        DB::raw("concat(exams.start_date,' ',exams.start_time) as start_date"),
                        DB::raw("concat(exams.end_date,' ',exams.end_time) as end_date"),
                        DB::raw("(CASE WHEN exams.duration IS NULL THEN SUM(exam_sections.duration) ELSE exams.duration END) AS duration"),
                        DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                    ])
                    ->leftJoin('exam_sections', 'exams.id', '=', 'exam_sections.exam_id');

        if ($category = $request->input('category')) {
            $query->where('exams.exam_category_id', $category);
        }

        if ($type = $request->input('type')) {
            $query->where('exams.exam_type_id', $type);
        }

        $query->where([
                    ['exams.type', '=', 'live'],
                    ['exams.status', '=', 'published'],
                ])
                ->groupBy('exams.id', 'exams.institute_id', 'exams.exam_category_id', 'exams.exam_type_id', 'exams.name', 'exams.type', 'exams.start_date', 'exams.end_date', 'exams.start_time', 'exams.end_time', 'exams.duration')
                ->orderBy('exams.start_date', 'desc');

        if ($take = $request->input('take')) {
            $query->take($take);
        }

        $rawData = $query->get();

        $data = $this->globalService->filterBeforeDate($rawData);

        return $this->responseSuccess('Data', $data);
    }
}
