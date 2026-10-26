# Sport Organizer Web App — Authentication and Authorization

## 1. Document Information

- **Project:** Sport Organizer
- **Document:** Authentication and Authorization Specification
- **Version:** 1.0
- **Authentication Provider:** Supabase Auth
- **Frontend Framework:** Next.js App Router
- **Authorization:** Database-backed permissions, PostgreSQL RLS, and trusted server-side checks
- **Related Documents:** `02-PRD.md`, `03-TECH-STACK.md`, `04-DATABASE-SCHEMA.md`, `11-SECURITY-RULES.md`

---

## 2. Purpose

This document defines how users authenticate, how sessions are maintained, and how permissions are enforced throughout Sport Organizer.

The system must ensure that:
- Users can securely access their accounts.
- Each user can perform only authorized actions.
- Team managers can manage only their permitted teams.
- Organizers can manage only their permitted tournaments.
- Administrators receive explicitly granted privileges.
- Protected database operations cannot be bypassed by modifying frontend code or requests.

## 3. Authentication Provider

Use **Supabase Auth** for identity and session management.

Supported initial authentication methods:
- Email and password
- Email verification
- Password recovery
- Session refresh
- Sign out

Google OAuth may be added later if explicitly approved.

Do not implement custom password hashing, credential storage, or session-token generation.

Use the official `@supabase/supabase-js` and `@supabase/ssr` packages with the Next.js integration pattern documented by Supabase. <https://supabase.com/docs/guides/auth/server-side>

## 4. User Registration

### 4.1 Signup Fields

Required:
- Full name
- Email address
- Password
- Password confirmation

Optional:
- Profile image
- Organization affiliation

Do not ask users to select an administrator role during signup.

### 4.2 Signup Workflow

1. User opens the signup page.
2. User enters valid registration information.
3. Frontend validates the input.
4. Supabase Auth creates the authentication account.
5. Email verification is sent when enabled.
6. A corresponding profile is created through a reliable, secure workflow.
7. User verifies their email when required.
8. User is redirected to the appropriate onboarding or dashboard page.

### 4.3 Signup Rules

- Email addresses must be valid.
- Passwords must comply with configured authentication requirements.
- Password confirmation must match.
- Duplicate accounts must be handled safely.
- Unverified accounts must follow the configured verification policy.
- Signup errors must be displayed clearly.
- Profile creation failures must be logged and recoverable.
- Public signup must never grant privileged permissions.

### 4.4 Profile Creation

The `profiles.id` field must reference `auth.users.id`.

Profile creation may use a carefully designed database trigger or a trusted server-side workflow.

If a database trigger is used:
- Validate all input.
- Restrict its execution privileges.
- Set a safe `search_path` for any `SECURITY DEFINER` function.
- Avoid granting elevated permissions to the new user.
- Test the signup flow when profile creation fails.

---

## 5. Login

### 5.1 Login Fields

- Email address
- Password

### 5.2 Login Workflow

1. User submits credentials.
2. Supabase Auth validates the credentials.
3. The application establishes or refreshes the supported session.
4. The server verifies the user's identity.
5. The application loads permitted profile and membership information.
6. The user is redirected to the requested authorized page or dashboard.

### 5.3 Login Rules

- Do not reveal whether a particular email address exists.
- Use a generic invalid-credentials message where appropriate.
- Disable duplicate submissions while a request is processing.
- Provide loading and error states.
- Do not store passwords in application state longer than needed.
- Do not log passwords or authentication tokens.
- Apply appropriate rate limiting and abuse protections.

## 6. Email Verification

Email verification should be enabled according to the Supabase project configuration.

Requirements:
- Provide a verification-required screen.
- Provide a resend-verification action subject to rate limits.
- Handle expired or invalid verification links.
- Redirect users to an approved destination after verification.
- Do not allow unverified accounts to perform actions that require verified email.
- Enforce verification requirements on trusted backend operations when applicable.

Email verification confirms control of an email address; it does not prove that a user belongs to a particular college.

Organization verification, if required, must be a separate workflow.

## 7. Password Recovery

### 7.1 Workflow

1. User opens the forgot-password page.
2. User enters their email address.
3. Application requests a recovery email through Supabase Auth.
4. User opens the recovery link.
5. The application validates and exchanges the recovery code using the supported authentication flow.
6. User sets a new password.
7. The application confirms the result and redirects to login or an authorized page.

### 7.2 Security Requirements

- Use approved redirect URLs.
- Do not expose recovery tokens.
- Do not log recovery links.
- Handle expired and already-used links.
- Use generic responses that do not unnecessarily reveal account existence.
- Follow the configured session-revocation policy after password changes.

## 8. Session Management

### 8.1 Next.js Integration

Use cookie-based server-side authentication through `@supabase/ssr`.

Maintain separate Supabase client utilities for:
- Browser components
- Server Components
- Server Actions
- Route Handlers

Use the current Next.js session-refresh convention compatible with the installed version. Next.js 16 uses `proxy.ts`; earlier supported versions use `middleware.ts`.

### 8.2 Session Rules

- Verify identity on the trusted server before sensitive operations.
- Refresh sessions using the supported Supabase integration.
- Handle expired or revoked sessions gracefully.
- Clear the session during logout.
- Redirect unauthenticated users away from protected pages.
- Never treat a browser-provided user ID as proof of identity.
- Never rely on an unverified session object for authorization decisions.

Use `getClaims()` to verify token claims and `getUser()` when a fresh server-confirmed user record is needed. Use `getSession()` to retrieve session information when required, not as the sole identity-verification mechanism on the server. <https://supabase.com/docs/guides/auth/server-side/creating-a-client>

### 8.3 Logout

The logout process must:
1. Request session termination through Supabase Auth.
2. Clear or refresh authentication cookies as appropriate.
3. Remove protected user-specific data from client-side state.
4. Redirect the user to a public page.
5. Ensure subsequent protected requests are rejected.

## 9. Authorization Model

Use role-based access control combined with resource ownership and membership checks.

A global role alone is insufficient for team and tournament permissions.

The authorization model has four layers:

1. **Identity:** Who is the authenticated user?
2. **Global role:** Is the user a regular user or an authorized platform administrator?
3. **Resource permissions:** Does the user manage this organization, team, or tournament?
4. **Operation permissions:** Is the requested action allowed in the resource's current state?

For example, being a team captain does not authorize a user to approve their own tournament registration.

## 10. Roles

### 10.1 Guest

An unauthenticated visitor.

Allowed:
- Browse published public tournaments.
- View published schedules and results.
- Read public tournament announcements.
- Access signup and login pages.

Not allowed:
- Register teams.
- Modify profiles.
- Create or manage tournaments.
- Access private dashboards.

### 10.2 Player

An authenticated user who participates in teams.

Allowed:
- Manage permitted profile fields.
- View their teams and upcoming matches.
- View relevant tournament results.
- Access permitted notifications.

Not allowed:
- Change official results.
- Approve registrations.
- Manage teams without appropriate team permissions.
- Access other users' private information.

### 10.3 Team Captain

A team manager with captain permissions.

Allowed:
- Manage authorized team information.
- Manage rosters within defined rules.
- Submit tournament registrations.
- View registration statuses.
- Withdraw registrations when allowed.

Not allowed:
- Approve their own registration.
- Modify another team's roster.
- Bypass registration deadlines.
- Change official match results without separately granted authorization.

### 10.4 Tournament Organizer

An organizer with permissions for specific tournaments.

Allowed:
- Create tournaments.
- Edit and publish authorized tournaments.
- Manage registrations.
- Schedule matches.
- Record and publish results.
- Publish tournament announcements.

Not allowed:
- Modify unrelated tournaments.
- Access unrelated private resources.
- Change permissions beyond their authority.
- Bypass tournament lifecycle restrictions.

### 10.5 Organization Administrator

An authorized administrator for a specific organization.

Allowed:
- Manage permitted organization information.
- Manage organization membership according to policy.
- Assign authorized coordinators.
- Oversee organization-linked tournaments and teams where explicitly permitted.

Organization administrator privileges do not automatically grant platform-wide administrator access.

### 10.6 Platform Administrator

A trusted platform-level administrator.

Allowed:
- Manage platform-wide accounts and moderation.
- Review authorized audit records.
- Resolve platform-level issues.
- Manage platform configuration.

Requirements:
- Platform administrator privileges must be granted through a trusted administrative process.
- Users must never assign this role to themselves.
- Sensitive administrative actions must be audited.
- Administrative access must be tested separately from normal user permissions.

## 11. Permission Matrix

| Action | Guest | Player | Captain | Organizer | Platform Admin |
|---|---|---|---|---|---|
| View public tournaments | Yes | Yes | Yes | Yes | Yes |
| Edit own profile | No | Yes | Yes | Yes | Yes |
| Create team | No | If permitted | Yes | If permitted | Yes |
| Manage team roster | No | No | Own team | Only if granted | Authorized cases |
| Submit registration | No | If authorized by team role | Yes | If separately authorized | Authorized cases |
| Approve registration | No | No | No | Authorized tournament | Authorized cases |
| Create tournament | No | No | No | Yes | Yes |
| Schedule matches | No | No | No | Authorized tournament | Authorized cases |
| Publish official results | No | No | No | Authorized tournament | Authorized cases |
| Manage platform users | No | No | No | No | Yes |

Every permission in this matrix must be enforced by the backend or database, not just the user interface.

## 12. Resource-Level Permissions

### 12.1 Team Permissions

Before allowing a team operation, verify:
- The user is authenticated.
- The team exists.
- The user has the required active membership or management permission.
- The requested operation is permitted for the user's team role.
- The operation respects roster and tournament constraints.

### 12.2 Tournament Permissions

Before allowing a tournament operation, verify:
- The user is authenticated.
- The tournament exists.
- The user owns or has explicit management permission for that tournament.
- The tournament's current state allows the requested operation.
- The operation does not violate registration, fixture, or result rules.

### 12.3 Organization Permissions

Before allowing organization administration, verify:
- The user has an active organization membership.
- The membership role grants the requested permission.
- The target organization matches the user's authorized scope.
- Privileged membership changes are not self-assigned.

### 12.4 Platform Administration

Platform-level permissions must be verified through trusted authorization logic.

Do not trust:
- A role supplied in a form.
- A role stored in browser local storage.
- A query parameter.
- A user-editable profile field.
- A client-side navigation check.

## 13. Database Role Design

Use the following concepts consistently with `04-DATABASE-SCHEMA.md`:

- `profiles`: User profile information.
- `organization_members`: Organization-specific roles.
- `team_members`: Team-specific roles.
- `tournaments.created_by`: Tournament creator.
- Trusted authorization logic: Platform-wide administrative permissions.

Do not introduce an unrestricted user-editable `is_admin` field.

If a global role column or dedicated administrator table is introduced, it must be protected against user updates and verified through trusted authorization logic.

The same user may be a player on one team, captain of another team, and organizer of a tournament. Permissions must be resolved in the context of the resource being accessed.

## 14. Route Protection

### Public Routes

- `/`
- `/tournaments`
- `/tournaments/[id]`
- `/matches`
- `/matches/[id]`
- `/login`
- `/signup`
- `/forgot-password`

### Authenticated Routes

- `/dashboard`
- `/profile`
- `/my-teams`
- `/my-registrations`
- `/notifications`

### Organizer Routes

- `/dashboard/organizer`
- `/dashboard/organizer/tournaments`
- `/dashboard/organizer/registrations`
- `/dashboard/organizer/matches`

### Administrator Routes

- `/dashboard/admin`

Rules:
- Unauthenticated users must be redirected from protected routes.
- Authenticated users without sufficient permissions must receive an appropriate forbidden response or page.
- Dynamic resource routes must verify resource-level permissions.
- Server-side checks are mandatory for sensitive operations.
- Route protection must not replace database RLS.

## 15. Row Level Security (RLS)

Enable RLS on all exposed application tables that require authorization.

### Profiles

- Users may read permitted profile information.
- Users may update only their own permitted fields.
- Users cannot grant themselves privileged permissions.

### Teams and Team Membership

- Team managers can manage only authorized teams.
- Membership changes require appropriate permissions.
- Users cannot grant themselves captain status.
- Private roster information must be protected.

### Tournaments

- Public users can read published public tournaments.
- Authorized organizers can manage their tournaments.
- Draft and private tournament information must remain restricted.

### Registrations

- Team managers can view registrations for their authorized teams.
- Organizers can review registrations for authorized tournaments.
- Only authorized organizers can approve or reject registrations.
- Database constraints and transactional logic must enforce capacity.

### Matches and Results

- Public users can read published match information.
- Authorized organizers can schedule matches and publish results.
- Finalized result corrections must follow an authorized workflow.

### Notifications

- Users can read their own notifications.
- Users can update their own read state.
- Clients cannot create arbitrary notifications for other users.

### Audit Logs

- Ordinary users cannot modify audit records.
- Administrative reads are restricted.
- Sensitive audit writes use trusted server-side logic.

All policies must be tested using multiple accounts and unauthorized requests.

## 16. Server-Side Authorization

Create a centralized authorization layer, for example:

```text
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── auth/
│   │   ├── get-current-user.ts
│   │   └── require-user.ts
│   └── permissions/
│       ├── can-manage-team.ts
│       ├── can-manage-tournament.ts
│       └── can-administer-organization.ts
```

These names are examples; adapt them to the actual project architecture.

Requirements:
- Keep authorization logic reusable.
- Verify identity using trusted authentication methods.
- Load current resource permissions from trusted sources.
- Avoid duplicating inconsistent permission checks across routes.
- Return only the data the caller is allowed to see.
- Use RLS as an additional enforcement layer.
- Never accept a browser-supplied role as authoritative.

## 17. Privileged Operations

The following operations require especially careful enforcement:

- Promoting a user to administrator.
- Changing organization ownership.
- Approving registrations.
- Enforcing tournament capacity.
- Finalizing match results.
- Correcting official scores.
- Suspending accounts.
- Reading sensitive audit logs.

Use database transactions or trusted database functions for operations that must update multiple related records atomically.

If a Supabase service-role or secret key is required for a specific server-side operation:
- Keep it server-only.
- Never prefix it with `NEXT_PUBLIC_`.
- Never return it to the browser.
- Use the minimum privileges practical.
- Do not use an unrestricted service-role client for ordinary user operations.

## 18. Error Handling

Use consistent outcomes:

- `401 Unauthorized`: Authentication is missing or invalid.
- `403 Forbidden`: The user is authenticated but lacks permission.
- `404 Not Found`: The resource does not exist or should not be disclosed to the caller.
- `400 Bad Request`: The submitted input is invalid.
- `409 Conflict`: The request conflicts with the current resource state.
- `429 Too Many Requests`: A rate limit has been reached, where applicable.

Avoid exposing SQL errors, secret values, internal stack traces, or private resource details.

## 19. Security Testing

Test at minimum:

1. Unauthenticated users cannot access protected resources.
2. A player cannot approve tournament registrations.
3. A captain cannot modify another team's roster.
4. A captain cannot approve their own registration.
5. An organizer cannot modify a tournament outside their scope.
6. A normal user cannot promote themselves to administrator.
7. A user cannot access another user's private notifications.
8. A user cannot modify a match result through a direct database request.
9. A user cannot bypass RLS by changing request parameters.
10. Expired sessions are rejected or refreshed correctly.
11. Logout removes access to protected operations.
12. Organization membership changes are permission-checked.
13. Concurrent registrations cannot exceed tournament capacity.
14. Sensitive operations produce appropriate audit records.

Test with separate accounts for guests, players, captains, organizers, and administrators.

## 20. Definition of Done

Authentication and authorization are ready when:

- Signup, login, verification, recovery, and logout work.
- Server-side session handling is configured correctly.
- Protected routes enforce authentication.
- Resource-specific permissions are enforced.
- RLS policies are enabled and tested.
- Users cannot grant themselves privileged roles.
- Critical operations use trusted transactional logic.
- Error handling does not leak sensitive information.
- Automated authorization tests pass.

## 21. Related Documents

- `01-PROJECT-OVERVIEW.md`
- `02-PRD.md`
- `03-TECH-STACK.md`
- `04-DATABASE-SCHEMA.md`
- `09-FEATURES-AND-MODULES.md`
- `10-API-AND-BACKEND.md`
- `11-SECURITY-RULES.md`
- `13-VALIDATION-AND-ERROR-HANDLING.md`
- `14-TESTING-STRATEGY.md`
- `16-ENVIRONMENT-VARIABLES.md`
- `19-AI-CODING-INSTRUCTIONS.md`
