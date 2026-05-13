<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('audit.view');

        $query = Activity::with('causer')->latest();

        if ($request->has('user_id')) {
            $query->where('causer_id', $request->user_id);
        }

        if ($request->has('action')) {
            $query->where('description', 'like', "%{$request->action}%");
        }

        $logs = $query->paginate(20)->withQueryString();

        return Inertia::render('AuditLog/Index', [
            'logs' => $logs,
            'filters' => $request->only(['user_id', 'action']),
        ]);
    }
}
