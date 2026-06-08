import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    BookOpen,
    Building2,
    Calendar,
    CirclePlus,
    Clock,
    ClipboardCheck,
    ClipboardList,
    Cog,
    Database,
    FileBarChart,
    FileSearch,
    FileText,
    FolderOpen,
    GraduationCap,
    HeartHandshake,
    KeyRound,
    HeartPulse,
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
    ScrollText,
    Settings2,
    Shield,
    Smartphone,
    Stethoscope,
    UserPlus,
    Users,
    Wallet,
    Award,
} from 'lucide-react';

export type NavContext = {
    roles: string[];
    isSuperAdmin: boolean;
    isOperationalLead: boolean;
    canViewUsers: boolean;
    canCreateUsers: boolean;
    canManageRoles: boolean;
    canViewAuditLogs: boolean;
    canCaptureAttendance: boolean;
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
    highlight?: boolean | ((c: NavContext) => boolean);
    visible?: (c: NavContext) => boolean;
};

export type NavBranchConfig = {
    kind: 'branch';
    id: string;
    label: string;
    icon: LucideIcon;
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
        visible: staff,
        children: [
            {
                kind: 'leaf',
                label: 'Overview',
                icon: LayoutDashboard,
                routeName: 'dashboard',
            },
            {
                kind: 'leaf',
                label: 'Analytics',
                icon: LineChart,
                routeName: 'dashboard.analytics',
            },
            {
                kind: 'leaf',
                label: 'Activity logs',
                icon: Activity,
                routeName: 'dashboard.activity',
            },
        ],
    },
    {
        kind: 'branch',
        id: 'identity-access',
        label: 'Identity & access',
        icon: Shield,
        visible: (c) =>
            staff(c) &&
            (c.canViewUsers || c.canCreateUsers || c.canManageRoles || c.canViewAuditLogs),
        children: [
            {
                kind: 'leaf',
                label: 'All users',
                icon: Users,
                routeName: 'users.index',
                visible: (c) => c.canViewUsers,
            },
            {
                kind: 'leaf',
                label: 'Add user',
                icon: UserPlus,
                routeName: 'users.create',
                visible: (c) => c.canCreateUsers,
            },
            {
                kind: 'leaf',
                label: 'Roles',
                icon: Shield,
                routeName: 'roles.index',
                visible: (c) => c.canManageRoles,
            },
            {
                kind: 'leaf',
                label: 'New role',
                icon: CirclePlus,
                routeName: 'roles.create',
                visible: (c) => c.canManageRoles,
            },
            {
                kind: 'leaf',
                label: 'Permissions',
                icon: KeyRound,
                routeName: 'permissions.index',
                visible: (c) => c.canViewUsers,
            },
            {
                kind: 'leaf',
                label: 'New permission',
                icon: CirclePlus,
                routeName: 'permissions.create',
                visible: (c) => c.canManageRoles,
            },
            {
                kind: 'leaf',
                label: 'Audit logs',
                icon: FileSearch,
                routeName: 'audit-logs.index',
                visible: (c) => c.canViewAuditLogs,
            },
        ],
    },
    {
        kind: 'branch',
        id: 'school-setup',
        label: 'School setup',
        icon: School,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'School profile', icon: Building2, routeName: 'school-setup.index', routeParams: { tab: 'profile' } },
            { kind: 'leaf', label: 'Academic years', icon: ClipboardList, routeName: 'school-setup.index', routeParams: { tab: 'academic_years' } },
            { kind: 'leaf', label: 'Terms / semesters', icon: ClipboardList, routeName: 'school-setup.index', routeParams: { tab: 'terms' } },
            { kind: 'leaf', label: 'Classes', icon: Users, routeName: 'school-setup.index', routeParams: { tab: 'classes' } },
            { kind: 'leaf', label: 'Streams / sections', icon: Users, routeName: 'school-setup.index', routeParams: { tab: 'streams' } },
            { kind: 'leaf', label: 'Subjects', icon: BookOpen, routeName: 'school-setup.index', routeParams: { tab: 'subjects' } },
            { kind: 'leaf', label: 'Departments', icon: Building2, routeName: 'school-setup.index', routeParams: { tab: 'departments' } },
            { kind: 'leaf', label: 'Grading system', icon: PieChart, routeName: 'school-setup.index', routeParams: { tab: 'grading' } },
        ],
    },
    {
        kind: 'branch',
        id: 'students',
        label: 'Students',
        icon: GraduationCap,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Student list', icon: Users, routeName: 'students.index' },
            { kind: 'leaf', label: 'Admissions', icon: UserPlus, routeName: 'admissions.index' },
            { kind: 'leaf', label: 'Registration', icon: UserPlus, routeName: 'students.create' },
            { kind: 'leaf', label: 'Profiles', icon: Users, erpPageKey: 'students-profiles' },
            { kind: 'leaf', label: 'Guardians / parents', icon: HeartHandshake, routeName: 'guardians.index' },
            { kind: 'leaf', label: 'Promotion', icon: GraduationCap, erpPageKey: 'students-promotion' },
            { kind: 'leaf', label: 'Alumni', icon: GraduationCap, erpPageKey: 'students-alumni' },
            { kind: 'leaf', label: 'Transfers', icon: Users, erpPageKey: 'students-transfers' },
        ],
    },
    {
        kind: 'branch',
        id: 'academics',
        label: 'Academics',
        icon: BookOpen,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Subjects', icon: BookOpen, routeName: 'academics.subjects.index' },
            { kind: 'leaf', label: 'Classes', icon: Users, routeName: 'academics.classes.index' },
            { kind: 'leaf', label: 'Streams', icon: Users, erpPageKey: 'academics-streams' },
            { kind: 'leaf', label: 'Timetable', icon: ClipboardList, routeName: 'timetables.index' },
            { kind: 'leaf', label: 'Assignments', icon: ClipboardList, erpPageKey: 'academics-assignments' },
            { kind: 'leaf', label: 'Exams', icon: FileBarChart, erpPageKey: 'academics-exams' },
            { kind: 'leaf', label: 'Marks entry', icon: PieChart, routeName: 'academics.marks.index' },
            { kind: 'leaf', label: 'Results', icon: BarChart3, erpPageKey: 'academics-results' },
            { kind: 'leaf', label: 'Report cards', icon: FileBarChart, erpPageKey: 'academics-report-cards' },
            { kind: 'leaf', label: 'Academic reports', icon: LineChart, erpPageKey: 'academics-reports' },
        ],
    },
    {
        kind: 'branch',
        id: 'attendance',
        label: 'Attendance',
        icon: ClipboardCheck,
        visible: (c) => staff(c) && c.canCaptureAttendance,
        children: [
            {
                kind: 'leaf',
                label: 'Student attendance',
                icon: ClipboardCheck,
                routeName: 'attendance.index',
                highlight: (c) => !!c.offlineAttendanceReady,
            },
            { kind: 'leaf', label: 'Mark attendance', icon: ClipboardList, routeName: 'attendance.mark' },
            { kind: 'leaf', label: 'Teacher attendance', icon: Users, erpPageKey: 'attendance-teacher' },
            { kind: 'leaf', label: 'Reports', icon: FileBarChart, erpPageKey: 'attendance-reports' },
            { kind: 'leaf', label: 'Analytics', icon: BarChart3, erpPageKey: 'attendance-analytics' },
        ],
    },
    {
        kind: 'branch',
        id: 'finance',
        label: 'Finance',
        icon: Wallet,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Fee structures', icon: Receipt, routeName: 'finance.fee-structures.index' },
            { kind: 'leaf', label: 'Invoices', icon: FileBarChart, routeName: 'finance.invoices.index' },
            { kind: 'leaf', label: 'Payments', icon: Wallet, routeName: 'finance.payments.index' },
            { kind: 'leaf', label: 'Balances', icon: PieChart, erpPageKey: 'finance-balances' },
            { kind: 'leaf', label: 'Discounts & scholarships', icon: HeartHandshake, erpPageKey: 'finance-discounts' },
            { kind: 'leaf', label: 'Expenses', icon: Receipt, erpPageKey: 'finance-expenses' },
            { kind: 'leaf', label: 'Financial reports', icon: LineChart, erpPageKey: 'finance-reports' },
            { kind: 'leaf', label: 'Integrations', icon: Cog, erpPageKey: 'finance-integrations' },
        ],
    },
    {
        kind: 'branch',
        id: 'communication',
        label: 'Communication',
        icon: Megaphone,
        visible: staff,
        children: [
            { kind: 'leaf', label: 'Announcements', icon: Megaphone, routeName: 'announcements.index' },
            { kind: 'leaf', label: 'School calendar', icon: Calendar, routeName: 'calendar-events.index' },
            { kind: 'leaf', label: 'SMS center', icon: Smartphone, erpPageKey: 'communication-sms' },
            { kind: 'leaf', label: 'Emails', icon: Mail, erpPageKey: 'communication-email' },
            { kind: 'leaf', label: 'Push notifications', icon: Bell, erpPageKey: 'communication-push' },
            { kind: 'leaf', label: 'Messaging', icon: MessageCircle, erpPageKey: 'communication-messaging' },
        ],
    },
    {
        kind: 'branch',
        id: 'parent-portal',
        label: 'Parent portal',
        icon: HeartHandshake,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Parent dashboard', icon: LayoutDashboard, routeName: 'portal.parent' },
            { kind: 'leaf', label: 'Child dashboard', icon: Users, erpPageKey: 'portal-child-dashboard' },
            { kind: 'leaf', label: 'Fee statements', icon: Wallet, erpPageKey: 'portal-fee-statements' },
            { kind: 'leaf', label: 'Academic reports', icon: FileBarChart, erpPageKey: 'portal-academic-reports' },
            { kind: 'leaf', label: 'Messages', icon: MessageCircle, erpPageKey: 'portal-messages' },
        ],
    },
    {
        kind: 'branch',
        id: 'staff',
        label: 'Staff',
        icon: Users,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Staff directory', icon: Users, erpPageKey: 'staff-directory' },
            { kind: 'leaf', label: 'Departments', icon: Building2, erpPageKey: 'staff-departments' },
            { kind: 'leaf', label: 'Leave management', icon: ClipboardList, erpPageKey: 'staff-leave' },
            { kind: 'leaf', label: 'Payroll', icon: Wallet, erpPageKey: 'staff-payroll' },
            { kind: 'leaf', label: 'Staff attendance', icon: ClipboardCheck, erpPageKey: 'staff-attendance' },
            { kind: 'leaf', label: 'Performance reviews', icon: BarChart3, erpPageKey: 'staff-performance' },
        ],
    },
    {
        kind: 'branch',
        id: 'library',
        label: 'Library',
        icon: LibraryBig,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Book catalog', icon: BookOpen, erpPageKey: 'library-catalog' },
            { kind: 'leaf', label: 'Borrowing', icon: ClipboardList, erpPageKey: 'library-borrowing' },
            { kind: 'leaf', label: 'Fines', icon: Receipt, erpPageKey: 'library-fines' },
            { kind: 'leaf', label: 'Reports', icon: FileBarChart, erpPageKey: 'library-reports' },
        ],
    },
    {
        kind: 'branch',
        id: 'discipline',
        label: 'Discipline',
        icon: AlertTriangle,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Incident reports', icon: AlertTriangle, erpPageKey: 'discipline-incidents' },
            { kind: 'leaf', label: 'Punishments', icon: Shield, erpPageKey: 'discipline-punishments' },
            { kind: 'leaf', label: 'Behavior tracking', icon: Activity, erpPageKey: 'discipline-behavior' },
            { kind: 'leaf', label: 'Student awards', icon: Award, routeName: 'student-awards.index' },
        ],
    },
    {
        kind: 'branch',
        id: 'health',
        label: 'Health center',
        icon: HeartPulse,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Medical records', icon: Stethoscope, erpPageKey: 'health-records' },
            { kind: 'leaf', label: 'Clinic visits', icon: HeartPulse, routeName: 'clinic-visits.index' },
            { kind: 'leaf', label: 'Emergency contacts', icon: Bell, erpPageKey: 'health-emergency' },
        ],
    },
    {
        kind: 'branch',
        id: 'documents',
        label: 'Documents',
        icon: FolderOpen,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'Student documents', icon: FolderOpen, erpPageKey: 'documents-students' },
            { kind: 'leaf', label: 'Staff documents', icon: FolderOpen, erpPageKey: 'documents-staff' },
            { kind: 'leaf', label: 'Downloads', icon: Database, erpPageKey: 'documents-downloads' },
        ],
    },
    {
        kind: 'branch',
        id: 'reports',
        label: 'Reports',
        icon: FileBarChart,
        visible: staff,
        children: [
            { kind: 'leaf', label: 'Academic reports', icon: FileBarChart, erpPageKey: 'reports-academic' },
            { kind: 'leaf', label: 'Attendance reports', icon: ClipboardCheck, erpPageKey: 'reports-attendance' },
            { kind: 'leaf', label: 'Financial reports', icon: Wallet, erpPageKey: 'reports-financial' },
            { kind: 'leaf', label: 'Enrollment reports', icon: Users, erpPageKey: 'reports-enrollment' },
        ],
    },
    {
        kind: 'branch',
        id: 'settings',
        label: 'Settings',
        icon: Settings2,
        visible: (c) => staff(c) && c.isOperationalLead,
        children: [
            { kind: 'leaf', label: 'General', icon: Cog, erpPageKey: 'settings-general' },
            { kind: 'leaf', label: 'Academic', icon: BookOpen, erpPageKey: 'settings-academic' },
            { kind: 'leaf', label: 'Notifications', icon: Bell, erpPageKey: 'settings-notifications' },
            { kind: 'leaf', label: 'Integrations', icon: Database, erpPageKey: 'settings-integrations' },
            { kind: 'leaf', label: 'Backup & restore', icon: Database, erpPageKey: 'settings-backup' },
        ],
    },
    {
        kind: 'branch',
        id: 'my-school',
        label: 'My school',
        icon: School,
        visible: (c) =>
            staff(c) &&
            !c.isSuperAdmin &&
            c.roles.some((r) =>
                ['school_director', 'school_admin'].includes(r),
            ),
        children: [
            { kind: 'leaf', label: 'School profile', icon: Building2, routeName: 'schools.index' },
        ],
    },
    {
        kind: 'branch',
        id: 'superadmin',
        label: 'Super admin',
        icon: Monitor,
        visible: (c) => staff(c) && c.isSuperAdmin,
        children: [
            { kind: 'leaf', label: 'All schools', icon: Building2, routeName: 'schools.index' },
            { kind: 'leaf', label: 'Add school', icon: CirclePlus, routeName: 'schools.create' },
            { kind: 'leaf', label: 'System monitoring', icon: Activity, erpPageKey: 'superadmin-monitoring' },
            { kind: 'leaf', label: 'Subscriptions', icon: Receipt, erpPageKey: 'superadmin-subscriptions' },
            { kind: 'leaf', label: 'Support tickets', icon: MessageCircle, erpPageKey: 'superadmin-support' },
        ],
    },
    {
        kind: 'branch',
        id: 'parent-app',
        label: 'Parent portal',
        icon: HeartHandshake,
        visible: (c) => c.isParent,
        children: [
            { kind: 'leaf', label: 'My children', icon: Users, routeName: 'portal.parent' },
            { kind: 'leaf', label: 'Child Profile', icon: UserPlus, routeName: 'portal.children.show', visible: () => false }, // Hidden from nav, used for matching
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
    if (leaf.visible && !leaf.visible(ctx)) {
        return false;
    }
    return true;
}

function filterBranch(branch: NavBranchConfig, ctx: NavContext): NavBranchConfig | null {
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
};

export type ResolvedNavBranch = {
    kind: 'branch';
    id: string;
    name: string;
    icon: LucideIcon;
    children: ResolvedNavLeaf[];
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
        });
    }

    return { items, flat };
}
