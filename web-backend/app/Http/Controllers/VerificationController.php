<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VerificationController extends Controller
{
    public function verify(Request $request)
    {
        $user = User::find($request->route('id'));
        if (!$user) return $this->responseFailed('User not found', '', 404);

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return $this->responseFailed('Invalid email verification url', '', 403);
        }

        if ($user->hasVerifiedEmail()) return $this->responseFailed('Email already verified', '', 422);

        $user->markEmailAsVerified();

        return $this->responseSuccess('Email successfully verified');
    }

    public function resend(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'email' => 'required|string|email',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }
        
        $user = User::where('email', $request->email)->first();
        if (!$user) return $this->responseFailed('User not found', '', 404);

        if ($user->hasVerifiedEmail()) return $this->responseFailed('Email already verified', '', 422);

        $user->sendEmailVerificationNotification();

        return $this->responseSuccess('Email verification link sent on your email');
    }
}
