# Sport Organizer Web App — Technology Stack

## 1. Document Information

- **Project:** Sport Organizer
- **Document:** Technology Stack Specification
- **Version:** 1.0
- **Status:** Proposed Stack
- **Related Documents:** `01-PROJECT-OVERVIEW.md`, `02-PRD.md`

---

## 2. Technology Overview

Sport Organizer will be developed as a modern, responsive web application using a TypeScript-based frontend and Supabase backend.

### 2.1 Core Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | Next.js | Application routing, layouts, and rendering |
| UI library | React | Component-based interfaces |
| Programming language | TypeScript | Type safety and maintainability |
| Styling | Tailwind CSS | Responsive styling and design consistency |
| UI primitives | shadcn/ui | Accessible, reusable UI components |
| Icons | Lucide React | Consistent interface icons |
| Backend platform | Supabase | Authentication, PostgreSQL database, and storage |
| Database | PostgreSQL | Structured relational data |
| Database security | Supabase RLS | Row-level data access policies |
| Form management | React Hook Form | Form state and submission |
| Schema validation | Zod | Runtime validation of user input |
| Data fetching | Supabase JavaScript client | Database and authentication integration |
| Charts | Recharts | Tournament analytics and statistics |
| Notifications | Sonner | Toast notifications |
| Version control | Git and GitHub | Source control and collaboration |
| Deployment | Vercel | Hosting the Next.js application |

**Important:** These are the proposed project standards. Pin compatible package versions in the package manager lockfile and follow the installed framework's official documentation.

---

## 3. Frontend Architecture

### 3.1 Next.js

Use Next.js with the App Router.

Requirements:
- Organize pages using the `src/app/` directory.
- Use layouts for shared navigation and page structure.
- Use Server Components by default.
- Use Client Components only when browser interaction or client-side state is required.
- Keep database access and privileged operations on trusted server-side boundaries.
- Use route handlers or server actions where appropriate.
- Implement loading, error, and not-found states.

Do not make every component a Client Component unnecessarily.

### 3.2 React

React will be used to build reusable interface components.

Examples:
- Tournament cards
- Team cards
- Match cards
- Registration forms
- Data tables
- Dialogs
- Dropdown menus
- Dashboard widgets
- Navigation components
- Notification components

Shared components should be implemented once and reused wherever possible.

### 3.3 TypeScript

TypeScript must be enabled throughout the project.

Rules:
- Use strict type checking.
- Define interfaces or types for domain entities.
- Avoid `any` unless there is a documented reason.
- Type function arguments and return values.
- Validate external data at runtime.
- Use generated Supabase database types when practical.
- Keep database types separate from UI-specific types when their responsibilities differ.

Example:

```ts
export type TournamentStatus =
  | "draft"
  | "published"
  | "registration_closed"
  | "in_progress"
  | "completed"
  | "cancelled";
```

The allowed values must match the final database schema and lifecycle rules.

---

## 4. Styling and Component System

### 4.1 Tailwind CSS

Tailwind CSS will be the primary styling system.

Requirements:
- Use reusable utility classes.
- Follow the centralized color and typography specifications.
- Use responsive breakpoints consistently.
- Avoid excessive inline styles.
- Avoid duplicating large class strings across components.
- Use shared design tokens for recurring visual values.

Do not introduce Bootstrap, Material UI, or another full styling framework without explicit approval.

### 4.2 shadcn/ui

Use shadcn/ui components where appropriate.

Recommended components:
- Button
- Input
- Textarea
- Select
- Checkbox
- Radio Group
- Dialog
- Alert Dialog
- Dropdown Menu
- Tabs
- Sheet
- Table
- Card
- Badge
- Avatar
- Skeleton
- Tooltip
- Popover
- Calendar
- Form

Components may be customized to match the Sport Organizer design system.

Do not use the default appearance without reviewing its colors, spacing, typography, responsiveness, and interaction states.

### 4.3 Lucide React

Use Lucide React for interface icons.

Requirements:
- Use consistent icon sizing.
- Use recognizable icons.
- Provide accessible labels for icon-only buttons.
- Do not use emoji as replacements for important navigation icons.
- Avoid mixing unrelated icon libraries.

### 4.4 Charts

Use Recharts for dashboard charts only when charts provide meaningful information.

Potential charts:
- Tournament participation
- Match completion
- Team performance
- Registration trends

Charts must be responsive, readable, and accessible. Do not create decorative charts with fabricated data.

---

## 5. Backend and Database

### 5.1 Supabase

Supabase will provide the primary backend infrastructure.

Required services:
- Supabase Authentication
- Supabase PostgreSQL
- Row Level Security
- Supabase Storage where image or document uploads are required
- Database migrations
- Database-generated types

Supabase should remain the single source of truth for persistent application data unless a future architectural decision explicitly introduces another system.

### 5.2 PostgreSQL

Use a relational schema for the main application entities.

Expected entities include:
- Profiles
- Organizations
- Tournaments
- Teams
- Team memberships
- Tournament registrations
- Matches
- Match results or scores
- Notifications
- Audit logs

The final table definitions, foreign keys, indexes, constraints, and relationships will be specified in `04-DATABASE-SCHEMA.md`.

Requirements:
- Use primary keys and foreign keys.
- Enforce uniqueness where necessary.
- Use database constraints for important invariants.
- Add indexes for common query patterns.
- Use transactions or database functions for critical multi-step operations.
- Avoid storing the same authoritative information in multiple tables unnecessarily.

### 5.3 Supabase Authentication

Use Supabase Auth for account registration, login, session management, and supported recovery flows.

Requirements:
- Do not implement a custom password-storage system.
- Do not store passwords in application tables.
- Use the supported Supabase client libraries.
- Handle expired sessions and authentication errors.
- Protect private pages and backend operations.
- Keep user profile data separate from authentication credentials.

### 5.4 Row Level Security

Enable RLS on every exposed table containing application data that requires access control.

Policies must be designed according to the user's identity, role, resource ownership, team membership, and tournament permissions.

Examples:
- Users can update permitted fields in their own profiles.
- Team captains can manage only authorized teams.
- Organizers can manage tournaments within their scope.
- Public users can read only published public tournament information.
- Only authorized users can publish match results.

**Never rely exclusively on frontend role checks.**

Service-role or other privileged server credentials must never be exposed to the browser.

---

## 6. Data Fetching and State Management

### 6.1 Supabase Client

Use the official Supabase JavaScript client for database and authentication operations.

Create separate client utilities for browser and server execution according to the official Next.js and Supabase integration guidance.

Requirements:
- Reuse configured clients appropriately.
- Avoid creating unnecessary client instances.
- Handle database errors explicitly.
- Avoid duplicate requests.
- Do not expose privileged credentials through public environment variables.

### 6.2 React State

Use React state for local interface interactions.

Examples:
- Dialog visibility
- Form field interaction
- Selected tabs
- Temporary filters
- Menu state

Do not introduce a global state library unless the application develops a concrete need for it.

### 6.3 Server State

Prefer server-side data loading for pages that benefit from it.

For interactive client-side updates:
- Fetch only the required data.
- Handle loading and error states.
- Refresh affected data after successful mutations.
- Prevent duplicate submissions.
- Avoid treating stale client data as authoritative.

Supabase Realtime may be added for live score updates or notifications when the required workflows are stable.

---

## 7. Forms and Validation

### 7.1 React Hook Form

Use React Hook Form for complex forms such as:
- Tournament creation
- Team creation
- Player management
- Tournament registration
- Match scheduling
- Score entry

Simple forms may use lighter approaches when appropriate.

### 7.2 Zod

Use Zod for runtime validation.

Requirements:
- Validate required fields.
- Validate field lengths.
- Validate dates and deadlines.
- Validate numeric limits and score formats.
- Validate supported tournament formats.
- Provide readable error messages.
- Revalidate critical rules on the trusted backend or database.

Client-side validation improves usability but does not replace server-side enforcement.

---

## 8. Application Architecture

Use a feature-oriented structure that separates routing, reusable UI, business logic, and database integration.

Recommended structure:

```text
sport-organizer-web/
├── docs/
├── public/
│   ├── images/
│   ├── logos/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── tournaments/
│   │   │   └── matches/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   ├── dashboard/
│   │   ├── tournaments/
│   │   ├── teams/
│   │   ├── matches/
│   │   ├── profile/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── tournaments/
│   │   ├── teams/
│   │   ├── matches/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   ├── tournaments/
│   │   ├── teams/
│   │   ├── registrations/
│   │   ├── matches/
│   │   ├── standings/
│   │   └── notifications/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── validation/
│   │   ├── permissions/
│   │   └── utils/
│   ├── types/
│   └── config/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
├── tests/
├── .env.example
├── .gitignore
├── components.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

This structure is a guide, not a requirement to create every directory immediately. Keep the project simple while ensuring that security-sensitive code stays on trusted execution paths.

---

## 9. Routing Strategy

Use the Next.js App Router.

Expected public routes:
- `/`
- `/tournaments`
- `/tournaments/[id]`
- `/matches`
- `/matches/[id]`
- `/teams/[id]`
- `/login`
- `/signup`

Expected authenticated routes:
- `/dashboard`
- `/profile`
- `/my-teams`
- `/my-registrations`
- `/notifications`

Expected organizer routes:
- `/dashboard/organizer`
- `/dashboard/organizer/tournaments`
- `/dashboard/organizer/tournaments/new`
- `/dashboard/organizer/tournaments/[id]`
- `/dashboard/organizer/registrations`
- `/dashboard/organizer/matches`

Expected platform administration routes:
- `/dashboard/admin`

These routes must enforce permissions at the appropriate backend boundary. Hiding a link or blocking navigation in the browser is not sufficient authorization.

---

## 10. Environment Configuration

Use environment variables for deployment-specific configuration.

Expected variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Additional server-only variables may be introduced for explicitly required privileged integrations.

Rules:
- Commit `.env.example` with placeholders only.
- Keep real `.env.local` values out of Git.
- Never expose secret keys through `NEXT_PUBLIC_` variables.
- Never commit database passwords, access tokens, or private credentials.
- Validate required configuration during application startup.
- Use separate configuration for local development and production.

The final configuration details will be documented in `16-ENVIRONMENT-VARIABLES.md`.

---

## 11. Testing Tools

Recommended testing stack:

- **Vitest:** Unit tests for isolated logic.
- **React Testing Library:** Component behavior tests.
- **Playwright:** End-to-end browser tests.
- **TypeScript:** Compile-time checks.
- **ESLint:** Code quality and common error detection.

Test coverage should prioritize:
- Authentication
- Permissions
- Tournament lifecycle
- Registration capacity
- Team roster rules
- Match scheduling
- Score validation
- Standings calculations
- Unauthorized requests
- Mobile navigation

Database security policies and critical transactional operations must be tested, not merely inspected visually.

---

## 12. Deployment

Use Vercel for the Next.js frontend and Supabase for backend infrastructure.

Deployment requirements:
- Configure environment variables separately for preview and production.
- Apply reviewed database migrations.
- Verify production RLS policies.
- Test authentication redirects and callback URLs.
- Configure the production site URL.
- Check responsive behavior and accessibility.
- Run linting, type checking, and automated tests.
- Confirm that privileged credentials are absent from browser bundles.

Do not apply destructive production database changes without a backup and a reviewed migration plan.

---

## 13. Coding Standards

1. Use TypeScript for application code.
2. Follow the App Router conventions.
3. Prefer reusable, focused components.
4. Use Server Components by default where suitable.
5. Keep secrets and privileged operations server-side.
6. Use consistent naming conventions.
7. Validate external data at runtime.
8. Handle errors explicitly.
9. Use semantic HTML and accessible controls.
10. Avoid unnecessary dependencies.
11. Do not use fake data in production workflows.
12. Do not hardcode user-specific IDs or credentials.
13. Keep business rules consistent across the application and database.
14. Write tests for important business logic.
15. Update documentation when the architecture changes.

---

## 14. Dependency Management

Before adding a dependency:

1. Check whether an existing dependency already solves the problem.
2. Verify compatibility with the current Next.js and React versions.
3. Prefer actively maintained packages.
4. Install a compatible version.
5. Update and commit the lockfile.
6. Run linting, type checking, and relevant tests.

Do not upgrade the entire stack merely to resolve an isolated package issue.

---

## 15. Implementation Order

Follow this order to reduce integration problems:

1. Initialize Next.js and TypeScript.
2. Configure Tailwind CSS and shadcn/ui.
3. Establish the color and design tokens.
4. Configure Supabase clients and environment variables.
5. Design and migrate the database schema.
6. Implement authentication and access control.
7. Build the shared layout and navigation.
8. Implement tournament discovery and details.
9. Implement team and roster management.
10. Implement registration workflows.
11. Implement match scheduling and results.
12. Implement standings calculations.
13. Add notifications and dashboards.
14. Test security, usability, and responsiveness.
15. Deploy and verify the production application.

---

## 16. Final Technology Decisions

The following technologies are the intended baseline:

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage when needed
- React Hook Form
- Zod
- Recharts
- Sonner
- Vitest
- React Testing Library
- Playwright
- GitHub
- Vercel

Any change to this baseline must have a clear technical justification and should be reflected in this document before implementation.

## 17. Related Documentation

- `01-PROJECT-OVERVIEW.md`
- `02-PRD.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `06-UI-UX-GUIDELINES.md`
- `07-COLOR-TYPOGRAPHY.md`
- `08-DESIGN-SYSTEM.md`
- `11-SECURITY-RULES.md`
- `14-TESTING-STRATEGY.md`
- `16-ENVIRONMENT-VARIABLES.md`
- `19-AI-CODING-INSTRUCTIONS.md`
