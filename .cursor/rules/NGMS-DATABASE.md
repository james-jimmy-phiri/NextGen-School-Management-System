# NGMS Database Design — Authoritative Reference

**Source document:** `docs/NGMS-Database-Design.docx`  
**Version:** 1.0 · June 2025 · PostgreSQL 14+  
**Scope:** 60 tables · 14 schema groups · multi-tenant SaaS

When implementing or migrating schema, treat the Word document as canonical. This file is the agent-readable summary.

---

## Design principles

1. **Multi-tenancy:** Every tenant-scoped row has `tenant_id` (UUID FK → `tenants.id`). PostgreSQL RLS: `tenant_id = current_setting('app.tenant_id')::UUID`.
2. **Primary keys:** UUID `id DEFAULT gen_random_uuid()`.
3. **Soft delete:** `is_active` / `status` flags on users, students, staff — no hard deletes on critical records.
4. **Audit:** `audit_logs` with `old_values` / `new_values` JSONB.
5. **Money:** `NUMERIC(12,2)` — never FLOAT.
6. **Scores:** `NUMERIC(6,2)` marks; `NUMERIC(5,2)` percentages.
7. **Denormalised columns** maintained by triggers: `invoices.balance`, `books.available_copies`, report card aggregates.

---

## Laravel implementation mapping

| Design doc | Laravel / current app | Notes |
|------------|----------------------|-------|
| `tenants` | `schools` | Use `school_id` (bigint) today; target UUID `tenant_id` on Postgres migration |
| `classes` | `class_groups` | Year groups / forms per academic year |
| `class_subjects` | `teacher_subject_allocations` + `class_group_subject` | Teacher-class-subject assignment |
| `grading_scales` + `grade_bands` | `grading_systems` + `grading_scales` | Naming inverted in app |
| `attendance_sessions` | `student_attendance_sessions` | |
| `attendance_records` | `student_attendance_records` | |
| `teacher_attendance` | `staff_attendances` | |
| `exams` + `exam_schedules` + `marks` | `exam_sessions` + `assessments` + `assessment_marks` | Partial overlap — align toward doc model |
| `messages` | `portal_messages` (+ unused `message_threads`/`messages`) | |
| `incidents` + `sanctions` | `discipline_records` only | Split into incidents/sanctions per doc |
| `permissions` / Spatie | Spatie `permissions`, `roles`, pivot tables | Doc uses custom RBAC tables |

---

## 14 schema groups — 60 tables

### 4.1 SaaS / Platform (3)
| Table | Purpose |
|-------|---------|
| `tenants` | Root school record: name, slug, logo, motto, address, MWK currency, subscription_plan/status, branding colours |
| `subscriptions` | Billing history per tenant (plan, cycle, amount, dates, status) |
| `support_tickets` | Helpdesk: priority, status, assigned agent |

### 4.2 Identity & Access (6)
| Table | Purpose |
|-------|---------|
| `users` | All accounts; `tenant_id` NULL = super admin |
| `roles` | Per-tenant or system roles (`is_system`) |
| `permissions` | `module` + `action` (view/create/edit/delete/export) |
| `role_permissions` | M:N composite PK |
| `user_roles` | M:N with `assigned_by`, `assigned_at` |
| `audit_logs` | Immutable; `action`, `table_name`, `record_id`, JSONB diffs, IP, user_agent |

### 4.3 Academic Structure (10)
| Table | Purpose |
|-------|---------|
| `academic_years` | `name`, dates, `is_current`, `is_archived` |
| `terms` | Sub-periods within year |
| `departments` | `type`: academic \| administrative; `head_user_id` |
| `classes` | Year groups per academic year; `class_teacher_id`, `capacity`, `level` |
| `streams` | Sections within class; `room` |
| `subjects` | `code`, `is_compulsory`, `department_id` |
| `class_subjects` | class + subject + teacher (+ optional term) |
| `grading_scales` | Scale header; `is_default` |
| `grade_bands` | grade letter, min/max score, gpa_points, remark |
| `timetables` | day_of_week, start/end time, class/stream/subject/teacher/room |

### 4.4 Students (5)
| Table | Purpose |
|-------|---------|
| `students` | admission_number (unique per tenant), biodata, `user_id`, status: active/graduated/transferred/withdrawn |
| `student_enrollments` | One `is_current` enrollment per student per year; class, stream, exit_reason |
| `guardians` | Parent profile; optional `user_id` for portal |
| `student_guardians` | Pivot: `is_primary`, `is_emergency`, `receives_sms`, `receives_email` |
| `admissions` | Pre-enrollment; status: pending/approved/waitlisted/rejected; links `student_id` when approved |

### 4.5 Attendance (3)
| Table | Purpose |
|-------|---------|
| `attendance_sessions` | class, optional subject, term, date, session_type (morning/afternoon/subject), `is_submitted` lock |
| `attendance_records` | status: present/absent/late/excused; `marked_via`: manual/qr_scan/bulk |
| `teacher_attendance` | Staff check-in/out per date |

### 4.6 Exams & Academics (6)
| Table | Purpose |
|-------|---------|
| `exams` | Term exam event; type, weight_percent, `is_published` |
| `exam_schedules` | Per class/subject paper; max_score, invigilator |
| `marks` | score per student per schedule; grade computed; moderation fields |
| `report_cards` | Aggregates: total/average grade, class/stream position, comments, pdf_url |
| `assignments` | Teacher tasks with due_date, max_score, file_url |
| `assignment_submissions` | Student upload, score, feedback |

### 4.7 Finance (6)
| Table | Purpose |
|-------|---------|
| `fee_structures` | Per year/class/category; amount, frequency (per_term/per_year/one_off) |
| `invoices` | invoice_number, subtotal, discount, total, amount_paid, **balance**, status |
| `invoice_items` | Line items linked to fee_structure |
| `payments` | receipt_number, method (cash/airtel_money/mpamba/bank/cheque), gateway_response JSONB |
| `discounts` | percentage \| fixed_amount; valid_from/until |
| `expenses` | category, approval workflow (pending/approved/rejected) |

### 4.8 Staff (3)
| Table | Purpose |
|-------|---------|
| `staff_profiles` | 1:1 with user; employee_number, job_title, salary, bank, TPIN |
| `leave_requests` | Types: annual/sick/maternity/etc.; approval workflow |
| `payroll` | Period, basic/allowances/deductions/net, payslip_url |

### 4.9 Communication (4)
| Table | Purpose |
|-------|---------|
| `announcements` | target: all/teachers/parents/students/class; scheduled publish |
| `messages` | Direct in-app; sender/recipient, is_read |
| `sms_logs` | Outbound SMS audit; cost, gateway_ref |
| `notifications` | In-app/push per user; deep-link |

### 4.10 Library (2)
| Table | Purpose |
|-------|---------|
| `books` | ISBN, copies; `available_copies` via trigger |
| `book_borrowings` | borrower student/staff; fines, overdue status |

### 4.11 Hostel (2)
| Table | Purpose |
|-------|---------|
| `hostel_rooms` | block, gender, capacity |
| `hostel_allocations` | student + room + academic year |

### 4.12 Transport (3)
| Table | Purpose |
|-------|---------|
| `vehicles` | registration, capacity, driver |
| `transport_routes` | pickup_points JSONB array |
| `student_transport` | student route allocation per year |

### 4.13 Discipline (2)
| Table | Purpose |
|-------|---------|
| `incidents` | category, severity, status workflow |
| `sanctions` | warning/detention/suspension/expulsion linked to incident |

### 4.14 Health (2)
| Table | Purpose |
|-------|---------|
| `medical_records` | 1:1 per student; allergies, chronic conditions, vaccinations |
| `clinic_visits` | visit_date, complaint, diagnosis, treatment, referred flag |

### 4.15 Documents (1)
| Table | Purpose |
|-------|---------|
| `documents` | Polymorphic owner_type: student/staff/school; category, file_url, expires_at |

---

## Required database triggers (implement in app or Postgres)

| Event | Action |
|-------|--------|
| AFTER payment INSERT/UPDATE | Recalculate `invoices.amount_paid` and `balance` |
| AFTER book_borrowings INSERT | Decrement `books.available_copies` |
| AFTER borrowing return | Increment available_copies |
| AFTER marks INSERT/UPDATE | Recompute report_cards for class |
| BEFORE invoice INSERT | Auto-generate `invoice_number` |
| BEFORE payment INSERT | Auto-generate `receipt_number` |
| BEFORE student INSERT | Auto-generate `admission_number` |
| AFTER users UPDATE | Write audit_logs row |

---

## Key indexes (beyond PK/UNIQUE)

- `users(tenant_id, email)`
- `students(tenant_id, admission_number)`, `(tenant_id, status)`
- `student_enrollments(student_id, academic_year_id)`
- `attendance_records(session_id, student_id)`, `(student_id, status)`
- `marks(exam_schedule_id, student_id)`
- `invoices(student_id, status)`
- `payments(invoice_id)`, `(tenant_id, payment_date)`
- `messages(recipient_id, is_read)`
- `notifications(user_id, is_read)`
- `audit_logs(tenant_id, created_at)`
- `incidents(student_id, created_at)`

---

## Critical query patterns (from doc §8)

1. **Class roster (current year):** students → enrollments → academic_years (`is_current`) → streams.
2. **Debtors report:** sum `invoices.balance` where status not paid/cancelled, group by student/class.
3. **Daily attendance:** attendance_records → sessions filtered by class_id + date + session_type.

---

## Migration guidance for this codebase

When aligning Laravel migrations to this design:

1. Rename/add tables to match doc names where practical (`class_groups` → alias as `classes` in API).
2. Add missing tables: `subscriptions`, `support_tickets`, `exams`, `exam_schedules`, `marks`, `assignments`, `assignment_submissions`, `staff_profiles`, `leave_requests`, `payroll`, `sms_logs`, `notifications`, `books`, `book_borrowings`, hostel, transport, `incidents`, `sanctions`.
3. Split `discipline_records` → `incidents` + `sanctions`.
4. Add `student_guardians.receives_sms`, `receives_email`, `is_emergency`.
5. Extend `invoices` with `amount_paid`, `term_id`, `academic_year_id` per doc.
6. Plan Postgres + UUID migration path; until then enforce `school_id` scoping in every Eloquent query.
