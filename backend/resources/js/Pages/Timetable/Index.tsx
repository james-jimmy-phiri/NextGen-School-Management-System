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
import { CalendarDays, Plus, Filter, Edit2, Trash2, Clock, Users, BookOpen } from 'lucide-react';

export default function Index({ auth, periods, classGroups, subjects, teachers, filters }: PageProps<{ periods: any, classGroups: any[], subjects: any[], teachers: any[], filters: any }>) {
    const [selectedClassGroup, setSelectedClassGroup] = useState(filters.class_group_id || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        class_group_id: '',
        day_of_week: 'Monday',
        start_time: '08:00',
        end_time: '08:40',
        is_break: false,
        name: '',
        subject_id: '',
        teacher_id: '',
        room: '',
    });

    const handleFilterChange = (classGroupId: string) => {
        setSelectedClassGroup(classGroupId);
        router.get(route('timetables.index'), { class_group_id: classGroupId }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        // default to currently filtered class group if any
        if (selectedClassGroup) {
            setData('class_group_id', selectedClassGroup);
        }
        setIsCreateModalOpen(true);
    };

    const openEditModal = (period: any) => {
        clearErrors();
        setSelectedPeriod(period);
        setData({
            class_group_id: period.class_group_id,
            day_of_week: period.day_of_week,
            start_time: period.start_time.substring(0, 5), // 'HH:mm'
            end_time: period.end_time.substring(0, 5),
            is_break: period.is_break === 1 || period.is_break === true,
            name: period.name || '',
            subject_id: period.subject_id || '',
            teacher_id: period.teacher_id || '',
            room: period.room || '',
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (period: any) => {
        setSelectedPeriod(period);
        setIsDeleteModalOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('timetables.store'), {
            onSuccess: () => setIsCreateModalOpen(false),
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('timetables.update', selectedPeriod.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const submitDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('timetables.destroy', selectedPeriod.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const formatTime = (timeStr: string) => {
        return timeStr.substring(0, 5); // simple HH:mm
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold tracking-tight text-gray-900">Class Timetables</h2>}
        >
            <Head title="Class Timetables" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex-1 w-full sm:max-w-xs flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select
                                value={selectedClassGroup}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="block w-full rounded-xl border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">All Classes (Filter)</option>
                                {classGroups.map((cg) => (
                                    <option key={cg.id} value={cg.id}>
                                        {cg.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                        >
                            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                            Add Period
                        </button>
                    </div>

                    {/* Table Card */}
                    <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-2xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Day & Time
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Class Group
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Subject / Activity
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Teacher & Room
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {periods.data.map((period: any) => (
                                        <tr key={period.id} className={`hover:bg-gray-50/50 transition-colors ${period.is_break ? 'bg-orange-50/30' : ''}`}>
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="font-semibold text-gray-900">{period.day_of_week}</div>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                                    {formatTime(period.start_time)} - {formatTime(period.end_time)}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5">
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-2 text-indigo-400" />
                                                    <span className="text-sm font-medium text-gray-900">{period.class_group?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {period.is_break ? (
                                                    <span className="inline-flex items-center rounded-md bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800 ring-1 ring-inset ring-orange-600/20">
                                                        ☕ {period.name || 'Break Time'}
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <BookOpen className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                                                        <span className="text-sm font-medium text-gray-900">{period.subject?.name || period.name}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5">
                                                {!period.is_break ? (
                                                    <div className="text-sm">
                                                        <div className="text-gray-900 font-medium">{period.teacher?.name || 'Unassigned'}</div>
                                                        {period.room && <div className="text-gray-500">Room: {period.room}</div>}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => openEditModal(period)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition-colors">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => openDeleteModal(period)} className="text-rose-600 hover:text-rose-900 p-1 rounded-md hover:bg-rose-50 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {periods.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <CalendarDays className="h-12 w-12 text-gray-300 mb-3" />
                                                    <p className="text-base font-medium text-gray-900">No periods scheduled</p>
                                                    <p className="text-sm">{selectedClassGroup ? 'This class has an empty timetable.' : 'Select a class or create a new period.'}</p>
                                                    <button onClick={openCreateModal} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                        Create period &rarr;
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
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <CalendarDays className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isCreateModalOpen ? 'Add Timetable Period' : 'Edit Period'}
                        </h2>
                    </div>

                    <form onSubmit={isCreateModalOpen ? submitCreate : submitEdit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="class_group_id" value="Class Group" />
                                <select
                                    id="class_group_id"
                                    value={data.class_group_id}
                                    onChange={(e) => setData('class_group_id', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select a class...</option>
                                    {classGroups.map((cg) => (
                                        <option key={cg.id} value={cg.id}>{cg.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.class_group_id} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="day_of_week" value="Day of Week" />
                                <select
                                    id="day_of_week"
                                    value={data.day_of_week}
                                    onChange={(e) => setData('day_of_week', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <InputError message={errors.day_of_week} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="start_time" value="Start Time" />
                                <TextInput
                                    id="start_time"
                                    type="time"
                                    className="mt-1 block w-full rounded-xl"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                />
                                <InputError message={errors.start_time} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_time" value="End Time" />
                                <TextInput
                                    id="end_time"
                                    type="time"
                                    className="mt-1 block w-full rounded-xl"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                />
                                <InputError message={errors.end_time} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center pt-2">
                            <input
                                id="is_break"
                                type="checkbox"
                                checked={data.is_break}
                                onChange={(e) => setData('is_break', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <label htmlFor="is_break" className="ml-2 block text-sm text-gray-900 font-medium">
                                This period is a Break (e.g. Lunch, Recess)
                            </label>
                        </div>

                        {!data.is_break ? (
                            <>
                                <div>
                                    <InputLabel htmlFor="subject_id" value="Subject" />
                                    <select
                                        id="subject_id"
                                        value={data.subject_id}
                                        onChange={(e) => setData('subject_id', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select a subject...</option>
                                        {subjects.map((subj) => (
                                            <option key={subj.id} value={subj.id}>{subj.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.subject_id} className="mt-2" />
                                </div>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="teacher_id" value="Teacher" />
                                        <select
                                            id="teacher_id"
                                            value={data.teacher_id}
                                            onChange={(e) => setData('teacher_id', e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select teacher...</option>
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.teacher_id} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="room" value="Room / Location" />
                                        <TextInput
                                            id="room"
                                            type="text"
                                            className="mt-1 block w-full rounded-xl"
                                            value={data.room}
                                            onChange={(e) => setData('room', e.target.value)}
                                            placeholder="e.g. Room 101"
                                        />
                                        <InputError message={errors.room} className="mt-2" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <InputLabel htmlFor="name" value="Break Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full rounded-xl"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Lunch Break"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <SecondaryButton onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Period'}
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
                        Delete Period
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Are you sure you want to delete this timetable period? This action cannot be undone.
                    </p>
                    
                    <form onSubmit={submitDelete} className="flex justify-center gap-3">
                        <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete'}
                        </DangerButton>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
