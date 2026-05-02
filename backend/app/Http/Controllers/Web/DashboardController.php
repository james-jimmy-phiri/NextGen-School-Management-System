<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\TenantDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $stats = app(TenantDashboardService::class)->forUser($request->user());

        return Inertia::render('Dashboard', [
            'analytics' => $stats,
        ]);
    }
}
