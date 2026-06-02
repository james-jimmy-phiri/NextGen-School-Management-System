import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Step4Guardians({ errors }: { errors: any }) {
    const { guardians, updateGuardian, addGuardian, removeGuardian } = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 4: Parent / Guardian Information</h3>
            
            {guardians.map((g, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50 relative">
                    <h4 className="font-semibold text-gray-700 mb-4">Guardian {index + 1} {g.is_primary && '(Primary)'}</h4>
                    {guardians.length > 1 && (
                        <button type="button" onClick={() => removeGuardian(index)} className="absolute top-4 right-4 text-red-500 text-sm font-semibold hover:text-red-700">Remove</button>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                            <input type="text" value={g.full_name} onChange={e => updateGuardian(index, 'full_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Relationship *</label>
                            <select value={g.relationship} onChange={e => updateGuardian(index, 'relationship', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                <option value="">Select...</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Sponsor">Sponsor</option>
                                <option value="Relative">Relative</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select value={g.gender} onChange={e => updateGuardian(index, 'gender', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input type="text" value={g.phone} onChange={e => updateGuardian(index, 'phone', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={g.email} onChange={e => updateGuardian(index, 'email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">National ID</label>
                            <input type="text" value={g.national_id} onChange={e => updateGuardian(index, 'national_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div className="col-span-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <input type="checkbox" checked={g.is_primary} onChange={e => updateGuardian(index, 'is_primary', e.target.checked)} className="rounded border-gray-300 text-indigo-600 shadow-sm mr-2" />
                                Set as Primary Guardian
                            </label>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-end">
                <PrimaryButton type="button" onClick={addGuardian} className="bg-green-600 hover:bg-green-700">
                    + Add Another Guardian
                </PrimaryButton>
            </div>
        </div>
    );
}
