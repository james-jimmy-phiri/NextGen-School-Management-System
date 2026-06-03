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
import { Stethoscope, Plus, Search, Edit2, Trash2, Calendar, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Index({ auth, visits, students, filters }: PageProps<{ visits: any, students: any[], filters: any }>) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        condition: '',
        action: '',
        notes: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('clinic-visits.index'), { search: searchQuery }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (visit: any) => {
        clearErrors();
        setSelectedVisit(visit);
        setData({
            student_id: visit.student_id,
            date: visit.date ? visit.date.split('T')[0] : '',
            condition: visit.condition || '',
            action: visit.action || '',
            notes: visit.notes || '',
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (visit: any) => {
        setSelectedVisit(visit);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clinic-visits.store'), {
            onSuccess: () => setIsCreateModalOpen(false),
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('clinic-visits.update', selectedVisit.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('clinic-visits.destroy', selectedVisit.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold tracking-tight text-gray-900">Clinic Visits</h2>}
        >
            <Head title="Clinic Visits" />

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
                                    placeholder="Search by student or condition..."
                                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-shadow"
                                />
                                <button type="submit" className="hidden" />
                            </form>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-x-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors"
                        >
                            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                            Log Visit
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
                                            Condition
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Action Taken
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
                                    {visits.data.map((visit: any) => (
                                        <tr key={visit.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                                                        {visit.student.first_name[0]}{visit.student.last_name[0]}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{visit.student.first_name} {visit.student.last_name}</div>
                                                        <div className="text-sm text-gray-500">{visit.student.admission_number}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <Activity className="h-4 w-4 text-rose-500 mr-2 flex-shrink-0" />
                                                    <span className="font-medium text-gray-900">{visit.condition}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm text-gray-900 line-clamp-2 max-w-sm">{visit.action}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                    {format(parseISO(visit.date), 'MMM d, yyyy')}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => openEditModal(visit)} className="text-teal-600 hover:text-teal-900 p-1 rounded-md hover:bg-teal-50 transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => openDeleteModal(visit)} className="text-rose-600 hover:text-rose-900 p-1 rounded-md hover:bg-rose-50 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {visits.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Stethoscope className="h-12 w-12 text-gray-300 mb-3" />
                                                    <p className="text-base font-medium text-gray-900">No clinic visits found</p>
                                                    <p className="text-sm">Get started by logging a new visit.</p>
                                                    <button onClick={openCreateModal} className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-500">
                                                        Log a visit &rarr;
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create / Edit Form Modal */}
            <Modal show={isCreateModalOpen || isEditModalOpen} onClose={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isCreateModalOpen ? 'Log Clinic Visit' : 'Edit Visit'}
                        </h2>
                    </div>

                    <form onSubmit={isCreateModalOpen ? submitCreate : submitEdit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="student_id" value="Student" />
                            <select
                                id="student_id"
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
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

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="condition" value="Medical Condition / Complaint" />
                                <TextInput
                                    id="condition"
                                    type="text"
                                    className="mt-1 block w-full rounded-xl"
                                    value={data.condition}
                                    onChange={(e) => setData('condition', e.target.value)}
                                    placeholder="e.g. Headache"
                                />
                                <InputError message={errors.condition} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="date" value="Date of Visit" />
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
                            <InputLabel htmlFor="action" value="Action Taken / Treatment" />
                            <TextInput
                                id="action"
                                type="text"
                                className="mt-1 block w-full rounded-xl"
                                value={data.action}
                                onChange={(e) => setData('action', e.target.value)}
                                placeholder="e.g. Given Paracetamol, rested"
                            />
                            <InputError message={errors.action} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Additional Notes" />
                            <textarea
                                id="notes"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Optional notes regarding the visit..."
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <SecondaryButton onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing} className="bg-teal-600 hover:bg-teal-500 focus:bg-teal-500 active:bg-teal-700">
                                {processing ? 'Saving...' : 'Save Record'}
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
                        Delete Visit Record
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Are you sure you want to delete this visit for <strong>{selectedVisit?.student?.first_name}</strong>? This action cannot be undone.
                    </p>
                    
                    <form onSubmit={submitDelete} className="flex justify-center gap-3">
                        <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete Visit'}
                        </DangerButton>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
