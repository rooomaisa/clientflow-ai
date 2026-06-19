# ClientFlow AI

AI-powered client intake and meeting assistant for freelancers, consultants, and small agencies.

Turn messy meeting notes into summaries, action items, follow-up tasks, and professional email drafts.

## What it does

ClientFlow AI helps you manage clients, meeting notes, and follow-up tasks. After a client conversation, paste your raw notes, click **Process with AI**, and get structured output you can act on.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, JavaScript, Tailwind CSS, Lucide icons, Framer Motion |
| Backend | Java 21, Spring Boot, Spring Security, JWT |
| Database | PostgreSQL (Supabase) |
| AI | OpenAI API |
| Deployment | Vercel (frontend) + Render (backend) |

## Project structure

```
clientflow-ai/
├── backend/        # Spring Boot REST API
├── frontend/       # React + Vite app
├── render.yaml     # Render deployment config
├── DEPLOYMENT.md   # Step-by-step deploy guide
└── README.md
```

## Local setup

### Prerequisites

- Java 21
- Node.js 18+
- Supabase project (PostgreSQL)
- OpenAI API key

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in .env with your Supabase + OpenAI credentials
./mvnw spring-boot:run
```

API runs at http://localhost:8080

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173 (API proxied to backend automatically)

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase JDBC URL (use Session pooler) |
| `DATABASE_USERNAME` | `postgres.YOUR_PROJECT_REF` |
| `DATABASE_PASSWORD` | Supabase database password |
| `JWT_SECRET` | Random string, min 32 characters |
| `CORS_ORIGIN` | `http://localhost:5173` (add Vercel URL in prod) |
| `OPENAI_API_KEY` | From platform.openai.com |
| `OPENAI_MODEL` | `gpt-4o-mini` (default) |

### Frontend (`frontend/.env` — optional locally)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Only needed in production (Vercel). Local dev uses Vite proxy. |

See `.env.example` files in each folder for templates.

## Deployment

Full step-by-step guide: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Quick summary:
1. Deploy backend to **Render** using `render.yaml`
2. Deploy frontend to **Vercel** (root directory: `frontend`)
3. Set `VITE_API_URL` on Vercel → your Render URL
4. Set `CORS_ORIGIN` on Render → your Vercel URL

## Live demo

_Add your Vercel URL here after deploying._

## Screenshots

The UI includes a polished landing page with product mockup, dashboard with stat cards and skeleton loaders, and an animated AI processing flow on meeting notes.

**Key screens to capture for your README:**
1. Landing page hero with dashboard mockup
2. Dashboard overview with stats
3. Meeting detail → "Process with AI" loading state
4. AI analysis panel with summary, action items, and email draft

_Tip: Use a screen recorder (macOS Screenshot, LICEcap, or CleanShot) to create a short GIF of the AI flow — great for GitHub._

## What I learned

- Design tokens and reusable Tailwind component classes (`.card`, `.input-base`, gradient utilities)
- Loading UX patterns: skeleton screens vs spinners
- Micro-interactions with CSS animations and Framer Motion staggered reveals
- Toast notifications for user feedback on CRUD actions
- Building a cohesive visual system across marketing and app pages

## Future improvements

- Database migrations with Flyway
- Send follow-up emails directly from the app
- Team / multi-user workspaces
- Streaming AI responses

## License

Portfolio project — all rights reserved.
