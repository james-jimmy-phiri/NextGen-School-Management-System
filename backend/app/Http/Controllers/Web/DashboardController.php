<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\TenantDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        if ($request->user()->hasRole('parent')) {
            return redirect()->route('portal.parent');
        }

        $stats = app(TenantDashboardService::class)->forUser($request->user());

        return Inertia::render('Dashboard', [
            'analytics' => $stats,
        ]);
    }
}
