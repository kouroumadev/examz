<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|string|email|max:100|unique:users,email',
            'phone' => 'required|string|max:15|unique:users,phone',
            'password' => 'required|string|confirmed|min:6',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
            ]);
        $user->assignRole('ST');
        $user->sendEmailVerificationNotification();
        
        $data = ['user' => $user];

        return $this->responseSuccess('User successfully registered', $data, 201);
    }

    public function login(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'email' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 422);
        }

        if (filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            $credentials = $validator->validated();
        } else {
            $credentials = ['phone' => $request->email, 'password' => $request->password];
        }

        if (!$token = auth()->attempt($credentials)) {
            return $this->responseFailed('Unauthorized', '', 401);
        }

        if (!auth()->user()->email_verified_at) {
            return response()->json('Email not verified', 401);
        }

        $data = $this->createNewToken($token);
        $data['user']['hasPassword'] = !!auth()->user()->password;

        return $this->responseSuccess('User successfully logged in', $data, 200);
    }

    public function logout()
    {
        auth()->logout();

        return $this->responseSuccess('User successfully logged out', '', 200);
    }

    public function forgot(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'email' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->orWhere('phone', $request->email)->first();
        
        if (!$user) {
            return $this->responseFailed('Email or Phone not found', '', 404);
        }

        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status == Password::RESET_LINK_SENT) {
            return $this->responseSuccess('Reset password link sent on your email', '', 200);
        }

        return $this->responseFailed('', ['email' => __($status)]);
    }

    public function reset(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return $this->responseFailed('Email not found', '', 404);
        }
    
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return $this->responseSuccess('Password reset successfully', '', 200);
        }

        return $this->responseFailed('', ['email' => __($status)]);
    }

    public function refresh()
    {
        $data = $this->createNewToken(auth()->refresh());

        return $this->responseSuccess('Refresh token created', $data, 200);
    }

    public function profile()
    {
        $data = ['user' => User::with('roles:id,name')->find(auth()->user()->id)];

        return $this->responseSuccess('', $data, 200);
    }

    protected function createNewToken($token)
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => User::with('roles:id,name')->find(auth()->user()->id),
        ];
    }
}
