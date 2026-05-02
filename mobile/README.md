# Flutter field client (Phase 1 scaffold)

This package mirrors the Laravel + Inertia SaaS controllers by consuming the canonical `/api/v1/*` endpoints. It is deliberately lightweight in this MVP so your mobile squad can sprint on UX while backend contracts stabilize.

```bash
cd mobile
flutter pub get

# Point to your running Laravel backend
flutter run --dart-define API_BASE_URL=https://YOUR-HOST.example/api/v1
```

Riverpod scopes school context the same way the web tenant resolver does (`X-School-Id` for super admins, implicit `school_id` for scoped users).

Hive persists:

- Offline attendance payloads (`POST /api/v1/attendance/sync` reconciliation)
- Guardian messaging drafts
- Cached ledger snapshots for kiosk finance windows
