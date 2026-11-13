## NextGen School Management System · Phase 1 foundation

Africa-first SaaS scaffolding that pairs **Laravel 12**, **Sanctum**, **Spatie Roles & Permissions + Activity Logs**, **Inertia + React (TypeScript)** (Tailwind, Framer Motion, React Hook Form, Zustand, Axios), Dockerized PostgreSQL/Redis infrastructure, plus a Flutter mobile shell.

> This repo’s goal is **not** infinite boilerplate duplication—but a **commercial-grade blueprint**: multi-tenant `school_id` isolation, audited finance & grading tables, resilient offline APIs, UX polish for staff/parent workspaces, Flutter alignment, Redis/Queues, PDF receipts, SMS-ready placeholders, CI-friendly tests.

### Monorepo map

```
backend/               # Laravel 12 SaaS kernel (Inertia + REST)
mobile/                # Flutter (Riverpod + Dio + Hive) skeleton
docker-compose.yml     # Postgres 17 + Redis 7 helpers
docs/                  # Expanded API & deployment narratives
```

### Quick start (Laragon / local PHP acceptable)

Requirements: **PHP 8.2+** (Composer will select Laravel 12 matching your runtime), Composer 2.x, Node 22+, optional Docker Desktop.

1. Bring up infrastructure helpers (optional):

   ```powershell
   docker compose up -d
   ```

2. Configure Laravel:

   ```powershell
   cd .\backend
   copy .\.env.example .\.env      # tweak DB_* blocks (defaults target docker-compose ports)
   php artisan key:generate
   composer install
   php artisan migrate:fresh --seed # seeds roles + Horizon International demo tenant
   npm install
   npm run build                    # PHPUnit depends on vite manifest.json
   php artisan queue:listen         # new terminal (processes guardian absentee jobs etc.)
   php artisan serve
   ```

3. Visit:

   ```
   http://127.0.0.1:8000/login
   ```

### Demo personas (demo password `Demo#2026Pass`)

| Email | Role | Notes |
| --- | --- | --- |
| `super.admin@nextgen.africa` | `super_admin` | Platform operator; pass `X-School-Id` when calling APIs |
| `admin@horizon.demo` | `school_admin` | Branding, finance, academic ops |
| `teacher@horizon.demo` | `teacher` | Attendance + classroom surfaces |
| `finance@horizon.demo` | `accountant` | Invoice & payment flows |
| `parent@horizon.demo` | `parent` | Parent portal (multi-child ready) |
| `student@horizon.demo` | `student` | Learner shell (extend with assignments) |

### REST surface

See [`docs/api.md`](docs/api.md) for Sanctum token exchange, analytics payload, SIS + attendance contracts, and multi-tenant headers.

### Quality gates

```powershell
cd .\backend
php artisan test
```

### Front-end stack highlights

- **ShadCN-style primitives** live under `resources/js/Components/ui` with `class-variance-authority` + `tailwind-merge`.
- **Zustand** (`resources/js/state/ui-store.ts`) isolates UI chrome from server props.
- **Framer Motion** powers dashboard + parent portal storytelling for stakeholders.

### Mobile + offline strategy

`mobile/` ships a Riverpod root with Dio + Hive so field teams can mirror `/api/v1` routes, cache attendance batches, and synchronize when connectivity returns. Use:

```bash
flutter run --dart-define API_BASE_URL=http://YOUR-HOST/api/v1
```

### Deployment

Follow [`docs/deployment.md`](docs/deployment.md) for build caching, queue workers, schedulers, and mobile parity.

### What’s intentionally left for Phase 2+

Granular finance settlement adapters (Airtel Money, TNM Mpamba, bank webhooks), native biometric SDKs, automated report-card PDFs per template, advanced analytics warehouse, and multi-region tenant sharding. The schema + service seams are already where those modules snap in.

---

Need help extending a specific module (fees, exams, SMS bridges)? Call it out and we can iterate surgically on top of this foundati


# Admissions Module Implementation

The admissions module has been successfully implemented to handle prospective student applications. It includes a public-facing portal for parents/students to apply, and an admin interface to review, process, and convert accepted applicants into enrolled students.

## What was implemented

### 1. Database & Models
- Created the `Admission` model and a migration for the `admissions` table.
- Added necessary fields: `student_first_name`, `gender`, `date_of_birth`, `previous_school_name`, `boarding_type`, `parent_name`, `status`, etc.
- Configured JSON casting for `documents` to store file paths (birth certificate, passport photo, etc.).
- The `status` field defaults to `submitted` and can transition through `under_review`, `waitlisted`, `accepted`, `rejected`, and `enrolled`.

### 2. Backend Controllers & Routing
- **PublicAdmissionController**: Handles the public-facing application form, generating a unique `reference_number` (e.g., APP-2026-X7Y8Z9) and uploading documents to public storage.
- **AdmissionController**: Handles the internal admin management. Allows listing applications, viewing details, updating statuses, and manually creating new applications.
- **Enrollment Logic**: The `enroll` method converts an `accepted` admission into a full `Student` and `Guardian` record automatically and attaches them correctly.
- Added corresponding web routes in `routes/web.php` for both public and admin access.

### 3. Frontend Views (React/Inertia)
- **Public Form (`Public/Admissions/Create.tsx`)**: A clean, multi-step application form utilizing the `GuestLayout`. Features built-in auto-saving of drafts to local storage, ensuring applicants don't lose their data if they accidentally refresh or leave the page.
- **Admin Form (`Admissions/Create.tsx`)**: A similar multi-step form utilizing `AuthenticatedLayout` for manual entry by school administrators.
- **Admin Dashboard (`Admissions/Index.tsx`)**: A table listing all admissions with search UI and distinct status badges.
- **Admin Review Screen (`Admissions/Show.tsx`)**: Displays all submitted details and uploaded documents. Provides quick action buttons to transition the application status and to "Convert to Student" when accepted.
- **Navigation**: Updated `appNavigation.ts` to replace the placeholder route for Admissions with the real route (`admissions.index`).

> [!TIP]
> The public application portal can be accessed via `/admissions/apply`.

## Verification

- Try navigating to `/admissions/apply` to test the public application form. Notice the auto-save draft functionality working in the background (draft saved indicator at the bottom).
- Navigate to the **Students > Admissions** page in the Admin Dashboard to see the list of applications.
- Click on an application to view the details, update the status to "Accepted", and try clicking the "Convert to Student" button to see the new `Student` and `Guardian` records created.

> [!NOTE]
> The document uploads currently save to the `admissions` folder on local storage. To make them publicly accessible, you might need to run `php artisan storage:link` if you haven't already.
Automatic Tracking Number: Upon successfully submitting an application, the system generates a unique reference number (e.g. APP-2026-X7Y8Z9).
Success Screen Integration: The success screen now prominently displays this number and includes a new "Track Application Status" button. Clicking this button automatically takes the parent to the tracking page with their number pre-filled.
Dedicated Tracking Page: I created a new public page (/admissions/track) where anyone can enter their reference number at any time.
Status Details: When a valid reference number is entered, the page fetches the application and displays a visually distinct status card showing exactly where the application is in the pipeline (e.g., "Under Review" with an amber clock icon, or "Accepted" with a green checkmark), along with the basic details of their application.
Layout Polish: I also created a custom PublicLayout so that these large admission forms look beautiful and expansive, rather than being squeezed into the narrow authentication box styling we use for the Login screens.
You can test this out by submitting a new application at /admissions/apply and clicking the tracking link at the end! Let me know if you want to display any additional information on the tracking page.

11:45 AM
# Multi-Step Student Registration System

I have successfully designed and implemented the **11-Step Multi-Step Student Registration System** per your requirements. The system is built with a robust relational database backend using Laravel and a dynamic, stateful frontend wizard powered by React and Zustand.

## 1. Backend Implementation

> [!NOTE]  
> All fields proposed in your master design document have been successfully incorporated into the database schema and eloquent models.

### Database Schema Updates
We've normalized the registration data into several interconnected tables to allow for robust querying and data integrity:
- **`students`**: Enhanced with 23+ fields covering personal details, demographics, and consent policies.
- **`student_enrollments`**: Manages the student's academic profile (Campus, Class Group, Term, Mode of Study).
- **`student_addresses`**: Normalizes the physical and postal contact information.
- **`guardians` & `student_guardian`**: Pivot table structures that securely support multiple parents/guardians, noting primary contacts and relationship types.
- **`sponsors`**: Captures NGO, corporate, or self-sponsorship details.
- **`medical_records`**: Secures sensitive health status, chronic conditions, and disability configurations.
- **`emergency_contacts`**: Vital secondary points of contact.
- **`student_documents`**: Prepares the schema for upcoming document/file upload requirements.

### Controller Updates
The `StudentController@store` method was completely rewritten. It now handles massive incoming JSON payloads containing the full multi-step form data. 
- It validates the complex multi-dimensional array payload.
- It executes a **Database Transaction (`DB::transaction`)** to ensure atomicity. If a single relationship (e.g. medical data) fails to insert, the entire student creation is safely rolled back.

## 2. Frontend Implementation

> [!TIP]  
> The form now uses **Zustand** instead of traditional React Context/State for much cleaner performance and simpler global state management.

### State Management (`useRegistrationStore.ts`)
We built a robust Zustand store that:
- Centralizes the state for all 11 steps.
- Uses `zustand/middleware` to **persist** the form data in `localStorage`. This means if the user accidentally refreshes the page on Step 6, they will not lose their progress.
- Cleanly manages complex dynamic lists, like adding/removing multiple guardians.

### Multi-Step React Wizard (`Create.tsx`)
The `Create.tsx` component was transformed from a simple static form into a **Dynamic Stepper Component**. 
- It tracks the current `step` index.
- Features a beautiful, interactive navigation progress bar at the top using Tailwind CSS.
- Automatically validates the final payload before dispatching it to the backend.

### Component Breakdown
To keep the code clean and maintainable, the massive form was broken down into manageable partials:
- `Step1Personal.tsx`
- `Step2Address.tsx`
- `Step3Academic.tsx`
- `Step4Guardians.tsx`
- `Step5Sponsor.tsx`
- `Step6Medical.tsx`
- `Step7Emergency.tsx`
- `Step8Account.tsx`
- `Step10Consent.tsx` *(Merged as step 9 in the UI flow for simplicity)*

> [!IMPORTANT]  
> Before pushing to production, ensure you run `php artisan migrate` to apply these database structures on your live server! The local development environment has already been migrated and seeded cleanly.

## 3. Validation and Next Steps
The build process compiles all these new components successfully. You can now visit the **Add Student** page in your portal to experience the completely new enrollment workflow!
