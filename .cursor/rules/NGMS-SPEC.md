# NGMS Specification Alignment

Authoritative references:
- **SRS**: NGMS Software Requirements Specification v1.0 (June 2025)
- **DB**: NGMS Database Design Document v1.0 (June 2025) — 60 tables, 14 schema groups

## Product context

NGMS is a **multi-tenant SaaS** school management platform for **Malawian** primary/secondary schools.

- **Tenancy**: `schools` table = SRS `tenants`; all tenant data scoped by `school_id`
- **Currency**: MWK default; dates DD/MM/YYYY
- **Roles**: Super Admin, School Admin, Principal, Teacher, Bursar, Librarian, Nurse, Parent, Student, IT Admin
- **Phases**: Core MVP (modules 1–9, 17–18, 20) → Phase 2 (staff, library, hostel, transport, discipline, health, documents) → Phase 3 (mobile apps)

## Implementation mapping (Laravel project)

| SRS module | DB tables (SRS name) | Project table(s) | Status |
|------------|---------------------|------------------|--------|
| School config | tenants, academic_years, terms, classes, streams, subjects | schools, academic_years, terms, class_groups, streams, subjects | **Strong** |
| Students | students, enrollments, guardians, admissions | students, student_enrollments, guardians, admissions | **Medium** |
| Attendance | attendance_sessions, attendance_records | student_attendance_sessions, student_attendance_records | **Partial** — marking UI required |
| Academics | exams, marks, report_cards, assignments, timetables | assessments, assessment_marks, report_cards, timetable_periods | **Partial** — marks entry required |
| Finance | fee_structures, invoices, payments, discounts, expenses | fee_structures, invoices, payments, discounts*, expenses* | **Partial** — admin CRUD required |
| Communication | announcements, messages, sms_logs | announcements, portal_messages | **Partial** |
| Parent portal | — | portal/* routes | **Medium–High** |
| Staff | staff_profiles, leave, payroll | — | **Not started** |
| Library / Hostel / Transport | books, hostel_rooms, vehicles | — | **Not started** |
| Discipline / Health | incidents, sanctions, medical_records | discipline_records, medical_records, clinic_visits | **Partial** |
| Super Admin | tenants, subscriptions, support_tickets | schools resource only | **Partial** |

\* discounts/expenses migrations added per DB design §4.7.5–4.7.6

## Admission status vocabulary

| SRS | Current app | Notes |
|-----|-------------|-------|
| pending | submitted | Map in UI labels |
| approved | accepted | Enroll creates student |
| waitlisted | waitlisted | OK |
| rejected | rejected | OK |

## Coding conventions

1. Always scope queries by `school_id` for tenant users
2. Use Spatie permissions: `finance.manage`, `attendance.manage`, `communication.manage`, `admissions.manage`
3. Parent routes under `portal.*` with `role:parent`
4. Public admissions use `SchoolPublicLayout` + `SchoolBranding::forSchool()`
5. Prefer real DB data in portal controllers; avoid demo/random fallbacks
6. New finance records must update `invoice.balance_due` when payments are recorded

## Core MVP functional requirements (priority)

- FR-013: Student attendance marking (manual + bulk)
- FR-016–17: Marks entry + report cards
- FR-020–22: Fee structures, invoices, payments, debtors
- FR-025–26: Announcements + messaging
- FR-027: Parent portal child dashboard (real data)
- FR-010–11: Admissions + student profiles

## Out of scope v1.0

HEMIS/EMIS integration, government-school workflows, full LMS, native mobile apps (Phase 3).
