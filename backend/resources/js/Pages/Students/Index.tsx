import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserAvatar from '@/Components/UserAvatar';
import type { LaravelPagination, PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRightLeft,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FileSpreadsheet,
    GraduationCap,
    Pencil,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

type EnrollmentSummary = {
    class_group?: { name?: string };
    academic_year?: { title?: string };
};

type StudentRow = {
    id: number;
    admission_number: string;
    first_name: string;
    last_name: string;
    status: string | null;
    phone?: string;
    email?: string;
    enrollments?: EnrollmentSummary[];
};

type StudentsProps = {
    students: LaravelPagination<StudentRow>;
    filters?: {
        search?: string;
        status?: string;
        class_group_id?: number | string;
    };
    classGroups?: { id: number; name: string }[];
};

export default function StudentsIndex() {
    const { students, filters, classGroups } = usePage<PageProps<StudentsProps>>().props;
    const { delete: destroy } = useForm();

    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [classGroupId, setClassGroupId] = useState(
        filters?.class_group_id ? String(filters.class_group_id) : '',
    );

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to archive student ${name}?`)) {
            destroy(route('students.destroy', id));
        }
    };

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            route('students.index'),
            {
                search: search || undefined,
                status: status || undefined,
                class_group_id: classGroupId || undefined,
            },
            { preserveState: true },
        );
    };

    const handleClassChange = (cgId: string) => {
        setClassGroupId(cgId);
        router.get(
            route('students.index'),
            {
                search: search || undefined,
                status: status || undefined,
                class_group_id: cgId || undefined,
            },
            { preserveState: true },
        );
    };

    const handleExport = () => {
        window.location.href = route('students.export');
    };

    const breadcrumbs = [
        { label: 'School Management', href: '/students' },
        { label: 'Students' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />

            <div className="school-app max-w-[1560px] mx-auto pb-8">
                {/* ─── Page Title Header (Stitch Design) ───────────────────── */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 leading-none">
                            SCHOOL MANAGEMENT
                        </p>
                        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
                            Students <span className="title-dot" />
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                            {students.total} students · 2026–2027 academic year
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
                        <Link
                            href={route('students.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
                        >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Add student</span>
                        </Link>
                    </div>
                </div>

                {/* ─── Sub-Tabs Bar ─────────────────────────────────────────────── */}
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <Link
                        href={route('students.index')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white shadow-xs dark:bg-slate-800"
                    >
                        <Users size={13} />
                        All Students
                    </Link>
                    <Link
                        href={route('students.promotions')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-border dark:bg-card dark:text-slate-300"
                    >
                        <GraduationCap size={13} className="text-blue-600" />
                        Promotion Wizard
                    </Link>
                    <Link
                        href={route('students.transfers')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-border dark:bg-card dark:text-slate-300"
                    >
                        <ArrowRightLeft size={13} className="text-blue-600" />
                        Student Transfers
                    </Link>
                    <Link
                        href={route('students.alumni')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-border dark:bg-card dark:text-slate-300"
                    >
                        <FileSpreadsheet size={13} className="text-blue-600" />
                        Alumni Directory
                    </Link>
                </div>

                {/* ─── Panel with Directory Table ───────────────────────────────── */}
                <div className="school-panel">
                    <div className="panel-heading">
                        <h2>Students directory</h2>
                        <span className="record-count">{students.total} records</span>
                    </div>

                    {/* Toolbar */}
                    <div className="directory-toolbar">
                        <form onSubmit={handleFilter} className="search-field">
                            <span className="text-xs text-slate-400">⌕</span>
                            <input
                                type="text"
                                placeholder="Search students by name, ID, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>

                        <div className="flex items-center gap-2">
                            <select
                                className="directory-select"
                                value={classGroupId}
                                onChange={(e) => handleClassChange(e.target.value)}
                            >
                                <option value="">All classes</option>
                                {(classGroups ?? []).map((cg) => (
                                    <option key={cg.id} value={cg.id}>
                                        {cg.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="directory-select"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    router.get(
                                        route('students.index'),
                                        {
                                            search: search || undefined,
                                            status: e.target.value || undefined,
                                            class_group_id: classGroupId || undefined,
                                        },
                                        { preserveState: true },
                                    );
                                }}
                            >
                                <option value="">All statuses</option>
                                <option value="active">Active</option>
                                <option value="applicant">Applicant</option>
                                <option value="suspended">Suspended</option>
                                <option value="graduated">Graduated</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-scroll">
                        <table className="school-table directory-table">
                            <thead>
                                <tr>
                                    <th>Student name</th>
                                    <th>Student ID</th>
                                    <th>Class</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            <p className="text-xs font-semibold">No students found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    students.data.map((student) => {
                                        const fullName = `${student.first_name} ${student.last_name}`;
                                        const enrollment = student.enrollments?.[0];
                                        const className = enrollment?.class_group?.name ?? 'Grade 10A';
                                        const initials = `${student.first_name[0] ?? ''}${student.last_name[0] ?? ''}`.toUpperCase();
                                        const isActive = (student.status ?? 'active').toLowerCase() === 'active';

                                        return (
                                            <tr key={student.id}>
                                                <td>
                                                    <div className="person-cell">
                                                        <UserAvatar name={fullName} initials={initials} size="sm" />
                                                        <div className="person-name">
                                                            <strong>{fullName}</strong>
                                                            <span>{student.email || student.phone || 'student@school.edu'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{student.admission_number}</td>
                                                <td>
                                                    <span className="class-tag">{className}</span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`status-pill ${
                                                            isActive ? 'positive' : 'pending'
                                                        }`}
                                                    >
                                                        <span className="status-pill-dot" />
                                                        {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="text-right">
                                                    <div className="row-actions justify-end">
                                                        <Link
                                                            href={route('students.show', student.id)}
                                                            title="View Profile"
                                                        >
                                                            <Eye size={13} />
                                                        </Link>
                                                        <Link
                                                            href={route('students.edit', student.id)}
                                                            title="Edit Details"
                                                        >
                                                            <Pencil size={13} />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(student.id, fullName)}
                                                            title="Archive Student"
                                                            className="action-delete"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>
                            {students.data.length > 0 ? `1–${students.data.length}` : '0'} of {students.total} records
                        </span>
                        <div>
                            <button
                                type="button"
                                disabled={students.current_page <= 1}
                                onClick={() =>
                                    students.prev_page_url && router.visit(students.prev_page_url)
                                }
                            >
                                <ChevronLeft size={13} />
                            </button>
                            <span>
                                Page {students.current_page} of {students.last_page}
                            </span>
                            <button
                                type="button"
                                disabled={students.current_page >= students.last_page}
                                onClick={() =>
                                    students.next_page_url && router.visit(students.next_page_url)
                                }
                            >
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
