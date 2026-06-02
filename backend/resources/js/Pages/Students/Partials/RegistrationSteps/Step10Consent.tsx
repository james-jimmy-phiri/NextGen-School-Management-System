import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step10Consent({ errors }: { errors: any }) {
    const store = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 9: Declaration & Consent</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-md border">
                <div>
                    <label className="flex items-start text-sm font-medium text-gray-700">
                        <input type="checkbox" checked={store.consent_policies} onChange={e => store.updateField('consent_policies', e.target.checked)} className="mt-1 rounded border-gray-300 text-indigo-600 shadow-sm mr-3" required />
                        I confirm that the information provided is correct and I accept the Institution Policies. *
                    </label>
                </div>
                <div>
                    <label className="flex items-start text-sm font-medium text-gray-700">
                        <input type="checkbox" checked={store.consent_privacy} onChange={e => store.updateField('consent_privacy', e.target.checked)} className="mt-1 rounded border-gray-300 text-indigo-600 shadow-sm mr-3" required />
                        I accept the Data Privacy Policy. *
                    </label>
                </div>
                <div className="pt-4 border-t border-gray-200 mt-4">
                    <label className="block text-sm font-medium text-gray-700">Digital Signature (Type Full Name) *</label>
                    <input type="text" value={store.digital_signature} onChange={e => store.updateField('digital_signature', e.target.value)} className="mt-1 block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm" required />
                </div>
            </div>
        </div>
    );
}
