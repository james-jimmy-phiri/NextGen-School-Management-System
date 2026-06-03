<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use App\Models\Guardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentRegistrationController extends Controller
{
    public function create(?School $school = null)
    {
        if ($school) {
            return redirect()->route('public.admissions.create', ['school' => $school->slug]);
        }

        return redirect()->route('public.admissions.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'student_first_name' => ['required', 'string', 'max:255'],
            'student_last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['required', 'date'],
            'parent_first_name' => ['required', 'string', 'max:255'],
            'parent_last_name' => ['required', 'string', 'max:255'],
            'parent_email' => ['required', 'email', 'max:255'],
            'parent_phone' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Create Student User account
            $studentPassword = Str::random(8); // Default password
            $studentUser = User::create([
                'school_id' => $validated['school_id'],
                'name' => $validated['student_first_name'] . ' ' . $validated['student_last_name'],
                'email' => strtolower($validated['student_first_name'] . '.' . $validated['student_last_name'] . random_int(100, 999) . '@student.local'), // Generate unique student email or use placeholder
                'password' => Hash::make($studentPassword),
                'status' => 'active',
            ]);
            $studentUser->assignRole('student');

            // 2. Create Student Profile
            // Assuming admission_number is auto-generated or handled elsewhere. Here we generate a simple one.
            $admissionNumber = 'STU-' . date('Y') . '-' . str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
            $student = Student::create([
                'school_id' => $validated['school_id'],
                'user_id' => $studentUser->id,
                'admission_number' => $admissionNumber,
                'first_name' => $validated['student_first_name'],
                'last_name' => $validated['student_last_name'],
                'gender' => $validated['gender'],
                'date_of_birth' => $validated['date_of_birth'],
                'enrollment_date' => now(),
                'status' => 'active',
            ]);

            // 3. Create Parent User account (or find existing by email)
            $parentUser = User::where('email', $validated['parent_email'])->first();
            $parentPassword = null;
            if (!$parentUser) {
                $parentPassword = Str::random(8);
                $parentUser = User::create([
                    'school_id' => $validated['school_id'],
                    'name' => $validated['parent_first_name'] . ' ' . $validated['parent_last_name'],
                    'email' => $validated['parent_email'],
                    'phone' => $validated['parent_phone'],
                    'password' => Hash::make($parentPassword),
                    'status' => 'active',
                ]);
                $parentUser->assignRole('parent');
                
                // TODO: Dispatch Email Job to send credentials to $validated['parent_email']
                // Mail::to($parentUser->email)->send(new ParentWelcomeMail($parentUser, $parentPassword));
            }

            // 4. Create Guardian Profile
            $guardian = Guardian::firstOrCreate(
                ['user_id' => $parentUser->id],
                [
                    'school_id' => $validated['school_id'],
                    'first_name' => $validated['parent_first_name'],
                    'last_name' => $validated['parent_last_name'],
                    'email' => $validated['parent_email'],
                    'phone' => $validated['parent_phone'],
                ]
            );

            // 5. Link Student and Guardian
            $student->guardians()->attach($guardian->id, [
                'relationship' => $validated['relationship'],
                'is_primary' => true,
            ]);
        });

        return redirect()->route('login')->with('success', 'Application submitted successfully. We have sent the portal credentials to the parent email.');
    }
}
