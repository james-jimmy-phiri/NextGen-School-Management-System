import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { Award, Plus, Search, Edit2, Trash2, Calendar, User, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Index({ auth, awards, students, filters }: PageProps<{ awards: any, students: any[], filters: any }>) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAward, setSelectedAward] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        title: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('student-awards.index'), { search: searchQuery }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (award: any) => {
        clearErrors();
        setSelectedAward(award);
        setData({
            student_id: award.student_id,
            title: award.title,
            category: award.category || '',
            date: award.date ? award.date.split('T')[0] : '',
            description: award.description || '',
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (award: any) => {
        setSelectedAward(award);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student-awards.store'), {
            onSuccess: () => setIsCreateModalOpen(false),
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('student-awards.update', selectedAward.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('student-awards.destroy', selectedAward.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold tracking-tight text-gray-900">Student Awards</h2>}
        >
            <Head title="Student Awards" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex-1 w-full sm:max-w-md">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by student, title, or category..."
                                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-shadow"
                                />
                                <button type="submit" className="hidden" />
                            </form>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                        >
                            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                            Record Award
                        </button>
                    </div>

                    {/* Table Card */}
                    <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-2xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Award Title
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {awards.data.map((award: any) => (
                                        <tr key={award.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                        {award.student.first_name[0]}{award.student.last_name[0]}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{award.student.first_name} {award.student.last_name}</div>
                                                        <div className="text-sm text-gray-500">{award.student.admission_number}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <Award className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                                                    <span className="font-medium text-gray-900">{award.title}</span>
                                                </div>
                                                {award.description && (
                                                    <div className="text-sm text-gray-500 mt-1 line-clamp-1 max-w-xs">{award.description}</div>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5">
                                                {award.category ? (
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {award.category}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    {format(parseISO(award.date), 'MMM d, yyyy')}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => openEditModal(award)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => openDeleteModal(award)} className="text-rose-600 hover:text-rose-900 p-1 rounded-md hover:bg-rose-50 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {awards.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Award className="h-12 w-12 text-gray-300 mb-3" />
                                                    <p className="text-base font-medium text-gray-900">No awards found</p>
                                                    <p className="text-sm">Get started by recording a new student award.</p>
                                                    <button onClick={openCreateModal} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                        Record an award &rarr;
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination placeholder - could add simple prev/next here using awards.links */}
                    </div>
                </div>
            </div>

            {/* Create / Edit Form Modal */}
            <Modal show={isCreateModalOpen || isEditModalOpen} onClose={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Award className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isCreateModalOpen ? 'Record New Award' : 'Edit Award'}
                        </h2>
                    </div>

                    <form onSubmit={isCreateModalOpen ? submitCreate : submitEdit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="student_id" value="Student" />
                            <select
                                id="student_id"
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select a student</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.first_name} {student.last_name} ({student.admission_number})
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.student_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="title" value="Award Title" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full rounded-xl"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Student of the Month"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="category" value="Category" />
                                <TextInput
                                    id="category"
                                    type="text"
                                    className="mt-1 block w-full rounded-xl"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    placeholder="e.g. Academics, Sports"
                                />
                                <InputError message={errors.category} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="date" value="Date Awarded" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    className="mt-1 block w-full rounded-xl"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description / Notes" />
                            <textarea
                                id="description"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Optional details about this award..."
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <SecondaryButton onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Award'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-rose-100 rounded-full mb-4">
                        <Trash2 className="w-6 h-6 text-rose-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-center text-gray-900 mb-2">
                        Delete Award Record
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Are you sure you want to delete this award for <strong>{selectedAward?.student?.first_name}</strong>? This action cannot be undone.
                    </p>
                    
                    <form onSubmit={submitDelete} className="flex justify-center gap-3">
                        <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete Award'}
                        </DangerButton>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
