<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\AcademicYear;
use App\Models\Term;
use App\Models\Department;
use App\Models\GradeLevel;
use App\Models\ClassGroup;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\GradingSystem;
use App\Models\GradingScale;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Http\Requests\StoreTermRequest;
use App\Http\Requests\UpdateTermRequest;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Requests\StoreGradeLevelRequest;
use App\Http\Requests\UpdateGradeLevelRequest;
use App\Http\Requests\StoreClassGroupRequest;
use App\Http\Requests\UpdateClassGroupRequest;
use App\Http\Requests\StoreStreamRequest;
use App\Http\Requests\UpdateStreamRequest;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Http\Requests\StoreGradingSystemRequest;
use App\Http\Requests\UpdateGradingSystemRequest;

class SchoolSetupController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $school = School::find($schoolId) ?? School::first();

        return Inertia::render('SchoolSetup/Index', [
            'school' => $school,
            'permissions' => [
                'can_edit_school' => $request->user()->can('school_setup.edit'),
                'can_manage_academic_years' => $request->user()->can('academic_years.manage'),
                'can_manage_terms' => $request->user()->can('terms.manage'),
                'can_manage_classes' => $request->user()->can('classes.manage'),
                'can_manage_subjects' => $request->user()->can('subjects.manage'),
                'can_manage_grading' => $request->user()->can('grading.manage'),
            ],
            'academic_years' => AcademicYear::where('school_id', $schoolId)->orderBy('starts_on', 'desc')->get(),
            'terms' => Term::where('school_id', $schoolId)->with('academicYear')->orderBy('position')->get(),
            'departments' => Department::where('school_id', $schoolId)->with('headOfDepartment')->get(),
            'grade_levels' => GradeLevel::where('school_id', $schoolId)->orderBy('sort_order')->get(),
            'class_groups' => ClassGroup::where('school_id', $schoolId)->with(['academicYear', 'gradeLevel', 'homeroomTeacher'])->get(),
            'streams' => Stream::where('school_id', $schoolId)->with(['classGroup.gradeLevel', 'classGroup.academicYear'])->get(),
            'subjects' => Subject::where('school_id', $schoolId)->with(['department', 'teacher'])->get(),
            'grading_systems' => GradingSystem::where('school_id', $schoolId)->with('scales')->get(),
            
            // Dropdowns
            'teachers_list' => User::role('teacher')->where('school_id', $schoolId)->select('id', 'first_name', 'last_name')->get()->map(fn($t) => ['id' => $t->id, 'name' => $t->first_name . ' ' . $t->last_name]),
            'academic_years_list' => AcademicYear::where('school_id', $schoolId)->select('id', 'title', 'is_current')->get(),
            'grade_levels_list' => GradeLevel::where('school_id', $schoolId)->select('id', 'label')->get(),
            'class_groups_list' => ClassGroup::where('school_id', $schoolId)->select('id', 'name')->get(),
            'departments_list' => Department::where('school_id', $schoolId)->select('id', 'name')->get(),
        ]);
    }

    public function updateSchool(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $school = School::findOrFail($schoolId);
        $school->update($request->all());
        return back()->with('success', 'School profile updated successfully.');
    }

    // --- Academic Years ---
    public function storeAcademicYear(StoreAcademicYearRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        $data['created_by'] = $request->user()->id;
        
        if ($data['is_current'] ?? false) {
            AcademicYear::where('school_id', $request->user()->school_id)->update(['is_current' => false]);
        }
        
        AcademicYear::create($data);
        return back()->with('success', 'Academic year created successfully.');
    }

    public function updateAcademicYear(UpdateAcademicYearRequest $request, $id)
    {
        $year = AcademicYear::where('school_id', $request->user()->school_id)->findOrFail($id);
        $data = $request->validated();
        
        if ($data['is_current'] ?? false) {
            AcademicYear::where('school_id', $request->user()->school_id)->update(['is_current' => false]);
        }
        
        $year->update($data);
        return back()->with('success', 'Academic year updated successfully.');
    }

    public function destroyAcademicYear(Request $request, $id)
    {
        $year = AcademicYear::where('school_id', $request->user()->school_id)->findOrFail($id);
        $year->delete();
        return back()->with('success', 'Academic year deleted.');
    }

    // --- Terms ---
    public function storeTerm(StoreTermRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        Term::create($data);
        return back()->with('success', 'Term created successfully.');
    }

    public function updateTerm(UpdateTermRequest $request, $id)
    {
        $term = Term::where('school_id', $request->user()->school_id)->findOrFail($id);
        $term->update($request->validated());
        return back()->with('success', 'Term updated successfully.');
    }

    public function destroyTerm(Request $request, $id)
    {
        $term = Term::where('school_id', $request->user()->school_id)->findOrFail($id);
        $term->delete();
        return back()->with('success', 'Term deleted.');
    }

    // --- Departments ---
    public function storeDepartment(StoreDepartmentRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        Department::create($data);
        return back()->with('success', 'Department created successfully.');
    }

    public function updateDepartment(UpdateDepartmentRequest $request, $id)
    {
        $dept = Department::where('school_id', $request->user()->school_id)->findOrFail($id);
        $dept->update($request->validated());
        return back()->with('success', 'Department updated successfully.');
    }

    public function destroyDepartment(Request $request, $id)
    {
        $dept = Department::where('school_id', $request->user()->school_id)->findOrFail($id);
        $dept->delete();
        return back()->with('success', 'Department deleted.');
    }

    // --- Grade Levels ---
    public function storeGradeLevel(StoreGradeLevelRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        GradeLevel::create($data);
        return back()->with('success', 'Grade level created successfully.');
    }

    public function updateGradeLevel(UpdateGradeLevelRequest $request, $id)
    {
        $level = GradeLevel::where('school_id', $request->user()->school_id)->findOrFail($id);
        $level->update($request->validated());
        return back()->with('success', 'Grade level updated successfully.');
    }

    public function destroyGradeLevel(Request $request, $id)
    {
        $level = GradeLevel::where('school_id', $request->user()->school_id)->findOrFail($id);
        $level->delete();
        return back()->with('success', 'Grade level deleted.');
    }

    // --- Class Groups ---
    public function storeClassGroup(StoreClassGroupRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        ClassGroup::create($data);
        return back()->with('success', 'Class created successfully.');
    }

    public function updateClassGroup(UpdateClassGroupRequest $request, $id)
    {
        $class = ClassGroup::where('school_id', $request->user()->school_id)->findOrFail($id);
        $class->update($request->validated());
        return back()->with('success', 'Class updated successfully.');
    }

    public function destroyClassGroup(Request $request, $id)
    {
        $class = ClassGroup::where('school_id', $request->user()->school_id)->findOrFail($id);
        $class->delete();
        return back()->with('success', 'Class deleted.');
    }

    // --- Streams ---
    public function storeStream(StoreStreamRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        Stream::create($data);
        return back()->with('success', 'Stream created successfully.');
    }

    public function updateStream(UpdateStreamRequest $request, $id)
    {
        $stream = Stream::where('school_id', $request->user()->school_id)->findOrFail($id);
        $stream->update($request->validated());
        return back()->with('success', 'Stream updated successfully.');
    }

    public function destroyStream(Request $request, $id)
    {
        $stream = Stream::where('school_id', $request->user()->school_id)->findOrFail($id);
        $stream->delete();
        return back()->with('success', 'Stream deleted.');
    }

    // --- Subjects ---
    public function storeSubject(StoreSubjectRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        Subject::create($data);
        return back()->with('success', 'Subject created successfully.');
    }

    public function updateSubject(UpdateSubjectRequest $request, $id)
    {
        $subject = Subject::where('school_id', $request->user()->school_id)->findOrFail($id);
        $subject->update($request->validated());
        return back()->with('success', 'Subject updated successfully.');
    }

    public function destroySubject(Request $request, $id)
    {
        $subject = Subject::where('school_id', $request->user()->school_id)->findOrFail($id);
        $subject->delete();
        return back()->with('success', 'Subject deleted.');
    }

    // --- Grading Systems ---
    public function storeGradingSystem(StoreGradingSystemRequest $request)
    {
        $data = $request->validated();
        $data['school_id'] = $request->user()->school_id;
        
        DB::transaction(function () use ($data, $request) {
            if ($data['is_default'] ?? false) {
                GradingSystem::where('school_id', $request->user()->school_id)->update(['is_default' => false]);
            }
            
            $system = GradingSystem::create([
                'school_id' => $data['school_id'],
                'name' => $data['name'],
                'type' => $data['type'],
                'is_default' => $data['is_default'] ?? false,
            ]);
            
            if (!empty($data['scales'])) {
                foreach ($data['scales'] as $scale) {
                    $system->scales()->create($scale);
                }
            }
        });
        
        return back()->with('success', 'Grading system created successfully.');
    }

    public function updateGradingSystem(UpdateGradingSystemRequest $request, $id)
    {
        $system = GradingSystem::where('school_id', $request->user()->school_id)->findOrFail($id);
        $data = $request->validated();
        
        DB::transaction(function () use ($data, $system, $request) {
            if ($data['is_default'] ?? false) {
                GradingSystem::where('school_id', $request->user()->school_id)
                    ->where('id', '!=', $system->id)
                    ->update(['is_default' => false]);
            }
            
            $system->update([
                'name' => $data['name'],
                'type' => $data['type'],
                'is_default' => $data['is_default'] ?? false,
            ]);
            
            if (isset($data['scales'])) {
                // Delete scales that are not in the update request
                $scaleIds = collect($data['scales'])->pluck('id')->filter()->toArray();
                $system->scales()->whereNotIn('id', $scaleIds)->delete();
                
                foreach ($data['scales'] as $scale) {
                    if (isset($scale['id'])) {
                        $system->scales()->where('id', $scale['id'])->update([
                            'min_score' => $scale['min_score'],
                            'max_score' => $scale['max_score'],
                            'grade' => $scale['grade'],
                            'remark' => $scale['remark'] ?? null,
                            'points' => $scale['points'],
                        ]);
                    } else {
                        $system->scales()->create([
                            'min_score' => $scale['min_score'],
                            'max_score' => $scale['max_score'],
                            'grade' => $scale['grade'],
                            'remark' => $scale['remark'] ?? null,
                            'points' => $scale['points'],
                        ]);
                    }
                }
            }
        });
        
        return back()->with('success', 'Grading system updated successfully.');
    }

    public function destroyGradingSystem(Request $request, $id)
    {
        $system = GradingSystem::where('school_id', $request->user()->school_id)->findOrFail($id);
        $system->delete();
        return back()->with('success', 'Grading system deleted.');
    }
}
