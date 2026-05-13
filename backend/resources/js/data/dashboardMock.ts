export const enrollmentTrend = [
    { month: 'Jan', students: 412, target: 420 },
    { month: 'Feb', students: 418, target: 425 },
    { month: 'Mar', students: 425, target: 430 },
    { month: 'Apr', students: 431, target: 435 },
    { month: 'May', students: 438, target: 440 },
    { month: 'Jun', students: 442, target: 445 },
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
