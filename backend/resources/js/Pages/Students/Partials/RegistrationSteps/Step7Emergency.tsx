import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step7Emergency({ errors }: { errors: any }) {
    const store = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 7: Emergency Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input type="text" value={store.emergency_full_name} onChange={e => store.updateField('emergency_full_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Relationship *</label>
                    <input type="text" value={store.emergency_relationship} onChange={e => store.updateField('emergency_relationship', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input type="text" value={store.emergency_phone} onChange={e => store.updateField('emergency_phone', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Alternative Phone</label>
                    <input type="text" value={store.emergency_alternative_phone} onChange={e => store.updateField('emergency_alternative_phone', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={store.emergency_email} onChange={e => store.updateField('emergency_email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea value={store.emergency_address} onChange={e => store.updateField('emergency_address', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={2} />
                </div>
            </div>
        </div>
    );
}
