import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step5Sponsor({ errors }: { errors: any }) {
    const store = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 5: Sponsor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sponsorship Type *</label>
                    <select value={store.sponsorship_type} onChange={e => store.updateField('sponsorship_type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="Self Sponsored">Self Sponsored</option>
                        <option value="Government Sponsored">Government Sponsored</option>
                        <option value="NGO Sponsored">NGO Sponsored</option>
                        <option value="Company Sponsored">Company Sponsored</option>
                        <option value="Scholarship Sponsored">Scholarship Sponsored</option>
                    </select>
                </div>
                
                {store.sponsorship_type !== 'Self Sponsored' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sponsor Name *</label>
                            <input type="text" value={store.sponsor_name} onChange={e => store.updateField('sponsor_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                            <input type="text" value={store.sponsor_contact_person} onChange={e => store.updateField('sponsor_contact_person', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="text" value={store.sponsor_phone} onChange={e => store.updateField('sponsor_phone', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" value={store.sponsor_email} onChange={e => store.updateField('sponsor_email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea value={store.sponsor_address} onChange={e => store.updateField('sponsor_address', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={2} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
