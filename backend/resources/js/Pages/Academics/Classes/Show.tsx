import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { BookOpen, Users, UserCog, GraduationCap, Trash2, PlusCircle, Check } from 'lucide-react';

export default function Show({ classGroup, allSubjects, teachers, teacherAllocations }: any) {
    const [activeTab, setActiveTab] = useState('subjects');

    // 1. Subjects Form
    const currentSubjectIds = classGroup.subjects?.map((s: any) => s.id) || [];
    const { data: subjectData, setData: setSubjectData, post: postSubjects, processing: processingSubjects } = useForm({
        subject_ids: currentSubjectIds,
    });

    const handleSubjectToggle = (id: number) => {
        const newIds = subjectData.subject_ids.includes(id)
            ? subjectData.subject_ids.filter((sid: number) => sid !== id)
            : [...subjectData.subject_ids, id];
        setSubjectData('subject_ids', newIds);
    };

    const submitSubjects = (e: React.FormEvent) => {
        e.preventDefault();
        postSubjects(route('academics.classes.subjects.assign', classGroup.id));
    };

    // 2. Teacher Allocation Form
    const { data: allocData, setData: setAllocData, post: postAlloc, processing: processingAlloc, reset: resetAlloc, errors: allocErrors } = useForm({
        subject_id: '',
        stream_id: '',
        teacher_id: '',
    });

    const submitAllocation = (e: React.FormEvent) => {
        e.preventDefault();
        postAlloc(route('academics.classes.teachers.assign', classGroup.id), {
            onSuccess: () => resetAlloc('teacher_id'),
        });
    };

    const removeAllocation = (id: number) => {
        if(confirm('Are you sure you want to remove this teacher allocation?')) {
            router.delete(route('academics.allocations.destroy', id));
        }
    };

    // 3. Student Manual Subject Drop
    const removeStudentSubject = (studentId: number, subjectId: number) => {
        if(confirm('Are you sure you want to drop this subject for the student?')) {
            router.delete(route('academics.students.subjects.drop', { studentId, subjectId }));
        }
    };

    const tabs = [
        { id: 'subjects', label: 'Class Subjects', icon: BookOpen },
        { id: 'teachers', label: 'Subject Teachers', icon: UserCog },
        { id: 'students', label: 'Student Enrollments', icon: GraduationCap },
        { id: 'streams', label: 'Streams overview', icon: Users },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{classGroup.name} - Academic Management</h2>}>
            <Head title={`${classGroup.name} Management`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{classGroup.name}</h3>
                                <p className="text-gray-500 mt-1">{classGroup.academic_year?.title} • {classGroup.grade_level?.label}</p>
                            </div>
                            <div className="flex gap-4 text-center">
                                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                                    <span className="block text-xl font-bold text-indigo-700">{classGroup.enrollments?.length || 0}</span>
                                    <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Students</span>
                                </div>
                                <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                                    <span className="block text-xl font-bold text-emerald-700">{classGroup.subjects?.length || 0}</span>
                                    <span className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Subjects</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white border-b border-gray-200 shadow-sm sm:rounded-t-lg">
                        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                            ${activeTab === tab.id 
                                                ? 'border-indigo-500 text-indigo-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-b-lg border border-gray-200 border-t-0">
                        
                        {/* 1. Subjects Tab */}
                        {activeTab === 'subjects' && (
                            <div className="animate-in fade-in duration-300">
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Assign Class Subjects</h4>
                                <p className="text-gray-500 text-sm mb-6">Select the subjects offered in {classGroup.name}. All students currently enrolled will be automatically registered for these subjects.</p>
                                
                                <form onSubmit={submitSubjects}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        {allSubjects.map((subject: any) => {
                                            const isSelected = subjectData.subject_ids.includes(subject.id);
                                            return (
                                                <div 
                                                    key={subject.id}
                                                    onClick={() => handleSubjectToggle(subject.id)}
                                                    className={`
                                                        p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all
                                                        ${isSelected ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-200 hover:border-indigo-300'}
                                                    `}
                                                >
                                                    <div>
                                                        <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{subject.name}</p>
                                                        <p className={`text-xs ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>{subject.code}</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <PrimaryButton disabled={processingSubjects}>
                                            {processingSubjects ? 'Saving...' : 'Save Subject Configuration'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* 2. Teachers Tab */}
                        {activeTab === 'teachers' && (
                            <div className="animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 border-r border-gray-100 pr-8">
                                    <h4 className="text-lg font-bold text-gray-900 mb-6">Allocate Teacher</h4>
                                    <form onSubmit={submitAllocation} className="space-y-4">
                                        <div>
                                            <InputLabel value="Subject *" />
                                            <select 
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={allocData.subject_id}
                                                onChange={e => setAllocData('subject_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select subject...</option>
                                                {classGroup.subjects?.map((s: any) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <InputError message={allocErrors.subject_id} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel value="Stream (Optional)" />
                                            <select 
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={allocData.stream_id}
                                                onChange={e => setAllocData('stream_id', e.target.value)}
                                            >
                                                <option value="">All Streams</option>
                                                {classGroup.streams?.map((s: any) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">Leave blank to assign to the entire class group.</p>
                                        </div>
                                        <div>
                                            <InputLabel value="Teacher *" />
                                            <select 
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={allocData.teacher_id}
                                                onChange={e => setAllocData('teacher_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select teacher...</option>
                                                {teachers.map((t: any) => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <InputError message={allocErrors.teacher_id} className="mt-2" />
                                        </div>
                                        <PrimaryButton type="submit" disabled={processingAlloc} className="w-full justify-center">
                                            <PlusCircle className="w-4 h-4 mr-2" /> Assign Teacher
                                        </PrimaryButton>
                                    </form>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="text-lg font-bold text-gray-900 mb-6">Current Allocations</h4>
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {teacherAllocations.map((alloc: any) => (
                                                    <tr key={alloc.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alloc.subject?.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {alloc.stream ? alloc.stream.name : <span className="text-gray-400 italic">All streams</span>}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alloc.teacher?.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button onClick={() => removeAllocation(alloc.id)} className="text-red-600 hover:text-red-900">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {teacherAllocations.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                                                            No teachers allocated to subjects yet.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Students Tab */}
                        {activeTab === 'students' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-bold text-gray-900">Enrolled Students</h4>
                                    <p className="text-sm text-gray-500">Students automatically receive all class subjects upon enrollment.</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {classGroup.enrollments?.map((enrollment: any) => (
                                                <tr key={enrollment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {enrollment.student?.first_name} {enrollment.student?.last_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {enrollment.student?.admission_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {enrollment.stream ? enrollment.stream.name : 'Unassigned'}
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!classGroup.enrollments || classGroup.enrollments.length === 0) && (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-sm">
                                                        No students currently enrolled in this class.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 4. Streams Tab */}
                        {activeTab === 'streams' && (
                            <div className="animate-in fade-in duration-300">
                                <h4 className="text-lg font-bold text-gray-900 mb-6">Class Streams (Sections)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {classGroup.streams?.map((stream: any) => (
                                        <div key={stream.id} className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
                                            <h5 className="font-bold text-gray-800 text-lg">{stream.name}</h5>
                                            <div className="mt-4 flex flex-col gap-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Classroom:</span>
                                                    <span className="font-medium text-gray-900">{stream.classroom || 'Not set'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Capacity:</span>
                                                    <span className="font-medium text-gray-900">{stream.capacity || 'Unlimited'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!classGroup.streams || classGroup.streams.length === 0) && (
                                        <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                                            No streams configured for this class. You can set them up in School Setup.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
