<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\DataImport;
use App\Services\StudentImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DataImportController extends Controller
{
    public function __construct(private readonly StudentImportService $imports) {}

    public function create(Request $request): Response
    {
        $this->authorize('create', \App\Models\Student::class);

        return Inertia::render('Students/Import', [
            'import' => null,
        ]);
    }

    public function template(): StreamedResponse
    {
        $this->authorize('create', \App\Models\Student::class);

        return response()->streamDownload(function (): void {
            echo $this->imports->template();
        }, 'student-import-template.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function preview(Request $request): RedirectResponse
    {
        $this->authorize('create', \App\Models\Student::class);

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $file = $validated['file'];
        $parsed = $this->imports->preview($file, (int) $request->user()->school_id);

        $import = DataImport::create([
            'school_id' => $request->user()->school_id,
            'user_id' => $request->user()->id,
            'type' => 'students',
            'status' => 'previewed',
            'original_filename' => $file->getClientOriginalName(),
            'rows' => $parsed['rows'],
            'errors' => $parsed['errors'],
        ]);

        return redirect()->route('students.import.show', $import);
    }

    public function show(Request $request, DataImport $import): Response
    {
        $this->authorize('create', \App\Models\Student::class);
        abort_unless($import->school_id === $request->user()->school_id, 403);

        return Inertia::render('Students/Import', [
            'import' => $import,
        ]);
    }

    public function commit(Request $request, DataImport $import): RedirectResponse
    {
        $this->authorize('create', \App\Models\Student::class);
        abort_unless($import->school_id === $request->user()->school_id, 403);

        if (($import->errors ?? []) !== []) {
            return back()->withErrors(['file' => 'Fix row errors before committing. A failed import is not applied.']);
        }

        $count = $this->imports->commit($import);

        activity('import')
            ->causedBy($request->user())
            ->performedOn($import)
            ->withProperties(['count' => $count, 'filename' => $import->original_filename])
            ->log('Committed student CSV import');

        return redirect()->route('students.index')->with('success', "Imported {$count} students.");
    }
}
