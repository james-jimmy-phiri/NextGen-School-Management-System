import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { BookOpen, Users, GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';

interface Subject {
    id: number;
    name: string;
    code: string;
    gpa_weight: number;
    class_groups_count: number;
    students_count: number;
}

export default function Index({ subjects }: { subjects: Subject[] }) {
    const user = usePage().props.auth.user;
    const canManageSubjects = user?.permissions?.includes('academics.subjects.manage');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        gpa_weight: '1.0',
    });

    const openCreateModal = () => {
        setEditingSubject(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (subject: Subject) => {
        setEditingSubject(subject);
        setData({
            name: subject.name,
            code: subject.code,
            gpa_weight: subject.gpa_weight.toString(),
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const deleteSubject = (id: number) => {
        if (confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
            router.delete(route('academics.subjects.destroy', id));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubject) {
            patch(route('academics.subjects.update', editingSubject.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('academics.subjects.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Academic Subjects</h2>}
        >
            <Head title="Academic Subjects" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">All Subjects</h3>
                                <p className="text-sm text-gray-500">View and manage subject assignments across classes and teachers</p>
                            </div>
                            {canManageSubjects && (
                                <PrimaryButton onClick={openCreateModal}>
                                    <Plus className="w-4 h-4 mr-2" /> Create Subject
                                </PrimaryButton>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {subjects.map((subject) => (
                                <div key={subject.id} className="relative block p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                    {canManageSubjects && (
                                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(subject)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteSubject(subject.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <Link href={route('academics.subjects.manage', subject.id)} className="block mt-2">
                                        <div className="flex items-start justify-between mb-4 pr-16">
                                            <div>
                                                <h4 className="text-lg font-bold text-emerald-700 hover:text-emerald-800">{subject.name}</h4>
                                                <span className="text-xs font-mono text-gray-500">{subject.code}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3 pt-3 border-t border-gray-100 mt-2">
                                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-2 text-indigo-400" />
                                                    <span>Classes</span>
                                                </div>
                                                <span className="font-semibold text-gray-900">{subject.class_groups_count}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                                <div className="flex items-center">
                                                    <GraduationCap className="w-4 h-4 mr-2 text-blue-400" />
                                                    <span>Students</span>
                                                </div>
                                                <span className="font-semibold text-gray-900">{subject.students_count}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            {subjects.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                    <p>No subjects found.</p>
                                    {canManageSubjects && (
                                        <PrimaryButton className="mt-4" onClick={openCreateModal}>
                                            <Plus className="w-4 h-4 mr-2" /> Create First Subject
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
                        {editingSubject ? 'Edit Subject' : 'Create New Subject'}
                    </h2>
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel value="Subject Name *" />
                            <TextInput
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="e.g. Mathematics"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Subject Code *" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    required
                                    placeholder="e.g. MTH101"
                                />
                                <InputError message={errors.code} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel value="GPA Weight *" />
                                <TextInput
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    className="mt-1 block w-full"
                                    value={data.gpa_weight}
                                    onChange={(e) => setData('gpa_weight', e.target.value)}
                                    required
                                />
                                <InputError message={errors.gpa_weight} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Subject'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
