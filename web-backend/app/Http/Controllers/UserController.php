<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $input = $request->all();
        $validator = Validator::make($input, [
            'employee_id' => 'nullable|string',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:15|unique:users,phone,' . $user->id,
            'gender' => Rule::in(['MALE', 'FEMALE']),
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
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

        $user->update(array_merge(
            $validator->validated(),
            [
                'avatar' => $avatar,
            ]
        ));

        return $this->responseSuccess('Profile successfully updated', '', 200);
    }

    public function updatePassword(Request $request)
    {
        $user = auth()->user();
        $userPassword = $user->password;

        $input = $request->all();

        if ($userPassword) {
            $validator = Validator::make($input, [
                'current_password' => 'required|string|min:6',
                'password' => 'required|string|confirmed|min:6',
            ]);
        } else {
            $validator = Validator::make($input, [
                'password' => 'required|string|confirmed|min:6',
            ]);
        }

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        if ($request->current_password) {
            if (!Hash::check($request->current_password, $userPassword)) {
                return $this->responseFailed('Current password not match', '', 400);
            }
        }

        $user->update(['password' => Hash::make($request->password)]);

        return $this->responseSuccess('Password successfully updated', '', 200);
    }
}
