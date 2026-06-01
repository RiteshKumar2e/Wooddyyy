# Wooddyyy — Study Planner & Quiz App

>A full-stack study planner and quiz application with a Node/Express + MongoDB backend and a Vite + React frontend.

## Features
- User authentication (JWT)
- Create and manage subjects, topics, quizzes, and study plans
- Student dashboard and study tools (timetable, progress, revision)

## Tech Stack
- Backend: Node.js, Express, Mongoose, JWT
- Frontend: React, Vite
- Database: MongoDB

## Repository Structure

- `backend/` — Express API, controllers, models, middleware
- `frontend/` — React app (Vite), components, pages, styles
- `make landing page.md` — notes for landing page

Example layout:

```
backend/
  server.js
  controllers/
  models/
  routes/
frontend/
  src/
    pages/
    components/
    styles/
```

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or hosted)

## Quick Start

1) Backend

```bash
cd backend
npm install
# Create a .env file with the variables below
# Development:
npx nodemon server.js
# Production:
node server.js
```

Environment variables (create `backend/.env`):

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWTs
- `PORT` — port for the backend server (default 5000)

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Environment variables (optional `frontend/.env` or `.env.local`):

- `VITE_API_URL` — base URL for the API (e.g. `http://localhost:5000`)

## Scripts

- Backend: start with `node server.js` or `npx nodemon server.js` for development.
- Frontend: `npm run dev` (start), `npm run build` (production build), `npm run preview` (preview build), `npm run lint` (linting)

## API Endpoints (high level)

- `POST /api/auth/*` — authentication (register, login)
- `GET/POST /api/subjects` — manage subjects
- `GET/POST /api/topics` — manage topics
- `GET/POST /api/quizzes` — manage quizzes
- `GET /api/dashboard` — dashboard data

(See `backend/routes/` for exact routes and request shapes.)

## Development Tips
- Use `npx nodemon server.js` for backend hot-reloading.
- Set `VITE_API_URL` in the frontend to point to your backend during local development.
- Check `frontend/package.json` for available frontend scripts and `backend/package.json` for backend dependencies.

## Contributing
- Fork the repo, create a branch, open a PR. Keep changes focused and add tests where applicable.

## License
- Add a license file or specify a license here.

---

If you'd like, I can also:

- Update `backend/README.md` and `frontend/README.md` to be consistent
- Add example `.env.sample` files to both `backend/` and `frontend/`
