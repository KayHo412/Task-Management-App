# Backend Setup & Development Guide

## Quick Start

### 1. Prerequisites
- **Node.js** v18+
- **PostgreSQL** running on localhost:5432

### 2. Setup Environment
```bash
# Copy the example env file
cp .env.example .env

# The .env file should contain:
# NODE_ENV=development
# PORT=3000
# DATABASE_URL="postgresql://postgres:astrox88dpro2024@localhost:5432/mydb"
# JWT_SECRET="dev-secret-key-not-for-production-12345"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database
```bash
# Option A: Push schema to database (no migrations folder needed)
npm run db:push

# Option B: Run migrations (if migrations folder exists)
npm run db:migrate

# Then seed test data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Expected output:
```
🔍 Testing database connection...
📍 Database URL: localhost:5432
✅ Connected to database successfully
✅ Server running on http://0.0.0.0:3000
📝 API available at http://0.0.0.0:3000/api
```

---

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:push` | Sync Prisma schema with database (no migrations) |
| `npm run db:migrate` | Run migrations |
| `npm run db:migrate:create` | Create new migration |
| `npm run db:seed` | Seed database with test users |
| `npm run db:setup` | Run migrations + seed (full setup) |
| `npm run db:studio` | Open Prisma Studio UI on localhost:5555 |

---

## Test Credentials

After running `npm run db:seed`, use these credentials:

| Email | Password |
|-------|----------|
| test@example.com | password123 |
| demo@example.com | demo1234 |
| admin@example.com | admin123 |

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
psql postgresql://postgres:astrox88dpro2024@localhost:5432/mydb

# If database doesn't exist, create it
createdb mydb

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### "DATABASE_URL is not set"
```bash
# Make sure .env exists
ls -la .env

# If missing, copy from example
cp .env.example .env
```

### "Tables don't exist"
```bash
# Sync the schema
npm run db:push

# Or create migrations
npm run db:migrate:create --name init
```

### Prisma Client not generated
```bash
# Regenerate Prisma client
npx prisma generate
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
  Response:
  ```json
  {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "test@example.com"
    }
  }
  ```

- `POST /api/auth/signup` - Register new account
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123"
  }
  ```

### Health Check
- `GET /api/health` - Server health status

---

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Example: `postgresql://postgres:astrox88dpro2024@localhost:5432/mydb`

- `JWT_SECRET` - Secret for JWT tokens (min 8 characters)
  - Development: `dev-secret-key-not-for-production-12345`
  - Production: Use a strong random string

**Optional:**
- `NODE_ENV` - Environment (development|production|test), default: development
- `PORT` - Server port, default: 3000

---

## File Structure

```
backend/
├── src/
│   ├── api/          # API route handlers
│   │   ├── auth.ts   # Login/signup endpoints
│   │   ├── tasks.ts  # Task management
│   │   └── users.ts  # User management
│   ├── middleware/
│   │   ├── auth.ts   # JWT verification
│   │   └── validators.ts
│   ├── services/
│   │   ├── userService.ts     # User DB operations
│   │   └── taskService.ts
│   ├── db.ts         # Prisma client (singleton)
│   ├── env.ts        # Environment validation
│   ├── app.ts        # Express setup
│   ├── index.ts      # Server startup
│   └── tracing.js    # OpenTelemetry setup
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed.ts       # Database seeding
├── .env.example      # Example environment file
├── .env.development  # Development environment
├── package.json
└── README.md
```

---

## Key Improvements Made

### ✅ Fixed Prisma Authentication
- Changed `.env.example` from MySQL to PostgreSQL
- Added `.env.development` with correct credentials
- Improved database connection validation

### ✅ Better Error Messages
- Database connection errors now show helpful hints
- Environment validation shows what's missing
- Auth endpoints return detailed error codes

### ✅ Database Seeding
- Created `prisma/seed.ts` with test users
- Added `npm run db:seed` command
- Added `npm run db:setup` for full initialization

### ✅ Improved Code Quality
- Singleton Prisma client to prevent connection leaks
- Added error handling and logging
- Better type safety with improved schemas
- Added JSDoc comments to functions

### ✅ Development Experience
- `.env.development` for easier local setup
- Added all necessary npm scripts
- Comprehensive troubleshooting guide

---

## Docker Deployment

For Docker, the database connection string uses the service name:

```yaml
environment:
  DATABASE_URL: postgres://postgres:astrox88dpro2024@db:5432/mydb
```

In the Docker container, this will automatically connect to the PostgreSQL service.

---

## For Your Frontend Teammate

Your teammate can now:

1. **Login** with test credentials
   - Email: `test@example.com`
   - Password: `password123`

2. **Sign up** with their own email

3. **Get JWT token** for authenticated requests

4. **Use token** in Authorization header:
   ```
   Authorization: Bearer <token>
   ```

All authentication is now working! 🎉
