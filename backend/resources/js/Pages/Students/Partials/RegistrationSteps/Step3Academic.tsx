import React from 'react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';

export default function Step3Academic({ errors, campuses = [], academicYears = [], terms = [], classGroups = [] }: any) {
    const store = useRegistrationStore();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Step 3: Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Academic Year *</label>
                    <select value={store.academic_year_id} onChange={e => store.updateField('academic_year_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="">Select Year</option>
                        {/* Assuming we might fetch these, using dummy ID if empty for safety in demo */}
                        {academicYears.length ? academicYears.map((y: any) => <option key={y.id} value={y.id}>{y.title}</option>) : <option value="1">2024/2025</option>}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Grade / Class *</label>
                    <select value={store.class_group_id} onChange={e => store.updateField('class_group_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="">Select Class</option>
                        {classGroups.length ? classGroups.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>) : <option value="1">Grade 1</option>}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Campus *</label>
                    <select value={store.campus_id} onChange={e => store.updateField('campus_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="">Select Campus</option>
                        {campuses.length ? campuses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>) : <option value="1">Main Campus</option>}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mode of Study</label>
                    <select value={store.mode_of_study} onChange={e => store.updateField('mode_of_study', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="online">Online</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Year of Study *</label>
                    <input type="number" min="1" value={store.year_of_study} onChange={e => store.updateField('year_of_study', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Term *</label>
                    <select value={store.term_id} onChange={e => store.updateField('term_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="">Select Term</option>
                        {terms.length ? terms.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>) : <option value="1">Term 1</option>}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                    <input type="date" value={store.start_date} onChange={e => store.updateField('start_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date *</label>
                    <input type="date" value={store.end_date} onChange={e => store.updateField('end_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
            </div>
        </div>
    );
}
