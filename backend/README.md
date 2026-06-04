# Woody Backend

REST API for the **Woody** study-planner & quiz app, built with Express 5,
Mongoose and JWT auth.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit the values
npm run dev            # nodemon, auto-reload
# or
npm start              # plain node
```

You need a running MongoDB (local `mongod` or a MongoDB Atlas URI). Set the
connection string in `.env` → `MONGO_URI`.

### Environment variables (`.env`)

| Key              | Purpose                                   | Example                               |
| ---------------- | ----------------------------------------- | ------------------------------------- |
| `PORT`           | Port the API listens on                   | `5000`                                |
| `NODE_ENV`       | `development` / `production`              | `development`                         |
| `CLIENT_ORIGIN`  | Allowed CORS origin(s), comma-separated   | `http://localhost:5173`               |
| `MONGO_URI`      | MongoDB connection string                 | `mongodb://127.0.0.1:27017/woody`     |
| `JWT_SECRET`     | Secret for signing JWTs (use a long one!) | `a_long_random_string`                |
| `JWT_EXPIRES_IN` | Token lifetime                            | `7d`                                  |

## Auth

Send the token returned by register/login on protected routes:

```
Authorization: Bearer <token>
```

## API

Base URL: `http://localhost:<PORT>/api`

### Auth — `/auth`
| Method | Path        | Auth | Body                                   |
| ------ | ----------- | ---- | -------------------------------------- |
| POST   | `/register` | —    | `{ fullName, email, phone?, password }`|
| POST   | `/login`    | —    | `{ email, password }`                  |
| GET    | `/me`       | ✔    | —                                      |
| PUT    | `/me`       | ✔    | `{ fullName?, phone?, goal?, timezone? }` |

### Subjects — `/subjects` (all ✔)
| Method | Path    | Notes                                              |
| ------ | ------- | -------------------------------------------------- |
| GET    | `/`     | List subjects with computed `progress`             |
| POST   | `/`     | `{ name, color?, weeklySessions? }`                |
| GET    | `/:id`  | Subject + its `chapters` (topics)                  |
| PUT    | `/:id`  | Update `name` / `color` / `weeklySessions`         |
| DELETE | `/:id`  | Deletes the subject **and its topics**             |

### Topics (chapters) — `/topics` (all ✔)
| Method | Path           | Notes                                                  |
| ------ | -------------- | ------------------------------------------------------ |
| GET    | `/`            | `?subject=ID` and/or `?done=true|false` filters        |
| POST   | `/`            | `{ subject, title, notes?, date?, time?, estimatedHours? }` |
| PUT    | `/:id`         | Update any editable field                              |
| PATCH  | `/:id/toggle`  | Flip the `done` flag                                   |
| DELETE | `/:id`         | Remove a topic                                         |

### Quizzes — `/quizzes` (all ✔)
| Method | Path             | Notes                                                       |
| ------ | ---------------- | ----------------------------------------------------------- |
| GET    | `/`              | `?status=completed|draft`, `?subject=ID` filters            |
| POST   | `/`              | Save a quiz; include `answers[]` to grade immediately       |
| GET    | `/:id`           | Single quiz                                                 |
| PUT    | `/:id/submit`    | `{ answers: [...] }` → grades & marks completed             |
| DELETE | `/:id`           | Remove a quiz                                               |
| GET    | `/stats/summary` | Quizzes taken, average / best score, per-subject averages   |

`answers[]` aligns by index with `questions[]`:
- **objective**: `{ selection: <index>, timeout?: bool }`
- **subjective**: `{ subjectiveAnswer: <text>, selfGrade: 'perfect'|'partial'|'missed' }`

### Dashboard — `/dashboard` (all ✔)
| Method | Path           | Notes                                                        |
| ------ | -------------- | ------------------------------------------------------------ |
| GET    | `/`            | Summary: totals, overall progress, upcoming topics, recent quizzes |
| GET    | `/progress`    | Per-subject chart data (completed/total, quizAvg, weeklySessions) |
| POST   | `/study-plan`  | `{ examDate, dailyHours?, title? }` → generates & saves a plan |
| GET    | `/study-plan`  | Fetch the saved study plan                                   |

### Revision cards — `/revision` (all ✔)  → powers `revision.jsx`
| Method | Path     | Notes                                                                  |
| ------ | -------- | ---------------------------------------------------------------------- |
| GET    | `/`      | `?tag=must-revise|tricky|formula` and/or `?subject=Name` filters       |
| POST   | `/`      | `{ subject, keyword, detail, tag?, color?, date?, time?, resource? }`  |
| PUT    | `/:id`   | Update any field                                                       |
| DELETE | `/:id`   | Remove a card                                                          |

### Timetable blocks — `/timetable` (all ✔)  → powers `time-table.jsx`
| Method | Path     | Notes                                                       |
| ------ | -------- | ----------------------------------------------------------- |
| GET    | `/`      | `?day=Monday` filter                                        |
| POST   | `/`      | `{ day, start, end, subject?, note? }`                      |
| PUT    | `/:id`   | Update a block                                              |
| DELETE | `/:id`   | Remove a block                                              |

`subject` ∈ `Focus | Practice | Notes | Review | Break | CatchUp`.

### Exam-prep strategies — `/strategies` (all ✔)  → powers `exam-prep-strat.jsx`
| Method | Path                              | Notes                                                       |
| ------ | --------------------------------- | ----------------------------------------------------------- |
| GET    | `/`                               | List strategies                                             |
| POST   | `/`                               | `{ subject, color?, examDate?, phases?, tips? }`            |
| GET    | `/:id`                            | Single strategy                                             |
| PUT    | `/:id`                            | Replace any of subject/color/examDate/phases/tips           |
| PATCH  | `/:id/phases/:phaseId/toggle`     | Flip a phase's `done` flag                                  |
| DELETE | `/:id`                            | Remove a strategy                                           |

A `phase` is `{ phase, weeks, tasks: [string], done }`; `tips` is `[string]`.

### Health
`GET /api/health` → `{ status: 'ok', ... }`

## Project layout

```
backend/
├── config/db.js            # Mongoose connection
├── middleware/             # JWT auth guard
├── models/                 # User, Subject, Topic, Quiz, StudyPlan
├── controllers/            # Request handlers
├── routes/                 # Route → controller wiring
├── utils/studyPlanner.js   # Study-schedule generator
└── server.js               # App entrypoint
```

> **Note:** `.env` is listed in `.gitignore` but was committed earlier, so it is
> still tracked. To stop tracking it (recommended) run:
> `git rm --cached backend/.env`
