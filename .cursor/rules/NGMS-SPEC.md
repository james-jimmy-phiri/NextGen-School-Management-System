# NGMS Specification Alignment

Authoritative references (always consult before schema or module work):

- **Database:** [`docs/NGMS-Database-Design.docx`](../docs/NGMS-Database-Design.docx) — 60 tables, 14 groups, PostgreSQL/UUID/tenant_id
- **Database summary (agent):** [NGMS-DATABASE.md](./NGMS-DATABASE.md)
- **SRS:** NGMS Software Requirements Specification v1.0 (June 2025)

## Product context

NGMS is a **multi-tenant SaaS** school management platform for **Malawian** primary/secondary schools.

- **Tenancy (design):** `tenants` table, `tenant_id` UUID on all scoped tables, PostgreSQL RLS
- **Tenancy (Laravel app today):** `schools` + `school_id` bigint — map 1:1 until Postgres migration
- **Currency:** MWK · **Dates:** DD/MM/YYYY · **Language:** English

## Schema groups (14)

Platform · Identity · Academic Structure · Students · Attendance · Exams & Academics · Finance · Staff · Communication · Library · Hostel · Transport · Discipline · Health · Documents

Full table list: see **NGMS-DATABASE.md**.

## Laravel ↔ design doc naming

| Doc | App |
|-----|-----|
| tenants | schools |
| classes | class_groups |
| class_subjects | teacher_subject_allocations / class_group_subject |
| attendance_sessions | student_attendance_sessions |
| attendance_records | student_attendance_records |
| teacher_attendance | staff_attendances |

## Implementation status (high level)

| Group | Doc tables | App status |
|-------|-----------|------------|
| Platform | tenants, subscriptions, support_tickets | schools only |
| Identity | users, roles, permissions, audit_logs | Spatie RBAC + activity log |
| Academic | 10 tables | Strong (school setup) |
| Students | 5 tables | Medium (admissions, registration, guardians) |
| Attendance | 3 tables | Partial (marking UI added) |
| Exams | 6 tables | Partial (assessments ≠ full exam model) |
| Finance | 6 tables | Partial (fee structures, invoices, payments; discounts/expenses tables exist) |
| Staff | 3 tables | Not started |
| Communication | 4 tables | Partial (announcements, portal_messages) |
| Library / Hostel / Transport | 7 tables | Not started |
| Discipline | incidents, sanctions | discipline_records only |
| Health | 2 tables | medical_records, clinic_visits |
| Documents | 1 table | student_documents + polymorphic stub |

## Coding conventions

1. Scope all tenant queries by `school_id` (future: `tenant_id` UUID)
2. Spatie permissions: `finance.manage`, `attendance.manage`, `communication.manage`, `admissions.manage`
3. Parent routes: `portal.*` + `role:parent`
4. Public admissions: `SchoolPublicLayout` + school branding
5. On payment: update invoice `balance_due` / `amount_paid` (trigger logic per DB doc §6)
6. Admission statuses: doc `pending/approved` ↔ app `submitted/accepted`

## MVP priorities (SRS)

FR-010–11 Admissions & profiles · FR-013 Attendance · FR-016–17 Marks & report cards · FR-020–22 Finance · FR-025–26 Communication · FR-027 Parent portal
