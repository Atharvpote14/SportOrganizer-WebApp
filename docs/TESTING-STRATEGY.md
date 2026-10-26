# Testing Strategy — Sport Organizer

## 1. Purpose

This document defines the testing strategy for the Sport Organizer Web App.

The objective is to ensure that the application is functional, secure, reliable, accessible, and ready for production.

Testing must verify that:

- Features work according to the product requirements.
- UI components behave correctly on different screen sizes.
- Backend operations validate requests and enforce permissions.
- Supabase database policies protect private data.
- Tournament registrations and match results remain consistent.
- Errors are handled safely.
- Critical workflows work from beginning to end.
- Production builds complete successfully.

This document applies to developers, testers, and AI coding agents working on the project.

## 2. Testing Principles

Follow these principles throughout development:

1. Test features as they are implemented rather than postponing all testing until the end.
2. Test successful scenarios and failure scenarios.
3. Prioritize security-sensitive and competition-critical operations.
4. Use automated tests for repeatable behavior.
5. Test database permissions independently of the frontend.
6. Use isolated test data and environments.
7. Avoid tests that depend on execution order.
8. Verify fixes with regression tests.
9. Test responsive layouts and accessibility.
10. Run the appropriate test suite before merging or deploying changes.

A feature is not complete merely because its UI renders without errors.

## 3. Testing Stack

Use the following tools with compatible versions.

| Tool | Purpose |
|---|---|
| Vitest | Unit and lightweight integration tests |
| React Testing Library | React component behavior |
| `@testing-library/user-event` | Realistic user interactions |
| `@testing-library/jest-dom` | DOM assertions |
| Playwright | End-to-end browser testing |
| Zod | Runtime validation schemas to test |
| Supabase local development tools | Isolated database and authentication testing, where configured |
| TypeScript | Static type checking |
| ESLint | Code quality and common defect detection |
| Next.js production build | Build and compilation verification |

Install only the dependencies needed for the chosen test setup. Do not maintain multiple tools for the same purpose without a clear reason.

## 4. Testing Levels

Sport Organizer uses four primary testing levels.

### 4.1 Unit testing

Test individual functions and isolated logic.

Examples:

- Zod validation schemas.
- Date validation.
- Match score validation.
- Tournament status transitions.
- Permission helper logic.
- Standings calculations.
- Error mapping.
- Formatting utilities.

Unit tests should be fast and deterministic.

### 4.2 Component testing

Test UI components and their observable behavior.

Examples:

- Tournament cards.
- Team cards.
- Match cards.
- Registration forms.
- Confirmation dialogs.
- Status badges.
- Search and filter controls.
- Loading, empty, and error states.
- Responsive navigation behavior where testable.

Use React Testing Library to test what users see and do rather than depending heavily on internal implementation details.

### 4.3 Integration testing

Test interactions between multiple application layers.

Examples:

- Server Actions with validation and database access.
- Authentication and authorization helpers.
- Supabase queries and RLS policies.
- Registration capacity enforcement.
- Match result persistence.
- Standings recalculation.
- Notification creation.
- Audit logging.

Integration tests should use controlled test data and a dedicated test environment.

### 4.4 End-to-end testing

Test complete user journeys in a real browser using Playwright.

Examples:

- Signing in and signing out.
- Creating a team.
- Creating and publishing a tournament.
- Registering a team.
- Approving a registration.
- Scheduling a match.
- Publishing a result.
- Viewing updated standings.

End-to-end tests verify that the major parts of the system work together.

## 5. Recommended Test Folder Structure

Organize tests according to the project structure.

```text
src/
├── features/
│   ├── teams/
│   │   ├── schemas.ts
│   │   ├── services.ts
│   │   └── schemas.test.ts
│   ├── tournaments/
│   ├── registrations/
│   ├── matches/
│   └── standings/
├── components/
└── lib/
    └── errors/

tests/
├── integration/
│   ├── registrations.test.ts
│   ├── results.test.ts
│   └── permissions.test.ts
├── e2e/
│   ├── auth.spec.ts
│   ├── teams.spec.ts
│   ├── tournaments.spec.ts
│   └── competition-flow.spec.ts
└── fixtures/
    └── test-data.ts
```

This is a suggested structure. Follow the conventions established by the installed tools and existing codebase.

Keep unit tests close to the feature when practical. Use a dedicated directory for integration and end-to-end tests.

## 6. Unit Testing Requirements

### 6.1 Input validation

Test all important schemas.

Examples:

- Empty team names are rejected.
- Overlong descriptions are rejected.
- Invalid UUIDs are rejected.
- Invalid tournament dates are rejected.
- Invalid score values are rejected.
- Unsupported status values are rejected.
- Valid input is accepted.

### 6.2 Business logic

Test the rules that determine how the application behaves.

Examples:

- Registration cannot be submitted after the deadline.
- A completed match cannot accept an ordinary result submission.
- A tournament cannot transition through an unsupported lifecycle state.
- Standings follow the configured scoring rules.
- A result correction triggers the correct recalculation behavior.

### 6.3 Error mapping

Verify that known errors produce the expected application error codes and that unexpected failures do not expose internal details.

### 6.4 Utility functions

Test reusable functions such as:

- Date and time formatting.
- Score formatting.
- Search parameter normalization.
- Pagination calculations.
- Tournament status labels.

## 7. Component Testing Requirements

Component tests must verify visible behavior and accessibility.

### Required checks

- Correct content appears for the supplied data.
- Buttons trigger the expected behavior.
- Forms display validation errors.
- Loading states appear during pending operations.
- Success messages appear only after successful completion.
- Error messages appear when requests fail.
- Empty states appear when no data exists.
- Disabled controls cannot be activated.
- Keyboard navigation works for interactive components.
- Dialogs and menus behave correctly.
- Status information is not conveyed by color alone.

### Important components to test

| Component | Key tests |
|---|---|
| `TournamentCard` | Tournament details, status, permitted actions |
| `TeamCard` | Team information and navigation |
| `MatchCard` | Teams, schedule, match status |
| `Scoreboard` | Scores and match state |
| `StandingsTable` | Ranking order and statistics |
| `RegistrationForm` | Validation, submission, duplicate handling |
| `TournamentForm` | Required fields and date relationships |
| `ConfirmDialog` | Confirm and cancel behavior |
| `SearchFilters` | Filtering, reset, and empty results |

Use the actual component names adopted by the implementation.

## 8. Authentication Testing

Verify the authentication lifecycle.

### Sign-up

- Valid sign-up input is accepted.
- Invalid input is rejected.
- Required email verification is handled correctly.
- Failed sign-up displays a safe error.
- Users do not receive privileged roles by default.

### Sign-in

- Valid credentials establish the expected session.
- Invalid credentials are rejected.
- Protected pages cannot be accessed without authentication.
- Intended redirects work safely.
- Expired sessions are handled correctly.

### Password recovery

- Recovery requests use the supported Supabase flow.
- Recovery links use permitted redirect URLs.
- Invalid or expired recovery links are handled safely.
- Password updates follow the configured authentication policy.

### Sign-out

- The session is cleared appropriately.
- Protected data is no longer accessible through the signed-out session.
- The user is redirected to a permitted public page.

Do not include real passwords, production tokens, or other secrets in test fixtures.

## 9. Authorization and RLS Testing

Security tests are mandatory.

Test each role independently, including anonymous users and ordinary authenticated users.

### Role-based scenarios

| Scenario | Expected result |
|---|---|
| Guest reads a public tournament | Allowed |
| Guest modifies a tournament | Rejected |
| Player edits an unrelated team | Rejected |
| Captain manages an authorized team | Allowed |
| Captain modifies an unrelated team | Rejected |
| Organizer manages an assigned tournament | Allowed |
| Organizer modifies an unrelated tournament | Rejected |
| User changes their own role to administrator | Rejected |
| Organization administrator accesses an unrelated organization | Rejected |
| Platform administration is attempted without permission | Rejected |

The exact permitted actions must follow `05-AUTHENTICATION-AND-AUTHORIZATION.md` and `11-SECURITY-RULES.md`.

### RLS requirements

- Test policies using realistic database roles and authenticated contexts.
- Test both allowed and denied reads and writes.
- Test unauthorized updates to protected fields.
- Test `INSERT`, `UPDATE`, and `DELETE` policies where applicable.
- Test that private rows remain private even when a user calls the database API directly.
- Test storage policies if file uploads are implemented.

A passing frontend test does not prove that an RLS policy is secure.

## 10. Database Integration Testing

Test the actual database behavior for critical operations.

### Core database checks

- Primary and foreign key constraints work.
- Duplicate membership rules are enforced.
- Invalid references are rejected.
- Unique constraints prevent duplicate registrations.
- RLS prevents unauthorized access.
- Transactions preserve consistency.
- Failed operations do not leave partial data.
- Deletion behavior follows the intended retention rules.
- Audit records are protected from unauthorized modification.

Use a dedicated Supabase local environment or another isolated test project where practical.

Do not run destructive tests against production.

## 11. Tournament Registration Testing

Registration is a high-priority workflow because it combines authorization, eligibility, deadlines, and capacity constraints.

### Positive scenarios

- An eligible captain registers an authorized team.
- The registration is stored correctly.
- The registration status is displayed correctly.
- An authorized organizer can review the registration.
- An authorized organizer can approve or reject it according to the rules.

### Negative scenarios

- A guest attempts to register.
- A captain registers an unrelated team.
- A duplicate registration is submitted.
- Registration is attempted after the deadline.
- An ineligible team attempts to register.
- A full tournament receives another registration.
- An unauthorized user attempts to approve a registration.

### Concurrency scenarios

- Two teams attempt to claim the last available slot.
- The same registration request is submitted twice.
- An approval is submitted more than once.

Verify that database constraints and atomic backend operations preserve the registration rules under concurrent requests.

Do not rely exclusively on UI-level checks.

## 12. Match Scheduling and Results Testing

### Scheduling

Test that:

- Only authorized organizers can schedule matches.
- Selected teams are eligible.
- Required match fields are validated.
- Invalid dates and scheduling states are rejected.
- Unauthorized users cannot modify schedules.
- Completed matches cannot be modified through ordinary scheduling operations.

### Results

Test that:

- Valid scores are accepted.
- Invalid scores are rejected.
- Only authorized users can submit results.
- Duplicate submissions are handled safely.
- Published results are persisted correctly.
- Unauthorized result corrections are rejected.
- Valid corrections update the stored result and derived standings consistently.

### Standings

Test:

- Points calculation.
- Wins, losses, and draws where supported.
- Tie-breaking rules.
- Ranking order.
- Recalculation after a result changes.
- Recalculation after a result is corrected.
- Handling of incomplete or cancelled matches.

The expected calculations must match the actual tournament format and documented scoring rules. Do not hardcode one scoring system for every sport.

## 13. End-to-End Testing with Playwright

Use Playwright to test complete user workflows in a browser.

### Recommended test scenarios

**Scenario A — Public discovery**

1. Open the home page.
2. Open the tournament listing.
3. Search for a tournament.
4. Apply a filter.
5. Open a public tournament.
6. Verify the displayed details.

**Scenario B — Team creation**

1. Sign in as a test user.
2. Open the teams page.
3. Create a team.
4. Verify that the team appears in the list.
5. Open the team details page.
6. Verify the authorized captain membership.

**Scenario C — Tournament registration**

1. Sign in as an authorized captain.
2. Open an eligible tournament.
3. Select an authorized team.
4. Submit a registration.
5. Verify the resulting registration status.
6. Sign in as an authorized organizer.
7. Approve the registration.
8. Verify that the updated status appears for permitted users.

**Scenario D — Match results**

1. Sign in as an authorized organizer.
2. Open a scheduled match.
3. Submit a valid result.
4. Verify the saved result.
5. Open the standings page.
6. Verify that the standings reflect the result.

**Scenario E — Access control**

1. Sign in as a user without organizer permissions.
2. Attempt to open an organizer-only page.
3. Attempt a protected mutation through the actual backend interface.
4. Verify that both requests are rejected.
5. Confirm that no unauthorized database changes occurred.

Use dedicated test accounts and deterministic fixtures. Avoid depending on the production database or manually created production records.

## 14. Test Data and Fixtures

Use predictable data that can be created and removed safely.

Suggested fixtures:

- A verified test player.
- A test captain with an authorized team.
- A second captain with an unrelated team.
- A test tournament organizer.
- An organization administrator.
- A platform administrator, only in an isolated test environment.
- Public and private tournaments.
- Open, closed, and full tournaments.
- Scheduled and completed matches.
- Valid, invalid, and corrected results.

### Fixture rules

- Never use real user passwords or sensitive production data.
- Use dedicated test identities.
- Avoid shared mutable fixtures between unrelated tests.
- Make tests repeatable.
- Clean up created records safely.
- Do not disable RLS globally to simplify test setup.
- Keep test configuration separate from production configuration.

## 15. Mocking Strategy

Mock external dependencies when testing isolated application logic.

### Appropriate mocking

- Network failures.
- Third-party API failures.
- Email delivery.
- Time-dependent functions.
- Nonessential external integrations.

### Avoid excessive mocking

Do not mock away the database behavior that an integration test is intended to verify.

For example, a unit test may mock a registration service, but a registration concurrency test must verify the real database constraints and transaction behavior in an isolated environment.

Use a fixed clock or controlled dates for deadline-sensitive tests to avoid flaky results.

## 16. Error Handling Testing

Verify that failures are handled correctly at every layer.

Test:

- Invalid form input.
- Unauthenticated requests.
- Unauthorized actions.
- Missing resources.
- Duplicate records.
- Registration capacity conflicts.
- Expired sessions.
- Database failures.
- Network timeouts.
- Rate-limit responses.
- Invalid file uploads, if supported.
- Unexpected server exceptions.

### Expected behavior

- The operation fails safely.
- No unintended database changes occur.
- The user receives a useful error message.
- Sensitive implementation details remain server-side.
- The interface recovers from loading states.
- Retrying does not create duplicate operations.

## 17. Responsive and Accessibility Testing

Verify the application on desktop, tablet, and mobile viewport sizes.

Test:

- Navigation menus.
- Dashboard layouts.
- Tournament cards and listings.
- Tables and standings.
- Registration forms.
- Match schedules.
- Dialogs and confirmation flows.
- Empty and error states.

### Accessibility checks

- Keyboard navigation.
- Visible focus indicators.
- Form labels and error associations.
- Dialog focus handling.
- Accessible status announcements.
- Sufficient text contrast.
- Alternative text for meaningful images.
- Appropriate heading hierarchy.
- Controls with accessible names.

Automated accessibility tools can help identify issues, but they do not replace manual keyboard and usability checks.

## 18. Performance and Reliability Testing

Test performance as the application grows.

### Important checks

- Large tournament listings use pagination.
- Search queries do not fetch unlimited records.
- Database queries use appropriate indexes.
- Dashboards avoid unnecessary repeated requests.
- Pages do not load excessive unused data.
- Critical operations handle timeouts and transient failures.
- Caching does not expose private user data.
- Standings recalculation remains reliable as match counts grow.

For concurrency-sensitive operations, test multiple simultaneous requests rather than assuming ordinary single-user tests are sufficient.

## 19. Regression Testing

Whenever a bug is fixed, add a regression test when practical.

Examples:

- A user could previously edit an unrelated team.
- Two teams could register for the final slot.
- Match standings did not update after a result correction.
- A form cleared its fields after a server error.
- A private tournament appeared in public search results.

The regression test must fail under the old behavior and pass under the corrected behavior.

Re-run relevant tests after changing:

- Database schema.
- RLS policies.
- Authentication logic.
- Shared components.
- Validation schemas.
- Tournament lifecycle rules.
- Standings calculations.
- Environment configuration.

## 20. Continuous Integration

Run automated checks when code is pushed or a pull request is opened.

Recommended pipeline:

```text
Code Push / Pull Request
          |
          v
Install Locked Dependencies
          |
          v
Lint and Type Check
          |
          v
Run Unit Tests
          |
          v
Run Integration Tests
          |
          v
Build Application
          |
          v
Run Selected E2E Tests
          |
          v
Review Results
          |
          v
Deploy Only if Required Checks Pass
```

The exact pipeline may vary depending on test duration and infrastructure availability.

### CI requirements

- Use the committed lockfile.
- Keep secrets out of build logs.
- Use dedicated test environment variables.
- Do not run destructive tests against production.
- Fail the pipeline when mandatory checks fail.
- Do not ignore failing security tests.
- Keep deployment credentials restricted.

## 21. Suggested Package Scripts

Adapt the following scripts to the project's actual dependencies and configuration.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Check the installed Next.js and ESLint versions before adopting these commands. Some Next.js versions no longer provide the same lint command conventions, and the project may use a different ESLint configuration.

Add integration test scripts when the database test environment is configured.

Do not add scripts that refer to tools or configuration files that do not exist.

## 22. Testing Priorities

Use the following order when time is limited.

### Priority 1 — Critical

- Authentication.
- Resource-level authorization.
- RLS policies.
- Registration capacity and duplicate prevention.
- Match result integrity.
- Standings consistency.
- Secret management.

### Priority 2 — Important

- Team management.
- Tournament creation and publication.
- Match scheduling.
- Form validation.
- Error handling.
- Notifications and audit logging.

### Priority 3 — Quality improvements

- Visual regression checks.
- Advanced filtering.
- Animation behavior.
- Nonessential UI details.
- Performance benchmarks for lower-risk pages.

Critical security and data-integrity tests must not be skipped merely because the interface appears to work.

## 23. Definition of Done

A feature may be considered complete when:

- [ ] The feature matches its documented requirements.
- [ ] Input validation is implemented.
- [ ] Authentication and authorization are enforced where required.
- [ ] Database integrity rules are preserved.
- [ ] Loading, success, empty, and error states are implemented.
- [ ] Relevant unit or component tests pass.
- [ ] Relevant integration tests pass.
- [ ] Security-sensitive negative cases are tested.
- [ ] The application passes type checking and linting.
- [ ] The production build succeeds.
- [ ] Responsive and accessibility behavior has been reviewed.
- [ ] Relevant documentation has been updated.

For critical workflows, successful end-to-end testing is also required before production release.

## 24. AI Coding Agent Instructions

Any AI coding agent working on Sport Organizer must:

1. Identify the relevant testing level before implementing a feature.
2. Add tests for important business logic.
3. Test both successful and rejected operations.
4. Never remove a security test simply to make the pipeline pass.
5. Never weaken RLS or database constraints to simplify testing.
6. Use dedicated test data and environments.
7. Run the relevant checks after changing code.
8. Fix the root cause of failures rather than hiding errors.
9. Add regression tests for significant bug fixes.
10. Report which checks were actually executed and whether they passed.
11. Never claim tests passed if they were not run.
12. Keep test fixtures consistent with the documented database schema.

## 25. Related Documentation

- `02-PRD.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `06-UI-UX-GUIDELINES.md`
- `09-FEATURES-AND-MODULES.md`
- `10-API-AND-BACKEND.md`
- `11-SECURITY-RULES.md`
- `12-USER-FLOWS.md`
- `13-VALIDATION-AND-ERROR-HANDLING.md`
- `15-DEPLOYMENT-GUIDE.md`
- `17-CODING-STANDARDS.md`
- `18-IMPLEMENTATION-ROADMAP.md`
- `19-AI-CODING-INSTRUCTIONS.md`

---

**End of Testing Strategy**