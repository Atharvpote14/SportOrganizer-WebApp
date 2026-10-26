# Security Rules — Sport Organizer

## 1. Purpose

This document defines mandatory security requirements for the Sport Organizer Web App.

The goal is to protect:

- User accounts and personal information.
- Teams, memberships, and organization data.
- Tournament registrations and participant records.
- Match schedules, results, and standings.
- Organizer and administrator privileges.
- Database records, uploaded files, and application secrets.

**Security is a backend responsibility. Hiding a button or restricting a page in the frontend is never sufficient authorization.**

These rules apply to all developers, AI coding agents, Server Components, Client Components, Server Actions, Route Handlers, database functions, and deployment configurations.

## 2. Security Principles

Follow these principles throughout development:

1. **Least privilege:** Grant only the permissions required for a task.
2. **Defense in depth:** Combine authentication, authorization, RLS, validation, and database constraints.
3. **Secure by default:** New resources must not become publicly writable accidentally.
4. **Server-side trust:** Treat all browser-submitted data as untrusted.
5. **Data minimization:** Collect and expose only necessary information.
6. **Fail securely:** If authorization cannot be verified, reject the operation.
7. **Auditable changes:** Record important administrative and competition-related changes.
8. **Safe errors:** Never expose credentials, stack traces, or internal database details to users.

## 3. Authentication Security

Use Supabase Auth for identity management.

### Mandatory rules

- Use the established Supabase SSR authentication pattern.
- Verify the authenticated user on every protected server operation.
- Use the appropriate verified claims or authenticated user lookup for the operation.
- Never trust a user ID supplied by the browser as proof of identity.
- Never trust a role, organization ID, team ID, or ownership claim merely because it appears in a request.
- Require email verification where configured by the product's authentication policy.
- Implement password recovery through Supabase Auth's supported flow.
- Do not build a custom password storage system.
- Do not log passwords, access tokens, refresh tokens, or authentication secrets.
- Clear or invalidate application session state appropriately when a user signs out.

### Session handling

- Follow Supabase SSR cookie-handling guidance.
- Do not place session tokens in URLs.
- Do not store privileged credentials in browser storage.
- Use HTTPS in production.
- Handle expired sessions gracefully.
- Recheck authorization when a user attempts a protected action, even if the page previously loaded successfully.

Authentication middleware or a Next.js proxy may improve navigation and early request handling, but it does not replace authorization checks inside protected operations.

## 4. Authorization and Role Security

Sport Organizer supports different levels of access:

- Guest
- Player
- Team Captain
- Tournament Organizer
- Organization Administrator
- Platform Administrator

A user's role must not automatically grant access to every resource.

### Resource-level authorization

Examples:

- A captain can manage only teams they are authorized to manage.
- An organizer can manage only tournaments within their permitted scope.
- An organization administrator can manage only authorized organization resources.
- A player cannot change their own role to captain or administrator.
- A platform administrator must be explicitly authorized for platform-level operations.

### Mandatory checks

Before a protected operation:

1. Identify the authenticated user.
2. Identify the requested resource.
3. Determine the user's actual permission for that resource.
4. Validate the requested state change.
5. Execute the operation only if permission is granted.

Never authorize an operation using only a frontend role, URL parameter, hidden form field, or request body value.

## 5. Supabase Row Level Security (RLS)

Enable and configure RLS for every application table exposed through the Supabase Data API.

### Mandatory requirements

- Enable RLS on tables that are accessible through the Data API.
- Create explicit policies for permitted `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations.
- Use the authenticated identity, such as `auth.uid()`, when enforcing user-specific access.
- Verify team membership, organization membership, and tournament ownership where required.
- Apply restrictions to both existing rows and proposed row values.
- Use appropriate `USING` and `WITH CHECK` expressions for PostgreSQL policies.
- Test access as anonymous users, ordinary authenticated users, and privileged users.
- Keep storage bucket policies consistent with application permissions.

Do not create broad policies such as “all authenticated users can update every row.”

### Example policy

A profile table may permit a user to read and update their own profile, subject to the application's public-profile rules.

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));
```

This is an illustrative policy. Adapt it to the actual table structure and profile-field permissions. It does not, by itself, prevent users from changing sensitive columns if the table allows those columns to be updated.

For sensitive fields, use restricted column privileges, narrowly scoped server operations, or another explicit protection mechanism.

Never assume that enabling RLS alone makes a table secure. Verify the complete set of policies and database grants.

## 6. Environment Variables and Secret Management

Use environment variables for configuration.

### Public configuration

The following variables may be exposed to the browser when needed:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The Supabase publishable key is intended for public application use. Security must still be enforced through authentication, RLS, and database permissions.

### Private configuration

Privileged keys and third-party secrets must remain server-side.

```dotenv
SUPABASE_SECRET_KEY=
```

Include this variable only if a privileged backend operation genuinely requires it and the selected Supabase project supports that key type.

### Mandatory rules

- Never commit `.env.local` or real production secrets.
- Never expose privileged credentials through `NEXT_PUBLIC_` variables.
- Never hardcode secrets into source files.
- Never print secrets in logs or error messages.
- Use secure environment-variable storage in deployment.
- Rotate exposed credentials immediately.
- Use `.env.example` with placeholder values only.
- Restrict access to production credentials.

**Critical:** A Supabase secret or service-role credential can bypass RLS. Never use it as a normal replacement for the authenticated server client.

## 7. Database Security

Use PostgreSQL constraints and permissions as additional protection.

### Mandatory requirements

- Use primary keys and foreign keys.
- Add appropriate uniqueness constraints.
- Validate required fields and value ranges.
- Use transactions for critical multi-step operations.
- Restrict database permissions to the minimum required.
- Use migrations to track schema and policy changes.
- Avoid exposing internal or sensitive columns in public queries.
- Prevent unauthorized updates to ownership, role, status, and audit fields.
- Review database functions and triggers for privilege escalation risks.

### Protected fields

The following fields must never be freely editable by ordinary users:

- Application roles.
- Organization administrator privileges.
- Platform administrator privileges.
- Ownership and authorization relationships.
- Registration approval status.
- Match result publication status.
- Audit metadata.
- Other fields that control access or competition integrity.

Allow changes only through authorized operations with explicit validation.

### SQL injection

- Use parameterized database queries and Supabase's supported query builders.
- Never concatenate untrusted input into raw SQL.
- Allowlist dynamic sort columns and other SQL identifiers.
- Validate values passed into database functions.
- Review raw SQL and database functions before deployment.

## 8. Tournament and Competition Integrity

Tournament data affects participants and competition outcomes. Protect it from unauthorized changes.

### Registration security

- Verify that the user can manage the team being registered.
- Confirm the tournament accepts registrations.
- Validate registration deadlines and eligibility.
- Enforce duplicate prevention at the database level.
- Enforce capacity limits atomically under concurrent requests.
- Restrict approval and rejection to authorized organizers.
- Validate withdrawal and cancellation rules.
- Prevent users from approving their own registration unless explicitly allowed by product policy.

### Match security

- Restrict match creation and scheduling to authorized users.
- Verify that participating teams are eligible for the tournament.
- Validate score values and match state transitions.
- Prevent unauthorized edits to completed matches.
- Require explicit permission for result corrections.
- Keep the published result and derived standings consistent.
- Record important result changes in audit history.

Never accept standings or other derived competition data from the client as authoritative.

## 9. Server Actions and API Security

Every Server Action and Route Handler must enforce its own security requirements.

### Server Actions

- Treat each action as a potentially direct external invocation.
- Validate all input at runtime.
- Verify authentication when required.
- Check resource-level permissions.
- Reject unauthorized state changes.
- Return safe errors.
- Do not trust hidden form fields or client-side validation.

### Route Handlers

- Use appropriate HTTP methods.
- Authenticate protected endpoints.
- Authorize each requested operation.
- Validate request bodies, query parameters, and path identifiers.
- Apply rate limiting where appropriate.
- Return appropriate HTTP status codes.
- Restrict cross-origin access when relevant.
- Do not expose internal server errors.

### Webhooks

If external webhooks are introduced:

- Verify the provider's signature.
- Reject invalid or malformed payloads.
- Prevent duplicate processing where necessary.
- Keep webhook secrets private.
- Do not trust a request merely because it targets a secret-looking URL.

## 10. Input Validation and Output Safety

Validate all untrusted inputs, including:

- Names and descriptions.
- Search queries.
- IDs and URL parameters.
- Scores and statistics.
- Dates and time zones.
- Uploaded file metadata.
- User-generated announcements.
- Profile information.

Use Zod or an equivalent runtime validator.

### Output safety

- Render user-generated text using React's normal escaped rendering.
- Avoid inserting untrusted HTML into the DOM.
- Do not use `dangerouslySetInnerHTML` for arbitrary user content.
- If rich text is required, sanitize it using an appropriate allowlist-based sanitizer.
- Encode data appropriately when used in URLs or other output contexts.
- Do not display sensitive database fields just because they were returned by a query.

Validation must be appropriate to the field. Do not remove legitimate names or punctuation through overly restrictive sanitization.

## 11. File Upload Security

If avatars, team logos, or tournament artwork are supported, use Supabase Storage with appropriate policies.

### Mandatory rules

- Set a maximum file size.
- Allow only the required file types.
- Validate actual file content where feasible, not only the filename or MIME header.
- Generate safe object names.
- Restrict who can upload, replace, and delete files.
- Prevent one user from overwriting another user's protected files.
- Use private buckets and signed URLs for private content when appropriate.
- Avoid exposing private file URLs unnecessarily.
- Do not allow executable uploads to be served as trusted application code.

Public artwork may use a public bucket when intended, but public visibility must not imply public write access.

## 12. Cross-Site Request Forgery (CSRF) and Cross-Origin Security

Use Next.js and Supabase's supported request-handling mechanisms correctly.

- Preserve framework protections for Server Actions.
- Do not bypass origin checks casually.
- Configure allowed origins narrowly when custom cross-origin requests are necessary.
- Do not use wildcard CORS permissions for sensitive authenticated endpoints without a justified design.
- Avoid state-changing operations through `GET` requests.
- Do not assume CORS alone prevents unauthorized requests.
- If custom cookie-authenticated mutation endpoints are introduced, evaluate the required CSRF protections for that design.

## 13. Rate Limiting and Abuse Prevention

Apply rate limits to operations that could be abused.

Examples:

- Sign-up and authentication-related custom endpoints.
- Password recovery requests.
- Tournament registration submissions.
- Repeated result submissions.
- Search endpoints with expensive queries.
- Public contact or reporting forms.
- Administrative mutation endpoints.

### Requirements

- Use a rate-limiting mechanism suitable for the deployment environment.
- Do not rely exclusively on in-memory counters in serverless deployments.
- Apply additional abuse prevention where an operation creates significant cost or risk.
- Return an appropriate response when limits are exceeded.
- Avoid exposing detailed account-existence information through authentication-related errors.
- Monitor repeated failures and suspicious activity.

Supabase Auth provides some authentication protections, but application-specific endpoints may require additional controls.

## 14. Privacy and Data Protection

Collect only information required for the application's functionality.

### Requirements

- Limit public profile fields to intended public information.
- Restrict private registration and membership information.
- Prevent users from reading another user's private notifications.
- Avoid exposing private email addresses in public team or tournament responses.
- Keep administrative data restricted.
- Use HTTPS in production.
- Define appropriate data retention and deletion behavior.
- Avoid collecting sensitive information without a clear requirement.
- Ensure logs and error reports do not unnecessarily contain personal data.

Before deleting an account, determine how to handle teams, organization memberships, registrations, historical results, and audit records without compromising data integrity.

## 15. Audit Logging

Record significant actions that affect security or competition integrity.

Examples:

- Changes to application roles.
- Organization membership changes.
- Tournament creation, cancellation, or publication.
- Registration approvals and rejections.
- Match result publication or correction.
- Privileged administrative actions.

Audit records should capture, where appropriate:

- Actor ID.
- Action type.
- Resource type and ID.
- Timestamp.
- Relevant change summary.
- Request or correlation ID when available.

### Audit requirements

- Prevent ordinary users from modifying or deleting audit records.
- Write audit events through trusted backend logic or database mechanisms.
- Avoid storing passwords, tokens, or unnecessary personal data.
- Do not treat browser-generated audit events as authoritative.
- Ensure a failed business operation does not produce a misleading success audit record.

See `04-DATABASE-SCHEMA.md` for the audit table design.

## 16. Security Headers and Transport

Use HTTPS for production traffic.

Configure appropriate security headers through Next.js or the deployment platform where applicable.

Evaluate:

- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Content-Security-Policy`
- `frame-ancestors` through CSP or an appropriate framing restriction

A Content Security Policy must be tested against the application's actual scripts, styles, images, fonts, and external integrations. Do not add a restrictive policy blindly if it breaks required functionality.

Avoid embedding secrets in URLs, client bundles, or public source maps.

## 17. Error Handling and Logging

- Return generic messages for unexpected server failures.
- Log detailed diagnostic information only on the server.
- Never return stack traces to ordinary users in production.
- Never log authentication secrets.
- Sanitize untrusted values before writing them to logs.
- Avoid leaking whether a private resource exists when access is denied.
- Track repeated authorization failures where practical.

Use consistent application error codes as described in `10-API-AND-BACKEND.md` and `13-VALIDATION-AND-ERROR-HANDLING.md`.

## 18. Dependency and Supply-Chain Security

- Use maintained dependencies.
- Review new packages before installing them.
- Commit the package lockfile.
- Run dependency security audits periodically.
- Update vulnerable packages using compatible versions.
- Avoid installing packages for trivial functionality that can be implemented safely with existing tools.
- Never execute untrusted scripts or downloaded code in production.
- Protect GitHub and deployment credentials.
- Require review of sensitive workflow and permission changes.

Do not automatically apply major dependency upgrades without testing compatibility.

## 19. Security Testing

Security tests must cover both expected access and denied access.

### Authentication tests

- Anonymous user attempts a protected operation.
- Expired session attempts a mutation.
- Invalid authentication state is rejected.

### Authorization tests

- A player attempts to edit another team's details.
- A captain attempts to approve a tournament registration.
- An organizer attempts to modify an unrelated tournament.
- An ordinary user attempts to change their role.
- A user attempts to access another user's notifications.

### Database tests

- Anonymous access to protected records.
- Authenticated access to unauthorized rows.
- Attempts to modify protected columns.
- Duplicate registration attempts.
- Concurrent requests for the last available tournament slot.
- Unauthorized deletion or modification of audit records.

### Input and API tests

- Malformed UUIDs.
- Missing required fields.
- Invalid scores.
- Invalid tournament dates.
- Oversized uploads.
- Unexpected enum values.
- Repeated requests and rate-limit behavior.
- Malformed or unsigned webhook requests, if applicable.

Test RLS using realistic database roles and authenticated contexts. Do not rely solely on frontend tests to establish security.

## 20. Production Security Checklist

Before deployment, verify the following:

- [ ] Supabase Auth is configured correctly.
- [ ] Protected server operations verify authentication.
- [ ] Resource-level authorization is enforced.
- [ ] RLS is enabled and tested on exposed tables.
- [ ] Database grants and policies follow least privilege.
- [ ] Sensitive fields cannot be freely updated.
- [ ] Privileged keys are not present in browser bundles.
- [ ] Environment files and credentials are excluded from Git.
- [ ] Critical database operations are safe under concurrency.
- [ ] File uploads have appropriate restrictions.
- [ ] Rate limiting is configured for abuse-prone operations.
- [ ] Error messages do not expose internal information.
- [ ] Security headers have been reviewed.
- [ ] Audit logging protects important actions.
- [ ] Dependencies have been checked for known vulnerabilities.
- [ ] Negative authorization tests pass.
- [ ] Production uses HTTPS.
- [ ] Backup and recovery procedures are documented.

## 21. AI Coding Agent Security Instructions

Any AI coding agent working on Sport Organizer must follow these rules:

1. Never disable RLS to make a feature work.
2. Never use a privileged Supabase key in client-side code.
3. Never assume frontend route protection is sufficient.
4. Never accept client-submitted roles or ownership as authoritative.
5. Never bypass validation to fix a failing request.
6. Never silently remove authorization checks.
7. Never expose private user or organization data through public queries.
8. Never trust a successful UI interaction as proof that a database operation succeeded.
9. Never modify a sensitive database policy without explaining the intended access and testing it.
10. Never introduce a privileged database function without reviewing its execution privileges and authorization checks.
11. Add or update tests when changing authorization, RLS, or critical business rules.
12. If a feature conflicts with these rules, implement a secure alternative rather than weakening security.

When debugging an authorization failure, identify the specific policy, permission, or ownership check causing it. Do not solve the problem by granting unrestricted access.

## 22. Related Documentation

- `02-PRD.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `09-FEATURES-AND-MODULES.md`
- `10-API-AND-BACKEND.md`
- `12-USER-FLOWS.md`
- `13-VALIDATION-AND-ERROR-HANDLING.md`
- `14-TESTING-STRATEGY.md`
- `15-DEPLOYMENT-GUIDE.md`
- `16-ENVIRONMENT-VARIABLES.md`

---

**End of Security Rules**