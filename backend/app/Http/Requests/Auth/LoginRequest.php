<?php

namespace App\Http\Requests\Auth;

use App\Models\Guardian;
use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login' => ['required_without:email', 'nullable', 'string'],
            'email' => ['required_without:login', 'nullable', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function identifier(): string
    {
        return (string) ($this->input('login') ?: $this->input('email'));
    }

    /**
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $identifier = $this->identifier();
        $user = User::query()
            ->where('email', $identifier)
            ->orWhere('phone', $identifier)
            ->first();

        if ($user?->isLocked() || $user?->status === 'suspended' || $user?->status === 'inactive' || $user?->isDeactivated()) {
            RateLimiter::hit($this->throttleKey());

            $msg = 'This account is not active. Please contact the administrator.';
            if ($user->isLocked()) {
                $msg = 'This account is locked after too many failed sign-in attempts. An administrator must unlock it.';
            } elseif ($user->isDeactivated()) {
                $msg = 'This account has been deactivated. ' . ($user->deactivated_reason ? 'Reason: ' . $user->deactivated_reason : 'Please contact the administrator.');
            } elseif ($user->status === 'suspended') {
                $msg = 'This account has been suspended. Please contact the administrator.';
            }

            throw ValidationException::withMessages([
                'login' => $msg,
            ]);
        }

        if (! $user || ! Hash::check((string) $this->input('password'), $user->password)) {
            RateLimiter::hit($this->throttleKey());
            $user?->registerFailedLogin();

            throw ValidationException::withMessages([
                'login' => trans('auth.failed'),
                'email' => trans('auth.failed'),
            ]);
        }

        if ($user->hasRole('parent')) {
            $guardian = Guardian::query()->where('user_id', $user->id)->first();
            if ($guardian && ! $guardian->isVerified()) {
                throw ValidationException::withMessages([
                    'login' => 'This parent account is waiting for school verification of the guardian relationship.',
                ]);
            }
        }

        $user->clearFailedLogins();
        RateLimiter::clear($this->throttleKey());

        Auth::login($user, $this->boolean('remember'));

        $this->revokeOtherPrivilegedSessions($user);
    }

    /**
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->identifier()).'|'.$this->ip());
    }

    private function revokeOtherPrivilegedSessions(User $user): void
    {
        if (! $user->hasAnyRole(['super_admin', 'school_director', 'school_admin'])) {
            return;
        }

        if (config('session.driver') !== 'database') {
            return;
        }

        DB::table(config('session.table', 'sessions'))
            ->where('user_id', $user->id)
            ->delete();
    }
}
