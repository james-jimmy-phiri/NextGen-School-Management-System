<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\StudentEnrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdmissionController extends Controller
{
    public function index(Request $request)
    {
        $admissions = Admission::query()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admissions/Index', [
            'admissions' => $admissions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admissions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_first_name' => 'required|string|max:255',
            'student_middle_name' => 'nullable|string|max:255',
            'student_last_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'nullable|string|max:255',
            'nationality' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'birth_certificate_number' => 'nullable|string|max:255',
            
            'previous_school_name' => 'nullable|string|max:255',
            'previous_grade' => 'nullable|string|max:255',
            'transfer_reason' => 'nullable|string|max:255',
            
            'boarding_type' => 'required|string|in:day,boarding',
            
            'parent_name' => 'required|string|max:255',
            'parent_relationship' => 'required|string|max:255',
            'parent_phone' => 'required|string|max:255',
            'parent_email' => 'required|email|max:255',
            'parent_occupation' => 'nullable|string|max:255',
            'parent_address' => 'required|string',

            'birth_certificate' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
            'school_reports' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
            'transfer_letter' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
            'passport_photo' => 'nullable|file|mimes:jpg,png|max:2048',
        ]);

        $documents = [];
        $filesToUpload = ['birth_certificate', 'school_reports', 'transfer_letter', 'passport_photo'];
        foreach ($filesToUpload as $fileKey) {
            if ($request->hasFile($fileKey)) {
                $documents[$fileKey] = $request->file($fileKey)->store('admissions', 'public');
            }
        }

        $referenceNumber = 'APP-' . date('Y') . '-' . strtoupper(\Illuminate\Support\Str::random(6));
        while (Admission::where('reference_number', $referenceNumber)->exists()) {
            $referenceNumber = 'APP-' . date('Y') . '-' . strtoupper(\Illuminate\Support\Str::random(6));
        }

        // We assume an admin creates it for their current school
        $schoolId = \App\Models\School::first()->id;

        $admission = Admission::create(array_merge($validated, [
            'school_id' => $schoolId,
            'reference_number' => $referenceNumber,
            'status' => 'submitted',
            'documents' => $documents,
        ]));

        return redirect()->route('admissions.index')->with('flash', [
            'success' => 'Application created successfully. Reference: ' . $referenceNumber
        ]);
    }

    public function show(Admission $admission)
    {
        return Inertia::render('Admissions/Show', [
            'admission' => $admission,
        ]);
    }

    public function updateStatus(Request $request, Admission $admission)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:submitted,under_review,accepted,rejected,waitlisted',
            'internal_notes' => 'nullable|string'
        ]);

        $admission->update($validated);

        return redirect()->back()->with('flash', [
            'success' => 'Status updated successfully.'
        ]);
    }

    public function enroll(Request $request, Admission $admission)
    {
        if ($admission->status !== 'accepted') {
            return redirect()->back()->withErrors(['status' => 'Only accepted applications can be enrolled.']);
        }

        DB::beginTransaction();
        try {
            // Create Guardian
            $guardian = Guardian::create([
                'school_id' => $admission->school_id,
                'first_name' => $admission->parent_name, // Typically split name, but storing as first name for now
                'last_name' => '', // Needs splitting logic
                'relationship' => $admission->parent_relationship,
                'email' => $admission->parent_email,
                'phone' => $admission->parent_phone,
            ]);

            // Create Student
            $student = Student::create([
                'school_id' => $admission->school_id,
                'admission_number' => $admission->reference_number, // Or generate a new one
                'first_name' => $admission->student_first_name,
                'last_name' => $admission->student_last_name,
                'gender' => $admission->gender,
                'date_of_birth' => $admission->date_of_birth,
                'enrollment_date' => now(),
                'status' => 'active',
                'photo_path' => $admission->documents['passport_photo'] ?? null,
            ]);

            // Attach Guardian
            $student->guardians()->attach($guardian->id, [
                'relationship' => $admission->parent_relationship,
                'is_primary' => true,
            ]);

            // Mark Admission as Enrolled
            $admission->update(['status' => 'enrolled']);

            DB::commit();

            return redirect()->route('students.show', $student->id)->with('flash', [
                'success' => 'Student successfully enrolled!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to enroll student: ' . $e->getMessage()]);
        }
    }
}
