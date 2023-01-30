<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;

class SocialiteController extends Controller
{
    public function redirectToProvider($provider)
    {
        $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();

        return $this->responseSuccess('', compact('url'), 200);
    }

    public function handleProviderCallback($provider)
    {
        $socialUser = Socialite::driver($provider)->stateless()->user();
        $socialAccount = SocialAccount::where('provider_id', $socialUser['id'])
                        ->where('provider_name', $provider)
                        ->first();
        
        if ($socialAccount) {
            $user = $socialAccount->user;
        } else {
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                ]);
                $user->assignRole('ST');
                $user->markEmailAsVerified();
            }

            SocialAccount::create([
                'provider_id' => $socialUser->getId(),
                'provider_name' => $provider,
                'user_id' => $user->id
            ]);
        }

        $data = [
            'access_token' => JWTAuth::fromUser($user),
            'token_type' => 'bearer',
            'user' => User::with('roles:id,name')->find($user->id),
        ];
        $data['user']['hasPassword'] = !!$user->password;

        return $this->responseSuccess('User successfully logged in', $data, 200);
    }
}
