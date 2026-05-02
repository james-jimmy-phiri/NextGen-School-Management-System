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

Need help extending a specific module (fees, exams, SMS bridges)? Call it out and we can iterate surgically on top of this foundation.
