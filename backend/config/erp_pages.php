<?php

/** @var callable(string, string, array<int, string>, array<int, string>): array<string, mixed> $p */
$p = static fn (string $title, string $description, array $features, array $breadcrumbs = []) => [
    'title' => $title,
    'description' => $description,
    'features' => $features,
    'breadcrumbs' => $breadcrumbs,
];

return [
    'definitions' => [
        'school-profile' => $p('School profile', 'Branding, contacts, and public-facing school identity.', ['School name & motto', 'Logo & colours', 'Address & website'], ['School setup', 'School profile']),
        'school-academic-years' => $p('Academic years', 'Create, activate, and archive academic years.', ['Year planner', 'Activate year', 'Archive history'], ['School setup', 'Academic years']),
        'school-terms' => $p('Terms / semesters', 'Define term dates and academic rhythm.', ['Create terms', 'Activate term', 'Date ranges'], ['School setup', 'Terms']),
        'school-classes' => $p('Classes', 'Organise cohorts and assign lead teachers.', ['Create classes', 'Assign teachers', 'Define levels'], ['School setup', 'Classes']),
        'school-streams' => $p('Streams / sections', 'Split classes into teaching groups.', ['Create streams', 'Assign classrooms', 'Capacity'], ['School setup', 'Streams']),
        'school-subjects' => $p('Subjects', 'Catalogue subjects and teacher assignments.', ['Subject codes', 'Assign teachers', 'Department linkage'], ['School setup', 'Subjects']),
        'school-departments' => $p('Departments', 'Academic and administrative departments.', ['Department heads', 'Staff mapping'], ['School setup', 'Departments']),
        'school-grading' => $p('Grading system', 'Scales, GPA, and automated remarks.', ['Grading scales', 'GPA setup', 'Remark templates'], ['School setup', 'Grading system']),

        'students-admissions' => $p('Admissions', 'Applications, approvals, and waiting lists.', ['Online applications', 'Approvals', 'Interviews'], ['Students', 'Admissions']),
        'students-registration' => $p('Student registration', 'Capture new learners and documents.', ['Admission numbers', 'Document uploads', 'Guardian capture'], ['Students', 'Registration']),
        'students-profiles' => $p('Student profiles', '360° learner view (placeholder hub).', ['Biodata', 'Medical', 'Guardians'], ['Students', 'Profiles']),
        'students-guardians' => $p('Guardians / parents', 'Link households and emergency contacts.', ['Multi-child links', 'Communication prefs', 'Emergency contacts'], ['Students', 'Guardians']),
        'students-promotion' => $p('Student promotion', 'End-of-year movement between levels.', ['Promote class', 'Repeat', 'Bulk wizard'], ['Students', 'Promotion']),
        'students-alumni' => $p('Alumni', 'Graduated cohorts and alumni relations.', ['Graduate records', 'Alumni contacts', 'Re-engagement'], ['Students', 'Alumni']),
        'students-transfers' => $p('Transfers', 'Inbound and outbound learner mobility.', ['Transfer in', 'Transfer out', 'Document trail'], ['Students', 'Transfers']),

        'academics-subjects' => $p('Subjects', 'Curriculum catalogue and staffing.', ['Subject master', 'Syllabus links', 'Exam weighting'], ['Academics', 'Subjects']),
        'academics-classes' => $p('Classes', 'Timetable anchors and cohort setup.', ['Room assignments', 'Class teachers', 'Levels'], ['Academics', 'Classes']),
        'academics-streams' => $p('Streams', 'Sections within a class.', ['Roll groups', 'Capacity alerts'], ['Academics', 'Streams']),
        'academics-timetable' => $p('Timetable', 'Class, teacher, and exam grids.', ['Drag-drop builder', 'Conflict detection', 'Publish to app'], ['Academics', 'Timetable']),
        'academics-assignments' => $p('Assignments', 'Homework lifecycle and grading.', ['Uploads', 'Deadlines', 'Rubric scoring'], ['Academics', 'Assignments']),
        'academics-exams' => $p('Exams', 'Scheduling and exam types.', ['Exam types', 'Seating plans', 'Invigilation'], ['Academics', 'Exams']),
        'academics-marks' => $p('Marks entry', 'Teacher marks capture and moderation.', ['Grid entry', 'CSV import', 'Moderation queue'], ['Academics', 'Marks entry']),
        'academics-results' => $p('Results processing', 'Aggregations, rankings, and approvals.', ['Auto calculations', 'Rankings', 'Locking'], ['Academics', 'Results']),
        'academics-report-cards' => $p('Report cards', 'Design templates and PDF generation.', ['Layouts', 'Comments', 'Signatures'], ['Academics', 'Report cards']),
        'academics-reports' => $p('Academic reports', 'Performance analytics for leaders.', ['Top performers', 'Subject analysis', 'Class comparison'], ['Academics', 'Academic reports']),

        'attendance-teacher' => $p('Teacher attendance', 'Staff time and presence tracking.', ['Check-in / out', 'Summaries', 'Exceptions'], ['Attendance', 'Teacher attendance']),
        'attendance-reports' => $p('Attendance reports', 'Operational and regulatory views.', ['Daily roll', 'Monthly trends', 'Export'], ['Attendance', 'Reports']),
        'attendance-analytics' => $p('Attendance analytics', 'Patterns and risk alerts.', ['Heatmaps', 'Chronic absence', 'Interventions'], ['Attendance', 'Analytics']),

        'finance-fee-structures' => $p('Fee structures', 'Tuition, boarding, transport, and levies.', ['Fee bands', 'Sibling rules', 'Version history'], ['Finance', 'Fee structures']),
        'finance-invoices' => $p('Invoices', 'Billing runs and document output.', ['Generate invoices', 'Recurring billing', 'Print / email'], ['Finance', 'Invoices']),
        'finance-payments' => $p('Payments', 'Receipting and reconciliation.', ['Mobile money', 'Bank', 'Receipt PDF'], ['Finance', 'Payments']),
        'finance-balances' => $p('Fee balances', 'Debtors and ageing.', ['Outstanding list', 'Aging buckets', 'Promises to pay'], ['Finance', 'Balances']),
        'finance-discounts' => $p('Discounts & scholarships', 'Bursaries and sponsorships.', ['Approval flows', 'Ledger impact'], ['Finance', 'Discounts']),
        'finance-expenses' => $p('Expenses', 'Operational spend with approvals.', ['Petty cash', 'Approvals', 'Vendors'], ['Finance', 'Expenses']),
        'finance-reports' => $p('Financial reports', 'Leadership dashboards.', ['Income statement', 'Collections', 'Debt analysis'], ['Finance', 'Financial reports']),
        'finance-integrations' => $p('Payment integrations', 'Connectors and API health.', ['Airtel Money', 'Mpamba', 'Bank feeds'], ['Finance', 'Integrations']),

        'communication-announcements' => $p('Announcements', 'Targeted school communications.', ['Channels', 'Audience filters', 'Scheduling'], ['Communication', 'Announcements']),
        'communication-sms' => $p('SMS center', 'High-throughput SMS for alerts.', ['Bulk SMS', 'Templates', 'Delivery logs'], ['Communication', 'SMS center']),
        'communication-email' => $p('Emails', 'Newsletters and transactional mail.', ['Templates', 'Unsubscribe', 'Analytics'], ['Communication', 'Emails']),
        'communication-push' => $p('Push notifications', 'Mobile engagement.', ['Topic targeting', 'Deep links'], ['Communication', 'Push']),
        'communication-messaging' => $p('Messaging', 'Secure teacher–parent threads.', ['Threading', 'Read receipts', 'Moderation'], ['Communication', 'Messaging']),

        'portal-child-dashboard' => $p('Child dashboard', 'Guardian view of learner pulse.', ['Attendance', 'Fees snapshot', 'Performance'], ['Parent portal', 'Child dashboard']),
        'portal-fee-statements' => $p('Fee statements', 'Balances and payment history.', ['PDF statements', 'Receipt archive'], ['Parent portal', 'Fee statements']),
        'portal-academic-reports' => $p('Academic reports', 'Report cards and rankings.', ['Published cards', 'Teacher comments'], ['Parent portal', 'Academic reports']),
        'portal-messages' => $p('Communication', 'Message teachers and book appointments.', ['Inbox', 'Appointments'], ['Parent portal', 'Communication']),

        'staff-directory' => $p('Staff directory', 'Teacher and employee records.', ['Profiles', 'Documents', 'Contracts'], ['Staff', 'Directory']),
        'staff-departments' => $p('Departments', 'Staff placement and reporting lines.', ['Academic vs admin', 'HOD assignments'], ['Staff', 'Departments']),
        'staff-leave' => $p('Leave management', 'Requests and approvals.', ['Balances', 'Workflow', 'Calendar'], ['Staff', 'Leave']),
        'staff-payroll' => $p('Payroll', 'Salaries, deductions, payslips.', ['Pay runs', 'Statutory', 'Exports'], ['Staff', 'Payroll']),
        'staff-attendance' => $p('Staff attendance', 'HR attendance views.', ['Clock data', 'Exceptions'], ['Staff', 'Attendance']),
        'staff-performance' => $p('Performance reviews', 'Evaluations and KPIs.', ['Cycles', '360 feedback', 'Goals'], ['Staff', 'Performance reviews']),

        'library-catalog' => $p('Book catalog', 'ISBN, authors, and categories.', ['MARC-lite', 'Stock counts'], ['Library', 'Catalog']),
        'library-borrowing' => $p('Borrowing', 'Issue and return workflow.', ['Self-checkout', 'Due dates'], ['Library', 'Borrowing']),
        'library-fines' => $p('Fines', 'Overdue penalties and waivers.', ['Rules engine', 'Payments'], ['Library', 'Fines']),
        'library-reports' => $p('Library reports', 'Circulation and inventory.', ['Borrowed books', 'Lost items'], ['Library', 'Reports']),

        'discipline-incidents' => $p('Incident reports', 'Misconduct logging and workflow.', ['Severity', 'Witnesses', 'Attachments'], ['Discipline', 'Incidents']),
        'discipline-punishments' => $p('Punishments', 'Sanctions and follow-up.', ['Suspensions', 'Warnings', 'Community service'], ['Discipline', 'Punishments']),
        'discipline-behavior' => $p('Behavior tracking', 'Longitudinal conduct view.', ['Trends', 'Interventions'], ['Discipline', 'Behavior']),

        'health-records' => $p('Medical records', 'Allergies, conditions, medication.', ['Nurse notes', 'Confidentiality flags'], ['Health center', 'Records']),
        'health-visits' => $p('Clinic visits', 'Triage and treatment logs.', ['Vitals', 'Referrals'], ['Health center', 'Visits']),
        'health-emergency' => $p('Emergency contacts', 'Rapid access for incidents.', ['Guardian chain', 'Hospital prefs'], ['Health center', 'Emergency']),

        'documents-students' => $p('Student documents', 'Certificates and uploads.', ['Versioning', 'Expiry'], ['Documents', 'Student documents']),
        'documents-staff' => $p('Staff documents', 'Contracts and certifications.', ['Renewal alerts'], ['Documents', 'Staff documents']),
        'documents-downloads' => $p('Downloads', 'Controlled file distribution.', ['Permissions', 'Audit trail'], ['Documents', 'Downloads']),

        'reports-academic' => $p('Academic reports', 'Export-ready academic datasets.', ['PDF / Excel', 'Filters'], ['Reports', 'Academic']),
        'reports-attendance' => $p('Attendance reports', 'Regulatory and pastoral views.', ['Chronic absence', 'Class heatmaps'], ['Reports', 'Attendance']),
        'reports-financial' => $p('Financial reports', 'Collections and debt.', ['Cashflow', 'Aging'], ['Reports', 'Financial']),
        'reports-enrollment' => $p('Enrollment reports', 'Pipeline and capacity.', ['Cohort trends', 'Gender splits'], ['Reports', 'Enrollment']),

        'settings-general' => $p('General settings', 'Branding and theme controls.', ['Logo', 'Theme', 'Locale'], ['Settings', 'General']),
        'settings-academic' => $p('Academic settings', 'Grading and calendar defaults.', ['Grading scales', 'Calendar'], ['Settings', 'Academic']),
        'settings-notifications' => $p('Notification settings', 'SMS and email gateways.', ['API keys', 'Templates'], ['Settings', 'Notifications']),
        'settings-integrations' => $p('Integrations', 'Payment and SMS providers.', ['Webhooks', 'Health checks'], ['Settings', 'Integrations']),
        'settings-permissions' => $p('Module permissions', 'Fine-grained capability matrix.', ['Module toggles', 'Action-level'], ['Settings', 'Permissions']),
        'settings-backup' => $p('Backup & restore', 'Disaster recovery readiness.', ['Scheduled backups', 'Restore drills'], ['Settings', 'Backup']),

        'superadmin-monitoring' => $p('System monitoring', 'Platform uptime and signals.', ['Queues', 'Errors', 'Latency'], ['Super admin', 'Monitoring']),
        'superadmin-subscriptions' => $p('Subscriptions', 'Plans, renewals, and invoices.', ['Plan catalogue', 'MRR'], ['Super admin', 'Subscriptions']),
        'superadmin-support' => $p('Support tickets', 'Tenant issue tracking.', ['SLA', 'Assignment'], ['Super admin', 'Support']),

        'users-permissions' => $p('Permissions', 'Module and action-level access design.', ['Matrix editor', 'Templates', 'Simulation'], ['User management', 'Permissions']),
    ],
];
