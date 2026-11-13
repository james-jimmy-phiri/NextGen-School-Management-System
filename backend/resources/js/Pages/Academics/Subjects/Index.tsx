import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    BookOpen,
    Users,
    GraduationCap,
    Settings,
    ChevronRight,
    Search,
    Download,
    Pencil,
    ChevronLeft,
} from 'lucide-react';

interface Subject {
    id: number;
    name: string;
    code: string;
    gpa_weight: number;
    class_groups_count: number;
    students_count: number;
}

export default function Index({ subjects }: { subjects: Subject[] }) {
    const user = (usePage().props.auth as any).user;
    const canManageSchoolSetup =
        user?.permissions?.includes('school.manage') ||
        user?.permissions?.includes('settings.manage');

    const [searchTerm, setSearchTerm] = useState('');

    const filteredSubjects = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleExport = () => {
        const headers = ['ID', 'Subject Name', 'Code', 'GPA Weight', 'Classes', 'Students'];
        const csvRows = filteredSubjects.map((s) => [
            s.id,
            `"${s.name.replace(/"/g, '""')}"`,
            s.code,
            s.gpa_weight ?? 1.0,
            s.class_groups_count ?? 0,
            s.students_count ?? 0,
        ]);
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `subjects_directory_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const breadcrumbs = [
        { label: 'Academics', href: '/classes' },
        { label: 'Subjects' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Subjects" />

            <div className="school-app max-w-[1560px] mx-auto pb-8">
                {/* ─── Page Title Header (Stitch Design) ─────────────────────────── */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 leading-none">
                            ACADEMIC CURRICULUM
                        </p>
                        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
                            Subjects <span className="title-dot" />
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {subjects.length} subjects · 2026–2027 academic year
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:bg-slate-100 transition-all cursor-pointer dark:border-border dark:bg-card dark:text-slate-200 dark:hover:bg-muted"
                        >
                            <Download className="h-3.5 w-3.5 text-slate-500" />
                            <span>Export</span>
                        </button>
                        {canManageSchoolSetup && (
                            <Link
                                href={route('school-setup.index')}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
                            >
                                <Settings className="h-3.5 w-3.5" />
                                <span>Setup subjects</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* ─── Panel with Directory Table ───────────────────────────────── */}
                <div className="school-panel">
                    <div className="panel-heading">
                        <h2>Subjects directory</h2>
                        <span className="record-count">{subjects.length} records</span>
                    </div>

                    {/* Toolbar */}
                    <div className="directory-toolbar">
                        <div className="search-field">
                            <span className="text-xs text-slate-400">⌕</span>
                            <input
                                type="text"
                                placeholder="Search subjects by name or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-scroll">
                        <table className="school-table directory-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Code</th>
                                    <th>GPA Weight</th>
                                    <th>Assigned Classes</th>
                                    <th>Enrolled Learners</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                            <p className="text-xs font-semibold">No subjects found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubjects.map((sub) => (
                                        <tr key={sub.id}>
                                            <td>
                                                <div className="person-cell">
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100 dark:bg-blue-950 dark:text-blue-300">
                                                        <BookOpen size={13} />
                                                    </span>
                                                    <div className="person-name">
                                                        <strong>{sub.name}</strong>
                                                        <span>Course syllabus</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="class-tag">{sub.code}</span>
                                            </td>
                                            <td className="text-slate-600 dark:text-slate-300">
                                                {Number(sub.gpa_weight ?? 1.0).toFixed(1)}x
                                            </td>
                                            <td>
                                                <strong className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {sub.class_groups_count ?? 0}
                                                </strong>{' '}
                                                <span className="text-[10px] text-slate-400">cohorts</span>
                                            </td>
                                            <td>
                                                <strong className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {sub.students_count ?? 0}
                                                </strong>{' '}
                                                <span className="text-[10px] text-slate-400">learners</span>
                                            </td>
                                            <td>
                                                <span className="status-pill positive">
                                                    <span className="status-pill-dot" />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <div className="row-actions justify-end">
                                                    <Link
                                                        href={route('academics.subjects.show', sub.id)}
                                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 px-2 py-1"
                                                    >
                                                        <span>View details</span>
                                                        <ChevronRight size={13} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>
                            {filteredSubjects.length > 0 ? `1–${filteredSubjects.length}` : '0'} of {subjects.length} records
                        </span>
                        <div>
                            <button type="button" disabled>
                                <ChevronLeft size={13} />
                            </button>
                            <span>Page 1 of 1</span>
                            <button type="button" disabled>
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
