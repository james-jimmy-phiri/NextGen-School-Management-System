# NGMS implementation plan

**Baseline:** *Next-Generation School Management System Software Requirements Specification*, v1.0, 14 October 2026 (`docs/NGMS_Software_Requirements_Specification.docx`).

**Compared against:** current Laravel 12 + Inertia/React workspace, REST `/api/v1`, Flutter scaffold, and `backend/config/erp_pages.php` placeholders.

**Rule from SRS §2.7.8:** a later module starts only after the modules it depends on are accepted. Existing schema and screens for later modules are **kept**, but product effort follows the phase order below until exit criteria are met.

The June 2025 SRS (20 modules) is **not** the sequencing baseline.

---

## Verdict

The stack and product direction match the document (multi-tenant SaaS, Sanctum, RBAC, school workspace, parent portal, MWK, Malawi payment *labels*). **No phase currently meets Annex 3 exit criteria.**

| Phase | Modules | Est. Must-FR coverage | Status |
| --- | --- | --- | --- |
| 1 Foundation | M1, M2 | ~90% | Closed for Must FRs except MFA (deferred) |
| 2 Finance MVP | M3–M5 | ~22% | Partial M3/M4 CRUD; M5 schema only |
| 3 Engagement | M6, M7 | ~48% | Parent web portal + attendance/marks; no SMS/apps/report-card PDFs |
| 4 Commercial | M8, M9 | ~10% | Marketing site + subscription models; no AI, no platform billing |
| 5 Extended ops | M10–M13 | ~14% | Timetable UI; library/HR/transport/hostel tables without product UI |
| 6 Advanced | M14–M16 | ~13% | Clinic visits + awards; LMS/alumni/statutory not started |

---

## What already matches the SRS

### M1 — Platform foundation (partial)

- Multi-tenant `school_id` on core tables; `ResolveTenant`; super-admin `X-School-Id` intent in docs
- Email **or phone** login, password reset, Sanctum token API (`/api/v1/auth/*`); account lockout after 5 failed attempts (admin unlock). **MFA/2FA is deferred**
- Users, roles, permissions, audit log UI (Spatie)
- School profile, academic years, terms, classes, streams, subjects, departments, grading systems
- Campus table exists (FR6.4 is Want)

### M2 — Student and guardian (partial)

- Student 11-step registration (personal, address, academic, guardians, sponsor, medical, emergency, account, consent)
- Guardian links; public admissions apply / track / convert to student (FR13.5 is Want — already built)
- Enrolment records (`student_enrollments`)

### M3 / M4 — Finance slice

- Fee structures, invoices (incl. lines, statuses used in UI), manual payments (cash, labelled Airtel/Mpamba/bank/cheque)
- Parent portal fee view

### M6 / M7 — Engagement slice

- Parent portal: children, attendance, academics, fees, behaviour, health, documents, timetable, messages, announcements, calendar
- Staff attendance capture + absentee guardian job stub
- Marks entry, subject/class operational assignment, timetable period CRUD
- Announcements and school calendar

### Schema already laid for later modules (do not rebuild)

Staff profiles, leave, payroll, books/borrowings, hostel rooms/allocations, transport routes/vehicles, clinic visits, discipline records, student awards, subscriptions, support tickets, OTP codes, report cards, discounts, expenses.

---

## Gaps vs Must requirements (build this)

### Phase 1 close-out — M1 (FR1–FR10)

| ID | Gap | Implementation notes |
| --- | --- | --- |
| FR2 | Login is email-only; MFA unused | Allow phone **or** email; wire `otp_codes.purpose = two_factor` for privileged roles |
| FR4.5 | No lockout | Track failed attempts; lock after 5; deactivate-on-idle policy later |
| FR7.4 | No numbering/print templates | School settings: admission, invoice, receipt sequences + header/footer |
| FR7.5 | No communication prefs | Sender name, default channel, quiet hours (even before SMS live) |
| FR8.3–8.4 | Idle/concurrent sessions; timed support access | Session config + audited impersonation with expiry |
| FR9.2 | No audited PDF/Excel/CSV exports | Start with students, invoices, attendance |
| FR10 | No import | CSV templates + validate-preview + transactional commit + rollback summary |
| Annex 3 | No CI; thin tests | GitHub Actions: lint, `php artisan test`, tenant-isolation tests |
| FR6.3 | Isolation not proven | Feature tests: school A cannot read school B students/invoices |

**Exit (Annex 3):** isolation, auth, RBAC, audit tested; school setup + student/guardian + import accepted; CI + backups + baseline monitoring.

### Phase 1 close-out — M2 (FR11–FR14)

| ID | Gap | Implementation notes |
| --- | --- | --- |
| FR11.3 | Status field exists; no workflow UI | Applicant → Active → Suspended / Transferred / Withdrawn (reason) / Graduated |
| FR11.4 | Medical/SNE on student; access not restricted enough | Policy + audit for special-needs fields |
| FR12.2 | Portal parents seeded; no school verification step | Guardian must be verified before portal login |
| FR12.3–12.4 | No family account / responsible payer | `families` + sibling grouping; payer on enrolment |
| FR13.4 | No class-list print | PDF/CSV class lists |
| FR14 | Nav placeholders only | Bulk promotion wizard (fee-balance warnings), transfer-out + clearance, graduate/leave |

Admissions already exceeds Want FR13.5 — keep and harden (documents, numbering FR7.4).

### Phase 2 — M3 Fees (FR15–FR19) — **priority after Phase 1**

SRS: first revenue-protecting capability.

1. Fee **categories** and **schedules** by year/term/class/learner category; mandatory vs optional; due dates  
2. Schedule **approval + version history**  
3. Individual + **bulk** invoice generation with duplicate guard and preview  
4. Invoice statuses: Draft, Issued, Part-paid, Paid, Overdue, Cancelled  
5. Credit/debit notes (no silent edit of posted invoices)  
6. Invoice **PDF** (DomPDF already in stack narrative)  
7. Discount/scholarship rules + approval (table `discounts` exists; wire UI + invoice impact)  
8. Student **statement**, arrears **ageing**, **opening-balance** import  
9. Family statement once M2 family accounts exist  
10. Want later: late fees, instalment plans, clearance policy  

### Phase 2 — M4 Payments (FR20–FR25)

1. Payment statuses: Pending → Confirmed → Posted / Exception / Reversed  
2. Unique **payer reference** per learner/family  
3. Allocation to one or more invoices; **credits** for over/advance pay (today overpay is rejected)  
4. Numbered receipts; reprint marked duplicate; void only via reversal  
5. **Provider adapter** interface (Airtel Money, TNM Mpamba, bank file); authenticated **idempotent** callbacks  
6. Settlement import + match + exception queue + batch approval  
7. Daily cash-up  
8. Reverse / refund / move-payment with dual control  
9. Secure per-school provider credentials  

Do not fake live mobile-money until a sandbox adapter exists.

### Phase 2 — M5 Accounting (FR26–FR31)

1. Default Malawi school **chart of accounts** + mapping from fees/payments/expenses  
2. Automatic ledger postings  
3. Manual journals with approval  
4. Period close/lock  
5. Expense capture + approval (table exists)  
6. Cashbook; income/expenditure reports  
7. Qualified accountant review before production (SRS comment on FR26)

**Phase 2 exit:** fee schedules, invoices, statements, payments, receipts, allocation, reconciliation exceptions, reversals, expenses, ledger, finance reports; mobile-money/bank **validated** (sandbox acceptable).

### Phase 3 — M6 Communication (FR32–FR36)

Already: parent web portal.

1. SMS / email / push adapters + templates + delivery logs (FR33)  
2. Automated notices: absence, invoice issued, payment received, overdue (FR34) — job exists only for absence  
3. Flutter **Android** parent + teacher apps on the shared API (current `mobile/` is a bootstrap screen)  
4. Learner portal (student role is seeded, not a product)  
5. Enquiry / appointment threads beyond current messages  
6. Pay-from-portal (FR22.5 Want, with M4)

### Phase 3 — M7 Academic core (FR37–FR41)

Already: subjects, allocations, attendance, marks grid, grading scales.

1. Assessment types + **weights**; lock after publish  
2. Results aggregation, ranking, approval  
3. **Report card** templates + PDF + parent visibility of **published** cards only (`report_cards` model)  
4. Attendance reports / chronic absence (replace analytics mock data)  
5. Teacher attendance (staff_attendance table)

**Phase 3 exit:** channels with delivery tracking, parent portal **and** apps, attendance, assessments, report cards; 3–5 school pilot.

### Phase 4 — M8 AI (FR42–FR44)

Start only after M7. Replaceable model adapter, drafts only, no writes to marks/finance, age-appropriate tutor, metering, safety log. Out of scope: automated official grading, cheating detection, risk scoring.

### Phase 4 — M9 Platform ops (FR45–FR48)

Plans, student/module limits, school subscription invoices, grace/suspend (no data delete), onboarding checklist, support tickets UI, queue/error/backup monitoring. Marketing site (`/site/*`) can stay as the public funnel.

### Phase 5 — M10–M13

Demand-validate with two pilots before heavy UI (Annex 3).

- **M10:** clash detection, publish timetable, exam sessions, invigilation, national exam registration  
- **M11:** staff directory UI, leave workflow, payroll/payslips, statutory **export files** (not e-filing — out of scope)  
- **M12:** catalogue + issue/return + fines; then stores/assets/PO  
- **M13:** assign learners to routes; hostel beds; **exeat**; boarding/transport fees → M3  

### Phase 6 — M14–M16

- **M14:** materials, assignments, quizzes (placeholder nav today)  
- **M15:** restrict health; staff discipline workflow; counselling/safeguarding  
- **M16:** alumni; replace mock analytics with Annex 1 indicators; statutory returns; data export/portability  

---

## Suggested sprint slicing (after this review)

Work in this order so dependencies stay honest.

### Sprint block A — Phase 1 hard gates (done)

1. Tenant isolation tests  
2. Failed-login lockout (MFA **skipped** for later)  
3. Document numbering (admission / invoice / receipt / application)  
4. CSV import (students, guardians) with preview/rollback  
5. Promotion / transfer / graduate workflows  
6. Family account + responsible payer + guardian verification  
7. GitHub Actions CI  

**Deferred:** two-factor authentication (FR2 MFA) until a later security hardening pass.  

### Sprint block B — Finance MVP (4–6 sprints)

1. Fee schedule versioning + bulk invoicing + PDFs  
2. Statements + ageing + opening balances  
3. Payment lifecycle + receipts + credits  
4. Reconciliation exception queue (file import first, APIs second)  
5. Chart of accounts + auto postings + expense approval + period close  

### Sprint block C — Phase 3 (then stop and pilot)

1. SMS adapter + notification jobs  
2. Report card generate/publish/PDF  
3. Flutter parent app: login, children, fees, attendance  
4. Wire analytics pages to live queries  

---

## Explicitly do **not** implement (SRS §1.5)

- Native iOS as a first-release requirement  
- National EMIS replacement / live video / exam proctoring  
- AI cheating detection or auto-publish of official marks  
- Predictive risk scoring  
- Biometric hardware  
- Direct statutory payroll **filing**  
- Cafeteria POS hardware  

---

## Definition of done per module

A module is **accepted** when:

1. Must FRs in Table 4 for that module are in school workspace (or portal) — not only `erp_pages` scaffolds  
2. Tenant isolation tests exist for its tables  
3. Role permissions match `RolePermissionSeeder` / policies  
4. Sensitive actions hit activity log (FR8.1)  
5. Annex 3 exit criteria for its phase are evidenced (tests + pilot checklist)

Scaffold pages under `/app/{pageKey}` remain a **backlog index**, not done.
