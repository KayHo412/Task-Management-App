# TaskFlow - Modern Task Management Application

A full-stack task management application with team collaboration, drag-and-drop task management, calendar view, and theme customization. Built with React 19 + Vite on the frontend and Express 5 + Prisma on the backend.

## 🎯 Features

### Core Features
- **User Authentication** - Secure register/login with JWT tokens
- **Task Management** - Create, read, update, delete tasks with priorities and due dates
- **Team Collaboration** - Create teams, invite members, manage team-specific tasks
- **Personal & Team Tasks** - Tasks can be personal or assigned to teams with automatic filtering
- **Drag & Drop** - Reorder tasks between columns (Todo, In Progress, Done)
- **Calendar View** - Visualize tasks on an interactive calendar
- **Dark/Light Theme** - Toggle between light and dark modes with persistent settings
- **Task Board** - Organized task lists by status with team context switching
- **Settings Modal** - Customize appearance and preferences

## 🛠 Tech Stack

### Backend
- **Node.js 18+** with Express 5
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **PostgreSQL** for data persistence
- **Zod** for request validation
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React 19** with Vite
- **TypeScript** for type safety
- **@hello-pangea/dnd** for drag-and-drop functionality
- **date-fns** for date utilities
- **lucide-react** for icons
- **CSS** with variables for theming

### Development & Testing
- **Vitest** for unit testing
- **ESLint** for code quality
- **Docker & Docker Compose** for containerization

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL (or use Docker)

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The backend will start on `http://localhost:3000`

**Environment variables** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanagement
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5174`

**Test credentials** (from seed):
- Email: `test@example.com`
- Password: `password123`

## 🚀 Running with Docker Compose

```bash
# Create observability network if needed
docker network create observability

# Build and start containers
docker-compose up --build
```

- Frontend: `http://localhost` (port 80)
- Backend: `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks
- `GET /api/tasks` - Get all tasks (personal and team)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get team details
- `DELETE /api/teams/:id` - Delete a team (owner only)
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:memberId` - Remove member from team

### Health
- `GET /api/health` - Check backend health

## 🎮 Usage Guide

### Creating Tasks
1. Log in with your credentials
2. Click "Create Task" or the + button
3. Enter task title, description, priority, and due date
4. Select a team (optional) or leave it for personal tasks
5. Tasks are created and visible in the appropriate list

### Managing Teams
1. Click the **Teams** button in the header
2. Create a new team with the "Create Team" form
3. Switch between teams using team buttons
4. Click the trash icon to delete a team (owner only)
5. Add members by their email address

### Task Board Navigation
- **My Tasks** - Shows only personal tasks
- **Team Selection** - Click team name to view team-specific tasks
- **Columns** - Tasks organized by Todo, In Progress, Done
- **Drag & Drop** - Drag tasks between columns to change status

### Theme & Settings
1. Click the **Settings** button in the header
2. Toggle **Dark Mode** to switch themes
3. Settings persist across sessions

### Calendar View
1. Click the **Calendar** button in the header
2. View tasks with due dates on the calendar
3. Tasks appear on their due date
4. Click a date to see tasks for that day

## 🏗 Project Structure

```
Task-Management-App/
├── backend/
│   ├── src/
│   │   ├── api/              # API route handlers
│   │   │   ├── auth.ts       # Authentication endpoints
│   │   │   ├── tasks.ts      # Task CRUD endpoints
│   │   │   ├── teams.ts      # Team management endpoints
│   │   │   └── health.ts     # Health check
│   │   ├── middleware/        # Express middleware
│   │   ├── services/          # Business logic
│   │   └── db.ts             # Database client
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── TaskBoard.tsx  # Main board component
│   │   │   ├── TaskList.tsx   # Task list component
│   │   │   ├── TeamsModal.tsx # Team management
│   │   │   ├── SettingsModal.tsx # Settings
│   │   │   └── Calendar.tsx   # Calendar view
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS stylesheets
│   │   └── App.tsx            # Main app component
│   └── package.json
│
└── docker-compose.yml         # Docker composition
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Type checking
cd backend && npm run typecheck
cd frontend && npm run typecheck
```

## 🔧 Development Commands

### Backend
```bash
npm run dev              # Start dev server with watch
npm run build            # Build TypeScript
npm run lint             # Fix linting issues
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio
npm test                 # Run tests
```

### Frontend
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run lint             # Fix linting issues
```

## 📋 Database Schema

### Key Models
- **User** - Registered users with email and hashed password
- **Task** - Tasks with title, description, priority, due date, and team context
- **Team** - Teams with owner and members
- **TeamMember** - Join table for team membership with roles

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Team ownership validation for team operations
- User context validation for task operations
- Request body validation with Zod

## 📝 Notes

- Environment files are gitignored; use `.env.example` as templates
- Database migrations are tracked in `backend/prisma/migrations/`
- Task data includes `teamId` for team-specific filtering
- Frontend uses environment variables for API URL configuration

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linters: `npm run lint`
4. Run tests: `npm test`
5. Commit with clear messages
6. Open a pull request


