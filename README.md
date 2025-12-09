# Task Management App

Task Management App is a small monorepo containing a TypeScript/Node backend (Express + Prisma) and a React + Vite frontend. It implements a simple task board with authentication, task CRUD, and a lightweight API suitable for local development and containerized deployment.

Functionality
- User authentication (register/login)
- Create, read, update, delete tasks
- Simple task board UI with task lists and forms

Tech stack
- Backend: Node 18+, Express 5, TypeScript, Prisma, PostgreSQL
- Frontend: React 19, Vite, TypeScript
- Dev/test: Vitest, ESLint

Running locally (development)
Prerequisites: Node.js (18+), npm

Backend (dev)
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The backend dev server uses `npm run dev` (tsx watch) and listens on port 3000 by default.

Frontend (dev)
```bash
cd frontend
cp .env.development.example .env  
npm install
npm run dev
```

The frontend dev server uses Vite; open the printed URL (http://localhost:5173).

Run both in separate terminals to develop the full app.

Run with Docker Compose
Note: the compose file references an external Docker network `observability`. Create it if missing:
```bash
docker network create observability
```
Then build and start containers:
```bash
docker-compose up --build
```
Frontend will be exposed on port 80 and backend on port 3000 per `docker-compose.yml`.

Production / build
Backend:
```bash
cd backend
npm install --production
npm run build
npm start
```
Frontend (build & preview):
```bash
cd frontend
npm install
npm run build
npm run preview
```

Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

Environment & database
- Backend environment templates: `backend/.env.example`
- Frontend env templates: `frontend/.env.example`, `frontend/.env.development.example`, `frontend/.env.production.example`
- Prisma is configured in `backend/prisma/schema.prisma`. Use `npm run db:push` and seed with `npm run db:seed` from the `backend` folder.

Notes
- Generated artifacts like security scan reports are in `security/` (may be removed). Keep `package-lock.json` files if you rely on lockfiles for reproducible installs.

Contributing
- Open a PR, run linters and tests. See `backend/` and `frontend/` folders for per-project details.
