<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\TenantDashboardService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class DashboardApiController extends Controller
{
    public function __invoke(Request $request)
    {
        $payload = app(TenantDashboardService::class)->forUser($request->user());

        return ApiResponse::success($payload);
    }
}
