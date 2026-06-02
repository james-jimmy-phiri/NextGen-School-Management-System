<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassGroup;
use App\Models\Subject;
use App\Models\Stream;
use App\Models\User;
use App\Models\Student;
use App\Models\TeacherSubjectAllocation;
use Illuminate\Support\Facades\DB;

class AcademicsController extends Controller
{
    /**
     * Display a listing of all class groups for academic management.
     */
    public function classesIndex(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $classes = ClassGroup::where('school_id', $schoolId)
            ->with(['academicYear', 'gradeLevel', 'streams'])
            ->withCount('enrollments')
            ->get();

        return Inertia::render('Academics/Classes/Index', [
            'classes' => $classes,
        ]);
    }

    /**
     * Manage a specific class group (Streams, Subjects, Teachers, Students).
     */
    public function classManage(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        
        $classGroup = ClassGroup::where('school_id', $schoolId)
            ->with([
                'gradeLevel',
                'academicYear',
                'streams',
                'subjects',
                'enrollments.student',
                'enrollments.stream'
            ])
            ->findOrFail($id);

        $allSubjects = Subject::where('school_id', $schoolId)->get();
        $teachers = User::role('teacher')->where('school_id', $schoolId)->select('id', 'name')->get();
        
        // Load teacher allocations for this class
        $teacherAllocations = TeacherSubjectAllocation::where('class_group_id', $id)
            ->with(['subject', 'stream', 'teacher'])
            ->get();

        return Inertia::render('Academics/Classes/Show', [
            'classGroup' => $classGroup,
            'allSubjects' => $allSubjects,
            'teachers' => $teachers,
            'teacherAllocations' => $teacherAllocations,
        ]);
    }

    /**
     * Display a listing of all subjects for academic management.
     */
    public function subjectsIndex(Request $request)
    {
        $schoolId = $request->user()->school_id;
        
        $subjects = Subject::where('school_id', $schoolId)
            ->withCount(['classGroups', 'students'])
            ->get();
            
        return Inertia::render('Academics/Subjects/Index', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * Manage a specific subject.
     */
    public function subjectManage(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        
        $subject = Subject::where('school_id', $schoolId)
            ->with([
                'classGroups.academicYear',
                'students',
                'teacher'
            ])
            ->findOrFail($id);

        $teacherAllocations = TeacherSubjectAllocation::where('subject_id', $id)
            ->with(['classGroup', 'stream', 'teacher', 'academicYear'])
            ->get();

        return Inertia::render('Academics/Subjects/Show', [
            'subject' => $subject,
            'teacherAllocations' => $teacherAllocations,
        ]);
    }

    /**
     * Assign multiple subjects to a class.
     */
    public function assignSubjectsToClass(Request $request, $id)
    {
        $request->validate([
            'subject_ids' => 'required|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $classGroup = ClassGroup::where('school_id', $request->user()->school_id)->findOrFail($id);
        
        // Sync the subjects (adds new, removes unselected)
        $syncData = [];
        foreach ($request->subject_ids as $subjectId) {
            $syncData[$subjectId] = ['is_core' => true];
        }
        
        $classGroup->subjects()->sync($syncData);

        // Auto-enroll all students currently in this class into the new core subjects for the current academic year
        $studentIds = $classGroup->enrollments()->pluck('student_id')->toArray();
        if (count($studentIds) > 0) {
            // Find current academic year
            $academicYearId = $classGroup->academic_year_id;
            
            foreach ($studentIds as $studentId) {
                $student = Student::find($studentId);
                if ($student) {
                    // For auto-enrollment, we sync without detaching existing ones, or just attach new ones.
                    // SyncWithoutDetaching ensures they don't lose subjects they manually selected.
                    $syncStudentData = [];
                    foreach ($request->subject_ids as $subjectId) {
                        $syncStudentData[$subjectId] = ['academic_year_id' => $academicYearId];
                    }
                    $student->subjects()->syncWithoutDetaching($syncStudentData);
                }
            }
        }

        return back()->with('success', 'Subjects assigned successfully and students auto-enrolled.');
    }

    /**
     * Assign a teacher to a subject for a specific stream.
     */
    public function assignTeacherToSubject(Request $request, $classId)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'stream_id' => 'nullable|exists:streams,id',
            'teacher_id' => 'required|exists:users,id',
        ]);

        $classGroup = ClassGroup::where('school_id', $request->user()->school_id)->findOrFail($classId);
        
        // Use updateOrCreate to avoid unique constraint violations
        TeacherSubjectAllocation::updateOrCreate(
            [
                'academic_year_id' => $classGroup->academic_year_id,
                'subject_id' => $request->subject_id,
                'class_group_id' => $classGroup->id,
                'stream_id' => $request->stream_id,
            ],
            [
                'school_id' => $classGroup->school_id,
                'teacher_id' => $request->teacher_id,
            ]
        );

        return back()->with('success', 'Teacher assigned successfully.');
    }
    
    /**
     * Remove a teacher assignment.
     */
    public function removeTeacherAssignment(Request $request, $allocationId)
    {
        $allocation = TeacherSubjectAllocation::where('school_id', $request->user()->school_id)->findOrFail($allocationId);
        $allocation->delete();
        
        return back()->with('success', 'Teacher allocation removed.');
    }

    /**
     * Drop a subject for a specific student.
     */
    public function dropStudentSubject(Request $request, $studentId, $subjectId)
    {
        $student = Student::where('school_id', $request->user()->school_id)->findOrFail($studentId);
        $student->subjects()->detach($subjectId);
        
        return back()->with('success', 'Subject dropped for student.');
    }
    
    /**
     * Attach a subject to a specific student (manual enrollment).
     */
    public function enrollStudentSubject(Request $request, $studentId)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);
        
        $student = Student::where('school_id', $request->user()->school_id)->findOrFail($studentId);
        $student->subjects()->syncWithoutDetaching([
            $request->subject_id => ['academic_year_id' => $request->academic_year_id]
        ]);
        
        return back()->with('success', 'Student manually enrolled in subject.');
    }
}
