import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step6Medical({ errors }: { errors: any }) {
    const store = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 6: Detailed Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Health Status</label>
                    <input type="text" value={store.health_status} onChange={e => store.updateField('health_status', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <select value={store.blood_group} onChange={e => store.updateField('blood_group', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="">Unknown</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                        <input type="checkbox" checked={store.has_disability} onChange={e => store.updateField('has_disability', e.target.checked)} className="rounded border-gray-300 text-indigo-600 shadow-sm mr-2" />
                        Student has a disability
                    </label>
                </div>

                {store.has_disability && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Disability Type *</label>
                        <select value={store.disability_type} onChange={e => store.updateField('disability_type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                            <option value="">Select...</option>
                            <option value="Physical Disability">Physical Disability</option>
                            <option value="Visual Impairment">Visual Impairment</option>
                            <option value="Hearing Impairment">Hearing Impairment</option>
                            <option value="Learning Disability">Learning Disability</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                )}
                
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Chronic Medical Conditions</label>
                    <textarea value={store.chronic_conditions} onChange={e => store.updateField('chronic_conditions', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={2} />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Allergies</label>
                    <textarea value={store.allergies} onChange={e => store.updateField('allergies', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={2} />
                </div>
            </div>
        </div>
    );
}
