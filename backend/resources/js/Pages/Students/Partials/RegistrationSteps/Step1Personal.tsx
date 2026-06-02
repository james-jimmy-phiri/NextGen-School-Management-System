import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step1Personal({ errors }: { errors: any }) {
    const { admission_number, first_name, middle_name, last_name, gender, date_of_birth, place_of_birth, nationality, marital_status, religion, national_id_passport, updateField } = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 1: Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Number *</label>
                    <input type="text" value={admission_number} onChange={e => updateField('admission_number', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">National ID / Passport</label>
                    <input type="text" value={national_id_passport} onChange={e => updateField('national_id_passport', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input type="text" value={first_name} onChange={e => updateField('first_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input type="text" value={middle_name} onChange={e => updateField('middle_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input type="text" value={last_name} onChange={e => updateField('last_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender *</label>
                    <select value={gender} onChange={e => updateField('gender', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input type="date" value={date_of_birth} onChange={e => updateField('date_of_birth', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
                    <input type="text" value={place_of_birth} onChange={e => updateField('place_of_birth', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nationality *</label>
                    <input type="text" value={nationality} onChange={e => updateField('nationality', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                    <input type="text" value={marital_status} onChange={e => updateField('marital_status', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Religion</label>
                    <input type="text" value={religion} onChange={e => updateField('religion', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
            </div>
        </div>
    );
}
