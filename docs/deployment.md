# Deployment & observability playbook

### 1. Infrastructure targets

| Layer | Recommendation |
| --- | --- |
| App runtime | PHP 8.3 FPM containers or managed PHP (Laravel Vapor/Fly.io/Render) |
| Database | PostgreSQL 16+ multi-AZ (single schema with `school_id`) |
| Cache / sessions | Redis (shared with queues) |
| Object storage | S3-compatible buckets via `FILESYSTEM_DISK=s3` |
| Observability | Centralized logs (`LOG_STACK=slack,stderr`), Laravel Pulse (optional), Horizon |

### 2. Build pipeline

```bash
composer install --no-dev --prefer-dist --optimize-autoloader
npm ci && npm run build

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

### 3. Queues & schedulers

```bash
php artisan queue:work redis --sleep=1 --queue=notifications,finance,analytics
```

Schedule via cron:

```
* * * * * php /srv/app/artisan schedule:run >> /dev/null 2>&1
```

### 4. Offline + mobile rollout

Expose identical `/api/v1` contracts from production with certificate pinning inside Flutter Dio. Replay offline attendance payloads only after server-side uniqueness checks (`class_group_id` + `date`).


Admissions Module Implementation
The admissions module has been successfully implemented to handle prospective student applications. It includes a public-facing portal for parents/students to apply, and an admin interface to review, process, and convert accepted applicants into enrolled students.

What was implemented
1. Database & Models
Created the Admission model and a migration for the admissions table.
Added necessary fields: student_first_name, gender, date_of_birth, previous_school_name, boarding_type, parent_name, status, etc.
Configured JSON casting for documents to store file paths (birth certificate, passport photo, etc.).
The status field defaults to submitted and can transition through under_review, waitlisted, accepted, rejected, and enrolled.
2. Backend Controllers & Routing
PublicAdmissionController: Handles the public-facing application form, generating a unique reference_number (e.g., APP-2026-X7Y8Z9) and uploading documents to public storage.
AdmissionController: Handles the internal admin management. Allows listing applications, viewing details, updating statuses, and manually creating new applications.
Enrollment Logic: The enroll method converts an accepted admission into a full Student and Guardian record automatically and attaches them correctly.
Added corresponding web routes in routes/web.php for both public and admin access.
3. Frontend Views (React/Inertia)
Public Form (Public/Admissions/Create.tsx): A clean, multi-step application form utilizing the GuestLayout. Features built-in auto-saving of drafts to local storage, ensuring applicants don't lose their data if they accidentally refresh or leave the page.
Admin Form (Admissions/Create.tsx): A similar multi-step form utilizing AuthenticatedLayout for manual entry by school administrators.
Admin Dashboard (Admissions/Index.tsx): A table listing all admissions with search UI and distinct status badges.
Admin Review Screen (Admissions/Show.tsx): Displays all submitted details and uploaded documents. Provides quick action buttons to transition the application status and to "Convert to Student" when accepted.
Navigation: Updated appNavigation.ts to replace the placeholder route for Admissions with the real route (admissions.index).
TIP

The public application portal can be accessed via /admissions/apply.

Verification
Try navigating to /admissions/apply to test the public application form. Notice the auto-save draft functionality working in the background (draft saved indicator at the bottom).
Navigate to the Students > Admissions page in the Admin Dashboard to see the list of applications.
Click on an application to view the details, update the status to "Accepted", and try clicking the "Convert to Student" button to see the new Student and Guardian records created.
NOTE

The document uploads currently save to the admissions folder on local storage. To make them publicly accessible, you might need to run php artisan storage:link if you haven't already.

Explain what this problem is and help me fix it: 'auth.user' is possibly 'null'. @[c:\laragon\www\dev\NextGen-School-Management-System\backend\resources\js\Pages\Students\Create.tsx:L10]
11:24 AM
I have reviewed your idea for the Admission Module and compared it with the current implementation. You've outlined a solid and comprehensive flow!

To make this an enterprise-grade ERP module, I've created an Implementation Plan for you to review. The most 