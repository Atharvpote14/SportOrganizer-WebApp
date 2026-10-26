# 18 — Implementation Roadmap

## 1. Purpose

This document defines the development sequence for the Sport Organizer Web App.

The roadmap converts the project requirements, architecture, database design, security rules, and UI/UX guidelines into an actionable implementation plan.

The application will be built using:

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL and Row Level Security (RLS)
- Supabase Storage
- React Hook Form and Zod
- Vitest and React Testing Library
- Playwright
- GitHub and Vercel

**Core principle:** Build incrementally. Complete, test, and verify each phase before moving to the next.

---

## 2. Development Strategy

Use a feature-oriented, dependency-first approach.

1. Establish the project foundation.
2. Configure Supabase and the database.
3. Build shared UI and design-system components.
4. Implement authentication and authorization.
5. Implement user profiles and organizations.
6. Build teams and membership management.
7. Build tournament discovery and management.
8. Implement tournament registration.
9. Implement match scheduling and results.
10. Implement standings and announcements.
11. Add notifications and administration.
12. Test, harden, and deploy the complete application.

Do not build all screens using mock data and postpone database integration until the end. Integrate each feature with its real backend as soon as its dependencies are ready.

---

## 3. Phase Overview

| Phase | Focus | Completion milestone |
|---|---|---|
| 0 | Planning and repository setup | Requirements and repository are ready |
| 1 | Project foundation | Next.js application builds successfully |
| 2 | Supabase and database | Schema, migrations, and RLS are verified |
| 3 | Design system and application shell | Shared UI and navigation work |
| 4 | Authentication and authorization | Secure account flows work |
| 5 | Profiles and organizations | User and organization management works |
| 6 | Teams and memberships | Team creation and membership workflows work |
| 7 | Tournament discovery and management | Organizers can create and publish tournaments |
| 8 | Tournament registration | Eligibility, approval, and capacity rules work |
| 9 | Matches and results | Authorized users can manage matches and scores |
| 10 | Standings and announcements | Competition information remains consistent |
| 11 | Notifications and administration | Supporting operational features work |
| 12 | Integration and quality assurance | Critical workflows pass testing |
| 13 | Production deployment | Secure production release is verified |
| 14 | Maintenance and future improvements | The application remains reliable and extensible |

The order may be adjusted when implementation dependencies require it, but security and database integrity must not be postponed.

---

## 4. Phase 0 — Planning and Repository Setup

### Objectives

Prepare the project before implementing application features.

### Tasks

- Review all project documentation in `docs/`.
- Confirm the MVP scope.
- Create or verify the GitHub repository.
- Define the main branch and feature-branch workflow.
- Confirm the required Node.js and package-manager versions.
- Identify the required Supabase project.
- Establish `.gitignore` and `.env.example`.
- Confirm the naming conventions and folder structure.

### Deliverables

- Project repository
- Documentation directory
- Agreed technology stack
- Environment configuration template
- Initial implementation checklist

### Acceptance criteria

- [ ] The project scope is documented.
- [ ] The repository is accessible to the development team.
- [ ] No secrets are committed.
- [ ] Required project documents are available to the implementation agent.

**Do not proceed** if the implementation agent cannot identify the project's required architecture and MVP scope.

---

## 5. Phase 1 — Project Foundation

### Objectives

Create a stable Next.js application that supports future feature development.

### Tasks

1. Initialize or inspect the existing Next.js App Router project.
2. Configure TypeScript.
3. Configure Tailwind CSS.
4. Install and configure shadcn/ui.
5. Configure Lucide React icons.
6. Set up path aliases.
7. Create the initial `src/` directory structure.
8. Configure linting and formatting according to the project's chosen tools.
9. Add loading, error, and not-found route handling.
10. Configure environment-variable validation.
11. Add initial test configuration.
12. Verify the production build.

### Deliverables

- Working Next.js application
- Shared project configuration
- Initial application route
- Environment-variable template
- Testing and quality-check scripts

### Acceptance criteria

- [ ] The development server starts.
- [ ] The homepage loads.
- [ ] TypeScript checks pass.
- [ ] Linting passes.
- [ ] The production build succeeds.
- [ ] No unnecessary dependencies are installed.

**Milestone:** A stable application foundation is ready for feature development.

---

## 6. Phase 2 — Supabase and Database

### Objectives

Establish the real backend and protect the application's data from the beginning.

### Tasks

1. Create or select the development Supabase project.
2. Configure the Supabase URL and publishable key.
3. Create version-controlled database migrations.
4. Implement the tables defined in `04-DATABASE-SCHEMA.md`.
5. Add primary keys, foreign keys, unique constraints, and check constraints.
6. Add appropriate indexes.
7. Enable and configure RLS.
8. Create least-privilege database policies.
9. Generate TypeScript database types.
10. Create safe development seed data.
11. Test database access using different user roles.
12. Document migration and reset workflows.

### Database areas

- Profiles
- Organizations and organization memberships
- Sports
- Teams and team memberships
- Tournaments
- Tournament registrations
- Matches and match results
- Tournament standings
- Announcements
- Notifications
- Audit logs

Implement tables according to their dependencies. Do not assume every table must be populated before feature development begins.

### Acceptance criteria

- [ ] Migrations apply successfully to a clean development database.
- [ ] Foreign keys and critical constraints work.
- [ ] Generated database types are available.
- [ ] RLS prevents unauthorized access.
- [ ] Test data can be created reproducibly.
- [ ] Database credentials are not exposed in client code.

**Milestone:** The application has a verified, secure database foundation.

---

## 7. Phase 3 — Design System and Application Shell

### Objectives

Create consistent shared UI before implementing complex screens.

### Tasks

1. Implement the design tokens from `07-COLOR-TYPOGRAPHY.md`.
2. Implement the component conventions from `08-DESIGN-SYSTEM.md`.
3. Configure typography, spacing, colors, borders, and shadows.
4. Create shared buttons, inputs, cards, dialogs, and status badges.
5. Create the public site header and footer.
6. Create the authenticated dashboard shell.
7. Implement responsive navigation and mobile navigation.
8. Add reusable page headers and breadcrumbs where appropriate.
9. Implement loading skeletons and empty states.
10. Test keyboard navigation and focus visibility.

### Suggested shared components

- `Button`
- `Input`
- `Select`
- `Textarea`
- `Dialog`
- `StatusBadge`
- `PageHeader`
- `AppHeader`
- `AppSidebar`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `ConfirmDialog`

Use shadcn/ui components as a foundation where suitable, and customize them to match the established design system.

### Acceptance criteria

- [ ] Shared components use consistent tokens.
- [ ] Navigation adapts to mobile and desktop.
- [ ] Keyboard focus is visible.
- [ ] Loading, empty, and error states are reusable.
- [ ] No major page introduces an unrelated visual system.

**Milestone:** The application shell and design system are ready.

---

## 8. Phase 4 — Authentication and Authorization

### Objectives

Implement secure account access and resource-based permissions.

### Tasks

1. Configure Supabase Auth.
2. Implement account registration.
3. Implement login and logout.
4. Implement email verification where enabled.
5. Implement password recovery and reset.
6. Configure SSR-compatible session handling.
7. Protect authenticated routes.
8. Add server-side authorization helpers.
9. Implement profile initialization after signup.
10. Implement role-aware navigation.
11. Test session expiration and invalid sessions.
12. Verify permissions at both server and database levels.

### Required roles

- Guest
- Player
- Team Captain
- Tournament Organizer
- Organization Administrator
- Platform Administrator

A user may hold different permissions in different resource contexts. Do not assume every user has one universal role that grants access everywhere.

### Acceptance criteria

- [ ] Users can register and log in.
- [ ] Password recovery follows the configured authentication flow.
- [ ] Protected pages require a valid session.
- [ ] Server mutations check permissions.
- [ ] RLS independently protects database operations.
- [ ] Users cannot grant themselves administrative privileges.
- [ ] Signing out removes access to protected user data.

**Milestone:** Authentication and authorization are working before sensitive feature development begins.

---

## 9. Phase 5 — Profiles and Organizations

### Objectives

Allow users to manage their profiles and establish organization ownership.

### Tasks

- Build profile viewing and editing.
- Validate editable profile fields.
- Implement avatar upload if required.
- Implement organization creation.
- Implement organization profile editing.
- Implement organization membership and invitations if included in the MVP.
- Enforce organization-level permissions.
- Record sensitive organization administration actions.

### Acceptance criteria

- [ ] Users can update permitted profile fields.
- [ ] Users cannot modify protected account fields.
- [ ] Organization membership is verified server-side.
- [ ] Unauthorized organization modifications are rejected.
- [ ] File uploads follow storage policies and file-size limits.

**Milestone:** User identity and organization ownership are available to dependent features.

---

## 10. Phase 6 — Teams and Memberships

### Objectives

Implement team creation and membership management.

### Tasks

1. Build the teams listing page.
2. Build team details.
3. Implement team creation and editing.
4. Implement captain assignment.
5. Implement member addition and removal.
6. Enforce sport and team membership rules.
7. Implement team logo uploads if required.
8. Add team search and pagination.
9. Display team rosters and membership status.
10. Test unauthorized team operations.

### Business rules

- Team membership must be represented in the database.
- Only authorized captains or administrators can perform permitted team-management actions.
- Users cannot modify arbitrary teams by changing an ID in a request.
- Team membership changes must preserve database integrity.
- Any team-size or sport-specific restrictions must be validated server-side.

### Acceptance criteria

- [ ] Authorized users can create teams.
- [ ] Team details and rosters load correctly.
- [ ] Membership changes persist in Supabase.
- [ ] Unauthorized modifications are denied.
- [ ] Team lists support empty and error states.

**Milestone:** Teams are functional and can participate in tournaments.

---

## 11. Phase 7 — Tournament Discovery and Management

### Objectives

Enable organizers to create tournaments and users to discover them.

### Tasks

1. Implement tournament discovery.
2. Add search, filters, sorting, and pagination.
3. Implement tournament detail pages.
4. Build the tournament creation form.
5. Build tournament editing.
6. Implement tournament publication and status transitions.
7. Implement capacity, eligibility, and registration settings.
8. Add sports, venues, dates, and rules.
9. Implement tournament asset uploads if needed.
10. Enforce organizer and organization permissions.
11. Test invalid status transitions.

### Suggested tournament lifecycle

```text id="9b8y03"
Draft
  |
  v
Published / Registration Open
  |
  v
Registration Closed
  |
  v
In Progress
  |
  v
Completed
```

Cancellation should be handled as an explicitly defined status transition rather than an undocumented shortcut.

The exact lifecycle must follow the product's business rules. For example, a tournament may need to close registration before scheduling begins.

### Acceptance criteria

- [ ] Organizers can create and edit authorized tournaments.
- [ ] Published tournaments appear in discovery.
- [ ] Guests can access only intended public information.
- [ ] Search and filters work correctly.
- [ ] Invalid status transitions are rejected.
- [ ] Capacity and date rules are validated.

**Milestone:** The application can publish and display real tournaments.

---

## 12. Phase 8 — Tournament Registration

### Objectives

Allow eligible teams to register and organizers to manage applications.

### Tasks

1. Implement the registration interface.
2. Verify team eligibility.
3. Prevent duplicate active registrations.
4. Enforce tournament capacity under concurrent requests.
5. Implement pending, approved, rejected, and cancelled states as required.
6. Build the organizer registration-management interface.
7. Implement approval and rejection.
8. Handle full tournaments.
9. Handle registration closure.
10. Send notifications when the notification module is available.
11. Test duplicate and concurrent submissions.

### Critical integrity requirements

- Never rely only on client-side checks for capacity or uniqueness.
- Enforce uniqueness through database constraints where appropriate.
- Use a transaction or an atomic database operation when capacity and registration status must change together.
- Verify organizer permissions before approval.
- Define whether rejected or cancelled teams can register again.

### Acceptance criteria

- [ ] Eligible teams can register.
- [ ] Duplicate active registrations are prevented.
- [ ] Capacity cannot be exceeded through concurrent requests.
- [ ] Organizers can approve or reject authorized applications.
- [ ] Registration status is consistent in the database and UI.
- [ ] Errors are handled without creating duplicate records.

**Milestone:** Tournament registration is reliable and secure.

---

## 13. Phase 9 — Matches and Results

### Objectives

Implement match scheduling, match details, and result submission.

### Tasks

- Implement match listing and details.
- Build organizer scheduling tools.
- Validate participants and tournament membership.
- Implement match date, venue, and status management.
- Implement score entry.
- Enforce score validation based on sport rules where defined.
- Restrict result submission to authorized users.
- Support correction or amendment workflows.
- Handle postponed, cancelled, and completed matches.
- Test conflicting schedule updates.

### Acceptance criteria

- [ ] Authorized organizers can create and update matches.
- [ ] Match participants belong to the correct competition.
- [ ] Invalid scores are rejected.
- [ ] Unauthorized users cannot publish results.
- [ ] Match status and saved results remain consistent.
- [ ] Result changes follow the documented correction policy.

**Milestone:** Match scheduling and score management are operational.

---

## 14. Phase 10 — Standings and Announcements

### Objectives

Display competition progress using trustworthy match data.

### Tasks

1. Implement standings calculations for supported tournament formats.
2. Define points, wins, losses, draws, and tie-breakers for each supported sport.
3. Recalculate or update standings after valid result changes.
4. Ensure cancelled or voided matches follow the defined rules.
5. Implement tournament announcement creation and editing.
6. Display announcements on tournament pages.
7. Restrict publishing to authorized organizers.
8. Test standings against known example datasets.
9. Verify that correcting a result updates standings correctly.

### Integrity requirements

- Standings must be derived from trusted match results.
- Users must not be able to edit their own ranking directly.
- Do not apply a single points system to every sport without an explicit product rule.
- Use a consistent strategy for recalculating standings.
- Avoid partial updates where a result changes but the corresponding standings remain stale.

For critical result and standings changes, use an appropriate transaction or database-level workflow.

### Acceptance criteria

- [ ] Standings match the documented rules.
- [ ] Tie-breakers work for supported formats.
- [ ] Result corrections update standings.
- [ ] Announcements are visible to the intended audience.
- [ ] Unauthorized users cannot publish or modify announcements.

**Milestone:** Tournament results, rankings, and announcements are reliable.

---

## 15. Phase 11 — Notifications and Administration

### Objectives

Complete supporting workflows and administrative visibility.

### Tasks

- Implement in-app notifications.
- Add unread and read states.
- Notify users of relevant registration and match updates.
- Implement user-facing notification preferences if included.
- Implement administrative user and organization management.
- Restrict platform-wide actions.
- Record important administrative events.
- Add safe audit-log viewing.
- Add search and filters to administration pages where needed.

### Acceptance criteria

- [ ] Notifications are created for configured events.
- [ ] Users can access only their own private notifications.
- [ ] Administrative operations require explicit authorization.
- [ ] Audit records cannot be changed by ordinary users.
- [ ] Sensitive details are excluded from logs and notification messages.

**Milestone:** Supporting workflows and administration are complete for the MVP scope.

---

## 16. Phase 12 — Integration and Quality Assurance

### Objectives

Verify that all modules work together as one application.

### Tasks

1. Run TypeScript checks and linting.
2. Run unit tests.
3. Run component tests.
4. Run integration tests.
5. Run Playwright end-to-end tests.
6. Test RLS using different user identities.
7. Test critical database constraints.
8. Test concurrent registration requests.
9. Test invalid and unauthorized match-result submissions.
10. Test standings after result changes.
11. Test mobile, tablet, and desktop layouts.
12. Test loading, empty, and error states.
13. Check accessibility.
14. Check performance and common browser errors.
15. Resolve critical and high-priority defects.

### Required end-to-end journey

The main user journey should be tested in sequence:

```text id="df2ncu"
Create Account
      |
      v
Complete Profile
      |
      v
Create Team
      |
      v
Discover Tournament
      |
      v
Register Team
      |
      v
Organizer Approves Registration
      |
      v
Organizer Schedules Match
      |
      v
Authorized User Publishes Result
      |
      v
Standings Update
```

Use separate accounts for different roles. Do not simulate organizer permissions merely by changing a client-side role value.

### Acceptance criteria

- [ ] Core end-to-end journey passes.
- [ ] Critical authorization tests pass.
- [ ] Database integrity tests pass.
- [ ] No known critical security issue remains unresolved.
- [ ] The production build succeeds.
- [ ] The application is usable on supported screen sizes.

**Milestone:** The MVP is ready for production preparation.

---

## 17. Phase 13 — Production Deployment

### Objectives

Deploy the verified application safely.

### Tasks

- Create or confirm the production Supabase project.
- Review and apply production migrations.
- Configure production environment variables.
- Verify production RLS policies.
- Configure authentication URLs and redirects.
- Configure Vercel deployment.
- Connect the approved domain if available.
- Verify HTTPS.
- Review error logging and monitoring.
- Confirm backups and recovery procedures.
- Run production smoke tests with approved test accounts.
- Document the release and rollback procedure.

Follow `15-DEPLOYMENT-GUIDE.md` and `16-ENVIRONMENT-VARIABLES.md`.

### Acceptance criteria

- [ ] Production deployment succeeds.
- [ ] Authentication works on the production domain.
- [ ] The correct database is connected.
- [ ] Unauthorized access is denied.
- [ ] Critical workflows pass smoke tests.
- [ ] Secrets are not exposed.
- [ ] Recovery and rollback procedures are documented.

**Milestone:** Sport Organizer is deployed and verified.

---

## 18. Phase 14 — Maintenance and Future Improvements

### Objectives

Maintain reliability and introduce improvements without destabilizing the MVP.

### Tasks

- Monitor application errors.
- Review database performance.
- Review security and dependency updates.
- Maintain backups and recovery documentation.
- Gather user feedback.
- Track feature requests and defects.
- Improve accessibility and performance.
- Review audit events and abuse patterns.
- Plan enhancements based on demonstrated user needs.

### Possible future enhancements

- Live match score updates
- Advanced tournament bracket generation
- Automated round-robin scheduling
- Email and push notifications
- QR-based event check-in
- Player statistics and performance history
- Exportable tournament reports
- Public tournament sharing
- Advanced analytics
- Additional sports and scoring formats

These features are not mandatory for the initial MVP. Add them only after the core application is stable.

---

## 19. Feature Priority

Use the following priority levels.

### P0 — Required for MVP

- Project setup
- Supabase integration
- Authentication and authorization
- Profiles
- Teams and memberships
- Tournament discovery
- Tournament creation and publication
- Registration and approval
- Match scheduling
- Result publishing
- Standings for supported formats
- RLS and validation
- Critical testing
- Production deployment

### P1 — Important supporting features

- Announcements
- In-app notifications
- Organization management
- Audit-log viewing
- Improved search and filtering
- Administrative tools
- Additional accessibility and performance improvements

### P2 — Future enhancements

- Advanced analytics
- Additional tournament formats
- QR check-in
- Push notifications
- More complex automation
- Expanded reporting and integrations

Priority may be adjusted according to the agreed PRD, but security, data integrity, and authorization must never be downgraded to optional features.

---

## 20. Implementation Rules for AI Coding Agents

Follow these rules throughout the roadmap:

1. Read the relevant Markdown documents before starting each phase.
2. Inspect the existing repository before modifying files.
3. Build one phase or a small, coherent feature at a time.
4. Do not regenerate the entire project when a targeted change is sufficient.
5. Preserve existing working functionality.
6. Use real Supabase operations for completed features rather than permanent mock data.
7. Implement loading, empty, success, and error states.
8. Enforce validation and authorization on the server.
9. Maintain RLS and database constraints.
10. Add tests for important business rules.
11. Run the available checks after each meaningful implementation step.
12. Fix regressions before proceeding.
13. Update documentation when architecture or environment requirements change.
14. Do not claim completion when required tests have not been run.
15. Clearly list manual configuration steps and remaining blockers.
16. Do not deploy destructive migrations or modify production data without explicit approval.

### Phase completion report

At the end of each phase, provide:

- Phase completed
- Files created or modified
- Features implemented
- Database changes
- Tests executed and their actual results
- Known issues
- Required manual configuration
- Recommended next step

---

## 21. Definition of Done for the Project

Sport Organizer's MVP is complete when:

1. Users can securely authenticate.
2. Users can create and manage teams within their permissions.
3. Organizers can publish and manage tournaments.
4. Eligible teams can register and receive registration decisions.
5. Matches can be scheduled and results published by authorized users.
6. Standings correctly reflect the supported tournament rules.
7. RLS and server-side authorization protect all sensitive operations.
8. The main user journeys pass automated and manual testing.
9. The application is responsive and accessible.
10. Production deployment and environment configuration are verified.
11. Critical security and functionality issues are resolved.
12. Documentation reflects the implemented system.

**End of Implementation Roadmap.**