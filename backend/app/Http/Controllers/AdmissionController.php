<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Admission;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdmissionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $admissions = Admission::query()
            ->when(! $user->isSuperAdmin(), fn ($query) => $query->where('school_id', $user->school_id))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->string('search') . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('reference_number', 'like', $search)
                        ->orWhere('student_first_name', 'like', $search)
                        ->orWhere('student_last_name', 'like', $search)
                        ->orWhere('parent_email', 'like', $search);
                });
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admissions/Index', [
            'admissions' => $admissions,
            'filters' => $request->only(['search', 'status']),
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
        foreach (['birth_certificate', 'school_reports', 'transfer_letter', 'passport_photo'] as $fileKey) {
            if ($request->hasFile($fileKey)) {
                $documents[$fileKey] = $request->file($fileKey)->store('admissions', 'public');
            }
        }

        $referenceNumber = 'APP-' . date('Y') . '-' . strtoupper(Str::random(6));
        while (Admission::where('reference_number', $referenceNumber)->exists()) {
            $referenceNumber = 'APP-' . date('Y') . '-' . strtoupper(Str::random(6));
        }

        $schoolId = $request->user()->school_id ?? \App\Models\School::query()->orderBy('id')->value('id');

        Admission::create(array_merge($validated, [
            'school_id' => $schoolId,
            'reference_number' => $referenceNumber,
            'status' => 'submitted',
            'documents' => $documents,
        ]));

        return redirect()->route('admissions.index')->with('success', 'Application created. Reference: ' . $referenceNumber);
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
            'internal_notes' => 'nullable|string',
        ]);

        $admission->update($validated);

        return redirect()->back()->with('success', 'Application status updated.');
    }

    public function enroll(Request $request, Admission $admission)
    {
        if ($admission->status !== 'accepted') {
            return redirect()->back()->withErrors(['status' => 'Only accepted applications can be enrolled.']);
        }

        DB::beginTransaction();
        try {
            $nameParts = preg_split('/\s+/', trim($admission->parent_name), 2);
            $parentFirst = $nameParts[0] ?? $admission->parent_name;
            $parentLast = $nameParts[1] ?? '';

            $parentUser = User::where('email', $admission->parent_email)->first();
            if (! $parentUser) {
                $parentUser = User::create([
                    'school_id' => $admission->school_id,
                    'name' => trim($admission->parent_name),
                    'email' => $admission->parent_email,
                    'phone' => $admission->parent_phone,
                    'password' => Hash::make(Str::random(12)),
                    'status' => 'active',
                ]);
                $parentUser->assignRole('parent');
            }

            $guardian = Guardian::firstOrCreate(
                ['user_id' => $parentUser->id, 'school_id' => $admission->school_id],
                [
                    'first_name' => $parentFirst,
                    'last_name' => $parentLast,
                    'email' => $admission->parent_email,
                    'phone' => $admission->parent_phone,
                    'address' => $admission->parent_address,
                ]
            );

            $admissionNumber = 'STU-' . date('Y') . '-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);

            $student = Student::create([
                'school_id' => $admission->school_id,
                'admission_number' => $admissionNumber,
                'first_name' => $admission->student_first_name,
                'middle_name' => $admission->student_middle_name,
                'last_name' => $admission->student_last_name,
                'gender' => $admission->gender,
                'date_of_birth' => $admission->date_of_birth,
                'enrollment_date' => now(),
                'status' => 'active',
                'photo_path' => $admission->documents['passport_photo'] ?? null,
            ]);

            $student->guardians()->attach($guardian->id, [
                'relationship' => $admission->parent_relationship,
                'is_primary' => true,
            ]);

            $academicYear = $admission->academic_year_id
                ? AcademicYear::find($admission->academic_year_id)
                : AcademicYear::query()
                    ->where('school_id', $admission->school_id)
                    ->where('is_current', true)
                    ->first();

            if ($academicYear && $admission->class_group_id) {
                StudentEnrollment::create([
                    'school_id' => $admission->school_id,
                    'student_id' => $student->id,
                    'academic_year_id' => $academicYear->id,
                    'class_group_id' => $admission->class_group_id,
                    'status' => 'enrolled',
                ]);
            }

            $admission->update(['status' => 'enrolled']);

            DB::commit();

            return redirect()->route('students.show', $student->id)->with('success', 'Student enrolled successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->withErrors(['error' => 'Failed to enroll student: ' . $e->getMessage()]);
        }
    }
}
