<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OperatorTeamController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->input('search')) {
            $query->whereRaw("name LIKE '%" .  $search . "%'")
                    ->orWhereRaw("email LIKE '%" .  $search . "%'")
                    ->orWhereRaw("phone LIKE '%" .  $search . "%'");
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->role('OT')
                    ->select('id', 'name', 'email', 'phone')
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = User::select('id', 'name', 'email', 'phone', 'avatar')
                        ->where('id', $id)
                        ->first();

        if (!$data) return $this->responseFailed('User not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email',
            'phone' => 'required|string|max:15|unique:users,phone',
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
                'gender' => 'MALE',
                'avatar' => $avatar ?? null,
                'password' => Hash::make($request->password),
            ]
        ));
        $data->assignRole('OT');
        $data->sendEmailVerificationNotificationWithPassword($request->password);

        return $this->responseSuccess('Operator team successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) return $this->responseFailed('User not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $id,
            'phone' => 'required|string|max:15|unique:users,phone,' . $id,
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

        return $this->responseSuccess('Operator team successfully updated', $data, 200);
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
