# Validation and Error Handling — Sport Organizer

## 1. Purpose

This document defines the validation standards and error-handling strategy for the Sport Organizer Web App.

The system must ensure that:

- Users cannot submit invalid data.
- All important validation occurs on the server.
- Database constraints protect data integrity.
- Unauthorized actions are rejected safely.
- Errors are understandable and actionable.
- Failed operations do not create inconsistent records.
- The interface provides clear loading, success, and failure feedback.
- Developers can diagnose issues without exposing sensitive information.

These rules apply to forms, Server Actions, Route Handlers, Supabase queries, database functions, file uploads, authentication flows, and external integrations.

## 2. Validation Principles

Follow these principles for every feature:

1. **Validate at the boundary:** Validate untrusted data when it enters the application.
2. **Validate on the server:** Client-side validation improves UX but never replaces server validation.
3. **Use a single source of truth:** Reuse shared schemas and business rules where practical.
4. **Enforce database integrity:** Use database constraints for rules that must always hold.
5. **Return actionable errors:** Explain what the user can do next.
6. **Preserve valid input:** Avoid clearing entire forms after a recoverable failure.
7. **Fail safely:** Do not continue a critical operation after validation or authorization fails.
8. **Avoid duplicate submissions:** Protect the UI and backend against repeated requests.
9. **Do not leak internal details:** Keep SQL errors, stack traces, and secrets on the server.
10. **Test failure paths:** Verify invalid inputs, conflicts, permissions, and unexpected failures.

## 3. Validation Layers

Sport Organizer uses multiple validation layers.

| Layer | Responsibility |
|---|---|
| UI validation | Immediate feedback while the user fills a form |
| Schema validation | Verify input types, required fields, lengths, and formats |
| Server validation | Verify untrusted requests and business rules |
| Authorization | Confirm that the user may perform the operation |
| Database constraints | Protect uniqueness, relationships, and other invariants |
| Integration validation | Validate external payloads, uploads, and webhook requests |

### Example flow

```text id="5o2s7z"
User submits form
       |
       v
Client-side validation
       |
       v
Server receives untrusted input
       |
       v
Runtime schema validation
       |
       v
Authentication and authorization
       |
       v
Business rule validation
       |
       v
Database constraints and operation
       |
       v
Success result or mapped error
       |
       v
User interface feedback
```

Client-side validation may reject an input early, but the server must independently validate any data that affects application state.

## 4. Recommended Validation Libraries

Use the following tools:

- **Zod:** Runtime schema validation.
- **React Hook Form:** Form state and submission management where useful.
- **TypeScript:** Static type checking.
- **PostgreSQL constraints:** Database integrity.
- **Supabase-generated types:** Strongly typed database queries where practical.

Use compatible versions of these libraries based on the project's installed dependencies.

Do not duplicate every validation rule manually in multiple components. Share schemas or reusable validation helpers when appropriate.

## 5. Shared Validation Structure

Keep reusable schemas near their associated feature.

Recommended structure:

```text id="m1pk9v"
src/
├── features/
│   ├── auth/
│   │   └── schemas.ts
│   ├── teams/
│   │   └── schemas.ts
│   ├── tournaments/
│   │   └── schemas.ts
│   ├── registrations/
│   │   └── schemas.ts
│   └── matches/
│       └── schemas.ts
└── lib/
    ├── validation/
    │   └── helpers.ts
    └── errors/
        ├── codes.ts
        ├── types.ts
        └── mapping.ts
```

This is a recommended structure. Adapt it to the existing codebase rather than creating unnecessary empty files.

### Schema rules

- Use clear schema names.
- Infer TypeScript types from schemas where appropriate.
- Keep user-facing validation messages understandable.
- Validate unknown input before using it.
- Avoid unsafe type assertions that bypass validation.
- Keep authorization checks separate from input-format validation.

## 6. Example Zod Schemas

### 6.1 Team creation

```ts
import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().trim().min(3, "Team name must contain at least 3 characters.").max(80),
  sportId: z.string().uuid("Select a valid sport."),
  description: z.string().trim().max(500).optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
```

### 6.2 Tournament creation

```ts
import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().trim().min(3).max(120),
  sportId: z.string().uuid(),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  registrationDeadline: z.string().datetime({ offset: true }),
  maxTeams: z.number().int().min(2).max(1000),
}).refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  },
);
```

This is a starting example. Adjust field names, date semantics, tournament limits, and business rules to match the actual database schema and requirements.

A registration deadline may need additional rules, such as being no later than the tournament start. Enforce those rules only when required by the product specification.

### 6.3 Match score

```ts
import { z } from "zod";

export const matchScoreSchema = z.object({
  matchId: z.string().uuid(),
  homeScore: z.number().int().min(0).max(10000),
  awayScore: z.number().int().min(0).max(10000),
});
```

The maximum score is an illustrative limit, not a universal rule. Actual score validation must follow the supported sport and competition format.

### Important note

HTML form inputs commonly provide strings, even for numeric values. Convert and validate those values explicitly. Do not assume a browser input automatically becomes a TypeScript number.

## 7. Validation Categories

### 7.1 Required fields

Required fields must not be missing, blank, or invalid.

Examples:

- Team name.
- Tournament name.
- Sport selection.
- Required match participants.
- Required registration information.

Trim user-entered text where appropriate before validating it.

### 7.2 String validation

Validate:

- Minimum and maximum length.
- Empty strings.
- Expected formats.
- Allowed characters only when the business requirement justifies them.

Do not unnecessarily restrict legitimate personal names, team names, or location descriptions.

### 7.3 Numeric validation

Validate:

- Integer or decimal requirements.
- Minimum and maximum values.
- Nonnegative values where required.
- Finite numeric values.
- Allowed precision.

Reject `NaN`, infinity, malformed numbers, and values outside the accepted range.

### 7.4 Identifier validation

Validate UUIDs and other identifiers before using them.

A valid identifier does not prove that the referenced resource exists or that the user has permission to access it.

After format validation, verify the relevant resource and authorization rules.

### 7.5 Date and time validation

Validate:

- Date format.
- Timestamp format and timezone.
- Start and end relationships.
- Registration deadlines.
- Permitted scheduling windows.
- Relevant tournament or match state.

Use consistent date storage and display conventions.

Do not compare ambiguous local date strings as if they were guaranteed UTC timestamps.

### 7.6 Enum validation

Use explicit allowed values for fields such as:

- Tournament status.
- Registration status.
- Match status.
- Membership role.
- Notification type.

Never trust arbitrary status strings submitted by a client.

## 8. Server-Side Validation

Every mutation must validate incoming data on the server.

Example:

```ts
"use server";

import { createTeamSchema } from "./schemas";

export async function createTeam(input: unknown) {
  const parsed = createTeamSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: {
        code: "VALIDATION_ERROR",
        message: "Please correct the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  // Continue with authentication, authorization,
  // business validation, and the database operation.
}
```

This example illustrates input validation only. A production action must also authenticate the user, verify permissions, handle database errors, and avoid exposing sensitive details.

### Mandatory requirements

- Accept untrusted data as `unknown` where appropriate.
- Validate the input before using it.
- Reject invalid values rather than silently coercing unexpected data.
- Verify authentication and resource permissions.
- Recheck business rules against trusted current data.
- Use safe database operations.
- Return a structured result where appropriate.

Do not consider schema validation a replacement for authorization.

## 9. Form Validation UX

Forms must communicate problems clearly and help users recover.

### Required behavior

- Show field-level errors close to the relevant input.
- Display a clear summary for important form-level failures.
- Preserve valid form values after recoverable errors.
- Disable or otherwise protect the submit action while a request is pending.
- Show an appropriate loading indicator.
- Prevent accidental duplicate submissions.
- Focus or announce the first invalid field where practical.
- Clear resolved errors when the relevant field is corrected.
- Keep validation messages accessible to assistive technologies.

### Example

If the user submits a tournament form with an invalid start date:

- Highlight the start date field.
- Display a clear message explaining the issue.
- Preserve the other entered fields.
- Prevent the invalid request from being saved.
- Allow the user to correct the date and submit again.

Avoid showing a generic red error banner for every small field-level issue.

## 10. Standard Error Result

Use a consistent application error format for Server Actions where suitable.

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

This format is appropriate for many form mutations. Server Components, thrown framework errors, and Route Handlers may use their own compatible conventions.

### Error properties

- `success`: Indicates whether the operation succeeded.
- `data`: Contains the safe result of a successful operation.
- `code`: A stable machine-readable application error code.
- `message`: A user-facing explanation.
- `fieldErrors`: Optional field-specific validation messages.

Do not return raw Supabase error objects directly to the browser.

## 11. Standard Error Codes

Use consistent application-level error codes.

| Code | Meaning | Suggested user message |
|---|---|---|
| `VALIDATION_ERROR` | Input failed validation | Please correct the highlighted fields. |
| `UNAUTHENTICATED` | Authentication is required | Please sign in to continue. |
| `FORBIDDEN` | Action is not permitted | You do not have permission to perform this action. |
| `NOT_FOUND` | Resource is unavailable | The requested item could not be found. |
| `CONFLICT` | Current state conflicts with the request | This item has changed or the action is no longer available. |
| `DUPLICATE_RESOURCE` | Duplicate entry detected | This entry already exists. |
| `CAPACITY_REACHED` | Tournament capacity is reached | This tournament is full. |
| `REGISTRATION_CLOSED` | Registration is no longer available | Registration for this tournament is closed. |
| `INVALID_STATE` | Action is invalid for the current state | This action is not available right now. |
| `RATE_LIMITED` | Request limit exceeded | Too many attempts. Please try again later. |
| `NETWORK_ERROR` | A network failure occurred | Check your connection and try again. |
| `INTERNAL_ERROR` | Unexpected failure | Something went wrong. Please try again. |

These are recommended application codes, not a promise that Supabase or PostgreSQL will return the same codes.

Keep internal database error details separate from user-facing messages.

## 12. HTTP Error Mapping

Route Handlers must use suitable HTTP status codes.

| Status | Use |
|---|---|
| `200 OK` | Successful request |
| `201 Created` | Resource created |
| `204 No Content` | Successful operation without a response body |
| `400 Bad Request` | Malformed request |
| `401 Unauthorized` | Authentication required or invalid |
| `403 Forbidden` | Operation not permitted |
| `404 Not Found` | Resource unavailable or intentionally concealed |
| `409 Conflict` | Conflicting state or duplicate operation |
| `422 Unprocessable Content` | Valid request structure but invalid business input, if used consistently |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server failure |
| `503 Service Unavailable` | Temporary service unavailability |

Use one consistent convention for validation failures. For example, use `400` for malformed or invalid requests, or `422` for semantically invalid input if that distinction is adopted across the API.

Do not return HTTP `200` for a failed Route Handler request merely because the server successfully processed the request.

## 13. Database Error Handling

Supabase operations may return an error alongside their data result. Check the error explicitly.

Example:

```ts
const { data, error } = await supabase
  .from("teams")
  .select("id, name")
  .eq("id", teamId)
  .maybeSingle();

if (error) {
  // Log safe diagnostic information on the server.
  // Map the failure to an appropriate application error.
  return {
    success: false as const,
    error: {
      code: "INTERNAL_ERROR",
      message: "Unable to load the team right now.",
    },
  };
}

if (!data) {
  return {
    success: false as const,
    error: {
      code: "NOT_FOUND",
      message: "The requested team could not be found.",
    },
  };
}
```

Adapt this example to the actual access policy. A missing result may also represent an intentionally hidden resource.

### Database error rules

- Check database errors after every critical operation.
- Do not assume a request succeeded because it did not throw an exception.
- Map known constraint violations to appropriate application errors.
- Do not expose raw SQL, table internals, or stack traces.
- Avoid treating all database errors as a missing record.
- Preserve the original diagnostic information in secure server-side logging where appropriate.

## 14. Business Rule Validation

Some requests have valid formats but violate application rules.

Examples:

- A tournament end date is before its start date.
- A registration deadline has passed.
- A team is not eligible for a tournament.
- A tournament has reached its capacity.
- A match references teams outside the tournament.
- A result is submitted for a match that cannot accept results.
- A completed match is edited without permission.
- A user attempts an invalid status transition.

Business rules must be checked against trusted database state.

For critical operations, validate the rules within the transaction or database operation that performs the change. This prevents race conditions in which the data changes after validation but before the write.

## 15. Duplicate and Concurrent Requests

Sport Organizer must handle repeated submissions and simultaneous operations safely.

### Examples

- A captain submits the same registration twice.
- Two teams attempt to claim the final tournament slot.
- An organizer clicks Approve repeatedly.
- Two requests attempt to publish a result for the same match.

### Required protections

- Enforce uniqueness in PostgreSQL where appropriate.
- Use transactions and suitable locking or atomic operations for shared capacity.
- Check the current state within the trusted mutation.
- Return a conflict or duplicate error when necessary.
- Disable repeated UI submissions while an operation is pending.
- Use idempotency keys when the workflow requires safe retries and the added complexity is justified.

Never rely solely on a disabled button to prevent duplicate database records.

## 16. Network Failures and Retry Behavior

A network failure does not always mean the database operation failed. The server may have completed the operation before the response was lost.

### Recovery strategy

1. Display a safe error or uncertain-outcome message.
2. Preserve the user's form data where practical.
3. Check the current resource state when needed.
4. Retry only when the operation is safe to repeat.
5. Use idempotency mechanisms for operations that require them.

Do not automatically retry non-idempotent operations without a strategy for duplicate prevention.

For example, after a registration request times out, check whether the registration already exists before asking the user to submit another one.

## 17. Authentication and Authorization Errors

### Unauthenticated

If authentication is required:

- Reject the protected operation.
- Prompt the user to sign in.
- Preserve the intended destination when safe.
- Avoid losing unsaved form data where practical.

### Forbidden

If the user lacks permission:

- Reject the operation.
- Display a clear permission message.
- Do not reveal restricted resource information.
- Do not retry the same operation automatically.

### Expired session

If the session expires:

- Handle the authentication state through the established Supabase SSR flow.
- Refresh or re-establish the session as appropriate.
- Redirect to sign-in when required.
- Never bypass authentication to keep the interface working.

## 18. Loading and Submission States

Every asynchronous operation must have appropriate feedback.

### Required UI states

- Idle.
- Validating.
- Submitting.
- Success.
- Recoverable failure.
- Conflict or permission failure.

### Rules

- Prevent accidental repeated submissions.
- Use a clear loading label, spinner, or other suitable indicator.
- Restore the submit action after a recoverable failure.
- Avoid blocking the entire page for a small operation unless necessary.
- Ensure an error does not leave the UI stuck in a loading state.
- Refresh affected data only after the operation has actually succeeded.

## 19. Error Logging and Monitoring

Log enough information to diagnose problems without leaking private information.

Recommended fields:

- Timestamp.
- Request or correlation ID.
- Feature or operation name.
- Sanitized error category.
- Relevant resource ID when safe.
- Actor ID when appropriate.
- Operation outcome.
- Duration, where useful.

### Never log

- Passwords.
- Access or refresh tokens.
- Secret keys.
- Full authentication payloads.
- Unnecessary private user information.
- Sensitive request bodies.

Use server-side logging for unexpected errors. Show users safe messages that do not reveal internal implementation details.

## 20. Accessibility Requirements

Validation and error messages must be accessible.

- Associate field errors with their inputs.
- Use semantic form controls.
- Announce important errors to assistive technologies.
- Do not rely only on color to indicate invalid fields.
- Maintain visible keyboard focus.
- Ensure error text is readable.
- Focus the first invalid field when appropriate.
- Use accessible status feedback for asynchronous operations.

The application should follow the accessibility goals in `06-UI-UX-GUIDELINES.md`.

## 21. Testing Requirements

### Schema tests

- Missing required fields.
- Empty strings.
- Values outside length limits.
- Invalid UUIDs.
- Invalid timestamps.
- Invalid enum values.
- Invalid numeric ranges.
- Cross-field validation failures.

### Server operation tests

- Invalid request data is rejected.
- Unauthorized requests are rejected.
- Valid requests complete successfully.
- Database failures produce safe errors.
- Duplicate requests are handled correctly.
- Concurrent capacity changes preserve tournament limits.
- Invalid match state transitions are rejected.

### UI tests

- Field errors appear in the correct location.
- Valid values remain after recoverable failures.
- Loading indicators appear during submission.
- Submit controls recover after errors.
- Success feedback appears only after success.
- Authentication errors offer an appropriate recovery path.
- Keyboard users can locate and understand validation errors.

### Integration tests

Test important workflows using a dedicated test database or environment. Never use production data for destructive tests.

## 22. AI Coding Agent Instructions

Any AI coding agent working on Sport Organizer must:

1. Create or reuse runtime validation schemas for untrusted inputs.
2. Validate requests on the server.
3. Check authentication and authorization independently of validation.
4. Map expected database errors to safe application errors.
5. Handle unexpected failures without exposing internal details.
6. Preserve user input after recoverable failures.
7. Implement safe retry behavior for operations that may be repeated.
8. Add tests for invalid input, conflicts, and permission failures.
9. Avoid silently ignoring database errors.
10. Avoid returning success before the operation has actually succeeded.
11. Keep validation rules consistent with the database schema and product requirements.
12. Avoid duplicating complex business rules across multiple unrelated files.

When debugging a failing operation, identify the root cause. Do not remove validation, weaken authorization, or disable database constraints merely to make a request succeed.

## 23. Implementation Checklist

- [ ] Shared Zod schemas are implemented where appropriate.
- [ ] Client-side validation provides immediate feedback.
- [ ] Server-side validation protects every mutation.
- [ ] Authentication and authorization checks are enforced.
- [ ] Database constraints protect critical invariants.
- [ ] Error codes and response conventions are consistent.
- [ ] Database errors are handled explicitly.
- [ ] Duplicate and concurrent requests are handled safely.
- [ ] Retry behavior accounts for uncertain outcomes.
- [ ] Forms display loading, success, and failure states.
- [ ] User input is preserved after recoverable errors.
- [ ] Errors are accessible.
- [ ] Logs exclude credentials and unnecessary sensitive data.
- [ ] Unit, integration, and relevant end-to-end tests pass.

## 24. Related Documentation

- `02-PRD.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `06-UI-UX-GUIDELINES.md`
- `09-FEATURES-AND-MODULES.md`
- `10-API-AND-BACKEND.md`
- `11-SECURITY-RULES.md`
- `12-USER-FLOWS.md`
- `14-TESTING-STRATEGY.md`
- `16-ENVIRONMENT-VARIABLES.md`
- `17-CODING-STANDARDS.md`

---

**End of Validation and Error Handling**