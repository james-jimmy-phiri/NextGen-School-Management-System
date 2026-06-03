<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Campus;
use App\Models\ClassGroup;
use App\Models\Student;
use App\Models\Term;
use App\Models\User;
use App\Models\Guardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Student::class);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $students = Student::query()
            ->with(['guardians', 'enrollments.classGroup'])
            ->when(! $user->isSuperAdmin(), fn ($query) => $query->where('school_id', $user->school_id))
            ->latest()
            ->paginate(15);

        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Student::class);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $schoolId = $user->school_id;

        return Inertia::render('Students/Create', [
            'schoolId' => $schoolId,
            'campuses' => Campus::query()->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))->orderBy('name')->get(['id', 'name']),
            'academicYears' => AcademicYear::query()->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))->orderByDesc('starts_on')->get(['id', 'title', 'is_current']),
            'terms' => Term::query()->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))->orderBy('name')->get(['id', 'name']),
            'classGroups' => ClassGroup::query()->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Student::class);

        $validated = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'admission_number' => ['required', 'string', 'max:50'],
            'national_id_passport' => ['nullable', 'string', 'max:100'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['required', 'date'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'nationality' => ['required', 'string', 'max:100'],
            'marital_status' => ['nullable', 'string', 'max:50'],
            'religion' => ['nullable', 'string', 'max:100'],
            
            // Address
            'phone_number' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'house_number' => ['nullable', 'string', 'max:50'],
            'street_name' => ['nullable', 'string', 'max:255'],
            'area_village' => ['required', 'string', 'max:255'],
            'traditional_authority' => ['nullable', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'city_town' => ['required', 'string', 'max:255'],
            'postal_address' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:100'],

            // Academics
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'class_group_id' => ['required', 'exists:class_groups,id'],
            'campus_id' => ['required', 'exists:campuses,id'],
            'mode_of_study' => ['required', 'string'],
            'year_of_study' => ['required', 'integer', 'min:1'],
            'term_id' => ['required', 'exists:terms,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],

            // Guardians
            'guardians' => ['required', 'array', 'min:1'],
            'guardians.*.full_name' => ['required', 'string', 'max:255'],
            'guardians.*.relationship' => ['required', 'string', 'max:100'],
            'guardians.*.gender' => ['nullable', 'string'],
            'guardians.*.national_id' => ['nullable', 'string'],
            'guardians.*.occupation' => ['nullable', 'string'],
            'guardians.*.employer' => ['nullable', 'string'],
            'guardians.*.phone' => ['required', 'string'],
            'guardians.*.alternative_phone' => ['nullable', 'string'],
            'guardians.*.email' => ['nullable', 'email'],
            'guardians.*.address' => ['nullable', 'string'],
            'guardians.*.is_primary' => ['boolean'],

            // Sponsor
            'sponsorship_type' => ['required', 'string'],
            'sponsor_name' => ['nullable', 'string'],
            'sponsor_contact_person' => ['nullable', 'string'],
            'sponsor_phone' => ['nullable', 'string'],
            'sponsor_email' => ['nullable', 'email'],
            'sponsor_address' => ['nullable', 'string'],

            // Medical
            'health_status' => ['nullable', 'string'],
            'blood_group' => ['nullable', 'string'],
            'has_disability' => ['required', 'boolean'],
            'disability_type' => ['nullable', 'string'],
            'chronic_conditions' => ['nullable', 'string'],
            'allergies' => ['nullable', 'string'],
            'medications' => ['nullable', 'string'],
            'special_needs' => ['nullable', 'string'],

            // Emergency
            'emergency_full_name' => ['required', 'string'],
            'emergency_relationship' => ['required', 'string'],
            'emergency_phone' => ['required', 'string'],
            'emergency_alternative_phone' => ['nullable', 'string'],
            'emergency_email' => ['nullable', 'email'],
            'emergency_address' => ['nullable', 'string'],

            // Consent
            'consent_policies' => ['required', 'boolean', 'accepted'],
            'consent_privacy' => ['required', 'boolean', 'accepted'],
            'digital_signature' => ['required', 'string'],
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Generate Registration Number
            $registrationNumber = 'COURSE-' . random_int(100, 999) . '-' . date('Y');

            $studentUser = null;
            if ($request->filled('username') && $request->filled('password')) {
                $studentUser = User::create([
                    'school_id' => $validated['school_id'],
                    'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                    'email' => $validated['email'] ?? strtolower($validated['first_name'] . '.' . $validated['last_name'] . random_int(100, 999) . '@student.local'),
                    'username' => $request->username,
                    'password' => Hash::make($request->password),
                    'security_question' => $request->security_question,
                    'security_answer' => $request->security_answer,
                    'status' => 'active',
                ]);
                $studentUser->assignRole('student');
            }

            $student = Student::create([
                'school_id' => $validated['school_id'],
                'user_id' => $studentUser ? $studentUser->id : null,
                'registration_number' => $registrationNumber,
                'admission_number' => $validated['admission_number'],
                'national_id_passport' => $validated['national_id_passport'],
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'],
                'last_name' => $validated['last_name'],
                'gender' => $validated['gender'],
                'date_of_birth' => $validated['date_of_birth'],
                'place_of_birth' => $validated['place_of_birth'],
                'nationality' => $validated['nationality'],
                'marital_status' => $validated['marital_status'],
                'religion' => $validated['religion'],
                'enrollment_date' => now(),
                'status' => 'active',
                'consent_policies' => $validated['consent_policies'],
                'consent_privacy' => $validated['consent_privacy'],
                'digital_signature' => $validated['digital_signature'],
                'signature_date' => now(),
            ]);

            $student->address()->create([
                'phone_number' => $validated['phone_number'],
                'email' => $validated['email'],
                'house_number' => $validated['house_number'],
                'street_name' => $validated['street_name'],
                'area_village' => $validated['area_village'],
                'traditional_authority' => $validated['traditional_authority'],
                'district' => $validated['district'],
                'city_town' => $validated['city_town'],
                'postal_address' => $validated['postal_address'],
                'country' => $validated['country'],
            ]);

            $student->enrollments()->create([
                'school_id' => $validated['school_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'class_group_id' => $validated['class_group_id'],
                'campus_id' => $validated['campus_id'],
                'mode_of_study' => $validated['mode_of_study'],
                'year_of_study' => $validated['year_of_study'],
                'term_id' => $validated['term_id'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => 'enrolled',
            ]);

            foreach ($validated['guardians'] as $guardianData) {
                $guardianUser = null;
                if (!empty($guardianData['email'])) {
                    $guardianUser = User::where('email', $guardianData['email'])->first();
                    if (!$guardianUser) {
                        $guardianUser = User::create([
                            'school_id' => $validated['school_id'],
                            'name' => $guardianData['full_name'],
                            'email' => $guardianData['email'],
                            'phone' => $guardianData['phone'],
                            'password' => Hash::make(Str::random(8)),
                            'status' => 'active',
                        ]);
                        $guardianUser->assignRole('parent');
                    }
                }

                $names = explode(' ', $guardianData['full_name'], 2);
                $firstName = $names[0];
                $lastName = $names[1] ?? '';

                $guardian = Guardian::create([
                    'user_id' => $guardianUser ? $guardianUser->id : null,
                    'school_id' => $validated['school_id'],
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone' => $guardianData['phone'],
                    'email' => $guardianData['email'] ?? null,
                    'gender' => $guardianData['gender'] ?? null,
                    'national_id' => $guardianData['national_id'] ?? null,
                    'occupation' => $guardianData['occupation'] ?? null,
                    'employer' => $guardianData['employer'] ?? null,
                    'alternative_phone' => $guardianData['alternative_phone'] ?? null,
                    'address' => $guardianData['address'] ?? null,
                ]);

                $student->guardians()->attach($guardian->id, [
                    'relationship' => $guardianData['relationship'],
                    'is_primary' => $guardianData['is_primary'] ?? false,
                ]);
            }

            $student->sponsor()->create([
                'sponsorship_type' => $validated['sponsorship_type'],
                'sponsor_name' => $validated['sponsor_name'],
                'contact_person' => $validated['sponsor_contact_person'],
                'phone_number' => $validated['sponsor_phone'],
                'email' => $validated['sponsor_email'],
                'address' => $validated['sponsor_address'],
            ]);

            $student->medicalRecord()->create([
                'health_status' => $validated['health_status'],
                'blood_group' => $validated['blood_group'],
                'has_disability' => $validated['has_disability'],
                'disability_type' => $validated['disability_type'],
                'chronic_conditions' => $validated['chronic_conditions'],
                'allergies' => $validated['allergies'],
                'medications' => $validated['medications'],
                'special_needs' => $validated['special_needs'],
            ]);

            $student->emergencyContacts()->create([
                'full_name' => $validated['emergency_full_name'],
                'relationship' => $validated['emergency_relationship'],
                'phone_number' => $validated['emergency_phone'],
                'alternative_phone' => $validated['emergency_alternative_phone'],
                'email' => $validated['emergency_email'],
                'address' => $validated['emergency_address'],
            ]);
        });

        return redirect()->route('students.index')->with('success', 'Student registered successfully.');
    }

    public function show(Student $student)
    {
        $this->authorize('view', $student);

        $student->load(['guardians', 'enrollments.classGroup', 'enrollments.academicYear']);

        return Inertia::render('Students/Show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        $this->authorize('update', $student);

        $student->load(['guardians']);

        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $this->authorize('update', $student);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['required', 'date'],
            'status' => ['required', Rule::in(['active', 'inactive', 'graduated', 'suspended'])],
        ]);

        $student->update($validated);

        return redirect()->route('students.show', $student)->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        $this->authorize('delete', $student);

        $student->delete();

        return redirect()->route('students.index')->with('success', 'Student archived successfully.');
    }
}
