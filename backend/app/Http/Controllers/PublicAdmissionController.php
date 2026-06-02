<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PublicAdmissionController extends Controller
{
    public function create(Request $request)
    {
        // Assuming there is a default school or fetching by domain/slug
        $school = School::first(); 

        return Inertia::render('Public/Admissions/Create', [
            'school' => $school,
        ]);
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

            // Files
            'birth_certificate' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
            'school_reports' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
            'transfer_letter' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
            'passport_photo' => 'nullable|file|mimes:jpg,png|max:2048',
        ]);

        $documents = [];
        
        $filesToUpload = ['birth_certificate', 'school_reports', 'transfer_letter', 'passport_photo'];
        foreach ($filesToUpload as $fileKey) {
            if ($request->hasFile($fileKey)) {
                $path = $request->file($fileKey)->store('admissions', 'public');
                $documents[$fileKey] = $path;
            }
        }

        // Generate a unique reference number
        $referenceNumber = 'APP-' . date('Y') . '-' . strtoupper(Str::random(6));
        
        // Ensure uniqueness
        while (Admission::where('reference_number', $referenceNumber)->exists()) {
            $referenceNumber = 'APP-' . date('Y') . '-' . strtoupper(Str::random(6));
        }

        $school = School::first(); // Or resolve from request

        $admission = Admission::create([
            'school_id' => $school->id,
            'reference_number' => $referenceNumber,
            'student_first_name' => $validated['student_first_name'],
            'student_middle_name' => $validated['student_middle_name'] ?? null,
            'student_last_name' => $validated['student_last_name'],
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'],
            'place_of_birth' => $validated['place_of_birth'] ?? null,
            'nationality' => $validated['nationality'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'birth_certificate_number' => $validated['birth_certificate_number'] ?? null,
            'previous_school_name' => $validated['previous_school_name'] ?? null,
            'previous_grade' => $validated['previous_grade'] ?? null,
            'transfer_reason' => $validated['transfer_reason'] ?? null,
            'boarding_type' => $validated['boarding_type'],
            'parent_name' => $validated['parent_name'],
            'parent_relationship' => $validated['parent_relationship'],
            'parent_phone' => $validated['parent_phone'],
            'parent_email' => $validated['parent_email'],
            'parent_occupation' => $validated['parent_occupation'] ?? null,
            'parent_address' => $validated['parent_address'],
            'status' => 'submitted',
            'documents' => $documents,
        ]);

        return redirect()->back()->with('flash', [
            'success' => 'Application submitted successfully. Your reference number is ' . $referenceNumber,
            'reference_number' => $referenceNumber
        ]);
    }

    public function track(Request $request)
    {
        $reference = $request->query('reference');
        $admission = null;
        $error = null;

        if ($reference) {
            $admission = Admission::where('reference_number', $reference)->first();
            
            if (!$admission) {
                $error = 'No application found with that reference number.';
            }
        }

        return Inertia::render('Public/Admissions/Track', [
            'admission' => $admission,
            'referenceQuery' => $reference,
            'error' => $error
        ]);
    }
}
