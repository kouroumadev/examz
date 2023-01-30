<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class InstituteAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->input('search')) {
            $query->whereRaw("name LIKE '%" .  $search . "%'")
                ->orWhereRaw("email LIKE '%" .  $search . "%'")
                ->orWhereRaw("phone LIKE '%" .  $search . "%'")
                ->orWhereRaw("employee_id LIKE '%" .  $search . "%'")
                ->orWhereHas('institute', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->role('IA')
                    ->select('id', 'institute_id', 'employee_id', 'name', 'email', 'phone')
                    ->with(['institute:id,name'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = User::select('id', 'institute_id', 'employee_id', 'name', 'email', 'phone', 'gender')
                        ->where('id', $id)
                        ->with('institute:id,name')
                        ->first();

        if (!$data) return $this->responseFailed('User not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'institute_id' => 'required|integer',
            'employee_id' => 'required|string',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email',
            'phone' => 'required|string|min:10|max:15|unique:users,phone',
            'gender' => Rule::in(['MALE', 'FEMALE']),
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $data = User::create(array_merge(
            $validator->validated(),
            [
                'password' => Hash::make($request->password),
            ]
        ));
        $data->assignRole('IA');
        $data->sendEmailVerificationNotificationWithPassword($request->password);

        return $this->responseSuccess('Institute admin successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) return $this->responseFailed('User not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'institute_id' => 'required|integer',
            'employee_id' => 'required|string',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $id,
            'phone' => 'required|string|min:10|max:15|unique:users,phone,' . $id,
            'gender' => Rule::in(['MALE', 'FEMALE']),
            'password' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $password = $request->password ? bcrypt($request->password) : $user->password;

        $user->update(array_merge(
            $validator->validated(),
            [
                'password' => $password,
            ]
        ));

        $data = User::find($id);

        return $this->responseSuccess('Institute admin successfully updated', $data, 200);
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

        return $this->responseSuccess('Institute admin successfully deleted');
    }
}
