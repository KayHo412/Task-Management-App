[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/UrSBfkqg)
# Web Software Production
Welcome to the starter repository for your team project in the **Web Software Production** course.

As the course progress and you implement features, keep the README up-to-date.

## Project: "TeamBoard" – A Collaborative Task Management Web App
### 🎯 Project Goal
Build a full-stack web application that allows users to create, manage, and collaborate on tasks within teams. The app should support basic CRUD operations, user authentication, and real-time updates.

### 🧩 Core Features (Required for All Teams)
#### User Authentication
- Register, login, logout
- Join team

#### Task Management
- Create, edit, delete tasks
- Assign tasks to users
- Set due dates and priorities
- Team Collaboration

#### Create and join teams
- View team-specific task boards

### 🎨 Options (Choose 2–3 per team)
Teams can personalize their app by selecting from the following enhancements:
- AI Assistant: Suggest task priorities or deadlines using a simple ML model or rule-based logic.
- Calendar View: Visualize tasks in a calendar or timeline format.
- Notifications: Add email or in-app notifications for task updates.
- Analytics Dashboard: Show team productivity metrics (e.g., tasks completed per week).
- Multilingual Support: Add localization for at least two languages.
- Security Focus: Implement advanced security features like 2FA or audit logs.
- File Attachments: Allow users to upload files to tasks.
- Custom Themes: Let users choose or create UI themes.
- Responsive UI: Works well on desktop and mobile.
  
### 🛠️ Tech Stack Guidelines
Frontend: React
Backend: Node.js (Express)
Database: PostgreSQL
DevOps: Docker, GitHub Actions, CI/CD pipeline
Testing: Unit + integration tests using Jest, Mocha, Cypress, Playwrite, etc.

## Technical Setup Details
This project is built with React + TypeScript + Vite

### Development Setup
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### ESLint Configuration
If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules.