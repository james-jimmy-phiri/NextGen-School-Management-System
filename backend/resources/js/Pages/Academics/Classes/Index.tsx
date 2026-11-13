import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Users,
    BookOpen,
    GraduationCap,
    ArrowRight,
    Settings,
    ChevronLeft,
    ChevronRight,
    Layers,
    Search,
    Download,
    Plus,
    Building2,
    Calendar,
    Pencil,
    LayoutGrid,
    List,
} from 'lucide-react';

interface Stream {
    id: number;
    name: string;
    capacity: number;
}

interface ClassGroup {
    id: number;
    name: string;
    room?: string;
    grade_level: { id: number; label: string; code: string };
    academic_year: { id: number; title: string; is_current: boolean };
    streams: Stream[];
    enrollments_count: number;
}

export default function Index({ classes }: { classes: ClassGroup[] }) {
    const user = (usePage().props.auth as any).user;
    const canManageSchoolSetup =
        user?.permissions?.includes('school.manage') ||
        user?.permissions?.includes('settings.manage');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('ALL');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const gradeLevels = useMemo(() => {
        const grades = new Set<string>();
        classes.forEach((c) => {
            if (c.grade_level?.label) grades.add(c.grade_level.label);
        });
        return Array.from(grades);
    }, [classes]);

    const filteredClasses = useMemo(() => {
        return classes.filter((cls) => {
            const matchesQuery =
                cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.grade_level?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (cls.room && cls.room.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesGrade = selectedGrade === 'ALL' || cls.grade_level?.label === selectedGrade;
            return matchesQuery && matchesGrade;
        });
    }, [classes, searchQuery, selectedGrade]);

    const handleExport = () => {
        const headers = ['ID', 'Class Name', 'Grade Level', 'Room', 'Students', 'Streams'];
        const csvRows = filteredClasses.map((c) => [
            c.id,
            `"${c.name.replace(/"/g, '""')}"`,
            c.grade_level?.label ?? '',
            c.room ?? '—',
            c.enrollments_count,
            c.streams?.length ?? 0,
        ]);
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `classes_directory_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const breadcrumbs = [
        { label: 'Academics', href: '/classes' },
        { label: 'Classes & Subjects' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes & Subjects" />

            <div className="school-app max-w-[1560px] mx-auto pb-8">
                {/* ─── Page Title Header (Stitch Design) ─────────────────────────── */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 leading-none">
                            ACADEMIC CURRICULUM
                        </p>
                        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
                            Classes &amp; Subjects <span className="title-dot" />
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {classes.length} classes · 2026–2027 academic year
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
                                <span>Setup classes</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* ─── Panel with Directory Table ───────────────────────────────── */}
                <div className="school-panel">
                    <div className="panel-heading">
                        <h2>Classes directory</h2>
                        <div className="flex items-center gap-2">
                            <div className="segmented">
                                <button
                                    type="button"
                                    className={viewMode === 'table' ? 'selected' : ''}
                                    onClick={() => setViewMode('table')}
                                    title="Table view"
                                >
                                    <List size={13} />
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'grid' ? 'selected' : ''}
                                    onClick={() => setViewMode('grid')}
                                    title="Grid cards view"
                                >
                                    <LayoutGrid size={13} />
                                </button>
                            </div>
                            <span className="record-count">{classes.length} records</span>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="directory-toolbar">
                        <div className="search-field">
                            <span className="text-xs text-slate-400">⌕</span>
                            <input
                                type="text"
                                placeholder="Search classes or room..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <select
                            className="directory-select"
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                            <option value="ALL">All grades</option>
                            {gradeLevels.map((lvl) => (
                                <option key={lvl} value={lvl}>
                                    {lvl}
                                </option>
                            ))}
                        </select>
                    </div>

                    {viewMode === 'table' ? (
                        <div className="table-scroll">
                            <table className="school-table directory-table">
                                <thead>
                                    <tr>
                                        <th>Class Name</th>
                                        <th>Grade Level</th>
                                        <th>Room</th>
                                        <th>Students</th>
                                        <th>Streams</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClasses.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-400">
                                                <p className="text-xs font-semibold">No classes found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredClasses.map((cls) => (
                                            <tr key={cls.id}>
                                                <td>
                                                    <div className="person-cell">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100 dark:bg-blue-950 dark:text-blue-300">
                                                            <Building2 size={13} />
                                                        </span>
                                                        <div className="person-name">
                                                            <strong>{cls.name}</strong>
                                                            <span>{cls.academic_year?.title || 'Current Year'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="class-tag">
                                                        {cls.grade_level?.label ?? 'Form 1'}
                                                    </span>
                                                </td>
                                                <td className="text-slate-600 dark:text-slate-300">
                                                    {cls.room || 'Room 101'}
                                                </td>
                                                <td>
                                                    <strong className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {cls.enrollments_count}
                                                    </strong>{' '}
                                                    <span className="text-[10px] text-slate-400">learners</span>
                                                </td>
                                                <td>
                                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                                        {cls.streams?.length ?? 0} divisions
                                                    </span>
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
                                                            href={route('academics.classes.manage', cls.id)}
                                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 px-2 py-1"
                                                        >
                                                            <span>Manage</span>
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
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {filteredClasses.map((cls) => (
                                <Link
                                    key={cls.id}
                                    href={route('academics.classes.manage', cls.id)}
                                    className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all dark:border-border dark:bg-card"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="class-tag">{cls.grade_level?.label}</span>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                                                {cls.name}
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                {cls.room || 'Main Hall'} · {cls.academic_year?.title || '2026-2027'}
                                            </p>
                                        </div>
                                        <ChevronRight size={15} className="text-slate-400 mt-1" />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-border">
                                        <span className="text-slate-500 font-medium">
                                            <strong className="text-slate-900 dark:text-white">{cls.enrollments_count}</strong> students
                                        </span>
                                        <span className="text-blue-600 font-semibold">
                                            {cls.streams?.length ?? 0} streams
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="pagination">
                        <span>
                            {filteredClasses.length > 0 ? `1–${filteredClasses.length}` : '0'} of {classes.length} records
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
