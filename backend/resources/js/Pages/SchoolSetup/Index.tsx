import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageProps } from '@/types';
import SchoolProfile from './Partials/SchoolProfile';
import AcademicYears from './Partials/AcademicYears';
import Terms from './Partials/Terms';
import Classes from './Partials/Classes';
import Streams from './Partials/Streams';
import Subjects from './Partials/Subjects';
import Departments from './Partials/Departments';
import GradingSystem from './Partials/GradingSystem';

interface Props extends PageProps {
    school: any;
    permissions: any;
}

export default function SchoolSetupIndex({ school, permissions }: Props) {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'School Profile', permission: permissions.can_edit_school },
        { id: 'academic_years', label: 'Academic Years', permission: permissions.can_manage_academic_years },
        { id: 'terms', label: 'Terms / Semesters', permission: permissions.can_manage_terms },
        { id: 'departments', label: 'Departments', permission: permissions.can_manage_subjects },
        { id: 'classes', label: 'Classes', permission: permissions.can_manage_classes },
        { id: 'streams', label: 'Streams', permission: permissions.can_manage_classes },
        { id: 'subjects', label: 'Subjects', permission: permissions.can_manage_subjects },
        { id: 'grading', label: 'Grading System', permission: permissions.can_manage_grading },
    ].filter(tab => tab.permission !== false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                        Administration
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        School Configuration
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        Manage your institution's core settings, academic structure, and operations.
                    </p>
                </div>
            }
        >
            <Head title="School Setup" />

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-col space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                                        : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8"
                        >
                            {activeTab === 'profile' && <SchoolProfile initialData={school} />}
                            {activeTab === 'academic_years' && <AcademicYears />}
                            {activeTab === 'terms' && <Terms />}
                            {activeTab === 'departments' && <Departments />}
                            {activeTab === 'classes' && <Classes />}
                            {activeTab === 'streams' && <Streams />}
                            {activeTab === 'subjects' && <Subjects />}
                            {activeTab === 'grading' && <GradingSystem />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
