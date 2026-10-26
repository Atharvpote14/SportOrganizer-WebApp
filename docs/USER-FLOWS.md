# User Flows — Sport Organizer

## 1. Purpose

This document defines the user journeys, navigation paths, decision points, and expected system behavior for the Sport Organizer Web App.

The goal is to provide a consistent experience for all user types while ensuring that every workflow respects authentication, authorization, validation, and competition rules.

These flows guide:

- Frontend page development.
- Backend and database integration.
- Navigation and redirects.
- Form design and validation.
- Loading, success, and error states.
- Automated testing.
- AI coding agents implementing features.

## 2. User Roles

Sport Organizer supports the following user types.

| Role | Primary purpose |
|---|---|
| Guest | Discover public tournaments, teams, and published results |
| Player | Manage their profile and participate in teams |
| Team Captain | Manage an authorized team and submit tournament registrations |
| Tournament Organizer | Manage assigned tournaments, registrations, schedules, and results |
| Organization Administrator | Manage permitted organization resources and members |
| Platform Administrator | Manage platform-level resources and administration |

A user may have different permissions in different organizations or resources. The application must determine access from trusted backend data rather than relying on the currently displayed role selector.

## 3. General Navigation Flow

```text
Open Sport Organizer
        |
        v
View Public Home Page
        |
        +---- Browse Tournaments
        |
        +---- View Teams and Results
        |
        +---- Sign In / Sign Up
                    |
                    v
              Authenticate
                    |
                    v
           Load User Permissions
                    |
                    v
           Open User Dashboard
                    |
          +---------+----------+
          |         |          |
        Teams   Tournaments   Matches
          |         |          |
          +---------+----------+
                    |
                    v
             Perform Action
                    |
                    v
          Validate and Authorize
                    |
                    v
          Save Data and Refresh UI
```

### Navigation rules

- Public pages must be accessible without signing in when their content is public.
- Protected pages must require authentication.
- Users who lack permission must not be able to perform restricted actions.
- After sign-in, redirect users to their intended destination when appropriate.
- If no intended destination exists, open the appropriate dashboard.
- Preserve relevant filters and search parameters when practical.
- Do not redirect every user to the same dashboard if their permissions require different landing pages.

## 4. Guest Flow — Discover Tournaments

### Objective

Allow visitors to discover tournaments and view public competition information without creating an account.

### Steps

1. The guest opens the home page.
2. The system displays featured or upcoming public tournaments.
3. The guest selects **Browse Tournaments**.
4. The tournament listing page loads.
5. The guest applies filters such as sport, status, date, or location.
6. The guest opens a tournament card.
7. The tournament details page displays public information.
8. The guest may view published schedules, results, and standings where available.
9. If registration requires an account, the guest selects **Register**.
10. The system redirects the guest to sign in or sign up.
11. After successful authentication, the system returns the user to the intended tournament when appropriate.

### Expected behavior

- Public tournament data is visible according to publication and visibility settings.
- Draft or private tournaments remain inaccessible to unauthorized visitors.
- Search and filters work with actual database data.
- Empty search results display a useful message.
- A protected action does not succeed merely because the guest can see its button or URL.

### Example route sequence

`/` → `/tournaments` → `/tournaments/[tournamentId]` → `/login`

## 5. Authentication Flow

### 5.1 Sign-up

**Objective:** Create a new user account.

Steps:

1. The visitor opens the sign-up page.
2. The visitor enters the required information.
3. The application validates the input.
4. Supabase Auth processes the sign-up request.
5. If email verification is required, the user is informed that verification is pending.
6. The user verifies their email through the configured authentication flow.
7. The application establishes the appropriate authenticated session.
8. The user completes any required profile setup.
9. The application opens the dashboard.

Expected states:

- Invalid form data.
- Account creation failure.
- Verification required.
- Verification successful.
- Session expired.
- Profile setup incomplete.
- Successful onboarding.

Do not grant administrator privileges or privileged organization membership during ordinary sign-up.

### 5.2 Sign-in

Steps:

1. The user opens the login page.
2. The user enters their credentials.
3. The application validates the form.
4. Supabase Auth verifies the credentials.
5. The application establishes the authenticated session.
6. The application retrieves the relevant profile and permissions.
7. The user is redirected to the intended destination or dashboard.

If authentication fails, show a safe message without unnecessarily revealing whether a particular email address has an account.

### 5.3 Password recovery

Steps:

1. The user selects **Forgot Password**.
2. The user submits their email address.
3. The application requests the supported Supabase password-recovery flow.
4. The user follows the recovery link.
5. The user sets a new password through the supported flow.
6. The application confirms completion.
7. The user signs in again if required.

Recovery links must use configured, trusted redirect URLs.

### 5.4 Sign-out

Steps:

1. The user opens the account menu.
2. The user selects **Sign Out**.
3. The application signs out through Supabase Auth.
4. Protected session-dependent UI is cleared or refreshed.
5. The user is redirected to a public page.

Signing out must not delete the user's profile, teams, registrations, or competition history.

## 6. Player Flow — Manage Profile

### Objective

Allow a player to maintain their personal information and view their participation.

### Steps

1. The player signs in.
2. The player opens their profile.
3. The system loads the permitted profile fields.
4. The player selects **Edit Profile**.
5. The player updates editable fields.
6. The application validates the changes.
7. The backend verifies authorization.
8. The changes are saved.
9. The interface displays a success message and refreshed profile information.

### Rules

- Users can update only permitted fields belonging to their own profile.
- Role, ownership, and administrator fields cannot be changed through the ordinary profile form.
- Private information must not become publicly visible without the appropriate policy.
- Invalid changes must preserve the last successfully saved values.

### Example route sequence

`/dashboard` → `/profile` → `/profile/edit`

## 7. Team Captain Flow — Create a Team

### Objective

Allow a user with the required permissions to create and manage a team.

### Steps

1. The captain signs in.
2. The captain opens **Teams**.
3. The captain selects **Create Team**.
4. The system displays the team creation form.
5. The captain enters the team name, sport, description, and other supported fields.
6. The application validates the input.
7. The backend verifies authentication and checks eligibility.
8. The team is created.
9. The authorized captain membership is established.
10. The system displays the team details page.

### Important behavior

- Team creation and initial captain membership must remain consistent.
- Use an atomic database operation if both records must be created together.
- Enforce team name and membership constraints according to the product rules.
- Do not allow a client to assign arbitrary captain or owner IDs.

### Example route sequence

`/dashboard` → `/teams` → `/teams/new` → `/teams/[teamId]`

## 8. Team Captain Flow — Manage Team Members

### Objective

Allow authorized team managers to maintain team membership.

### Steps

1. The captain opens the team details page.
2. The captain selects **Manage Members**.
3. The system loads the team's permitted membership information.
4. The captain selects an available membership action.
5. The backend verifies the captain's authority.
6. The backend validates the requested change.
7. The membership is updated.
8. The interface refreshes the member list.

### Supported actions

Implement only the actions defined by the product requirements, such as:

- View team members.
- Invite or add members, if supported.
- Remove members, if permitted.
- Change team details.
- Transfer captaincy through an authorized workflow, if supported.

### Rules

- A captain cannot modify an unrelated team's membership.
- Membership uniqueness must be enforced.
- The application must prevent invalid membership states.
- Removing a member must not silently delete historical match or tournament records.
- Captaincy transfers must update the relevant permissions safely.

## 9. Team Captain Flow — Register for a Tournament

### Objective

Allow an eligible team to enter an available tournament.

### Preconditions

- The user is authenticated.
- The user has permission to manage the selected team.
- The tournament exists and is visible to the user.
- Registration is open.
- The team meets the applicable eligibility rules.

### Steps

1. The captain opens the tournament listing.
2. The captain selects a tournament.
3. The system displays tournament details and registration status.
4. The captain selects **Register Team**.
5. If the captain manages multiple teams, the system asks them to choose the appropriate team.
6. The captain reviews the registration details.
7. The captain confirms the submission.
8. The backend validates the team, tournament, deadline, eligibility, and current capacity.
9. The database safely creates the registration.
10. The interface displays the registration status.
11. The captain can view the registration from the team or tournament dashboard.

### Possible outcomes

| Outcome | Expected behavior |
|---|---|
| Registration accepted for processing | Show the applicable pending or approved status |
| Registration period closed | Explain that registration is closed |
| Team not eligible | Explain the applicable restriction |
| Duplicate registration | Show the existing registration or a clear conflict message |
| Tournament full | Explain that capacity has been reached |
| Unauthorized team | Reject the request |
| Temporary failure | Show an error and allow a safe retry |

The application must not rely on a frontend capacity check. Simultaneous registration requests must be handled safely by trusted backend logic and database constraints.

## 10. Tournament Organizer Flow — Create a Tournament

### Objective

Allow an authorized organizer to create and manage a tournament.

### Steps

1. The organizer signs in.
2. The organizer opens the organizer dashboard.
3. The organizer selects **Create Tournament**.
4. The application displays the tournament form.
5. The organizer enters the name, sport, dates, location, registration deadline, capacity, format, and other supported fields.
6. The application validates the form.
7. The backend verifies organizer permissions.
8. The backend checks date relationships and other business rules.
9. The tournament is saved in draft status.
10. The organizer reviews the details.
11. The organizer publishes the tournament when it is ready.
12. The tournament appears in public discovery if its visibility settings permit it.

### Rules

- Creating a tournament does not automatically make it public.
- Draft tournaments remain visible only to authorized users.
- Registration must not open before the configured conditions are met.
- The tournament lifecycle must follow the documented business rules.
- The organizer may manage only tournaments within their authorized scope.

### Example route sequence

`/dashboard` → `/organizer/tournaments` → `/organizer/tournaments/new` → `/organizer/tournaments/[tournamentId]`

## 11. Tournament Organizer Flow — Manage Registrations

### Objective

Allow organizers to review and process team registrations.

### Steps

1. The organizer opens an authorized tournament.
2. The organizer selects **Registrations**.
3. The system loads registrations visible to that organizer.
4. The organizer filters by status when necessary.
5. The organizer opens a registration.
6. The system displays the relevant team and registration information.
7. The organizer selects **Approve** or **Reject**.
8. The application requests confirmation when appropriate.
9. The backend verifies the organizer's authority.
10. The backend validates the current registration state and tournament capacity.
11. The database updates the registration atomically where required.
12. The interface refreshes the registration list and status.
13. The system creates an appropriate notification if notifications are enabled.

### Rules

- Only authorized organizers can approve or reject registrations.
- Repeated requests must not create inconsistent state.
- Approval must respect tournament capacity and eligibility rules.
- The organizer must not be able to modify registrations belonging to unrelated tournaments.
- Notifications must reflect successfully committed changes.

## 12. Tournament Organizer Flow — Schedule Matches

### Objective

Allow an authorized organizer to create and maintain tournament match schedules.

### Steps

1. The organizer opens the tournament dashboard.
2. The organizer selects **Matches**.
3. The organizer chooses **Create Match** or the supported scheduling action.
4. The organizer selects eligible participating teams.
5. The organizer sets the date, time, venue, and other required fields.
6. The application validates the schedule.
7. The backend verifies permissions and team eligibility.
8. The match is saved.
9. The match appears in the tournament schedule.
10. The interface displays the updated schedule.

### Rules

- Teams must satisfy tournament eligibility requirements.
- Match dates must follow applicable tournament rules.
- Completed matches cannot be changed through ordinary scheduling actions.
- Postponement and cancellation must follow the supported match lifecycle.
- Time zones must be handled consistently.
- Match creation must not permit arbitrary participation by unregistered teams unless the tournament rules explicitly allow it.

## 13. Tournament Organizer Flow — Publish Match Results

### Objective

Allow an authorized organizer to record a match result and update competition standings.

### Steps

1. The organizer opens the match details page.
2. The organizer selects **Enter Result**.
3. The application displays the score entry form.
4. The organizer enters the result.
5. The application validates required fields and score formats.
6. The backend verifies the organizer's permissions.
7. The backend verifies the match's current state.
8. The result is stored using a consistent database operation.
9. The match status is updated as required.
10. Standings are recalculated or reliably scheduled for recalculation.
11. The interface displays the accepted result and updated standings.
12. Relevant users may receive notifications if that feature is enabled.

### Correction flow

If a result requires correction:

1. The organizer requests a correction through the supported workflow.
2. The backend checks permission and current match state.
3. The correction is validated.
4. The correction and its audit record are saved consistently.
5. Standings are recalculated.
6. The updated result is displayed.

### Rules

- Never trust client-generated standings.
- Prevent unauthorized result changes.
- Prevent duplicate or conflicting result submissions.
- Record important result corrections.
- Avoid displaying a successful result if the database operation fails.

## 14. Organization Administrator Flow

### Objective

Allow an organization administrator to manage authorized organization resources.

### Steps

1. The administrator signs in.
2. The administrator opens the organization dashboard.
3. The system verifies organization membership and administrative permission.
4. The administrator opens the relevant management section.
5. The administrator views organization members and permitted resources.
6. The administrator performs an authorized action.
7. The backend validates the request and checks the administrator's scope.
8. The database saves the change.
9. The interface displays the updated information.

### Possible management areas

- Organization profile.
- Organization membership.
- Organizer assignments.
- Organization-associated teams and tournaments.
- Organization settings.

Implement only the features supported by the product requirements.

An organization administrator must not automatically gain platform-wide privileges.

## 15. Platform Administrator Flow

### Objective

Allow explicitly authorized platform administrators to manage platform-level resources and respond to operational issues.

### Steps

1. The administrator signs in.
2. The application verifies the administrator's actual permission.
3. The administrator opens the protected administration dashboard.
4. The system loads permitted administrative data.
5. The administrator selects a supported operation.
6. The backend verifies permissions again.
7. Sensitive changes require confirmation where appropriate.
8. The operation executes.
9. An audit record is created for significant changes.
10. The interface displays the outcome.

### Security rules

- Never grant platform administrator access through public sign-up.
- Never trust a browser-submitted administrator flag.
- Restrict privileged operations to explicitly authorized backend paths.
- Require additional protection for destructive or high-impact actions.
- Avoid exposing private user information unnecessarily.
- Log significant administrative changes.

## 16. Search, Filters, and Pagination Flow

### Objective

Help users discover relevant tournaments, teams, matches, and other permitted resources.

### Steps

1. The user opens a listing page.
2. The system loads the initial dataset.
3. The user enters a search term or selects filters.
4. The application validates the search parameters.
5. The backend applies permitted filters and sorting.
6. The system returns a bounded result set.
7. The interface displays results and pagination controls.
8. The user changes filters or loads another page.
9. The interface updates the result list.

### Rules

- Search results must respect authorization and visibility restrictions.
- Filtering must use actual query parameters or database filters.
- Page sizes must be limited.
- Sorting fields must be allowlisted.
- Invalid filters must not cause server errors.
- Empty results must display a useful message.

## 17. Notifications Flow

### Objective

Allow users to view notifications relevant to their account.

### Steps

1. The user signs in.
2. The user opens the notification panel or notifications page.
3. The system loads the user's permitted notifications.
4. The user opens a notification.
5. The application marks it as read if that behavior is supported.
6. The notification links to the relevant authorized resource.
7. The user can return to their dashboard.

### Rules

- Users must not access another user's private notifications.
- Notification actions must validate access to the destination resource.
- Read status must be saved only for the authorized recipient.
- Failed business operations must not generate misleading success notifications.
- Notification counts must be consistent with the underlying data.

## 18. Common Error and Recovery Flows

### 18.1 Session expired

1. The user attempts a protected action.
2. The backend detects that authentication is no longer valid.
3. The action is rejected.
4. The user is prompted to sign in again.
5. The application redirects to the original destination when safe and appropriate.

### 18.2 Permission denied

1. The user opens a protected resource or performs an action.
2. The backend checks the user's permission.
3. The request is rejected if permission is absent.
4. The interface displays a suitable message.
5. The user may return to a permitted page.

### 18.3 Resource not found

1. The user opens a stale or invalid link.
2. The system cannot find a resource the user is permitted to view.
3. The application displays an appropriate not-found state.
4. The interface offers a route back to the relevant listing or dashboard.

Do not reveal the existence of a private resource unnecessarily.

### 18.4 Network or database failure

1. The user submits an action.
2. The operation fails or its outcome is uncertain.
3. The application displays a safe error.
4. The interface preserves entered form data where appropriate.
5. The user can retry safely.
6. The application checks the resulting database state when necessary before repeating a non-idempotent operation.

### 18.5 Concurrent update

1. Two users attempt incompatible changes.
2. The backend validates the current state.
3. Only permitted, consistent changes are committed.
4. A conflicting request receives a clear conflict response.
5. The interface refreshes the affected data.

## 19. Loading, Empty, Success, and Error States

Every data-driven page must have appropriate UI states.

### Loading

- Show a suitable loading indicator or skeleton.
- Avoid displaying misleading placeholder values.
- Prevent duplicate submissions when an operation is in progress.

### Empty

- Explain why no records are displayed where practical.
- Provide a relevant next action.
- Do not confuse an empty result with a failed request.

### Success

- Confirm the completed action.
- Refresh the relevant data.
- Display the resulting status.
- Provide navigation to the updated resource when helpful.

### Error

- Show an understandable message.
- Preserve user input when safe.
- Offer retry or recovery actions when appropriate.
- Never display raw internal exceptions.

## 20. Responsive and Accessibility Considerations

User flows must work on desktop, tablet, and mobile devices.

- Use responsive navigation.
- Keep primary actions accessible on smaller screens.
- Ensure forms have visible labels.
- Provide keyboard-accessible controls.
- Display validation errors in a clear and accessible way.
- Do not communicate status through color alone.
- Provide appropriate focus handling for dialogs and menus.
- Respect reduced-motion preferences.
- Ensure tables and match schedules remain usable on narrow screens.

## 21. User Flow Acceptance Tests

The following workflows must be tested before the MVP is considered complete.

### Public discovery

- [ ] Guest can browse public tournaments.
- [ ] Guest can open permitted tournament details.
- [ ] Private tournaments are not exposed to unauthorized visitors.
- [ ] Filters and search work correctly.

### Authentication

- [ ] User can sign up and complete the configured verification flow.
- [ ] User can sign in and sign out.
- [ ] Password recovery works through the supported flow.
- [ ] Protected pages reject unauthorized access.

### Teams

- [ ] Authorized user can create a team.
- [ ] Initial captain membership is consistent.
- [ ] Authorized captain can manage permitted team details.
- [ ] Unrelated team membership cannot be modified.

### Tournaments

- [ ] Authorized organizer can create and publish a tournament.
- [ ] Guest cannot create or modify a tournament.
- [ ] Registration rules are enforced by the backend.
- [ ] Duplicate and concurrent registration attempts are handled safely.

### Matches and results

- [ ] Authorized organizer can schedule eligible matches.
- [ ] Invalid match data is rejected.
- [ ] Unauthorized users cannot publish results.
- [ ] Published results update standings consistently.
- [ ] Result corrections follow the authorized workflow.

### Administration

- [ ] Organization administrators are restricted to their scope.
- [ ] Platform administration requires explicit authorization.
- [ ] Significant administrative actions are audited.

### Reliability

- [ ] Loading and empty states display correctly.
- [ ] Errors are understandable and safe.
- [ ] Session expiry is handled correctly.
- [ ] Concurrent changes do not leave inconsistent data.
- [ ] Mobile navigation and forms remain usable.

## 22. Implementation Guidance for AI Coding Agents

When implementing a user flow:

1. Identify the relevant role and permissions.
2. Identify the pages, components, and routes required.
3. Review the relevant database schema.
4. Define input validation and business rules.
5. Implement backend authorization before connecting the UI.
6. Add loading, empty, success, and error states.
7. Ensure the database operation is safe under retries and concurrent requests.
8. Add tests for both successful and unauthorized scenarios.
9. Update related documentation if the workflow changes.
10. Verify the entire flow using real development data rather than hardcoded success responses.

Do not implement only the visual steps while leaving the actual database operation, permissions, or error handling incomplete.

## 23. Related Documentation

- `02-PRD.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `06-UI-UX-GUIDELINES.md`
- `09-FEATURES-AND-MODULES.md`
- `10-API-AND-BACKEND.md`
- `11-SECURITY-RULES.md`
- `13-VALIDATION-AND-ERROR-HANDLING.md`
- `14-TESTING-STRATEGY.md`
- `18-IMPLEMENTATION-ROADMAP.md`
- `19-AI-CODING-INSTRUCTIONS.md`

---

**End of User Flows**