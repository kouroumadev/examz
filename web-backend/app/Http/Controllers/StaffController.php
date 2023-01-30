<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->input('search')) {
            $query->where([['institute_id', '=', auth()->user()->institute_id], ['name', 'like', '%' . $search . '%']])
                ->orWhere([['institute_id', '=', auth()->user()->institute_id], ['email', 'like', '%' . $search . '%']])
                ->orWhere([['institute_id', '=', auth()->user()->institute_id], ['phone', 'like', '%' . $search . '%']]);
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->role('STF')
                    ->select('id', 'name', 'email', 'phone')
                    ->where('institute_id', auth()->user()->institute_id)
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = User::select('id', 'employee_id', 'branch_id', 'name', 'email', 'phone', 'gender', 'avatar')
                        ->where('id', $id)
                        ->first();

        if (!$data) return $this->responseFailed('User not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'employee_id' => 'required|string',
            'branch_id' => 'nullable|integer',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email',
            'phone' => 'required|string|max:15|unique:users,phone',
            'gender' => Rule::in(['MALE', 'FEMALE']),
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        if ($request->hasFile('avatar')) {
            $avatar = rand() . '.' . $request->avatar->getClientOriginalExtension();
            Storage::putFileAs('public/images', $request->file('avatar'), $avatar);
        }

        $data = User::create(array_merge(
            $validator->validated(),
            [
                'institute_id' => auth()->user()->institute_id,
                'avatar' => $avatar ?? null,
                'password' => Hash::make($request->password),
            ]
        ));
        $data->assignRole('STF');
        $data->sendEmailVerificationNotificationWithPassword($request->password);

        return $this->responseSuccess('Staff successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) return $this->responseFailed('User not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'employee_id' => 'required|string',
            'branch_id' => 'nullable|integer',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $id,
            'phone' => 'required|string|max:15|unique:users,phone,' . $id,
            'gender' => Rule::in(['MALE', 'FEMALE']),
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

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

        $password = $request->password ? Hash::make($request->password) : $user->password;

        $user->update(array_merge(
            $validator->validated(),
            [
                'avatar' => $avatar,
                'password' => $password,
            ]
        ));

        $data = User::find($id);

        return $this->responseSuccess('Staff successfully updated', $data, 200);
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

        return $this->responseSuccess('Staff successfully deleted');
    }
}
