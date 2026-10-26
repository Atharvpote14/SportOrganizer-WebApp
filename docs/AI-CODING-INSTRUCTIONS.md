# 19 — AI Coding Instructions

## 1. Purpose

This document is the master instruction file for any AI coding agent working on the Sport Organizer Web App.

The agent must use this document together with the other Markdown files in the `docs/` directory.

The goal is to build a complete, maintainable, secure, and production-ready sports tournament management platform without generating the entire application in one uncontrolled operation.

**The AI agent must inspect, plan, implement, test, and verify its work incrementally.**

---

## 2. Project Overview

Sport Organizer is a web-based sports tournament management platform that helps players, team captains, tournament organizers, and administrators manage sports competitions.

### Core capabilities

- Discover public tournaments.
- Create and manage teams.
- Manage team memberships.
- Register teams for tournaments.
- Review and approve registrations.
- Schedule matches.
- Publish match results.
- Display tournament standings.
- Publish tournament announcements.
- Send in-app notifications.
- Manage organizations and authorized administrative operations.

The application must provide a professional, responsive SaaS experience rather than a generic template or a collection of disconnected pages.

### Primary objective

Build working features connected to the real backend. Do not deliver a visually complete interface whose buttons, forms, and navigation are mostly nonfunctional.

---

## 3. Technology Stack

Use the following stack unless the existing repository or an explicitly approved project decision requires otherwise.

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Icons | Lucide React |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Database security | Row Level Security |
| Forms | React Hook Form |
| Validation | Zod |
| Charts | Recharts, when needed |
| Notifications | Sonner, when configured |
| Unit/component testing | Vitest and React Testing Library |
| End-to-end testing | Playwright |
| Version control | Git and GitHub |
| Deployment | Vercel |

Use the versions and configuration already established in the repository. Do not upgrade major dependencies or replace technologies without justification and approval.

---

## 4. Mandatory Documentation

Before implementing a feature, read the relevant project documents.

```text
docs/
├── 01-PROJECT-OVERVIEW.md
├── 02-PRD.md
├── 03-TECH-STACK.md
├── 04-DATABASE-SCHEMA.md
├── 05-AUTHENTICATION-AND-AUTHORIZATION.md
├── 06-UI-UX-GUIDELINES.md
├── 07-COLOR-TYPOGRAPHY.md
├── 08-DESIGN-SYSTEM.md
├── 09-FEATURES-AND-MODULES.md
├── 10-API-AND-BACKEND.md
├── 11-SECURITY-RULES.md
├── 12-USER-FLOWS.md
├── 13-VALIDATION-AND-ERROR-HANDLING.md
├── 14-TESTING-STRATEGY.md
├── 15-DEPLOYMENT-GUIDE.md
├── 16-ENVIRONMENT-VARIABLES.md
├── 17-CODING-STANDARDS.md
├── 18-IMPLEMENTATION-ROADMAP.md
└── 19-AI-CODING-INSTRUCTIONS.md
```

### Documentation rules

1. Read `01-PROJECT-OVERVIEW.md`, `02-PRD.md`, and `03-TECH-STACK.md` before major implementation work.
2. Read `04-DATABASE-SCHEMA.md`, `05-AUTHENTICATION-AND-AUTHORIZATION.md`, `10-API-AND-BACKEND.md`, and `11-SECURITY-RULES.md` before implementing backend or protected features.
3. Read `06-UI-UX-GUIDELINES.md`, `07-COLOR-TYPOGRAPHY.md`, and `08-DESIGN-SYSTEM.md` before implementing UI.
4. Read `12-USER-FLOWS.md` and `13-VALIDATION-AND-ERROR-HANDLING.md` before implementing forms and workflows.
5. Follow `14-TESTING-STRATEGY.md` for verification.
6. Follow `15-DEPLOYMENT-GUIDE.md` and `16-ENVIRONMENT-VARIABLES.md` for deployment and configuration.
7. Follow `17-CODING-STANDARDS.md` and `18-IMPLEMENTATION-ROADMAP.md` throughout development.

If documents appear inconsistent, do not silently invent a resolution. Identify the conflict, follow explicit security and data-integrity requirements, and propose the smallest coherent resolution before proceeding.

---

## 5. Inspect Before Coding

At the start of every task:

1. Inspect the repository and its existing folder structure.
2. Read `package.json` and relevant configuration files.
3. Check the installed framework and dependency versions.
4. Inspect the files related to the requested feature.
5. Identify existing reusable components, hooks, schemas, types, and Supabase clients.
6. Check the current implementation and existing tests.
7. Identify the feature's database and authorization dependencies.
8. Determine which files actually need changes.

Do not assume the repository is empty.

Do not overwrite working files simply because generating replacements appears faster.

If a required file already exists, modify it carefully and preserve unrelated functionality.

---

## 6. Implementation Workflow

Follow this workflow for each task.

### Step 1 — Understand

Identify:

- The feature being implemented
- The user roles involved
- The expected user journey
- The required database operations
- The authorization requirements
- The UI states and validation rules
- The acceptance criteria

### Step 2 — Plan

Create a short implementation plan that identifies:

- Files to create
- Files to modify
- Components to reuse
- Database changes, if any
- Tests required
- Dependencies and risks

For small, straightforward changes, keep the plan brief.

### Step 3 — Implement

Implement the smallest complete, coherent feature.

- Reuse established architecture.
- Follow the design system.
- Use TypeScript.
- Validate input on the server.
- Enforce authorization.
- Handle loading and error states.
- Connect the feature to the real backend.
- Preserve existing working functionality.

### Step 4 — Test

Run the relevant checks available in the repository.

Examples:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Run end-to-end tests when the required environment is available:

```bash
npm run test:e2e
```

Do not assume these scripts exist. Inspect `package.json` and use the actual configured scripts.

### Step 5 — Fix and verify

If a change causes errors:

1. Inspect the actual error.
2. Identify the root cause.
3. Make a targeted correction.
4. Re-run the affected checks.
5. Check for regressions in related functionality.

Do not repeatedly rewrite the same files without investigating the failure.

### Step 6 — Report

Summarize the files changed, functionality implemented, checks actually executed, unresolved issues, and manual setup still required.

---

## 7. Phased Development Order

Implement the application according to `18-IMPLEMENTATION-ROADMAP.md`.

### Phase 1 — Foundation

- Inspect and configure the Next.js application.
- Establish TypeScript, Tailwind CSS, and shadcn/ui.
- Configure environment validation.
- Establish the project folder structure.
- Verify the initial build and testing setup.

### Phase 2 — Database and security

- Configure Supabase.
- Implement version-controlled migrations.
- Create database tables and relationships.
- Configure RLS policies.
- Generate database types.
- Verify permissions with test accounts.

### Phase 3 — Shared UI

- Implement design tokens.
- Create the application shell.
- Implement navigation and reusable components.
- Add loading, empty, and error states.
- Verify responsive layouts.

### Phase 4 — Authentication

- Implement registration, login, logout, and password recovery.
- Configure SSR-compatible session handling.
- Implement server-side authorization.
- Protect sensitive routes and mutations.

### Phase 5 — Profiles and organizations

- Implement profile management.
- Implement organization management where included in the MVP.
- Enforce ownership and membership rules.

### Phase 6 — Teams

- Implement team creation and editing.
- Implement team membership management.
- Enforce team permissions and business rules.

### Phase 7 — Tournaments

- Implement tournament discovery.
- Implement tournament details.
- Implement creation, editing, publication, and lifecycle rules.

### Phase 8 — Registration

- Implement team registration.
- Implement approval and rejection.
- Prevent duplicate active registrations.
- Enforce capacity safely under concurrent requests.

### Phase 9 — Matches

- Implement match scheduling.
- Implement match status management.
- Implement authorized result submission and correction.

### Phase 10 — Standings and announcements

- Calculate standings according to documented sport rules.
- Keep standings consistent with match results.
- Implement tournament announcements.

### Phase 11 — Notifications and administration

- Implement relevant in-app notifications.
- Implement authorized administrative workflows.
- Protect audit records.

### Phase 12 — Quality assurance

- Run unit, component, integration, and end-to-end tests.
- Verify security and RLS.
- Check responsiveness, accessibility, and performance.

### Phase 13 — Deployment

- Configure production environment variables.
- Apply reviewed production migrations.
- Deploy through Vercel.
- Run production smoke tests.

Do not skip foundational security work to make visual progress faster.

---

## 8. Architecture Rules

### 8.1 Next.js

- Use the App Router.
- Use Server Components by default.
- Add `"use client"` only when client-side interaction or browser APIs require it.
- Keep client boundaries as small as practical.
- Use route-level loading, error, and not-found handling where appropriate.
- Follow the conventions of the installed Next.js version.

### 8.2 Components

- Use shared design-system components.
- Keep components focused.
- Separate presentation from complex business logic.
- Avoid duplicating components with nearly identical behavior.
- Use semantic HTML and accessible interactions.
- Do not create unnecessary abstraction layers.

### 8.3 Backend

- Centralize Supabase client initialization.
- Use the correct client for the browser or server.
- Use server-side validation for mutations.
- Check permissions for every sensitive operation.
- Handle database errors explicitly.
- Keep business rules consistent across features.

### 8.4 Database

- Use version-controlled migrations.
- Preserve foreign keys and constraints.
- Use generated database types.
- Enable and test RLS on applicable tables.
- Use transactions or atomic database operations when required for integrity.
- Do not use client-side checks as the only protection against duplicate registrations or tournament-capacity violations.

---

## 9. Authentication and Authorization Rules

Every protected operation must verify both identity and permission.

The application supports role contexts including:

- Guest
- Player
- Team Captain
- Tournament Organizer
- Organization Administrator
- Platform Administrator

### Mandatory rules

1. Never trust a role supplied by the browser.
2. Never trust a resource ID merely because it was submitted by an authenticated user.
3. Verify team ownership and membership where required.
4. Verify tournament ownership or organization permissions where required.
5. Verify authorization inside Server Actions and Route Handlers.
6. Maintain matching database-level protections through RLS.
7. Never let ordinary users grant themselves privileged roles.
8. Deny unauthorized operations even if a user manually constructs an HTTP request.

Hiding a button in the UI is not an authorization mechanism.

---

## 10. Database Integrity Rules

The following operations require special care:

### Tournament registration

- Prevent duplicate active registrations.
- Enforce eligibility.
- Enforce registration deadlines.
- Enforce capacity under concurrent requests.
- Keep registration states valid.

### Match scheduling

- Verify tournament participation.
- Validate match participants.
- Validate schedule and status transitions.
- Handle conflicting updates according to the product rules.

### Match results

- Restrict result submission to authorized users.
- Validate scores according to the supported sport.
- Define correction and publication rules.
- Record sensitive changes when required.

### Standings

- Derive standings from trusted results.
- Implement the documented points and tie-breaker rules.
- Ensure result changes trigger the correct recalculation.
- Avoid leaving results and standings inconsistent.

Do not invent sport-specific rules where the documentation does not define them. Identify the missing requirement and resolve it before implementing the affected logic.

---

## 11. UI and UX Requirements

Every completed feature must follow the documented design system.

### Visual standards

- Use the approved blue primary palette and semantic colors.
- Use consistent typography, spacing, radii, and shadows.
- Prefer polished SaaS-style layouts.
- Avoid generic, repetitive dashboard templates.
- Use clear hierarchy and appropriate whitespace.
- Ensure tournament, team, and match information is easy to scan.

### Responsive behavior

Verify the feature on:

- Mobile
- Tablet
- Desktop
- Wide desktop

### Required UI states

Where relevant, implement:

- Loading
- Empty
- Success
- Validation error
- Network or server error
- Unauthorized
- Disabled
- Confirmation for destructive actions

Do not leave buttons without meaningful behavior. If an action is not implemented, do not present it as a working feature.

---

## 12. Forms and Error Handling

Use React Hook Form and Zod where appropriate.

For every mutation:

1. Validate the input.
2. Authenticate the caller.
3. Check authorization.
4. Enforce business rules.
5. Execute the operation safely.
6. Return the standard response format.
7. Display a user-friendly result.

Handle expected failures without crashing the page.

Never display raw SQL errors, stack traces, secret values, authentication tokens, or internal configuration to users.

Avoid silent failure. Show a clear message and, where useful, a safe retry action.

---

## 13. Testing Requirements

Write tests for business rules as well as UI behavior.

### Unit tests

Prioritize:

- Validation schemas
- Registration eligibility
- Capacity and duplicate-registration rules
- Score validation
- Standings calculations
- Status transitions

### Component tests

Test:

- Form validation
- Submission behavior
- Loading and error states
- Dialogs and confirmations
- Accessible interactions

### Integration tests

Test:

- Supabase operations
- Authorization
- RLS behavior
- Database constraints
- Registration and result workflows

### End-to-end tests

Test the main user journey:

1. A user creates an account.
2. The user completes their profile.
3. The user creates a team.
4. The user discovers a tournament.
5. The user registers the team.
6. An authorized organizer approves the registration.
7. The organizer schedules a match.
8. An authorized user publishes a result.
9. The standings update correctly.

Use separate test accounts for different roles. Never treat client-side role changes as proof of authorization.

Do not claim that tests passed unless they were actually executed and passed.

---

## 14. Environment and Secret Management

Use `.env.local` for local development and `.env.example` for documentation.

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Configure only the optional server-only variables that the implemented features require.

### Security rules

- Never commit real environment files.
- Never expose privileged Supabase keys to the browser.
- Never use `NEXT_PUBLIC_` for secrets.
- Never invent production credentials.
- Never print secrets in logs.
- Keep preview and production credentials separate.
- Update `.env.example` when required variables change.

If credentials are missing, clearly identify which values the user must obtain from Supabase or another configured provider.

---

## 15. Dependency and Configuration Rules

Before adding a package or changing configuration:

1. Inspect the existing setup.
2. Check whether the required functionality already exists.
3. Confirm compatibility with the installed framework.
4. Explain the reason for the change.
5. Avoid unrelated dependency upgrades.
6. Preserve the existing lockfile and package manager.
7. Run relevant checks after the change.

Do not replace a working library or rebuild the application configuration merely because another approach is available.

---

## 16. File Modification Rules

These rules are mandatory.

### Before editing

- Inspect the complete relevant file.
- Identify its imports, exports, and callers.
- Check dependent components and routes.
- Check whether tests cover the existing behavior.

### While editing

- Make the smallest complete change.
- Preserve unrelated functionality.
- Follow established naming and formatting conventions.
- Update dependent types, schemas, and tests when necessary.
- Avoid creating duplicate files with slightly different names.

### After editing

- Review the diff.
- Check imports and exports.
- Run applicable tests.
- Verify the changed user flow.
- Report any remaining uncertainty.

**Never replace an entire file when a targeted edit can safely achieve the requirement.**

If a full-file rewrite is genuinely necessary, preserve all existing required behavior and explain the reason.

---

## 17. Handling Missing Requirements

When a requirement is unclear:

1. Search the project documentation.
2. Inspect existing implementation patterns.
3. Determine whether the ambiguity affects security, data integrity, or a major product decision.
4. If the issue is minor, choose the simplest consistent approach and document it.
5. If the issue materially affects architecture or business rules, ask for clarification before making an irreversible decision.

Never invent:

- Production credentials
- Real user data
- External API keys
- Tournament rules that materially affect outcomes
- Administrative permissions
- Database migration results
- Successful test results

Use safe development placeholders only where appropriate.

---

## 18. Progress Tracking

Maintain an implementation checklist in the project or the development task.

For each feature, track:

- Not started
- In progress
- Implemented
- Tested
- Verified

A feature must not be marked complete simply because its UI has been generated.

It is complete only when its expected behavior, backend integration, authorization, error handling, and relevant tests have been verified.

### Required task report

At the end of each implementation task, provide:

**1. Completed**
- Features implemented and their expected behavior.

**2. Files changed**
- Created, modified, or removed files.

**3. Database changes**
- Migrations, schema updates, or policies, if applicable.

**4. Verification**
- Commands and tests actually executed.
- Pass/fail status and relevant failures.

**5. Manual setup**
- Any configuration required in Supabase, Vercel, or another provider.

**6. Remaining work**
- Known bugs, limitations, or blocked requirements.

**7. Next step**
- The smallest logical next task.

---

## 19. Definition of Done

A task is complete only when:

- [ ] The implementation matches the documented requirement.
- [ ] Existing functionality remains intact.
- [ ] TypeScript types are correct.
- [ ] Server-side validation is implemented where needed.
- [ ] Authorization is enforced.
- [ ] RLS and database integrity are preserved.
- [ ] Loading, empty, and error states are handled.
- [ ] The UI follows the design system.
- [ ] Responsive and accessibility requirements are considered.
- [ ] Relevant tests have been executed.
- [ ] No known regression introduced by the change remains unresolved.
- [ ] Required documentation is updated.
- [ ] Remaining limitations are reported honestly.

---

## 20. Final Master Instruction

Build Sport Organizer as a real, integrated application—not merely a visual prototype.

Follow all project documents, implement the roadmap in dependency order, protect user data, maintain database integrity, and verify every important change.

Work incrementally. Inspect before editing. Reuse existing code. Test before claiming completion. Never sacrifice security or correctness for speed.

When the user requests a feature, focus on that feature and its necessary dependencies. Do not rebuild unrelated modules or introduce unnecessary architectural changes.

**The final objective is a polished, secure, responsive, maintainable, and deployable Sport Organizer Web App with reliable tournament, team, match, and results management.**

**End of AI Coding Instructions.**