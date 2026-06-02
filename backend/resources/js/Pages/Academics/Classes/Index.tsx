import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Users, BookOpen, GraduationCap, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface ClassGroup {
    id: number;
    name: string;
    room?: string;
    homeroom_teacher_id?: number;
    grade_level_id: number;
    academic_year_id: number;
    grade_level: { id: number; label: string; code: string };
    academic_year: { id: number; title: string };
    streams: { id: number; name: string; capacity: number }[];
}

export default function Index({ classes, academicYears, gradeLevels, teachers }: any) {
    const user = usePage().props.auth.user;
    const canManageClasses = user?.permissions?.includes('academics.classes.manage');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        name: '',
        room: '',
        academic_year_id: '',
        grade_level_id: '',
        homeroom_teacher_id: '',
    });

    const openCreateModal = () => {
        setEditingClass(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (cls: ClassGroup) => {
        setEditingClass(cls);
        setData({
            name: cls.name,
            room: cls.room || '',
            academic_year_id: cls.academic_year_id.toString(),
            grade_level_id: cls.grade_level_id.toString(),
            homeroom_teacher_id: cls.homeroom_teacher_id ? cls.homeroom_teacher_id.toString() : '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const deleteClass = (id: number) => {
        if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            router.delete(route('academics.classes.destroy', id));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClass) {
            patch(route('academics.classes.update', editingClass.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('academics.classes.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Academic Classes</h2>}
        >
            <Head title="Academic Classes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">All Classes</h3>
                                <p className="text-sm text-gray-500">Select a class to manage subjects, streams, and teachers</p>
                            </div>
                            {canManageClasses && (
                                <PrimaryButton onClick={openCreateModal}>
                                    <Plus className="w-4 h-4 mr-2" /> Create Class
                                </PrimaryButton>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classes.map((cls: ClassGroup) => (
                                <div key={cls.id} className="relative block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                    {canManageClasses && (
                                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(cls)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteClass(cls.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <Link href={route('academics.classes.manage', cls.id)} className="block mt-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xl font-bold text-indigo-700 hover:text-indigo-800">{cls.name}</h4>
                                        </div>
                                        <div className="mb-4">
                                            <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-semibold">
                                                {cls.grade_level?.label}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Users className="w-4 h-4 mr-2" />
                                                <span>{cls.streams?.length || 0} Streams</span>
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                <span>Manage Subjects</span>
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <GraduationCap className="w-4 h-4 mr-2" />
                                                <span>{cls.academic_year?.title}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            {classes.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                    <p>No classes found.</p>
                                    {canManageClasses && (
                                        <PrimaryButton className="mt-4" onClick={openCreateModal}>
                                            <Plus className="w-4 h-4 mr-2" /> Create First Class
                                        </PrimaryButton>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        {editingClass ? 'Edit Class Group' : 'Create New Class Group'}
                    </h2>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Class Name *" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="e.g. Form 1"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel value="Room / Location" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.room}
                                    onChange={(e) => setData('room', e.target.value)}
                                    placeholder="e.g. Block A, Room 10"
                                />
                                <InputError message={errors.room} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Academic Year *" />
                                <select
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={data.academic_year_id}
                                    onChange={(e) => setData('academic_year_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Academic Year</option>
                                    {academicYears?.map((year: any) => (
                                        <option key={year.id} value={year.id}>{year.title}</option>
                                    ))}
                                </select>
                                <InputError message={errors.academic_year_id} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel value="Grade Level *" />
                                <select
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={data.grade_level_id}
                                    onChange={(e) => setData('grade_level_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Grade Level</option>
                                    {gradeLevels?.map((gl: any) => (
                                        <option key={gl.id} value={gl.id}>{gl.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.grade_level_id} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Homeroom Teacher" />
                            <select
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={data.homeroom_teacher_id}
                                onChange={(e) => setData('homeroom_teacher_id', e.target.value)}
                            >
                                <option value="">Select Homeroom Teacher</option>
                                {teachers?.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.homeroom_teacher_id} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Class Group'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
