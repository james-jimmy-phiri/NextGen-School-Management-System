import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step2Address({ errors }: { errors: any }) {
    const store = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 2: Physical Address & Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="text" value={store.phone_number} onChange={e => store.updateField('phone_number', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={store.email} onChange={e => store.updateField('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">House Number</label>
                    <input type="text" value={store.house_number} onChange={e => store.updateField('house_number', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Street Name</label>
                    <input type="text" value={store.street_name} onChange={e => store.updateField('street_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Area / Village *</label>
                    <input type="text" value={store.area_village} onChange={e => store.updateField('area_village', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Traditional Authority</label>
                    <input type="text" value={store.traditional_authority} onChange={e => store.updateField('traditional_authority', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">District *</label>
                    <input type="text" value={store.district} onChange={e => store.updateField('district', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">City / Town *</label>
                    <input type="text" value={store.city_town} onChange={e => store.updateField('city_town', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Address</label>
                    <input type="text" value={store.postal_address} onChange={e => store.updateField('postal_address', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Country *</label>
                    <input type="text" value={store.country} onChange={e => store.updateField('country', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
            </div>
        </div>
    );
}
