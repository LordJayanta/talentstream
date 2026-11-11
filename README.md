# 🚀 TalentStream

An intelligent, full-stack recruitment platform and job portal built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Drizzle ORM**, **PostgreSQL**, and **Better Auth**.

TalentStream connects candidates with top jobs through a weighted **AI Skill-Match Engine**, provides candidates with a dynamic **Live Profile & Resume** system with one-click applications, and equips recruiters with an enterprise-grade **HR Dashboard**, **Requisition Manager**, and **Candidate Pipeline**.

---

## 🌟 Key Features

### 👤 For Candidates
- **Smart AI Match Scoring:** Real-time percentage score (e.g. `98% MATCH`) comparing candidate skills against each job's must-have (75% weight) and nice-to-have (25% weight) skills.
- **AI Match Breakdown:** In-depth breakdown on job details showing matched vs. missing qualifications.
- **Profile = Resume:** Candidate profile acts as a live, machine-readable resume.
- **Resume Uploads:** Upload PDF/DOCX resumes directly to `/public/uploads/resumes/`.
- **One-Click Apply:** Submit applications instantly with optional cover notes and duplicate prevention.
- **Bookmarking & Tracking:** Save jobs and track application stages (`Pending`, `In Review`, `Shortlisted`, `Hired`, `Rejected`).
- **Interactive Search & Filters:** Filter by keyword, location, remote-only, employment type, and salary range.

### 🏢 For Employers & HR Teams
- **Recruiter Overview Dashboard:** Live hiring statistics (Active Jobs, Total Applicants, In Review, Shortlisted) and recent application feeds.
- **Requisition Management:** Full CRUD job management table with status workflows (`Active`, `Draft`, `Closed`, `Stopped/Paused`).
- **Rich MDX Editor:** Create and edit job postings using a dynamic markdown editor.
- **Candidate Pipeline:** Filter candidates by job requisition, inspect cover letters/resumes, and progress candidates across hiring stages.
- **Hiring Analytics:** Visual breakdown of applicant conversion funnel and requisition velocity.
- **Employer Profile & Settings:** Manage organization details, AI match thresholds, and hiring preferences.

### 🔐 Security & Architecture
- **Better Auth Integration:** Secure authentication with modular Drizzle schemas.
- **Role-Based Access Control (RBAC):** Strict separation between `candidate` and `employer` roles with route guards.
- **Sign-Up Security Guardrails:** Prevents unauthorized role escalation to `admin` during client registration.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16.2](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), Radix / Base UI primitives, Lucide Icons
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit
- **Authentication:** [Better Auth](https://www.better-auth.com/) (Drizzle adapter, Session cookies)
- **Rich Text:** MDXEditor
- **Form Validation:** React Hook Form, Zod
- **Package Manager / Runtime:** [Bun](https://bun.sh/) (or Node.js v20+)

---

## 📋 Prerequisites

Before running the project, make sure you have:
- **[Bun](https://bun.sh/)** (recommended: `curl -fsSL https://bun.sh/install | bash`) or **Node.js 20+**
- **PostgreSQL 14+** (either locally installed via `apt`/`brew` or via Docker)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/LordJayanta/talentstream.git

# or if you fork this repo
git clone https://github.com/your-username/talentstream.git

cd talentstream
bun install
```

### 2. Configure Environment Variables

Copy `sample.env` to `.env`:

```bash
cp sample.env .env
```

Your `.env` file should look like this:

```env
DATABASE_URL="postgres://postgres:password123@localhost:5432/talentstream_db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="talentstream-development-secret-key-32chars"
```

---

## 🗄️ Database Setup (Choose One Option)

You can run PostgreSQL either **natively on your local PC (no Docker needed)** or **via Docker Compose**.

### Option A: Local PC / Native PostgreSQL (No Docker - Lightweight)

If you installed PostgreSQL via `apt`, `brew`, or native installer:

#### Quick Automated Setup:
```bash
bun run db:setup
```
*(Runs [`scripts/setup-db.sh`](scripts/setup-db.sh) to start PostgreSQL and create the database).*

#### Or Manual Setup:
```bash
# 1. Start PostgreSQL service
sudo service postgresql start

# 2. Configure the postgres user password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password123';"

# 3. Create the database
sudo -u postgres psql -c "CREATE DATABASE talentstream_db;"
```

---

### Option B: Docker Compose (PostgreSQL + Adminer GUI)

If you prefer running isolated containers:

```bash
# Start PostgreSQL and Adminer in background
docker compose up -d
```

- **PostgreSQL:** `localhost:5432` (User: `postgres`, Password: `password123`, DB: `talentstream_db`)
- **Adminer (Database Web GUI):** Open [http://localhost:8080](http://localhost:8080) to inspect tables visually.

---

## 📦 Push Schema & Seed Demo Data

Once PostgreSQL is running:

```bash
# 1. Push Drizzle schema to PostgreSQL
bun run db:push

# 2. Import comprehensive demo data (employer, candidate, 6 jobs, applications)
bun run seed
# or: bun run:seed

# 3. (Optional) Reset or remove all demo data anytime
bun run clean
# or: bun run db:reset (cleans and re-seeds fresh data)
```

---

## 💻 Running the Application

Start the Next.js development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Demo Accounts for Testing

After running `bun run seed`, you can immediately test both user experiences:

| Role | Email | Password | Landing Page / Capabilities |
|---|---|---|---|
| **Employer / HR** | `employer@talentstream.com` | `password123` | Redirects to `/hr/dashboard`. Manage requisitions, edit jobs, review candidate pipeline, change applicant statuses. |
| **Candidate** | `candidate@talentstream.com` | `password123` | Redirects to `/`. Live match score across jobs, upload resumes, one-click apply, view saved jobs at `/candidate/profile`. |

*(You can also sign up with any new account via `/signup` by selecting either "Looking for Job" or "I am an Employer").*

---

## 📁 Project Directory Structure

```text
talentstream/
├── scripts/
│   ├── setup-db.sh           # Shell script to initialize local PostgreSQL
│   ├── seed.ts               # Demo data seeder (accounts, jobs, applications)
│   └── clean.ts              # Demo data cleanup script
├── public/
│   └── uploads/resumes/      # Storage directory for candidate resume files
├── src/
│   ├── actions/
│   │   ├── application-actions.ts  # HR pipeline, status updates & dashboard metrics
│   │   ├── candidate-actions.ts    # Profile/resume updates, apply flow & saved jobs
│   │   └── job-actions.ts          # Job creation, editing, status changes & search
│   ├── app/
│   │   ├── (auth)/                 # Login & Signup flows
│   │   ├── candidate/profile/      # Candidate Resume & Profile management
│   │   ├── hr/                     # Employer Portal
│   │   │   ├── analytics/          # Hiring analytics and funnel
│   │   │   ├── candidate/          # Candidate Pipeline workflow
│   │   │   ├── dashboard/          # Recruiter Overview Dashboard
│   │   │   ├── job/                # Job Management table
│   │   │   │   ├── new/            # Post new job with MDX editor
│   │   │   │   └── [id]/edit/      # Edit existing job posting
│   │   │   ├── profile/            # Organization profile
│   │   │   └── settings/           # Recruiter AI matching rules
│   │   ├── job/[id]/               # Public job detail view with AI match breakdown
│   │   ├── layout.tsx              # Root HTML & body layout with fonts
│   │   └── page.tsx                # Candidate job feed & search portal
│   ├── components/
│   │   ├── candidate-profile-form.tsx # Interactive resume & skills form
│   │   ├── core/                   # Navigation header, avatar dropdown, inputs
│   │   ├── hr-sections/            # HR sidebar, pipeline table, edit job form
│   │   ├── job-card.tsx            # Job listing card with match score badge
│   │   ├── job-detail-actions.tsx  # Dynamic Apply & Save buttons
│   │   ├── job-feed.tsx            # Live job feed with match sorting
│   │   ├── job-search-feed.tsx     # Full search & filter controls
│   │   └── ui/                     # Base UI / shadcn design system primitives
│   ├── db/
│   │   ├── index.ts                # Drizzle ORM client instance
│   │   ├── schema.ts               # Schema barrel export
│   │   └── schema/
│   │       ├── applications.ts     # Job applications schema
│   │       ├── auth.ts             # Better Auth tables (user, session, account)
│   │       ├── candidates.ts       # Candidate profiles & resume schema
│   │       ├── jobs.ts             # Jobs schema with skills & benefits
│   │       └── saved-jobs.ts       # Bookmarked jobs schema
│   └── lib/
│       ├── auth.ts                 # Better Auth server configuration
│       ├── auth-client.ts          # Better Auth React client SDK
│       ├── match-score.ts          # Weighted AI Skill-Match algorithm
│       └── utils.ts                # Styling & class merger utilities
├── docker-compose.yml              # Optional Docker service definition
├── drizzle.config.ts               # Drizzle Kit configuration
├── package.json
└── tsconfig.json
```

---

## 📜 Available NPM / Bun Scripts

| Command | Description |
|---|---|
| `bun dev` | Starts the Next.js development server on `http://localhost:3000` |
| `bun run build` | Builds the optimized production application |
| `bun run start` | Starts the production server |
| `bun run lint` | Runs ESLint across all TypeScript and React files |
| `bun run db:setup` | Starts local PostgreSQL service and creates `talentstream_db` |
| `bun run db:push` | Pushes Drizzle schemas to the PostgreSQL database |
| `bun run seed` | Seeds demo employer, candidate, jobs, and applications |
| `bun run:seed` | Alias for `bun run seed` |
| `bun run clean` | Cleans all demo accounts, sample jobs, applications, and saved jobs |
| `bun run:clean` | Alias for `bun run clean` |
| `bun run db:clean` | Alias for `bun run clean` |
| `bun run db:reset` | Cleans and immediately re-seeds fresh demo data |

---

## 🤝 Contribution Guidelines

We welcome contributions from the community! To contribute:

1. **Fork the Repository:** Create your own branch (`git checkout -b feature/amazing-feature`).
2. **Follow Code Conventions:**
   - Use TypeScript strict mode.
   - Run `bun run lint` and `bunx tsc --noEmit` before committing to ensure 0 errors.
   - Preserve existing docstrings, server actions, and type safety.
3. **Use Conventional Commits:**
   Follow our standard commit formatting matching previous commits:
   - `feat(scope): concise description in lowercase imperative mood` (e.g. `feat(jobs): add salary filter`)
   - `fix(scope): concise description in lowercase imperative mood` (e.g. `fix(auth): resolve session cookie expiration`)
   - `chore(scope): update dependencies or tooling`
4. **Submit a Pull Request:** Open a PR against the `main` branch with a clear description of your changes.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for personal and commercial projects.
