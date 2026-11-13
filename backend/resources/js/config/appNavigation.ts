import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    AlertTriangle,
    Award,
    BarChart3,
    Bell,
    BookOpen,
    Building2,
    Calendar,
    CirclePlus,
    ClipboardCheck,
    ClipboardList,
    Clock,
    Cog,
    Database,
    FileBarChart,
    FileSearch,
    FileText,
    FolderOpen,
    GraduationCap,
    HeartHandshake,
    HeartPulse,
    KeyRound,
    LayoutDashboard,
    LibraryBig,
    LineChart,
    Mail,
    Megaphone,
    MessageCircle,
    Monitor,
    PieChart,
    Receipt,
    School,
    Settings2,
    Shield,
    Smartphone,
    Stethoscope,
    UserPlus,
    Users,
    Wallet,
} from 'lucide-react';

export type NavContext = {
    roles: string[];
    permissions: string[];
    hasSchool: boolean;
    isSuperAdmin: boolean;
    isOperationalLead: boolean;
    canViewUsers: boolean;
    canCreateUsers: boolean;
    canManageRoles: boolean;
    canViewAuditLogs: boolean;
    canCaptureAttendance: boolean;
    canViewFinance: boolean;
    canManageFinance: boolean;
    canViewStudents: boolean;
    canCreateStudents: boolean;
    canEditStudents: boolean;
    canManageAdmissions: boolean;
    canViewAcademics: boolean;
    canManageAcademics: boolean;
    canViewSchoolSetup: boolean;
    canViewCommunication: boolean;
    canViewLibrary: boolean;
    canViewHealth: boolean;
    canViewDiscipline: boolean;
    canViewStaff: boolean;
    canViewSettings: boolean;
    isParent: boolean;
    offlineAttendanceReady?: boolean;
};

export type NavLeafConfig = {
    kind: 'leaf';
    label: string;
    icon: LucideIcon;
    routeName?: string;
    routeParams?: Record<string, any>;
    erpPageKey?: string;
    requiredPermission?: string;
    requiredRoles?: string[];
    requiresSchool?: boolean;
    description?: string;
    highlight?: boolean | ((c: NavContext) => boolean);
    visible?: (c: NavContext) => boolean;
};

export type NavBranchConfig = {
    kind: 'branch';
    id: string;
    label: string;
    icon: LucideIcon;
    requiredPermission?: string;
    requiredRoles?: string[];
    requiresSchool?: boolean;
    description?: string;
    children: NavLeafConfig[];
    visible?: (c: NavContext) => boolean;
};

export type NavBlockConfig = NavLeafConfig | NavBranchConfig;

const staff: (c: NavContext) => boolean = (c) => !c.isParent;

export const defaultNavBlocks: NavBlockConfig[] = [
    {
        kind: 'branch',
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'System overview and activity analytics',
        visible: staff,
        children: [
            {
                kind: 'leaf',
                label: 'Overview',
                icon: LayoutDashboard,
                routeName: 'dashboard',
                description: 'Main operational dashboard overview',
            },
            {
                kind: 'leaf',
                label: 'Analytics',
                icon: LineChart,
                routeName: 'dashboard.analytics',
                description: 'Platform metrics and statistical breakdown',
            },
            {
                kind: 'leaf',
                label: 'Activity logs',
                icon: Activity,
                routeName: 'dashboard.activity',
                requiredPermission: 'audit.view',
                description: 'Operational and system audit log trail',
                visible: (c) => c.canViewAuditLogs,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'identity-access',
        label: 'Identity & access',
        icon: Shield,
        description: 'Manage users, role permissions, and access controls',
        visible: (c) =>
            staff(c) &&
            (c.canViewUsers || c.canCreateUsers || c.canManageRoles || c.canViewAuditLogs),
        children: [
            {
                kind: 'leaf',
                label: 'All users',
                icon: Users,
                routeName: 'users.index',
                requiredPermission: 'users.view',
                description: 'View platform users or school users scoped by authority',
                visible: (c) => c.canViewUsers,
            },
            {
                kind: 'leaf',
                label: 'Add user',
                icon: UserPlus,
                routeName: 'users.create',
                requiredPermission: 'users.create',
                description: 'Create new user account with role assignment',
                visible: (c) => c.canCreateUsers,
            },
            {
                kind: 'leaf',
                label: 'Roles',
                icon: Shield,
                routeName: 'roles.index',
                requiredPermission: 'roles.manage',
                description: 'Role catalog and permission configuration',
                visible: (c) => c.canManageRoles,
            },
            {
                kind: 'leaf',
                label: 'New role',
                icon: CirclePlus,
                routeName: 'roles.create',
                requiredPermission: 'roles.manage',
                description: 'Create new customized security role',
                visible: (c) => c.canManageRoles,
            },
            {
                kind: 'leaf',
                label: 'Permissions',
                icon: KeyRound,
                routeName: 'permissions.index',
                requiredPermission: 'roles.manage',
                description: 'Permission directory and capabilities mapping',
                visible: (c) => c.canManageRoles,
            },
            {
                kind: 'leaf',
                label: 'New permission',
                icon: CirclePlus,
                routeName: 'permissions.create',
                requiredPermission: 'roles.manage',
                description: 'Register fine-grained system permission',
                visible: (c) => c.canManageRoles,
            },
            {
                kind: 'leaf',
                label: 'Audit logs',
                icon: FileSearch,
                routeName: 'audit-logs.index',
                requiredPermission: 'audit.view',
                description: 'Full security and data change audit logs',
                visible: (c) => c.canViewAuditLogs,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'superadmin',
        label: 'Super admin',
        icon: Monitor,
        requiredRoles: ['super_admin'],
        description: 'Multi-school platform management and tenant oversight',
        visible: (c) => staff(c) && c.isSuperAdmin,
        children: [
            {
                kind: 'leaf',
                label: 'All schools',
                icon: Building2,
                routeName: 'schools.index',
                requiredRoles: ['super_admin'],
                description: 'Listing of all tenant schools on the platform',
            },
            {
                kind: 'leaf',
                label: 'Add school',
                icon: CirclePlus,
                routeName: 'schools.create',
                requiredRoles: ['super_admin'],
                description: 'Provision a new tenant school',
            },
            {
                kind: 'leaf',
                label: 'System monitoring',
                icon: Activity,
                erpPageKey: 'superadmin-monitoring',
                requiredRoles: ['super_admin'],
                description: 'Infrastructure latency and queue telemetry',
            },
            {
                kind: 'leaf',
                label: 'Subscriptions',
                icon: Receipt,
                erpPageKey: 'superadmin-subscriptions',
                requiredRoles: ['super_admin'],
                description: 'School subscription tiers and billing status',
            },
            {
                kind: 'leaf',
                label: 'Support tickets',
                icon: MessageCircle,
                erpPageKey: 'superadmin-support',
                requiredRoles: ['super_admin'],
                description: 'School administrator helpdesk inquiries',
            },
        ],
    },
    {
        kind: 'branch',
        id: 'school-setup',
        label: 'School setup',
        icon: School,
        requiresSchool: true,
        requiredPermission: 'school_setup.view',
        description: 'School configuration, academic calendar, and class hierarchy',
        visible: (c) => staff(c) && c.hasSchool && c.canViewSchoolSetup,
        children: [
            {
                kind: 'leaf',
                label: 'School profile',
                icon: Building2,
                routeName: 'school-setup.index',
                routeParams: { tab: 'profile' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Document numbers',
                icon: FileText,
                routeName: 'school-setup.index',
                routeParams: { tab: 'numbering' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Communication',
                icon: Mail,
                routeName: 'school-setup.index',
                routeParams: { tab: 'communication' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Academic years',
                icon: ClipboardList,
                routeName: 'school-setup.index',
                routeParams: { tab: 'academic_years' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Terms / semesters',
                icon: ClipboardList,
                routeName: 'school-setup.index',
                routeParams: { tab: 'terms' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Classes',
                icon: Users,
                routeName: 'school-setup.index',
                routeParams: { tab: 'classes' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Streams / sections',
                icon: Users,
                routeName: 'school-setup.index',
                routeParams: { tab: 'streams' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Subjects',
                icon: BookOpen,
                routeName: 'school-setup.index',
                routeParams: { tab: 'subjects' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Departments',
                icon: Building2,
                routeName: 'school-setup.index',
                routeParams: { tab: 'departments' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
            {
                kind: 'leaf',
                label: 'Grading system',
                icon: PieChart,
                routeName: 'school-setup.index',
                routeParams: { tab: 'grading' },
                requiresSchool: true,
                requiredPermission: 'school_setup.view',
            },
        ],
    },
    {
        kind: 'branch',
        id: 'students',
        label: 'Students',
        icon: GraduationCap,
        requiresSchool: true,
        requiredPermission: 'students.view',
        description: 'Learner registry, admissions, transfers, and guardian links',
        visible: (c) => staff(c) && c.hasSchool && c.canViewStudents,
        children: [
            {
                kind: 'leaf',
                label: 'Student list',
                icon: Users,
                routeName: 'students.index',
                requiresSchool: true,
                requiredPermission: 'students.view',
                visible: (c) => c.canViewStudents,
            },
            {
                kind: 'leaf',
                label: 'Admissions',
                icon: UserPlus,
                routeName: 'admissions.index',
                requiresSchool: true,
                requiredPermission: 'admissions.manage',
                visible: (c) => c.canManageAdmissions,
            },
            {
                kind: 'leaf',
                label: 'Registration',
                icon: UserPlus,
                routeName: 'students.create',
                requiresSchool: true,
                requiredPermission: 'students.create',
                visible: (c) => c.canCreateStudents,
            },
            {
                kind: 'leaf',
                label: 'Import students',
                icon: Database,
                routeName: 'students.import.create',
                requiresSchool: true,
                requiredPermission: 'students.create',
                visible: (c) => c.canCreateStudents,
            },
            {
                kind: 'leaf',
                label: 'Guardians / parents',
                icon: HeartHandshake,
                routeName: 'guardians.index',
                requiresSchool: true,
                requiredPermission: 'students.view',
                visible: (c) => c.canViewStudents,
            },
            {
                kind: 'leaf',
                label: 'Promotion',
                icon: GraduationCap,
                routeName: 'students.promotions',
                requiresSchool: true,
                requiredPermission: 'students.edit',
                visible: (c) => c.canEditStudents,
            },
            {
                kind: 'leaf',
                label: 'Alumni',
                icon: GraduationCap,
                routeName: 'students.alumni',
                requiresSchool: true,
                requiredPermission: 'students.view',
                visible: (c) => c.canViewStudents,
            },
            {
                kind: 'leaf',
                label: 'Transfers',
                icon: Users,
                routeName: 'students.transfers',
                requiresSchool: true,
                requiredPermission: 'students.edit',
                visible: (c) => c.canEditStudents,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'academics',
        label: 'Academics',
        icon: BookOpen,
        requiresSchool: true,
        requiredPermission: 'assessments.view',
        description: 'Classes, curriculum, timetable, assessments, and marks',
        visible: (c) => staff(c) && c.hasSchool && c.canViewAcademics,
        children: [
            {
                kind: 'leaf',
                label: 'Subjects',
                icon: BookOpen,
                routeName: 'academics.subjects.index',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Classes',
                icon: Users,
                routeName: 'academics.classes.index',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Streams',
                icon: Users,
                erpPageKey: 'academics-streams',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Timetable',
                icon: ClipboardList,
                routeName: 'timetables.index',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Assignments',
                icon: ClipboardList,
                erpPageKey: 'academics-assignments',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Exams',
                icon: FileBarChart,
                erpPageKey: 'academics-exams',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Marks entry',
                icon: PieChart,
                routeName: 'academics.marks.index',
                requiresSchool: true,
                requiredPermission: 'assessments.manage',
                visible: (c) => c.canManageAcademics,
            },
            {
                kind: 'leaf',
                label: 'Results',
                icon: BarChart3,
                erpPageKey: 'academics-results',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Report cards',
                icon: FileBarChart,
                erpPageKey: 'academics-report-cards',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Academic reports',
                icon: LineChart,
                erpPageKey: 'academics-reports',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'attendance',
        label: 'Attendance',
        icon: ClipboardCheck,
        requiresSchool: true,
        requiredPermission: 'attendance.view',
        description: 'Daily roll call, electronic register, and trends',
        visible: (c) => staff(c) && c.hasSchool && c.canCaptureAttendance,
        children: [
            {
                kind: 'leaf',
                label: 'Student attendance',
                icon: ClipboardCheck,
                routeName: 'attendance.index',
                requiresSchool: true,
                highlight: (c) => !!c.offlineAttendanceReady,
            },
            {
                kind: 'leaf',
                label: 'Mark attendance',
                icon: ClipboardList,
                routeName: 'attendance.mark',
                requiresSchool: true,
                requiredPermission: 'attendance.manage',
            },
            {
                kind: 'leaf',
                label: 'Teacher attendance',
                icon: Users,
                erpPageKey: 'attendance-teacher',
                requiresSchool: true,
                visible: (c) => c.canViewStaff,
            },
            {
                kind: 'leaf',
                label: 'Reports',
                icon: FileBarChart,
                erpPageKey: 'attendance-reports',
                requiresSchool: true,
            },
            {
                kind: 'leaf',
                label: 'Analytics',
                icon: BarChart3,
                erpPageKey: 'attendance-analytics',
                requiresSchool: true,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'finance',
        label: 'Finance',
        icon: Wallet,
        requiresSchool: true,
        requiredPermission: 'finance.view',
        description: 'Fee structures, invoices, payment receipts, and balance reports',
        visible: (c) => staff(c) && c.hasSchool && c.canViewFinance,
        children: [
            {
                kind: 'leaf',
                label: 'Fee structures',
                icon: Receipt,
                routeName: 'finance.fee-structures.index',
                requiresSchool: true,
                requiredPermission: 'finance.view',
                visible: (c) => c.canViewFinance,
            },
            {
                kind: 'leaf',
                label: 'Invoices',
                icon: FileBarChart,
                routeName: 'finance.invoices.index',
                requiresSchool: true,
                requiredPermission: 'finance.view',
                visible: (c) => c.canViewFinance,
            },
            {
                kind: 'leaf',
                label: 'Payments',
                icon: Wallet,
                routeName: 'finance.payments.index',
                requiresSchool: true,
                requiredPermission: 'finance.view',
                visible: (c) => c.canViewFinance,
            },
            {
                kind: 'leaf',
                label: 'Balances',
                icon: PieChart,
                erpPageKey: 'finance-balances',
                requiresSchool: true,
                requiredPermission: 'finance.view',
                visible: (c) => c.canViewFinance,
            },
            {
                kind: 'leaf',
                label: 'Discounts & scholarships',
                icon: HeartHandshake,
                erpPageKey: 'finance-discounts',
                requiresSchool: true,
                requiredPermission: 'finance.manage',
                visible: (c) => c.canManageFinance,
            },
            {
                kind: 'leaf',
                label: 'Expenses',
                icon: Receipt,
                erpPageKey: 'finance-expenses',
                requiresSchool: true,
                requiredPermission: 'finance.manage',
                visible: (c) => c.canManageFinance,
            },
            {
                kind: 'leaf',
                label: 'Financial reports',
                icon: LineChart,
                erpPageKey: 'finance-reports',
                requiresSchool: true,
                requiredPermission: 'finance.view',
                visible: (c) => c.canViewFinance,
            },
            {
                kind: 'leaf',
                label: 'Integrations',
                icon: Cog,
                erpPageKey: 'finance-integrations',
                requiresSchool: true,
                requiredPermission: 'finance.manage',
                visible: (c) => c.canManageFinance,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'communication',
        label: 'Communication',
        icon: Megaphone,
        requiresSchool: true,
        requiredPermission: 'communication.manage',
        description: 'School announcements, events calendar, and messaging',
        visible: (c) => staff(c) && c.hasSchool && c.canViewCommunication,
        children: [
            {
                kind: 'leaf',
                label: 'Announcements',
                icon: Megaphone,
                routeName: 'announcements.index',
                requiresSchool: true,
            },
            {
                kind: 'leaf',
                label: 'School calendar',
                icon: Calendar,
                routeName: 'calendar-events.index',
                requiresSchool: true,
            },
            {
                kind: 'leaf',
                label: 'SMS center',
                icon: Smartphone,
                erpPageKey: 'communication-sms',
                requiresSchool: true,
            },
            {
                kind: 'leaf',
                label: 'Emails',
                icon: Mail,
                erpPageKey: 'communication-email',
                requiresSchool: true,
            },
            {
                kind: 'leaf',
                label: 'Push notifications',
                icon: Bell,
                erpPageKey: 'communication-push',
                requiresSchool: true,
            },
            {
                kind: 'leaf',
                label: 'Messaging',
                icon: MessageCircle,
                erpPageKey: 'communication-messaging',
                requiresSchool: true,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'staff',
        label: 'Staff',
        icon: Users,
        requiresSchool: true,
        description: 'Employee profiles, payroll, and performance records',
        visible: (c) => staff(c) && c.hasSchool && c.canViewStaff,
        children: [
            { kind: 'leaf', label: 'Staff directory', icon: Users, erpPageKey: 'staff-directory', requiresSchool: true },
            { kind: 'leaf', label: 'Departments', icon: Building2, erpPageKey: 'staff-departments', requiresSchool: true },
            { kind: 'leaf', label: 'Leave management', icon: ClipboardList, erpPageKey: 'staff-leave', requiresSchool: true },
            { kind: 'leaf', label: 'Payroll', icon: Wallet, erpPageKey: 'staff-payroll', requiresSchool: true },
            { kind: 'leaf', label: 'Staff attendance', icon: ClipboardCheck, erpPageKey: 'staff-attendance', requiresSchool: true },
            { kind: 'leaf', label: 'Performance reviews', icon: BarChart3, erpPageKey: 'staff-performance', requiresSchool: true },
        ],
    },
    {
        kind: 'branch',
        id: 'library',
        label: 'Library',
        icon: LibraryBig,
        requiresSchool: true,
        requiredPermission: 'library.view',
        description: 'Book catalog, circulation, borrowing, and overdue fines',
        visible: (c) => staff(c) && c.hasSchool && c.canViewLibrary,
        children: [
            { kind: 'leaf', label: 'Book catalog', icon: BookOpen, erpPageKey: 'library-catalog', requiresSchool: true },
            { kind: 'leaf', label: 'Borrowing', icon: ClipboardList, erpPageKey: 'library-borrowing', requiresSchool: true },
            { kind: 'leaf', label: 'Fines', icon: Receipt, erpPageKey: 'library-fines', requiresSchool: true },
            { kind: 'leaf', label: 'Reports', icon: FileBarChart, erpPageKey: 'library-reports', requiresSchool: true },
        ],
    },
    {
        kind: 'branch',
        id: 'discipline',
        label: 'Discipline',
        icon: AlertTriangle,
        requiresSchool: true,
        description: 'Incident logs, behavior tracking, and student merit awards',
        visible: (c) => staff(c) && c.hasSchool && c.canViewDiscipline,
        children: [
            { kind: 'leaf', label: 'Incident reports', icon: AlertTriangle, erpPageKey: 'discipline-incidents', requiresSchool: true },
            { kind: 'leaf', label: 'Punishments', icon: Shield, erpPageKey: 'discipline-punishments', requiresSchool: true },
            { kind: 'leaf', label: 'Behavior tracking', icon: Activity, erpPageKey: 'discipline-behavior', requiresSchool: true },
            { kind: 'leaf', label: 'Student awards', icon: Award, routeName: 'student-awards.index', requiresSchool: true },
        ],
    },
    {
        kind: 'branch',
        id: 'health',
        label: 'Health center',
        icon: HeartPulse,
        requiresSchool: true,
        requiredPermission: 'health.view',
        description: 'Student medical profiles and clinic visit logs',
        visible: (c) => staff(c) && c.hasSchool && c.canViewHealth,
        children: [
            { kind: 'leaf', label: 'Medical records', icon: Stethoscope, erpPageKey: 'health-records', requiresSchool: true },
            { kind: 'leaf', label: 'Clinic visits', icon: HeartPulse, routeName: 'clinic-visits.index', requiresSchool: true },
            { kind: 'leaf', label: 'Emergency contacts', icon: Bell, erpPageKey: 'health-emergency', requiresSchool: true },
        ],
    },
    {
        kind: 'branch',
        id: 'documents',
        label: 'Documents',
        icon: FolderOpen,
        requiresSchool: true,
        description: 'Student archives, certificates, and compliance files',
        visible: (c) => staff(c) && c.hasSchool && (c.canViewStudents || c.canViewStaff),
        children: [
            { kind: 'leaf', label: 'Student documents', icon: FolderOpen, erpPageKey: 'documents-students', requiresSchool: true },
            { kind: 'leaf', label: 'Staff documents', icon: FolderOpen, erpPageKey: 'documents-staff', requiresSchool: true },
            { kind: 'leaf', label: 'Downloads', icon: Database, erpPageKey: 'documents-downloads', requiresSchool: true },
        ],
    },
    {
        kind: 'branch',
        id: 'reports',
        label: 'Reports',
        icon: FileBarChart,
        requiresSchool: true,
        description: 'Consolidated reporting and data exports',
        visible: (c) => staff(c) && c.hasSchool && (c.canViewAcademics || c.canViewFinance || c.canCaptureAttendance),
        children: [
            {
                kind: 'leaf',
                label: 'Academic reports',
                icon: FileBarChart,
                erpPageKey: 'reports-academic',
                requiresSchool: true,
                visible: (c) => c.canViewAcademics,
            },
            {
                kind: 'leaf',
                label: 'Attendance reports',
                icon: ClipboardCheck,
                erpPageKey: 'reports-attendance',
                requiresSchool: true,
                visible: (c) => c.canCaptureAttendance,
            },
            {
                kind: 'leaf',
                label: 'Financial reports',
                icon: Wallet,
                erpPageKey: 'reports-financial',
                requiresSchool: true,
                visible: (c) => c.canViewFinance,
            },
            {
                kind: 'leaf',
                label: 'Enrollment reports',
                icon: Users,
                erpPageKey: 'reports-enrollment',
                requiresSchool: true,
                visible: (c) => c.canViewStudents,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'settings',
        label: 'Settings',
        icon: Settings2,
        requiresSchool: true,
        requiredPermission: 'settings.manage',
        description: 'School branding, integrations, and backup configuration',
        visible: (c) => staff(c) && c.hasSchool && c.canViewSettings,
        children: [
            { kind: 'leaf', label: 'General', icon: Cog, erpPageKey: 'settings-general', requiresSchool: true },
            { kind: 'leaf', label: 'Academic', icon: BookOpen, erpPageKey: 'settings-academic', requiresSchool: true },
            { kind: 'leaf', label: 'Notifications', icon: Bell, erpPageKey: 'settings-notifications', requiresSchool: true },
            { kind: 'leaf', label: 'Integrations', icon: Database, erpPageKey: 'settings-integrations', requiresSchool: true },
            { kind: 'leaf', label: 'Backup & restore', icon: Database, erpPageKey: 'settings-backup', requiresSchool: true },
        ],
    },
    {
        kind: 'branch',
        id: 'my-school',
        label: 'My school',
        icon: School,
        requiresSchool: true,
        description: 'School institutional identity and basic info',
        visible: (c) =>
            staff(c) &&
            c.hasSchool &&
            !c.isSuperAdmin &&
            c.roles.some((r) => ['school_director', 'school_admin'].includes(r)),
        children: [
            { kind: 'leaf', label: 'School profile', icon: Building2, routeName: 'schools.index', requiresSchool: true },
        ],
    },
    {
        kind: 'branch',
        id: 'parent-app',
        label: 'Parent portal',
        icon: HeartHandshake,
        description: 'Guardian portal for ward attendance, fees, and results',
        visible: (c) => c.isParent,
        children: [
            { kind: 'leaf', label: 'My children', icon: Users, routeName: 'portal.parent' },
            { kind: 'leaf', label: 'Child Profile', icon: UserPlus, routeName: 'portal.children.show', visible: () => false },
            { kind: 'leaf', label: 'Attendance', icon: Clock, routeName: 'portal.children.attendance', visible: () => false },
            { kind: 'leaf', label: 'Academics', icon: BookOpen, routeName: 'portal.children.academics', visible: () => false },
            { kind: 'leaf', label: 'Finances', icon: Wallet, routeName: 'portal.children.fees', visible: () => false },
            { kind: 'leaf', label: 'Behaviour', icon: Activity, routeName: 'portal.children.behaviour', visible: () => false },
            { kind: 'leaf', label: 'Health', icon: HeartPulse, routeName: 'portal.children.health', visible: () => false },
            { kind: 'leaf', label: 'Documents', icon: FileText, routeName: 'portal.children.documents', visible: () => false },
            { kind: 'leaf', label: 'Timetable', icon: Calendar, routeName: 'portal.children.timetable', visible: () => false },
            { kind: 'leaf', label: 'Fee statements', icon: Wallet, erpPageKey: 'portal-fee-statements' },
            { kind: 'leaf', label: 'Messages', icon: MessageCircle, routeName: 'portal.messages' },
            { kind: 'leaf', label: 'Announcements', icon: Megaphone, routeName: 'portal.announcements' },
            { kind: 'leaf', label: 'Calendar', icon: Calendar, routeName: 'portal.calendar' },
            { kind: 'leaf', label: 'Profile', icon: Settings2, routeName: 'portal.profile', visible: () => false },
        ],
    },
];

export type PermissionGuideEntry = {
    menu: string;
    submenu: string;
    routeOrKey: string;
    requiredPermission: string;
    requiresSchool: boolean;
    allowedRoles: string[];
    description: string;
};

/**
 * Clean Directory mapping exactly which permission, school context, and roles are able to see each menu & page.
 */
export const NAVIGATION_PERMISSIONS_DIRECTORY: PermissionGuideEntry[] = [
    // Identity & Access
    {
        menu: 'Identity & access',
        submenu: 'All users',
        routeOrKey: 'users.index',
        requiredPermission: 'users.view',
        requiresSchool: false,
        allowedRoles: ['super_admin (Platform)', 'school_director (School)', 'school_admin (School)'],
        description: 'Platform Super Admin views all platform & school admins. School Admin views school users only.',
    },
    {
        menu: 'Identity & access',
        submenu: 'Add user',
        routeOrKey: 'users.create',
        requiredPermission: 'users.create',
        requiresSchool: false,
        allowedRoles: ['super_admin (Platform)', 'school_director (School)', 'school_admin (School)'],
        description: 'Platform admin creates system/school users; school admin creates school users with multi-roles.',
    },
    {
        menu: 'Identity & access',
        submenu: 'Roles',
        routeOrKey: 'roles.index',
        requiredPermission: 'roles.manage',
        requiresSchool: false,
        allowedRoles: ['super_admin (Platform)', 'school_director (School)'],
        description: 'Configure roles and define whether roles require mandatory school assignment.',
    },
    {
        menu: 'Identity & access',
        submenu: 'Permissions',
        routeOrKey: 'permissions.index',
        requiredPermission: 'roles.manage',
        requiresSchool: false,
        allowedRoles: ['super_admin (Platform)', 'school_director (School)'],
        description: 'View and audit all granular permission capabilities.',
    },
    {
        menu: 'Identity & access',
        submenu: 'Audit logs',
        routeOrKey: 'audit-logs.index',
        requiredPermission: 'audit.view',
        requiresSchool: false,
        allowedRoles: ['super_admin (Platform)', 'school_director (School)'],
        description: 'System-wide or school-scoped audit logs and user activity tracking.',
    },

    // Super Admin Platform
    {
        menu: 'Super admin',
        submenu: 'All schools',
        routeOrKey: 'schools.index',
        requiredPermission: 'platform.manage',
        requiresSchool: false,
        allowedRoles: ['super_admin (Platform only)'],
        description: 'View and manage all tenant schools across the platform.',
    },
    {
        menu: 'Super admin',
        submenu: 'Add school',
        routeOrKey: 'schools.create',
        requiredPermission: 'platform.manage',
        requiresSchool: false,
        allowedRoles: ['super_admin (Platform only)'],
        description: 'Onboard and provision new schools.',
    },

    // School Setup (School Context Mandatory)
    {
        menu: 'School setup',
        submenu: 'All Setup Tabs (Profile, Academic Years, Terms, Classes, Streams, Subjects, Grading)',
        routeOrKey: 'school-setup.index',
        requiredPermission: 'school_setup.view',
        requiresSchool: true,
        allowedRoles: ['school_director', 'school_admin'],
        description: 'Manage school structure. Hidden from platform super admin and unpermitted staff.',
    },

    // Students (School Context Mandatory)
    {
        menu: 'Students',
        submenu: 'Student list',
        routeOrKey: 'students.index',
        requiredPermission: 'students.view',
        requiresSchool: true,
        allowedRoles: ['school_director', 'school_admin', 'teacher', 'accountant', 'registrar'],
        description: 'View enrolled learners in the current school.',
    },
    {
        menu: 'Students',
        submenu: 'Admissions',
        routeOrKey: 'admissions.index',
        requiredPermission: 'admissions.manage',
        requiresSchool: true,
        allowedRoles: ['school_director', 'school_admin', 'registrar'],
        description: 'Review and process new student applications.',
    },
    {
        menu: 'Students',
        submenu: 'Registration & Import',
        routeOrKey: 'students.create',
        requiredPermission: 'students.create',
        requiresSchool: true,
        allowedRoles: ['school_director', 'school_admin', 'registrar'],
        description: 'Register and import learners. Hidden from standard teachers.',
    },

    // Finance (School Context Mandatory)
    {
        menu: 'Finance',
        submenu: 'Fee structures, Invoices, Payments, Balances',
        routeOrKey: 'finance.*',
        requiredPermission: 'finance.view',
        requiresSchool: true,
        allowedRoles: ['accountant', 'school_director', 'school_admin'],
        description: 'Manage fees, billing, payments, and balances. Hidden from platform super admin and teachers.',
    },
    {
        menu: 'Finance',
        submenu: 'Discounts, Expenses, Integrations',
        routeOrKey: 'finance-expenses, finance-discounts',
        requiredPermission: 'finance.manage',
        requiresSchool: true,
        allowedRoles: ['accountant', 'school_director'],
        description: 'Manage operational expenditure and financial integrations.',
    },

    // Academics (School Context Mandatory)
    {
        menu: 'Academics',
        submenu: 'Classes, Subjects, Timetables, Results',
        routeOrKey: 'academics.*',
        requiredPermission: 'assessments.view',
        requiresSchool: true,
        allowedRoles: ['teacher', 'school_director', 'school_admin'],
        description: 'View curriculum, allocations, and academic results.',
    },
    {
        menu: 'Academics',
        submenu: 'Marks entry',
        routeOrKey: 'academics.marks.index',
        requiredPermission: 'assessments.manage',
        requiresSchool: true,
        allowedRoles: ['teacher', 'school_admin'],
        description: 'Capture student marks and assessment grades.',
    },

    // Attendance (School Context Mandatory)
    {
        menu: 'Attendance',
        submenu: 'Student attendance & Mark attendance',
        routeOrKey: 'attendance.*',
        requiredPermission: 'attendance.view / attendance.manage',
        requiresSchool: true,
        allowedRoles: ['teacher', 'school_director', 'school_admin'],
        description: 'Daily roll call and attendance registers. Hidden from platform super admin without school.',
    },
];

function routeIsActive(routeName: string, current: string | undefined): boolean {
    if (!current) {
        return false;
    }
    if (routeName === 'dashboard') {
        return current === 'dashboard';
    }
    if (routeName.startsWith('dashboard.')) {
        return current === routeName;
    }
    if (routeName.startsWith('portal.')) {
        return current === routeName;
    }
    const [resource] = routeName.split('.');
    return current === routeName || current.startsWith(`${resource}.`);
}

function erpIsActive(pageKey: string, current: string | undefined, pageUrl: string): boolean {
    if (current !== 'erp.page') {
        return false;
    }
    const path = pageUrl.split('?')[0] ?? '';
    return path.endsWith(`/app/${pageKey}`) || path.includes(`/app/${pageKey}`);
}

function leafHref(leaf: NavLeafConfig): string {
    try {
        if (leaf.erpPageKey) {
            return route('erp.page', { pageKey: leaf.erpPageKey });
        }
        if (leaf.routeName) {
            return route(leaf.routeName, leaf.routeParams);
        }
    } catch {
        return '#';
    }
    return '#';
}

function leafActive(leaf: NavLeafConfig, current: string | undefined, pageUrl: string): boolean {
    if (leaf.erpPageKey) {
        return erpIsActive(leaf.erpPageKey, current, pageUrl);
    }
    if (leaf.routeName) {
        const isActive = routeIsActive(leaf.routeName, current);
        if (!isActive) return false;

        if (leaf.routeParams) {
            const searchParams = new URLSearchParams(pageUrl.split('?')[1] || '');
            return Object.entries(leaf.routeParams).every(
                ([key, value]) => searchParams.get(key) === String(value),
            );
        }
        return true;
    }
    return false;
}

function filterLeaf(leaf: NavLeafConfig, ctx: NavContext): boolean {
    if (leaf.requiresSchool && !ctx.hasSchool) {
        return false;
    }
    if (leaf.visible && !leaf.visible(ctx)) {
        return false;
    }
    return true;
}

function filterBranch(branch: NavBranchConfig, ctx: NavContext): NavBranchConfig | null {
    if (branch.requiresSchool && !ctx.hasSchool) {
        return null;
    }
    if (branch.visible && !branch.visible(ctx)) {
        return null;
    }
    const children = branch.children.filter((ch) => filterLeaf(ch, ctx));
    if (!children.length) {
        return null;
    }
    return { ...branch, children };
}

export type ResolvedNavLeaf = {
    kind: 'leaf';
    name: string;
    href: string;
    icon: LucideIcon;
    highlight?: boolean;
    isActive: boolean;
    requiredPermission?: string;
    description?: string;
};

export type ResolvedNavBranch = {
    kind: 'branch';
    id: string;
    name: string;
    icon: LucideIcon;
    children: ResolvedNavLeaf[];
    requiredPermission?: string;
    description?: string;
};

export type ResolvedNavTop = ResolvedNavLeaf | ResolvedNavBranch;

export function resolveNavigation(
    ctx: NavContext,
    currentRoute: string | undefined,
    pageUrl: string,
): { items: ResolvedNavTop[]; flat: ResolvedNavLeaf[] } {
    const items: ResolvedNavTop[] = [];
    const flat: ResolvedNavLeaf[] = [];

    const pushLeaf = (leaf: NavLeafConfig) => {
        const highlight =
            typeof leaf.highlight === 'function'
                ? leaf.highlight(ctx)
                : leaf.highlight;
        const r: ResolvedNavLeaf = {
            kind: 'leaf',
            name: leaf.label,
            href: leafHref(leaf),
            icon: leaf.icon,
            highlight,
            isActive: leafActive(leaf, currentRoute, pageUrl),
            requiredPermission: leaf.requiredPermission,
            description: leaf.description,
        };
        flat.push(r);
        return r;
    };

    for (const block of defaultNavBlocks) {
        if (block.kind === 'leaf') {
            if (!filterLeaf(block, ctx)) {
                continue;
            }
            items.push(pushLeaf(block));
            continue;
        }
        const br = filterBranch(block, ctx);
        if (!br) {
            continue;
        }
        const children = br.children.map((ch) => {
            const r = pushLeaf(ch);
            return r;
        });
        items.push({
            kind: 'branch',
            id: br.id,
            name: br.label,
            icon: br.icon,
            children,
            requiredPermission: br.requiredPermission,
            description: br.description,
        });
    }

    return { items, flat };
}
