# 🚀 Quick Start - Backend Setup (5 minutes)

## Step 1: Setup Environment
```bash
cd backend
cp .env.example .env
```

**Check `.env` contains:**
```
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:astrox88dpro2024@localhost:5432/mydb"
JWT_SECRET="dev-secret-key-not-for-production-12345"
```

## Step 2: Make Sure PostgreSQL is Running
```bash
# Check if PostgreSQL is running on port 5432
psql postgresql://postgres:astrox88dpro2024@localhost:5432/mydb

# If not running, start it:
# macOS (Homebrew):
brew services start postgresql

# Or using Docker:
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=astrox88dpro2024 \
  -e POSTGRES_DB=mydb \
  postgres:15
```

## Step 3: Install & Setup Database
```bash
npm install
npm run db:setup
```

**Expected output:**
```
🌱 Starting database seed...
✅ Created user: test@example.com
✅ Created user: demo@example.com
✅ Created user: admin@example.com
✨ Seed completed!
```

## Step 4: Start Backend Server
```bash
npm run dev
```

**Expected output:**
```
🔍 Testing database connection...
📍 Database URL: localhost:5432
✅ Connected to database successfully
✅ Server running on http://0.0.0.0:3000
📝 API available at http://0.0.0.0:3000/api
```

## Step 5: Test Login (in another terminal)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com"
  }
}
```

## Test Credentials

| Email | Password |
|-------|----------|
| test@example.com | password123 |
| demo@example.com | demo1234 |
| admin@example.com | admin123 |

---

## Common Issues & Fixes

### PostgreSQL not running
```bash
# Check if running
pg_isready -h localhost -p 5432

# Start it
brew services start postgresql
```

### "Cannot connect to database"
```bash
# Test connection manually
psql postgresql://postgres:astrox88dpro2024@localhost:5432/mydb

# If database doesn't exist, create it
createdb mydb
```

### "DATABASE_URL is not set"
```bash
# Make sure .env exists
cat backend/.env | grep DATABASE_URL

# If missing:
cp backend/.env.example backend/.env
```

### Need to reseed data
```bash
npm run db:seed
```

### View database UI
```bash
npm run db:studio
# Opens http://localhost:5555
```

---

## ✅ Done!

Your backend is ready. Frontend can now:
- Login with test credentials
- Sign up new accounts
- Get JWT tokens
- Access protected endpoints

**Next:** Setup frontend login form to call `/api/auth/login`
