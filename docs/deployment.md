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
