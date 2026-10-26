# Features and Modules — Sport Organizer

## 1. Purpose

This document defines the functional modules of the Sport Organizer Web App and explains how they work together.

Sport Organizer is a sports tournament management platform that allows users to discover tournaments, create teams, register for competitions, manage match schedules, publish results, and view standings.

The application must be built as a real, database-backed platform rather than a static dashboard or UI-only prototype.

## 2. Application Architecture

Organize the application into feature modules with clearly defined responsibilities.

Each feature may contain:

- UI components.
- Pages and layouts.
- Forms and validation schemas.
- Data access functions.
- Server actions or route handlers, where appropriate.
- Type definitions.
- Tests.

Keep shared UI primitives in `src/components/ui/`, shared application components in `src/components/shared/`, and feature-specific code within the appropriate feature directory.

Recommended feature structure:

```text
src/features/
├── auth/
├── dashboard/
├── profiles/
├── organizations/
├── sports/
├── teams/
├── tournaments/
├── registrations/
├── matches/
├── results/
├── standings/
├── announcements/
├── notifications/
└── admin/
```

This is a logical structure. A feature does not need every possible subdirectory until its implementation requires one.

## 3. User Roles

The application must support role-aware experiences.

### Guest

Can:
- View public pages.
- Discover public tournaments.
- View public team information.
- View published match schedules, results, and standings where available.
- Register or sign in to access protected actions.

Cannot:
- Create protected resources.
- Join private teams.
- Submit authenticated registrations.
- Access private dashboards or management functions.

### Player

Can:
- Manage their own profile.
- View their team memberships.
- View relevant tournaments and matches.
- Receive notifications.
- Perform player-level actions explicitly supported by the product.

Cannot automatically manage teams or tournaments merely because they are a player.

### Team Captain

Can, subject to team membership and permissions:
- Create or manage a team.
- Manage team details.
- Invite or manage team members.
- Register an eligible team for a tournament.
- View registration status.
- Review team schedules and results.

A captain must only manage teams they are authorized to manage.

### Tournament Organizer

Can:
- Create and manage tournaments they own or are assigned to manage.
- Configure tournament details and rules.
- Review registrations.
- Schedule matches.
- Enter and publish results.
- Publish announcements.
- Manage standings-related workflows.

Organizer access must be scoped to the relevant tournament or organization.

### Organization Administrator

Can manage permitted organization resources, members, teams, and tournaments within their organization.

An organization administrator must not automatically receive platform-wide administrator privileges.

### Platform Administrator

Can perform platform-level administration according to explicit policies.

Platform administration must be restricted to trusted, explicitly authorized accounts.

## 4. Authentication and User Profiles Module

**Purpose:** Provide secure account access and user identity management.

### Main features

- User registration.
- Sign-in and sign-out.
- Email verification.
- Password recovery.
- Session management.
- Profile viewing and editing.
- Profile avatar support, if enabled.
- Account-related feedback and error handling.

### Main screens

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/profile`
- `/settings`

### Database integration

Use:
- Supabase Auth for identity and authentication.
- `profiles` for application-specific user information.

The application must not store plaintext passwords in the application database.

### Business rules

- Each application profile must be associated with the correct authenticated user.
- Users can edit only the fields they are permitted to modify.
- Role assignment must be controlled by trusted server-side logic.
- Users must not be able to promote themselves to organizer or administrator.
- Protected routes must verify authentication and authorization.

Refer to `05-AUTHENTICATION-AND-AUTHORIZATION.md` for the detailed security model.

## 5. Dashboard Module

**Purpose:** Provide a useful overview of activities relevant to the current user.

### Main features

- Role-aware dashboard.
- Upcoming matches.
- Tournament participation.
- Team overview.
- Registration status.
- Relevant announcements.
- Recent notifications.
- Quick actions based on permissions.

### Dashboard behavior

The dashboard must adapt to the authenticated user's role and actual application data.

For example:

- A player sees relevant matches and team information.
- A captain sees team management and registration information.
- An organizer sees tournaments, pending registrations, and matches requiring attention.
- An organization administrator sees organization-level information.

Do not display hardcoded metrics or fabricated recent activities.

### Database integration

Potential sources include:
- `profiles`
- `organizations`
- `organization_members`
- `teams`
- `team_members`
- `tournaments`
- `tournament_registrations`
- `matches`
- `match_results`
- `notifications`

Fetch only the data needed for the current dashboard and enforce access permissions.

## 6. Sports Module

**Purpose:** Provide a consistent list of supported sports.

### Main features

- Browse available sports.
- Select a sport while creating a team or tournament.
- Filter tournaments by sport.
- Display sport information and optional imagery.
- Manage supported sports through authorized administration, if enabled.

### Database integration

Use the `sports` table.

### Business rules

- A tournament or team must reference a valid supported sport when the schema requires one.
- Do not allow arbitrary invalid sport IDs.
- Keep sport names consistent across forms, cards, filters, and details pages.

The initial list of supported sports should be configurable through database seed data or authorized administration rather than duplicated throughout the application code.

## 7. Organizations Module

**Purpose:** Group related teams, members, and tournaments under an organization.

### Main features

- Organization discovery, if public organizations are supported.
- Organization details.
- Organization membership.
- Organization administration.
- Organization team and tournament listings.
- Member management.

### Database integration

Use:
- `organizations`
- `organization_members`
- `profiles`
- `teams`
- `tournaments`

### Business rules

- Organization resources must be scoped to the correct organization.
- Only authorized organization administrators may manage organization settings and members.
- Organization membership must be validated before granting organization-specific access.
- Public and private organization data must follow the application's visibility rules.

Organization functionality may be implemented after the core tournament and team workflows if it is not essential to the first MVP.

## 8. Teams Module

**Purpose:** Allow users to create, discover, and manage sports teams.

### Main features

- Create a team.
- Edit team information.
- Browse public teams.
- View team details.
- Manage team membership.
- Invite members, if invitation functionality is enabled.
- View upcoming matches and previous results.
- View tournament participation.

### Main screens

- `/teams`
- `/teams/[id]`
- `/dashboard/teams`
- `/dashboard/teams/create`
- `/dashboard/teams/[id]/manage`

These routes are illustrative and should be aligned with the final routing plan.

### Database integration

Use:
- `teams`
- `team_members`
- `profiles`
- `sports`
- `tournament_registrations`
- `matches`
- `match_results`

### Business rules

- Team creation must assign ownership or captaincy through trusted backend logic.
- Only authorized members may modify team details.
- Membership must be unique according to the database constraints.
- Team capacity, if supported, must be enforced on the server.
- Removing a member must follow the team's permissions and applicable tournament rules.
- Teams with active tournament registrations must follow the defined cancellation or withdrawal rules.

### MVP scope

Include team creation, team details, roster management, and captain-level permissions.

Advanced invitations, join requests, and team transfer workflows may be introduced in later iterations.

## 9. Tournament Discovery Module

**Purpose:** Help users find tournaments that match their interests.

### Main features

- Browse tournaments.
- Search by tournament name.
- Filter by sport.
- Filter by status.
- Filter by date or location when supported.
- Sort results.
- View tournament details.
- Identify whether registration is available.

### Database integration

Use:
- `tournaments`
- `sports`
- `organizations`
- `profiles`, where organizer information is public.

### Business rules

- Display only tournaments permitted by the visibility rules.
- Apply filters to actual data.
- Use pagination or another suitable strategy for large result sets.
- Show accurate registration status.
- Avoid exposing private tournament details to unauthorized users.

## 10. Tournament Management Module

**Purpose:** Allow authorized organizers to create and manage sports tournaments.

### Main features

- Create a tournament.
- Edit tournament information.
- Set sport and organizer.
- Configure dates and location.
- Define team capacity.
- Set registration opening and closing dates.
- Publish or unpublish tournaments.
- Configure tournament rules.
- Manage tournament lifecycle.
- Cancel a tournament when authorized.

### Main screens

- `/tournaments`
- `/tournaments/[id]`
- `/dashboard/tournaments`
- `/dashboard/tournaments/create`
- `/dashboard/tournaments/[id]/manage`

### Database integration

Use:
- `tournaments`
- `sports`
- `organizations`
- `organization_members`
- `profiles`

### Business rules

- Only authorized organizers may create or manage their tournaments.
- Required fields must be validated on the server.
- Tournament dates must be logically valid.
- Registration deadlines and capacity must be enforced by backend operations.
- Tournament ownership must be assigned through trusted logic.
- Publishing, closing registration, cancellation, and other lifecycle transitions must follow defined rules.
- Cancellation must not silently delete historical matches or results.

### Tournament lifecycle

A suggested lifecycle is:

1. Draft.
2. Published with registration open.
3. Registration closed.
4. In progress.
5. Completed.
6. Cancelled, when applicable.

Implement only the transitions supported by the final database schema and product requirements.

## 11. Tournament Registration Module

**Purpose:** Allow eligible teams to register for tournaments and allow organizers to review registrations.

### Main features

- Submit a team registration.
- View registration status.
- View registration history.
- Review pending registrations.
- Approve registrations.
- Reject registrations.
- Withdraw registrations when permitted.

### Database integration

Use:
- `tournament_registrations`
- `tournaments`
- `teams`
- `team_members`
- `profiles`

### Registration lifecycle

Suggested statuses:

- Pending.
- Approved.
- Rejected.
- Withdrawn.

Use only statuses defined in the actual schema and migration files.

### Business rules

- Only authorized team captains or designated team managers may register a team.
- The team must be eligible for the tournament.
- Registration must be open at the time of submission.
- Team capacity and tournament capacity must be checked server-side.
- Duplicate active registrations must be prevented.
- Approval and capacity checks must be safe under concurrent requests.
- Only authorized tournament organizers may approve or reject registrations.
- Registration history should be retained according to the application's data-retention rules.

Registration submission and approval must not rely solely on client-side checks.

## 12. Matches and Scheduling Module

**Purpose:** Manage tournament fixtures and provide accurate schedules.

### Main features

- Create matches.
- Assign participating teams.
- Set date and time.
- Set venue.
- View match schedules.
- Update permitted match details.
- Postpone or cancel matches when authorized.
- View match status.
- Access match details.

### Database integration

Use:
- `matches`
- `tournaments`
- `teams`
- `tournament_registrations`

### Business rules

- Participating teams must be eligible for the tournament.
- A team must not be assigned to an invalid tournament fixture.
- Scheduling rules must prevent invalid or conflicting assignments where the competition format requires it.
- Match times must use a consistent timezone strategy.
- Only authorized organizers may change schedules.
- Completed matches must follow controlled correction rules.
- Match status must accurately reflect backend data.

### MVP scope

Implement organizer-managed fixture creation and schedule viewing.

Automatic bracket generation, advanced round-robin scheduling, and complex conflict detection may be added after the basic workflows are stable.

## 13. Match Results Module

**Purpose:** Record, validate, and publish match results.

### Main features

- Enter match scores.
- Validate score values.
- Save results.
- Publish results.
- View completed match results.
- Correct results through authorized workflows.
- Update standings after result publication.

### Database integration

Use:
- `matches`
- `match_results`
- `tournaments`
- `teams`
- `tournament_standings`
- `audit_logs`

### Business rules

- Only authorized organizers or designated officials may submit results.
- Scores must follow sport-specific validation rules where implemented.
- A result must belong to the correct match.
- Result publication must be validated and authorized server-side.
- Duplicate or conflicting results must be prevented.
- Corrections to published results must be auditable.
- Standings must be updated consistently after an accepted result.

For operations involving both result publication and standings updates, use an appropriate database transaction or another reliable consistency strategy.

## 14. Standings Module

**Purpose:** Show tournament rankings based on accepted match results and the tournament's scoring rules.

### Main features

- Display tournament standings.
- Rank participating teams.
- Show applicable match statistics.
- Show points and score differences when relevant.
- Refresh standings after result publication.
- Display a useful empty state before results are available.

### Database integration

Use:
- `tournament_standings`
- `match_results`
- `matches`
- `teams`
- `tournaments`

### Business rules

- Standings must follow the applicable tournament format.
- Ranking rules must be deterministic and documented.
- Tie-breaking rules must be defined for each supported format.
- Users must not be able to edit authoritative standings directly through the browser.
- Standings must remain consistent with accepted match results.
- Corrections to match results must trigger the appropriate recalculation.

The `tournament_standings` table may be used as a derived or cached representation. Its update mechanism must be designed deliberately rather than treating it as independent authoritative input.

## 15. Announcements Module

**Purpose:** Allow authorized organizers to communicate important tournament information.

### Main features

- Create announcements.
- Edit announcements when permitted.
- Publish announcements.
- Display announcements on tournament pages.
- Display relevant announcements on dashboards.
- Track publication timestamps.

### Database integration

Use:
- `tournament_announcements`
- `tournaments`
- `profiles`

### Business rules

- Only authorized organizers may create or publish announcements for their tournaments.
- Announcement visibility must follow tournament access rules.
- Published announcements must display accurate timestamps.
- Unpublished announcements must not appear to unauthorized viewers.
- Editing and deleting announcements must follow the applicable audit and retention policies.

## 16. Notifications Module

**Purpose:** Inform users about important events and changes.

### Main features

Potential notification events include:

- Registration submitted.
- Registration approved or rejected.
- Match scheduled or rescheduled.
- Match result published.
- Tournament announcement published.
- Team membership changed.

### Main screens

- Notification menu.
- Notifications page.
- Relevant destination page after notification selection.

### Database integration

Use:
- `notifications`
- `profiles`
- Related tournament, registration, team, and match records.

### Business rules

- Notifications must be associated with the correct recipient.
- Users may only view and update their own notification state.
- Notification content must not expose information the recipient cannot access.
- Notifications must not be created for failed operations.
- Notification generation must be reliable for important state changes.

Email, push notifications, and real-time delivery may be added later. The initial implementation can use database-backed in-app notifications.

## 17. Administration Module

**Purpose:** Provide controlled administrative functionality.

### Platform administration

Potential features:

- User oversight.
- Sport catalog management.
- Reported issue management, if introduced.
- Platform activity review.
- Administrative audit review.

### Organization administration

Potential features:

- Organization profile management.
- Organization member management.
- Team oversight.
- Tournament oversight.

### Database integration

Depending on the implemented scope, use:
- `profiles`
- `organizations`
- `organization_members`
- `sports`
- `teams`
- `tournaments`
- `audit_logs`

### Business rules

- Platform and organization administration are separate permission scopes.
- Only explicitly authorized platform administrators may perform platform-level actions.
- Organization administrators must remain scoped to their organization.
- Administrative actions must be auditable when required.
- Privileged database operations must never depend on client-supplied role claims alone.
- Sensitive user information must not be exposed without authorization.

Administrative features should be implemented after the primary user and tournament workflows unless required for the initial release.

## 18. Audit Logging Module

**Purpose:** Maintain an accountable record of important administrative and tournament operations.

### Potential events

- Tournament creation and cancellation.
- Registration approval or rejection.
- Match schedule changes.
- Result publication and correction.
- Administrative role changes.
- Significant organization changes.

### Database integration

Use `audit_logs` as defined in `04-DATABASE-SCHEMA.md`.

### Business rules

- Important records should capture the actor, action, target, and timestamp where appropriate.
- Audit records must not be freely editable by ordinary users.
- Sensitive information, credentials, and access tokens must never be written to audit logs.
- Logging must not expose private data unnecessarily.
- Critical audit events should be recorded through trusted server-side logic or database mechanisms.

## 19. Settings Module

**Purpose:** Let users manage permitted account preferences.

### Initial features

- Edit profile information.
- Change supported account preferences.
- Manage avatar, if enabled.
- Access password recovery or account security options.
- Sign out.

Additional notification preferences and theme settings may be introduced later.

### Business rules

- Users may only change their own permitted settings.
- Security-sensitive changes must follow the authentication provider's recommended process.
- Unsupported preferences must not be presented as functional settings.
- Changes must persist correctly and show accurate feedback.

## 20. Global Search and Filtering

**Purpose:** Make tournament and team information easier to discover.

### Initial scope

Support search and filters for:
- Tournament names.
- Sports.
- Tournament statuses.
- Dates and locations where available.
- Public team names.

### Business rules

- Search must return real matching records.
- Search results must follow visibility and authorization rules.
- Inputs must be validated and safely handled.
- Large result sets must be paginated or otherwise limited.
- Empty and error states must be clear.

A cross-application global search can be deferred if tournament discovery already meets the MVP needs.

## 21. Database Module Mapping

The following table summarizes the main relationships between features and database tables.

| Feature | Primary tables |
|---|---|
| Authentication and profiles | Supabase Auth, `profiles` |
| Dashboard | Role-dependent queries across relevant tables |
| Sports | `sports` |
| Organizations | `organizations`, `organization_members` |
| Teams | `teams`, `team_members` |
| Tournament discovery | `tournaments`, `sports` |
| Tournament management | `tournaments` |
| Registrations | `tournament_registrations` |
| Match scheduling | `matches` |
| Match results | `match_results` |
| Standings | `tournament_standings`, `match_results`, `matches` |
| Announcements | `tournament_announcements` |
| Notifications | `notifications` |
| Administration | Relevant tables according to scope |
| Audit logging | `audit_logs` |
| Settings | `profiles` and supported preference storage |

The actual table definitions, foreign keys, constraints, indexes, and row-level security policies must follow `04-DATABASE-SCHEMA.md`.

Do not create duplicate tables simply because two features need access to the same data.

## 22. Module Dependencies

The main dependencies are:

- Authentication provides identity to protected features.
- Profiles provide user-facing account information.
- Sports provide classification for teams and tournaments.
- Organizations provide optional grouping and administrative scope.
- Teams provide participants for tournament registrations and matches.
- Tournaments define the competition and its rules.
- Registrations determine which teams are eligible to participate.
- Matches define the scheduled competition.
- Results record accepted match outcomes.
- Standings derive rankings from results and scoring rules.
- Announcements communicate tournament updates.
- Notifications communicate relevant events.
- Audit logs record important operations.

A feature must not assume another module has completed an operation until the backend confirms it.

## 23. Recommended MVP Scope

Implement the platform in the following order.

### Phase 1 — Foundation

- Project setup and shared design system.
- Supabase connection.
- Authentication.
- Profile management.
- Authorization foundations.
- Public and authenticated layouts.

### Phase 2 — Core sports functionality

- Sports catalog.
- Team creation and details.
- Team roster management.
- Tournament discovery.
- Tournament creation and management.

### Phase 3 — Competition management

- Tournament registrations.
- Organizer registration review.
- Match scheduling.
- Match result entry and publication.
- Basic standings.

### Phase 4 — Communication and polish

- Announcements.
- In-app notifications.
- Dashboard improvements.
- Responsive refinements.
- Loading, empty, and error states.
- Accessibility and security testing.

### Phase 5 — Optional advanced functionality

- Organization management.
- Advanced tournament formats.
- Automatic bracket generation.
- Advanced analytics.
- Email or push notifications.
- Advanced administrative reports.

Prioritize a fully working end-to-end tournament workflow over a large number of incomplete modules.

## 24. Global Implementation Rules

Every module must follow these rules:

1. Use real backend data for production functionality.
2. Validate input on the server.
3. Enforce authorization on trusted server-side paths and through Supabase RLS where applicable.
4. Keep business logic separate from presentation where practical.
5. Reuse the shared design system.
6. Provide loading, empty, success, and error states.
7. Use typed data models and validation schemas.
8. Prevent duplicate submissions and invalid state transitions.
9. Handle concurrent operations safely for capacity, registration, and result publication.
10. Add tests for critical business rules.
11. Keep database changes in version-controlled migrations.
12. Do not introduce new tables or major architectural changes without checking the existing project documentation.
13. Do not implement placeholder buttons that appear functional but perform no real action.
14. Document assumptions when a feature's requirements are unclear.

## 25. Feature Completion Checklist

A feature is ready for release only when:

- [ ] Its requirements are clearly defined.
- [ ] Its UI is implemented consistently.
- [ ] Its data model matches the database schema.
- [ ] Authentication requirements are satisfied.
- [ ] Authorization is enforced server-side.
- [ ] Validation and business rules are implemented.
- [ ] Loading, empty, and error states work.
- [ ] Responsive layouts are tested.
- [ ] Accessibility is considered.
- [ ] Critical actions are tested.
- [ ] Relevant database migrations are committed.
- [ ] No fabricated production data or misleading success messages remain.

## 26. Related Documentation

- `01-PROJECT-OVERVIEW.md`
- `02-PRD.md`
- `03-TECH-STACK.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `06-UI-UX-GUIDELINES.md`
- `07-COLOR-TYPOGRAPHY.md`
- `08-DESIGN-SYSTEM.md`
- `10-API-AND-BACKEND.md`
- `11-SECURITY-RULES.md`
- `12-USER-FLOWS.md`
- `13-VALIDATION-AND-ERROR-HANDLING.md`
- `14-TESTING-STRATEGY.md`

---

**End of Features and Modules**