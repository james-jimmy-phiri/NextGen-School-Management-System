import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step8Account({ errors }: { errors: any }) {
    const store = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 8: Student Account Information (Optional)</h3>
            <p className="text-sm text-gray-500">Provide these details if the student needs portal access.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" value={store.username} onChange={e => store.updateField('username', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="hidden md:block"></div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={store.password} onChange={e => store.updateField('password', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input type="password" value={store.password_confirmation} onChange={e => store.updateField('password_confirmation', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Security Question</label>
                    <select value={store.security_question} onChange={e => store.updateField('security_question', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="">Select a question...</option>
                        <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                        <option value="What city were you born in?">What city were you born in?</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Security Answer</label>
                    <input type="text" value={store.security_answer} onChange={e => store.updateField('security_answer', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
            </div>
        </div>
    );
}
