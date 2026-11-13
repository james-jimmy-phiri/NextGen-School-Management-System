<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && (! $user->isActive())) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $message = $user->isLocked()
                ? 'Your account is locked after too many failed sign-in attempts. An administrator must unlock it.'
                : ($user->isDeactivated()
                    ? ('Your account has been deactivated. '.($user->deactivated_reason ? 'Reason: '.$user->deactivated_reason : 'Please contact your administrator.'))
                    : ($user->status === 'suspended'
                        ? 'Your account has been suspended. Please contact the administrator.'
                        : 'Your account is inactive.'));

            return redirect()->route('login')->with('status', $message);
        }

        return $next($request);
    }
}
