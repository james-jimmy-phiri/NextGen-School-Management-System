import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
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
import { Toaster } from 'react-hot-toast';

interface Props extends PageProps {
    school: any;
    permissions: any;
    academic_years: any[];
    terms: any[];
    departments: any[];
    grade_levels: any[];
    class_groups: any[];
    streams: any[];
    subjects: any[];
    grading_systems: any[];
    teachers_list: any[];
    academic_years_list: any[];
    grade_levels_list: any[];
    class_groups_list: any[];
    departments_list: any[];
}

export default function SchoolSetupIndex(props: Props) {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [url]);

    const tabs = [
        { id: 'profile', label: 'School Profile', permission: props.permissions.can_edit_school },
        { id: 'academic_years', label: 'Academic Years', permission: props.permissions.can_manage_academic_years },
        { id: 'terms', label: 'Terms / Semesters', permission: props.permissions.can_manage_terms },
        { id: 'departments', label: 'Departments', permission: props.permissions.can_manage_subjects },
        { id: 'classes', label: 'Classes & Grade Levels', permission: props.permissions.can_manage_classes },
        { id: 'streams', label: 'Streams', permission: props.permissions.can_manage_classes },
        { id: 'subjects', label: 'Subjects', permission: props.permissions.can_manage_subjects },
        { id: 'grading', label: 'Grading System', permission: props.permissions.can_manage_grading },
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
            <Toaster position="top-right" />

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
                            {activeTab === 'profile' && <SchoolProfile initialData={props.school} />}
                            {activeTab === 'academic_years' && <AcademicYears years={props.academic_years} />}
                            {activeTab === 'terms' && <Terms terms={props.terms} academicYearsList={props.academic_years_list} />}
                            {activeTab === 'departments' && <Departments departments={props.departments} teachersList={props.teachers_list} />}
                            {activeTab === 'classes' && <Classes classGroups={props.class_groups} gradeLevels={props.grade_levels} academicYearsList={props.academic_years_list} gradeLevelsList={props.grade_levels_list} teachersList={props.teachers_list} />}
                            {activeTab === 'streams' && <Streams streams={props.streams} classGroupsList={props.class_groups_list} />}
                            {activeTab === 'subjects' && <Subjects subjects={props.subjects} departmentsList={props.departments_list} teachersList={props.teachers_list} />}
                            {activeTab === 'grading' && <GradingSystem gradingSystems={props.grading_systems} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
