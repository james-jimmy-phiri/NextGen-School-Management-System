export const enrollmentTrend = [
    { month: 'Jan', students: 412, target: 420 },
    { month: 'Feb', students: 418, target: 425 },
    { month: 'Mar', students: 425, target: 430 },
    { month: 'Apr', students: 431, target: 435 },
    { month: 'May', students: 438, target: 440 },
    { month: 'Jun', students: 442, target: 445 },
];

export const studentGrowthTrend = [
    { month: 'Jan', total: 1420, new: 180, dropped: 15 },
    { month: 'Feb', total: 1490, new: 90, dropped: 20 },
    { month: 'Mar', total: 1530, new: 65, dropped: 25 },
    { month: 'Apr', total: 1580, new: 75, dropped: 25 },
    { month: 'May', total: 1610, new: 50, dropped: 20 },
    { month: 'Jun', total: 1635, new: 40, dropped: 15 },
    { month: 'Jul', total: 1650, new: 30, dropped: 15 },
];

export const monthlyFinancials = [
    { month: 'Jan', earn: 4100, due: 900, expense: 2800 },
    { month: 'Feb', earn: 4450, due: 750, expense: 2950 },
    { month: 'Mar', earn: 4700, due: 600, expense: 3100 },
    { month: 'Apr', earn: 4900, due: 500, expense: 3050 },
    { month: 'May', earn: 5120, due: 420, expense: 3200 },
    { month: 'Jun', earn: 5065, due: 380, expense: 3150 },
    { month: 'Jul', earn: 5240, due: 320, expense: 3180 },
];

export const attendanceGaugeData = [
    { name: 'Present', value: 94.6, fill: '#f97316', count: 1540 },
    { name: 'Absent', value: 4.2, fill: '#1e293b', count: 70 },
    { name: 'Late', value: 1.2, fill: '#94a3b8', count: 20 },
];

export const attentionAlerts = [
    { id: 1, title: 'Unpaid Fee', count: 24, description: '24 students have unpaid fee balances', action: 'Remind', tone: 'danger', href: '/erp/finance-invoices' },
    { id: 2, title: 'Low Attendance', count: 14, description: '14 students flagged below 80% rate', action: 'Review', tone: 'warning', href: '/erp/attendance-reports' },
    { id: 3, title: 'Attendance Not Submitted', count: 3, description: '3 class teachers pending morning roll-call', action: 'View', tone: 'warning', href: '/attendance' },
    { id: 4, title: 'Exam Result Approval', count: 4, description: '4 exams require administrative sign-off', action: 'Approve', tone: 'info', href: '/erp/academics-exams' },
    { id: 5, title: 'Leave Requests', count: 2, description: '2 teachers requested leave clearances', action: 'Review', tone: 'info', href: '/erp/hr-leave' },
    { id: 6, title: 'Admission Requests', count: 12, description: '12 new prospective student applications', action: 'Review', tone: 'success', href: '/admissions' },
];

export const admissionCandidates = [
    { id: '01', name: 'Daniel Carter', class: 'Class 10 · Science', time: '2h ago', status: 'Pending Review' },
    { id: '02', name: 'Gustavo Carder', class: 'Class 10 · Science', time: '5h ago', status: 'Interview' },
    { id: '03', name: 'Chance Saris', class: 'Class 10 · Science', time: '1d ago', status: 'Document Check' },
];

export const masterControlModules = [
    {
        title: 'Student Management',
        icon: 'GraduationCap',
        color: '#4338CA',
        links: [
            { label: 'Add New', href: '/students/create' },
            { label: 'Directory', href: '/students' },
            { label: 'Promotions', href: '/students/promotion' },
            { label: 'Import CSV', href: '/students/import' },
        ],
    },
    {
        title: 'User Roles & Access',
        icon: 'Shield',
        color: '#F97316',
        links: [
            { label: 'Create Role', href: '/roles' },
            { label: 'Admin Access', href: '/users' },
            { label: 'Staff Privileges', href: '/permissions' },
            { label: 'Tenant Scope', href: '/schools' },
        ],
    },
    {
        title: 'Educator Operations',
        icon: 'Users',
        color: '#0D9488',
        links: [
            { label: 'Class Allocations', href: '/academics/classes' },
            { label: 'Subject Teachers', href: '/academics/subjects' },
            { label: 'Attendance Roll', href: '/attendance' },
            { label: 'Staff Directory', href: '/users' },
        ],
    },
    {
        title: 'Class & Stream Control',
        icon: 'Layers',
        color: '#0284C7',
        links: [
            { label: 'Class Groups', href: '/academics/classes' },
            { label: 'Streams', href: '/academics/classes' },
            { label: 'Timetable', href: '/timetable' },
            { label: 'Departments', href: '/departments' },
        ],
    },
    {
        title: 'Financial & Levies',
        icon: 'Wallet',
        color: '#16A34A',
        links: [
            { label: 'Invoicing', href: '/finance' },
            { label: 'Collect Payments', href: '/finance' },
            { label: 'Fee Structures', href: '/finance' },
            { label: 'Defaulters List', href: '/finance' },
        ],
    },
];

export const attendanceWeekly = [
    { day: 'Mon', rate: 96 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 97 },
    { day: 'Thu', rate: 95 },
    { day: 'Fri', rate: 93 },
];

export const feeCollection = [
    { week: 'W1', collected: 124000, expected: 140000 },
    { week: 'W2', collected: 132000, expected: 140000 },
    { week: 'W3', collected: 128000, expected: 138000 },
    { week: 'W4', collected: 136000, expected: 135000 },
];

export const performanceBySubject = [
    { subject: 'Math', avg: 72 },
    { subject: 'English', avg: 78 },
    { subject: 'Science', avg: 74 },
    { subject: 'Social', avg: 80 },
    { subject: 'ICT', avg: 85 },
];

export const genderSplit = [
    { name: 'Female', value: 214, fill: 'hsl(217 91% 60%)' },
    { name: 'Male', value: 228, fill: 'hsl(199 89% 48%)' },
];

export const debtorsBuckets = [
    { bucket: 'Current', amount: 420000 },
    { bucket: '1–30d', amount: 86000 },
    { bucket: '31–60d', amount: 34000 },
    { bucket: '60d+', amount: 12000 },
];

export const recentPayments = [
    { id: 'P-2041', student: 'Thandiwe Banda', amount: 'MWK 85,000', method: 'Airtel Money', status: 'Posted', at: '12 min ago' },
    { id: 'P-2040', student: 'James Phiri', amount: 'MWK 120,000', method: 'Bank', status: 'Posted', at: '1 hr ago' },
    { id: 'P-2039', student: 'Grace Moyo', amount: 'MWK 45,000', method: 'Mpamba', status: 'Pending', at: '3 hr ago' },
    { id: 'P-2038', student: 'Noah Tembo', amount: 'MWK 60,000', method: 'Cash', status: 'Posted', at: 'Yesterday' },
];

export const recentAdmissions = [
    { id: 'A-118', name: 'Chisomo Jere', class: 'Grade 8A', stage: 'Interview', at: 'Today' },
    { id: 'A-117', name: 'Luwesha Kapanda', class: 'Grade 5B', stage: 'Document review', at: 'Yesterday' },
    { id: 'A-116', name: 'Mwenda Sakala', class: 'Grade 10C', stage: 'Offer sent', at: '2 days ago' },
];

export const notificationsFeed = [
    { title: 'Fee reminder batch queued', detail: 'Form 4 guardians · SMS in 15 min', tone: 'info' as const },
    { title: 'Low attendance alert', detail: 'Grade 9B below 88% this week', tone: 'warning' as const },
    { title: 'Exam timetable published', detail: 'Term 2 midterms unlocked on portal', tone: 'success' as const },
];

export const sparklineAttendance = [92, 94, 91, 95, 96, 94, 97];

export const sparklineFees = [78, 80, 82, 79, 84, 86, 88];
