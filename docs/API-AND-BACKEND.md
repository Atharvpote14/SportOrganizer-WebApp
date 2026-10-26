# API and Backend Architecture — Sport Organizer

## 1. Purpose

This document defines the backend architecture, API conventions, database access patterns, request validation, and business logic for the Sport Organizer Web App.

The backend must provide secure, reliable operations for:

- Authentication and profiles.
- Teams and memberships.
- Tournament discovery and management.
- Tournament registrations.
- Match scheduling.
- Match results and standings.
- Announcements and notifications.
- Organization and platform administration.

The application uses Next.js App Router with Supabase Auth and PostgreSQL.

## 2. Backend Architecture

### 2.1 Technology

- **Frontend and application server:** Next.js App Router.
- **Language:** TypeScript.
- **Authentication:** Supabase Auth.
- **Database:** Supabase PostgreSQL.
- **Authorization:** PostgreSQL Row Level Security (RLS) and server-side permission checks.
- **Validation:** Zod.
- **Forms:** React Hook Form where appropriate.
- **Hosting:** Vercel.
- **File storage:** Supabase Storage, when required.

Use the installed package versions and their compatible APIs. Do not assume an outdated Next.js or Supabase implementation.

### 2.2 Request flow

<CodeBlock language="mermaid">flowchart TD
    A[User Interface] --> B[Next.js Server Component or Client Component]
    B --> C[Server Action or Route Handler]
    C --> D[Validate Input]
    D --> E[Verify Authentication]
    E --> F[Authorize Operation]
    F --> G[Supabase Client]
    G --> H[PostgreSQL and RLS]
    H --> I[Database Result]
    I --> J[Return Safe Response]
    J --> K[Update UI and Revalidate Data]</CodeBlock>

For public read-only data, Server Components may query Supabase directly through the server client when a separate API endpoint is unnecessary.

For mutations, use Server Actions or Route Handlers according to the use case.

**Important:** Every mutation must validate input, verify the user where required, enforce permissions, and rely on database constraints and RLS as additional protection.

## 3. Supabase Client Setup

Create separate Supabase client utilities for browser and server environments.

Recommended structure:

```text
src/
└── lib/
    └── supabase/
        ├── client.ts
        ├── server.ts
        └── admin.ts       # Only if privileged operations are necessary
```

### 3.1 Browser client

Use `createBrowserClient` from `@supabase/ssr` for client-side operations that genuinely require browser access.

The browser client may use:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The publishable key is intended for client use. It does not grant permission to bypass database security policies.

### 3.2 Server client

Use `createServerClient` from `@supabase/ssr` with the framework's cookie handling for Server Components, Server Actions, and Route Handlers.

The server client should operate with the current user's authenticated context so database operations remain subject to the applicable RLS policies.

Follow the official Supabase SSR guidance: https://supabase.com/docs/guides/auth/server-side/creating-a-client

### 3.3 Admin client

An administrative client using a privileged Supabase secret may be introduced only when a specific trusted backend operation requires it.

Rules:

- Never expose a secret or service-role key to browser code.
- Never prefix privileged environment variables with `NEXT_PUBLIC_`.
- Keep admin client imports isolated from client components.
- Authenticate and authorize the caller before privileged operations.
- Apply explicit resource-level checks even when the admin client bypasses RLS.
- Prefer normal user-scoped database access whenever it is sufficient.

Do not create an admin client simply to avoid configuring RLS correctly.

## 4. Environment Variables

Use `.env.local` for local development and the deployment provider's secure environment configuration for production.

Expected variables:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Optional privileged configuration, only if required:

```dotenv
SUPABASE_SECRET_KEY=
```

Use the appropriate secret-key variable supported by the actual Supabase project. Never commit real credentials.

See `16-ENVIRONMENT-VARIABLES.md` for the complete configuration requirements.

## 5. Choosing Between Server Actions and Route Handlers

Use the simplest suitable backend interface.

### Server Actions

Use Server Actions for application mutations initiated by the Sport Organizer interface, such as:

- Creating a team.
- Updating a profile.
- Creating a tournament.
- Submitting a registration.
- Approving a registration.
- Scheduling a match.
- Publishing a result.

Server Actions are server-side functions, not trusted private functions that can only be called through visible buttons. They must validate and authorize every invocation.

### Route Handlers

Use Route Handlers when an HTTP endpoint is useful or required, such as:

- External integrations.
- Webhooks.
- A documented JSON API.
- File or download workflows that need explicit HTTP handling.
- Integrations with systems outside the Next.js UI.

Use appropriate HTTP methods and response codes.

### Direct Supabase queries

Direct queries from Server Components are suitable for straightforward reads when an additional application endpoint would add unnecessary complexity.

Client-side queries may be used for appropriate interactive features, provided RLS and other database policies enforce the intended access.

Do not create a Route Handler for every database table merely for architectural symmetry.

## 6. Recommended Backend Structure

A possible feature-oriented structure is:

```text
src/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   └── ...
├── features/
│   ├── teams/
│   │   ├── actions.ts
│   │   ├── schemas.ts
│   │   ├── queries.ts
│   │   └── services.ts
│   ├── tournaments/
│   ├── registrations/
│   ├── matches/
│   ├── results/
│   └── standings/
└── lib/
    ├── supabase/
    ├── auth/
    ├── validation/
    ├── errors/
    └── utils.ts
```

This is a recommended pattern, not a requirement to create empty files for every feature.

### Responsibilities

- `actions.ts`: Server Actions for feature mutations.
- `schemas.ts`: Zod schemas and input validation.
- `queries.ts`: Read operations.
- `services.ts`: Reusable business operations where separation is useful.
- `lib/auth/`: Authentication and permission helpers.
- `lib/errors/`: Consistent application error types and response mapping.

Keep the architecture practical. Do not introduce unnecessary abstraction layers for simple features.

## 7. Authentication and Authorization

Authentication identifies the current user. Authorization determines what the user may do.

### Required process

For protected operations:

1. Obtain the request's authenticated context.
2. Verify the authentication state using the established Supabase SSR pattern.
3. Retrieve the user's application profile or relevant membership.
4. Check the permission for the requested resource and operation.
5. Validate the input.
6. Execute the database operation using the appropriate client.
7. Return a safe result.

The precise ordering may vary for public validation or other cases, but authorization must always occur before protected changes.

Use verified claims or the appropriate Supabase Auth method according to the operation. Do not rely on unverified session data or user-supplied role values.

### Resource-level permissions

Examples:

- A team captain may update an authorized team, not every team.
- An organizer may manage assigned tournaments, not arbitrary tournaments.
- An organization administrator may manage resources within their organization.
- A platform administrator may perform platform-level operations only through explicitly authorized paths.

See `05-AUTHENTICATION-AND-AUTHORIZATION.md` and `11-SECURITY-RULES.md`.

## 8. Request Validation

Every mutation must validate its input before performing a database change.

Use Zod schemas to validate:

- Required fields.
- String length.
- UUID format.
- Numeric values and ranges.
- Dates and timestamps.
- Enum values.
- Optional and nullable fields.
- Related resource identifiers.
- Cross-field rules.

Example:

```ts
import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().trim().min(3).max(120),
  sportId: z.string().uuid(),
  startDate: z.string().datetime({ offset: true }),
  location: z.string().trim().max(200).nullable().optional(),
});

export type CreateTournamentInput = z.infer<
  typeof createTournamentSchema
>;
```

Adapt the schema to the actual database fields and product requirements. For example, date-only tournament fields may require a different representation from timestamps.

### Validation rules

- Never trust TypeScript types as runtime validation.
- Never trust form values simply because a browser validated them.
- Reject unexpected or invalid enum values.
- Validate referenced records on the server.
- Enforce business rules through trusted backend logic and database constraints.
- Return safe field-level validation errors where useful.
- Avoid silently accepting malformed input.

## 9. Response Conventions

Server Actions and Route Handlers have different response conventions. Use a consistent result shape for application operations where appropriate.

Suggested TypeScript result type:

```ts
export type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };
```

Use this type where returning a structured result is appropriate. It is not necessary to wrap every Server Component render or every Route Handler in this exact shape.

### Success

Return only the data the caller needs. Do not expose internal database metadata unnecessarily.

### Failure

Provide a safe, actionable message and a stable error code where appropriate.

Examples:

- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

These are application-level conventions, not automatic Supabase error codes.

For Route Handlers, map errors to appropriate HTTP status codes. For Server Actions, return structured errors or use the established Next.js error-handling pattern.

Do not send raw SQL errors, stack traces, credentials, or internal service details to the browser.

## 10. Database Access Rules

Use the schema defined in `04-DATABASE-SCHEMA.md`.

Core tables include:

- `profiles`
- `organizations`
- `organization_members`
- `sports`
- `teams`
- `team_members`
- `tournaments`
- `tournament_registrations`
- `matches`
- `match_results`
- `tournament_standings`
- `notifications`
- `tournament_announcements`
- `audit_logs`

### Database principles

- Use migrations for schema changes.
- Enforce primary keys and foreign keys.
- Use database constraints for invariants that must always hold.
- Add indexes for frequently queried fields.
- Apply RLS to tables exposed through the Supabase Data API.
- Use transactions for operations requiring atomicity.
- Avoid fetching unnecessary columns or entire tables.
- Paginate large collections.
- Use generated Supabase database types when practical.
- Keep database changes consistent with the documented schema.

Never assume a query is secure merely because it runs on the server.

## 11. Core Feature Operations

### 11.1 Profile management

Operations:

- Read the current user's profile.
- Update permitted profile fields.
- Retrieve a public profile where allowed.
- Upload or update an avatar if supported.

Rules:

- The authenticated identity determines which profile may be updated.
- Sensitive or privileged fields must not be freely writable.
- Validate avatar type and size if uploads are enabled.
- Enforce private profile visibility where required.

### 11.2 Team management

Operations:

- Create team.
- Read team details.
- Update team details.
- List team members.
- Add or remove team members when authorized.

Rules:

- Assign captaincy and ownership through trusted logic.
- Validate the selected sport.
- Enforce membership constraints.
- Prevent unauthorized membership changes.
- Use transactions or database constraints where multiple changes must remain consistent.

### 11.3 Tournament management

Operations:

- List public tournaments.
- Read tournament details.
- Create tournament.
- Update tournament.
- Publish or unpublish tournament.
- Cancel tournament when authorized.

Rules:

- Check the organizer's authority.
- Validate dates, capacity, sport, and other required fields.
- Validate permitted lifecycle transitions.
- Enforce tournament visibility.
- Preserve historical records according to the documented retention rules.

### 11.4 Tournament registrations

Operations:

- Submit registration.
- Read registration status.
- List registrations visible to an authorized organizer.
- Approve registration.
- Reject registration.
- Withdraw registration where permitted.

Rules:

- Verify team management permission.
- Confirm the tournament is eligible for registration.
- Check deadlines and capacity on the server.
- Prevent duplicate active registrations.
- Enforce concurrent capacity checks safely.
- Authorize every approval and rejection.
- Preserve the registration history.

Registration uniqueness and capacity enforcement must not depend exclusively on browser checks.

### 11.5 Match scheduling

Operations:

- Create match.
- List tournament matches.
- Read match details.
- Update schedule.
- Postpone or cancel a match when permitted.

Rules:

- Validate tournament and team IDs.
- Verify team eligibility.
- Check applicable scheduling constraints.
- Validate timestamps and timezone handling.
- Restrict schedule changes to authorized users.
- Prevent invalid changes to completed matches.

### 11.6 Match results

Operations:

- Enter a result.
- Validate and save a result.
- Publish a result.
- Correct a published result through an authorized workflow.
- Retrieve published results.

Rules:

- Validate scores according to the supported sport and tournament rules.
- Verify match ownership and organizer permissions.
- Prevent duplicate or conflicting result submissions.
- Keep match status and result state consistent.
- Record important changes in the audit log.
- Recalculate standings reliably after an accepted result.

### 11.7 Standings

Operations:

- Read standings.
- Recalculate standings when results change.
- Refresh cached or derived standings.

Rules:

- Apply the documented tournament scoring and tie-breaking rules.
- Do not accept browser-submitted standings as authoritative.
- Keep standings consistent with accepted results.
- Make recalculation safe to repeat.
- Use transactions or an appropriate reliable processing strategy where consistency requires it.

### 11.8 Notifications and announcements

Operations:

- Create announcements.
- Publish announcements.
- List visible announcements.
- Generate notifications for relevant events.
- Read a user's notifications.
- Mark a notification as read.

Rules:

- Verify the actor's permissions.
- Associate notifications with the correct recipient.
- Prevent one user from accessing another user's private notifications.
- Do not generate success notifications for failed operations.
- Avoid exposing private data in notification messages.

## 12. Transactional Operations

Some workflows involve multiple related database changes. They must not be implemented as unrelated writes that can leave partial state behind.

Examples:

- Registration approval and capacity reservation.
- Match result publication and standings updates.
- Team creation and initial captain membership.
- Tournament cancellation and related lifecycle updates.

Use PostgreSQL transactions, database functions, or another appropriate atomic mechanism for operations that require all-or-nothing behavior.

For critical workflows, prefer a narrowly scoped database function called through an authorized server-side path when that is the most reliable way to enforce atomicity.

Any security-definer function must use a carefully controlled search path, explicit permission checks, and minimal privileges.

Do not assume multiple Supabase client queries automatically share one transaction.

## 13. Concurrency and Idempotency

The backend must handle repeated requests and simultaneous actions safely.

### Examples

- Two captains attempt to register the same team.
- Multiple teams attempt to claim the final available tournament slot.
- An organizer clicks Approve more than once.
- Two requests attempt to publish a result for the same match.

### Requirements

- Use unique constraints to prevent duplicate records.
- Use transactions and appropriate locking or atomic database operations for shared capacity.
- Validate state transitions inside the trusted operation.
- Return a clear conflict response when the requested transition is no longer valid.
- Disable repeated submissions in the UI, but do not rely on that alone.
- Use idempotency keys for operations where retries can otherwise create duplicate side effects and the added complexity is justified.

Do not implement capacity checks as a simple read followed by an independent write when concurrent requests could exceed the limit.

## 14. Route Handler Conventions

When creating HTTP endpoints, use the Next.js App Router Route Handler conventions.

Example endpoint structure:

```text
src/app/api/
├── health/
│   └── route.ts
└── integrations/
    └── example/
        └── route.ts
```

Only add endpoints that have a defined purpose.

### HTTP methods

Use methods consistently:

- `GET`: Retrieve data.
- `POST`: Create a resource or perform an explicit operation.
- `PATCH`: Update part of a resource.
- `PUT`: Replace a resource when full replacement semantics are intended.
- `DELETE`: Delete a resource when deletion is supported.

Choose the method based on the operation's semantics.

### HTTP status codes

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created |
| `204` | Successful request with no response body |
| `400` | Invalid request |
| `401` | Authentication required |
| `403` | Authenticated but not permitted |
| `404` | Resource not found or not visible |
| `409` | State conflict |
| `422` | Semantically invalid input, if used consistently |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |

Do not reveal whether a private resource exists if doing so would leak sensitive information. A consistent `404` response may be appropriate for inaccessible resources.

## 15. Pagination, Filtering, and Sorting

Large lists must not load unlimited records.

Use server-side pagination for:

- Tournaments.
- Teams.
- Registrations.
- Matches.
- Notifications.
- Administrative lists.

### Query parameters

Examples:

- `page`
- `pageSize`
- `search`
- `status`
- `sportId`
- `sortBy`
- `sortOrder`

Validate all query parameters.

### Rules

- Apply reasonable page-size limits.
- Allowlist sortable columns.
- Use deterministic ordering.
- Avoid arbitrary SQL expressions from user input.
- Return pagination metadata when the API requires it.
- Apply access restrictions before exposing results.
- Prefer cursor pagination when appropriate for large or frequently changing datasets.

Filtering and sorting must affect the actual database query rather than only the rendered interface.

## 16. Caching and Revalidation

Use Next.js caching and revalidation deliberately.

### Public data

Public tournament details, public sport listings, and published public results may be candidates for caching when the freshness requirements allow it.

### Private data

User profiles, private registrations, management dashboards, and private organization data must not leak between users through shared caches.

### Mutation behavior

After a successful mutation:

- Revalidate affected paths or cache tags when needed.
- Update the relevant client UI.
- Avoid revalidating unrelated pages unnecessarily.
- Do not display stale data as if a write has succeeded when it has not.

Inspect the caching behavior of the installed Next.js version. Do not assume every Server Component query is cached or uncached by default.

## 17. File Uploads

If the application supports team logos, avatars, or tournament artwork, use Supabase Storage.

Requirements:

- Use an appropriate storage bucket.
- Validate file size and content type.
- Use generated object names rather than trusting arbitrary filenames.
- Enforce upload and access policies.
- Restrict update and deletion permissions.
- Avoid trusting the file extension alone.
- Use signed URLs for private files when appropriate.
- Do not store large binary files directly in PostgreSQL rows.

File uploads are optional until the corresponding feature is implemented.

## 18. External Integrations and Webhooks

If external integrations are added:

- Validate webhook signatures.
- Authenticate incoming requests.
- Reject malformed payloads.
- Prevent replay or duplicate processing where appropriate.
- Keep integration secrets server-side.
- Apply timeouts and safe retry strategies.
- Log failures without exposing credentials.
- Avoid trusting a third-party payload as authorization for unrelated operations.

External integrations must not be implemented as unauthenticated public mutation endpoints.

## 19. Logging and Monitoring

Record enough information to diagnose production failures.

Potential information:

- Request or correlation ID.
- Operation name.
- Result status.
- Duration.
- Sanitized error details.
- Relevant resource identifier when safe.
- Actor identifier for authorized audit events.

Never log:

- Passwords.
- Access tokens.
- Refresh tokens.
- Secret keys.
- Full sensitive authentication payloads.
- Unnecessary private user information.

Keep operational logs distinct from audit records. Audit records document significant business actions; operational logs help diagnose technical behavior.

## 20. Error Handling

Use consistent error mapping across backend operations.

### Validation errors

Return field-level errors where useful.

### Authentication errors

Ask the user to sign in when the operation requires authentication.

### Authorization errors

Display a clear permission message without exposing private resource details.

### Conflict errors

Explain that the requested action is no longer available or conflicts with current data.

### Database and network errors

Provide a safe message and allow retry when appropriate.

### Unexpected errors

Log sufficient sanitized details on the server and return a generic error to the user.

Never convert every failure into a success response or silently ignore database errors.

See `13-VALIDATION-AND-ERROR-HANDLING.md`.

## 21. Testing Strategy

Test the backend at multiple levels.

### Unit tests

Test:

- Validation schemas.
- Status transition rules.
- Score validation.
- Permission helper behavior.
- Error mapping.
- Standings calculations.

### Integration tests

Test:

- Supabase queries.
- RLS enforcement.
- Registration capacity constraints.
- Duplicate registration prevention.
- Match result publication.
- Standings consistency.
- Notification ownership.
- Organization and team access boundaries.

### End-to-end tests

Verify complete workflows:

1. A user signs up and completes the required verification.
2. An authorized captain creates a team.
3. An organizer creates and publishes a tournament.
4. The captain submits a registration.
5. The organizer approves the registration.
6. The organizer schedules a match.
7. The organizer publishes the result.
8. The standings reflect the accepted result.

Include negative tests for unauthorized operations, invalid input, duplicate submissions, and concurrent capacity changes.

Use a dedicated test environment. Never run destructive integration tests against production data.

## 22. Implementation Order

Implement backend functionality in this order:

1. Supabase client utilities and environment configuration.
2. Authentication and profile access.
3. Shared validation and error handling.
4. RLS policies and permission checks.
5. Sports and team queries and mutations.
6. Tournament creation and discovery.
7. Registration workflows with concurrency protection.
8. Match scheduling.
9. Result publication and standings consistency.
10. Announcements and notifications.
11. Administration and audit logging.
12. Caching, monitoring, and performance improvements.

Complete and test each workflow before moving to the next.

## 23. Backend Acceptance Checklist

- [ ] Browser and server Supabase clients are configured correctly.
- [ ] No privileged secret is exposed to client code.
- [ ] Authentication is verified for protected operations.
- [ ] Resource-level authorization is enforced.
- [ ] RLS policies protect exposed tables.
- [ ] Mutations use runtime validation.
- [ ] Database constraints protect important invariants.
- [ ] Critical multi-step operations are atomic where required.
- [ ] Duplicate and concurrent requests are handled safely.
- [ ] Responses do not expose internal implementation details.
- [ ] Pagination and filtering operate on real data.
- [ ] Caching does not leak private data.
- [ ] Errors are logged safely.
- [ ] Critical backend workflows have automated tests.
- [ ] Production environment variables are configured securely.

## 24. Related Documentation

- `02-PRD.md`
- `03-TECH-STACK.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `09-FEATURES-AND-MODULES.md`
- `11-SECURITY-RULES.md`
- `12-USER-FLOWS.md`
- `13-VALIDATION-AND-ERROR-HANDLING.md`
- `14-TESTING-STRATEGY.md`
- `15-DEPLOYMENT-GUIDE.md`
- `16-ENVIRONMENT-VARIABLES.md`

---

**End of API and Backend Architecture**