## 1. Failure: Database Crash

### Detection
How will we know the database is down?
- [x] `/ready` endpoint fails because DB connection check returns error
- [x] Application logs show “PrismaClientInitializationError”
- [x] `docker ps` shows database container stopped

### Immediate Impact
Which parts of the app are affected?
- [x] Backend endpoints fail when querying data
- [x] Frontend cannot load or submit data
- [x] Users may see “Server not responding” errors

### Mitigation
What can we do to reduce impact?
- [x] Backend `/health` endpoint still works to confirm server is running
- [x] Display friendly error messages on the frontend
- [x] Log error details for developers to investigate

### Recovery
How do we restore service?
- [x] Docker automatically restarts the database container (`restart: unless-stopped`)
- [x] If restart fails, run `docker compose up -d db`
- [x] Restore latest backup using `psql < backup.sql`

---

## 2. Failure: Backend (API) Crash

### Detection
How will we know the backend is down?
- [x] `/health` endpoint fails to respond
- [x] `docker ps` shows backend container exited
- [x] Logs show application error or crash

### Immediate Impact
Which parts of the app are affected?
- [x] All API endpoints unavailable
- [x] Frontend shows “Network error” or blank data
- [x] No data requests are processed

### Mitigation
What can we do to reduce impact?
- [x] Docker restart policy automatically restarts backend container
- [x] Minimal downtime (seconds)
- [x] Use logs to quickly identify error cause

### Recovery
How do we restore service?
- [x] Verify container restarted (`docker ps`)
- [x] If persistent error, rebuild with `docker compose up -d --build backend`
- [x] Fix code or environment issue if needed

---

## 3. Failure: Frontend Crash

### Detection
How will we know the frontend is down?
- [x] Browser shows 404 or cannot connect
- [x] `docker ps` shows frontend container stopped
- [x] Nginx or React logs show an error

### Immediate Impact
Which parts of the app are affected?
- [x] Users cannot access the web interface
- [x] No requests are sent to backend

### Mitigation
What can we do to reduce impact?
- [x] Restart policy automatically restarts container
- [x] Serve static files again once restarted
- [x] Keep frontend build lightweight to restart quickly

### Recovery
How do we restore service?
- [x] Docker restarts frontend container
- [x] If restart fails, run `docker compose up -d frontend`
- [x] Rebuild frontend image if necessary

---

## 4. Failure: VM or Host Machine Failure

### Detection
How will we know the VM is down?
- [x] Host unreachable (ping or SSH fails)
- [x] Monitoring alert or downtime reported

### Immediate Impact
Which parts of the app are affected?
- [x] All services (frontend, backend, DB) go offline
- [x] Users cannot access system

### Mitigation
What can we do to reduce impact?
- [x] Keep daily backups on external storage
- [x] Document environment setup for quick redeployment
- [x] Use cloud VM snapshots or automated backups if available

### Recovery
How do we restore service?
- [x] Recreate VM or host
- [x] Clone repo and run `docker compose up -d`
- [x] Restore database using latest backup (`psql < backup.sql`)

---

## 5. Failure: Data Loss or Corruption

### Detection
How will we know data is lost or corrupted?
- [x] Application queries fail or return empty data
- [x] Database logs show corruption or missing relations
- [x] Users report missing content

### Immediate Impact
Which parts of the app are affected?
- [x] Users lose access to certain records
- [x] API endpoints return errors
- [x] System integrity affected

### Mitigation
What can we do to reduce impact?
- [x] Regular database backups (`backup.sh`)
- [x] Store backups outside container
- [x] Backup script scheduled with cron every 12 hours

### Recovery
How do we restore service?
- [x] Drop and recreate database container
- [x] Restore latest backup file using `psql < backup.sql`
- [x] Verify application data restored successfully
