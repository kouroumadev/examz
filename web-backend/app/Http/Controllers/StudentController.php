<?php

namespace App\Http\Controllers;

use App\Events\EnrollmentStatus;
use App\Http\Resources\ExamsGraph;
use App\Models\Enrollment;
use App\Models\User;
use App\Http\Services\GlobalService;
use App\Models\ExamResult;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public $globalService;

    public function __construct(GlobalService $globalService)
    {
        $this->globalService = $globalService;
    }

    public function index(Request $request)
    {
        $query = Enrollment::query();

        if ($search = $request->input('search')) {
            $query->where([['institute_id', '=', auth()->user()->institute_id], ['code', 'like', '%' . $search . '%']])
                ->orWhereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
        }

        if ($branch = $request->input('branch')) {
            $query->whereHas('branch', function ($q) use ($branch) {
                $q->where('name', 'like', '%' . $branch . '%');
            });
        }

        if ($batch = $request->input('batch')) {
            $query->whereHas('batch', function ($q) use ($batch) {
                $q->where('name', 'like', '%' . $batch . '%');
            });
        }

        if ($status = $request->input('status')) {
            $query->where([['institute_id', '=', auth()->user()->institute_id], ['status', '=', $status]]);
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->select('id', 'user_id', 'institute_id', 'branch_id', 'batch_id', 'code', 'status')
            ->where([['institute_id', '=', auth()->user()->institute_id], ['status', '!=', 'reject']])
            ->with([
                'user:id,name',
                'institute:id,name',
                'branch:id,name',
                'batch:id,name'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = User::select('id', 'name', 'email', 'phone', 'gender', 'avatar')
            ->where('id', $id)
            ->with(['enrollments' => function ($q) {
                $q->select('id', 'user_id', 'branch_id', 'batch_id', 'code')
                    ->where('status', 'approve')
                    ->with('branch:id,name');
            }])
            ->first();

        if (!$data) return $this->responseFailed('User not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function graphPerformance(Request $request, $id)
    {
        $query = ExamResult::query();

        if ($date = $request->input('date')) {
            $query->whereDate('created_at', '=', Carbon::createFromFormat('d-m-Y', $date));
        }

        $data = $query->where('user_id', $id)
            ->with([
                'exam' => function ($q) {
                    $q->select([
                        'exams.id',
                        'exams.institute_id',
                        'exams.name',
                        'exams.slug',
                        'exams.type',
                        DB::raw("SUM(exam_sections.duration) as duration"),
                        DB::raw("COUNT(exam_sections.exam_id) as total_section"),
                    ])
                        ->withCount([
                            'items AS total_score' => function ($q) {
                                $q->select(DB::raw("SUM(mark) as totalscore"));
                            },
                        ])
                        ->leftJoin('exam_sections', 'exam_sections.exam_id', '=', 'exams.id')
                        ->groupBy('exams.id', 'exams.institute_id', 'exams.slug', 'exams.name', 'exams.type');
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

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'branch_id' => 'required|integer',
            'batch_id' => 'required|integer',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email',
            'phone' => 'required|string|max:15|unique:users,phone',
            'gender' => Rule::in(['MALE', 'FEMALE']),
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'code' => 'nullable|string',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            if ($request->hasFile('avatar')) {
                $avatar = rand() . '.' . $request->avatar->getClientOriginalExtension();
                Storage::putFileAs('public/images', $request->file('avatar'), $avatar);
            }

            $code = $request->code ?? $this->globalService->generateEnrollmentId(auth()->user()->institute_id);

            $data = User::create(array_merge(
                $request->only('name', 'email', 'phone', 'gender'),
                [
                    'avatar' => $avatar ?? null,
                    'password' => Hash::make($request->password),
                ]
            ));
            $data->assignRole('ST');
            $data->sendEmailVerificationNotificationWithPassword($request->password);

            Enrollment::create(array_merge(
                $validator->validated(),
                [
                    'user_id' => $data->id,
                    'institute_id' => auth()->user()->institute_id,
                    'code' => $code,
                    'status' => 'approve',
                    'is_student_data_editable' => true,
                ]
            ));

            DB::commit();

            return $this->responseSuccess('Student successfully created', $data, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to create student');
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)
            ->with(['enrollments' => function ($q) {
                $q->where('status', 'approve');
            }])
            ->first();
        if (!$user) return $this->responseFailed('User not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'branch_id' => 'required|integer',
            'batch_id' => 'required|integer',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $id,
            'phone' => 'required|string|max:15|unique:users,phone,' . $id,
            'gender' => Rule::in(['MALE', 'FEMALE']),
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'code' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        try {
            DB::beginTransaction();
            $oldAvatar = $user->avatar;
            if ($request->hasFile('avatar')) {
                if (Storage::exists('public/images/' . $oldAvatar)) {
                    Storage::delete('public/images/' . $oldAvatar);
                }
                $avatar = rand() . '.' . $request->avatar->getClientOriginalExtension();
                Storage::putFileAs('public/images', $request->file('avatar'), $avatar);
            } else {
                $avatar = $oldAvatar;
            }

            $enrollment = Enrollment::find($user->enrollments[0]->id);

            $code = $request->code ?? $enrollment->code;

            $user->update(array_merge(
                $request->only('name', 'email', 'phone', 'gender'),
                [
                    'avatar' => $avatar,
                ]
            ));

            $enrollment->update(array_merge(
                $validator->validated(),
                [
                    'code' => $code,
                ]
            ));

            DB::commit();

            $data = User::find($id);

            return $this->responseSuccess('Student successfully updated', $data, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFailed('Failed to update student');
        }
    }

    public function destroy($id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) return $this->responseFailed('User not found', '', 404);

        if ($user->avatar) {
            if (Storage::exists('public/images/' . $user->avatar)) {
                Storage::delete('public/images/' . $user->avatar);
            }
        }

        $user->delete();

        return $this->responseSuccess('Student successfully deleted');
    }

    public function updateStatus(Request $request, $enrollmentId)
    {
        $enrollment = Enrollment::where('id', $enrollmentId)->first();
        if (!$enrollment) return $this->responseFailed('Data not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'status' => Rule::in(['approve', 'reject']),
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        if ($input['status'] == 'approve') {
            $approved = Enrollment::where([
                'user_id' => $enrollment->user_id,
                'status' => 'approve',
            ])
                ->first();

            if ($approved) return $this->responseFailed('Student already accepted by other institute', '', 422);

            Enrollment::where([
                ['id', '!=', $enrollment->id],
                ['user_id', '=', $enrollment->user_id],
                ['status', '=', 'pending'],
            ])
                ->update(['status' => 'reject']);

        }

        $enrollment->update($validator->validated());

        $data = Enrollment::where([
            'id' => $enrollment->id,
        ])
            ->with([
                'institute:id,name',
                'branch:id,name',
                'batch:id,name',
            ])
            ->first();

        EnrollmentStatus::dispatch($data);

        return $this->responseSuccess('Student status successfully updated');
    }
}
