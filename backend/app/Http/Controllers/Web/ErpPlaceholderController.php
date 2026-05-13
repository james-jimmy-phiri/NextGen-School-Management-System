<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ErpPlaceholderController extends Controller
{
    public function show(Request $request, string $pageKey): Response
    {
        $definitions = config('erp_pages.definitions', []);
        $page = $definitions[$pageKey] ?? null;

        abort_if($page === null, 404);

        $component = $page['component'] ?? 'Scaffold/ModulePage';
        $payload = array_merge(
            [
                'pageKey' => $pageKey,
                'title' => $page['title'] ?? 'Module',
                'description' => $page['description'] ?? '',
                'features' => $page['features'] ?? [],
                'breadcrumbs' => $page['breadcrumbs'] ?? [],
            ],
            $page['props'] ?? [],
        );

        return Inertia::render($component, $payload);
    }
}
