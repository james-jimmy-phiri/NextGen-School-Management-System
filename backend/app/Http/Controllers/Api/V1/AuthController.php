<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Guardian;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'nullable|string',
            'login' => 'nullable|string',
            'password' => 'required',
            'device_name' => 'nullable|string',
        ]);

        $identifier = (string) ($request->input('login') ?: $request->input('email'));

        if ($identifier === '') {
            throw ValidationException::withMessages([
                'login' => ['Email or phone is required.'],
            ]);
        }

        $user = User::query()
            ->where('email', $identifier)
            ->orWhere('phone', $identifier)
            ->first();

        if (! $user || ! Hash::check((string) $request->input('password'), $user->password)) {
            $user?->registerFailedLogin();

            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 401);
        }

        if ($user->isLocked() || $user->status !== 'active') {
            return response()->json([
                'message' => $user->isLocked()
                    ? 'Account locked after too many failed attempts.'
                    : 'Your account is '.$user->status.'.',
            ], 403);
        }

        if ($user->hasRole('parent')) {
            $guardian = Guardian::query()->where('user_id', $user->id)->first();
            if ($guardian && ! $guardian->isVerified()) {
                return response()->json([
                    'message' => 'Guardian relationship has not been verified by the school.',
                ], 403);
            }
        }

        $user->clearFailedLogins();

        $deviceName = (string) ($request->input('device_name') ?: 'api');
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => new UserResource($user),
            ],
        ]);
    }

    public function token(Request $request)
    {
        return $this->login($request);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }
}
