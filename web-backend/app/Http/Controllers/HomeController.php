<?php

namespace App\Http\Controllers;

use App\Models\Institute;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function listInstitute(Request $request)
    {
        $query = Institute::query();

        $query->select([
                    'id',
                    'name',
                ]);

        if ($search = $request->input('search')) {
            $query->whereRaw("name LIKE '%" . $search . "%'");
        }

        $data = $query->withCount([
                            'enrollments',
                            'enrollments as enrollments_count' => function($q) {
                                $q->where('status', 'approve');
                            }
                        ])
                        ->get();

        return $this->responseSuccess('Data', $data);
    }

    public function totalInstituteAndStudent()
    {
        $institutes = Institute::count();
        $students = User::role('ST')->count();

        $data = (object) [
            'totalInstitute' => $institutes,
            'totalStudent' => $students,
        ];

        return $this->responseSuccess('Data', $data);
    }

    public function totalStaffAndStudent()
    {
        $staffs = User::role('STF')->where('institute_id', auth()->user()->institute_id)->count();
        $students = User::role('ST')
                        ->join('enrollments', function ($j) {
                            $j->on('users.id', '=', 'enrollments.user_id')
                            ->where([
                                'enrollments.institute_id' => auth()->user()->institute_id,
                                'enrollments.status' => 'approve',
                            ]);
                        })
                        ->count();

        $data = (object) [
            'totalStaff' => $staffs,
            'totalStudent' => $students,
        ];

        return $this->responseSuccess('Data', $data);
    }

    public function checkExpiredToken()
    {
        $response = (int) auth('api')->check();

        try {
            if (!app(\Tymon\JWTAuth\JWTAuth::class)->parseToken()->authenticate()) {
                $response = 0;
            }
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            $response = -1;
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            $response = -2;
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            $response = -3;
        }

        $data = (object) [
            'status' => $response,
        ];

        return response()->json($data, 200);
    }
}
