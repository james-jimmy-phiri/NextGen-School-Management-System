# REST API Surface (`/api/v1`)

Authentication uses **Laravel Sanctum personal access tokens** (preferred for Dio on Flutter).

## Token lifecycle

```http
POST /api/v1/auth/token
Content-Type: application/json

{ "email": "super.admin@nextgen.africa", "password": "•••••••" }
```

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "token": "plaintext-only-once",
    "token_type": "Bearer",
    "user": { "...": "..." }
  }
}
```

```http
DELETE /api/v1/auth/token
Authorization: Bearer {token}
```

```http
GET /api/v1/auth/profile
Authorization: Bearer {token}
```

Super administrators may impersonate tenants by attaching `X-School-Id: {schoolId}` alongside the bearer token. Other roles inherit their `users.school_id` automatically via the `ResolveTenant` middleware binding.

### Rate limits

`/api/v1/auth/token` is throttled via the `login` limiter (**10**/minute per IP+email fingerprint).

### Standard payload envelope

Authenticated routes return `{ "success": true, "message": "OK", "data": … }`. Validation failures resolve to `{ "success": false, "message": "…", "errors": … }` with HTTP 422 semantics.

### Core modular routes

| Module | Verb | Route | Purpose |
| --- | --- | --- | --- |
| Diagnostics | GET | `/api/v1/dashboard` | Tenant dashboard analytics bundle |
| School admin | GET | `/api/v1/schools` | Paginated SaaS tenants (scoped) |
|  | POST | `/api/v1/schools` | Super-admin provisioning |
|  | PATCH | `/api/v1/schools/{school}` | Update branding/settings |
| SIS | GET | `/api/v1/students` | Pagination + fuzzy search (`?search=`) |
|  | POST | `/api/v1/students` | Admissions intake |
|  | GET | `/api/v1/students/{student}` | Guardian-ready profile envelope |
| Attendance | POST | `/api/v1/attendance/sync` | Upsert session + pupil rows; dispatches guardian jobs on `absent` |

> Tip: Extend with resource controllers mirroring `/finance`, `/communication`, `/academics`, etc.—the tenancy + authorization guards are centralized so new modules only ship policies & services.

## PDF receipts

Finance PDFs reuse `barryvdh/laravel-dompdf`; queue a dedicated job (`invoice:generate-pdf`) in later phases once storage disks switch from `local` to `s3`.
