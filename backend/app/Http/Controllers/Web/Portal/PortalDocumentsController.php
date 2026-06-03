<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Concerns\AuthorizesPortalStudent;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalDocumentsController extends Controller
{
    use AuthorizesPortalStudent;

    public function show(Request $request, Student $student): Response
    {
        $this->authorizePortalStudent($request, $student);

        $student->load(['school', 'documents']);

        $documents = $student->documents->map(function ($doc) {
            return [
                'id' => $doc->id,
                'type' => $doc->document_type,
                'name' => $doc->file_name,
                'url' => '#',
                'created_at' => $doc->created_at ? $doc->created_at->toISOString() : now()->toISOString(),
            ];
        });

        return Inertia::render('Portal/Child/Documents', [
            'student' => $student,
            'documents' => $documents,
        ]);
    }
}
