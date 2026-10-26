# 17 — Coding Standards

## 1. Purpose

This document defines the coding conventions and development practices for the Sport Organizer Web App.

Every developer and AI coding agent must follow these standards when creating, modifying, reviewing, or debugging application code.

### Technology stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Supabase Auth, PostgreSQL, and Storage
- React Hook Form and Zod
- Vitest and React Testing Library
- Playwright

Use the versions and dependencies established in the project. Do not upgrade major dependencies or replace architectural decisions without a clear reason.

---

## 2. General Coding Principles

All code must follow these principles:

1. **Readable:** Prefer clear code over clever shortcuts.
2. **Maintainable:** Keep modules focused and easy to modify.
3. **Reusable:** Extract genuinely reusable logic and components.
4. **Type-safe:** Use TypeScript without unnecessary escape hatches.
5. **Secure:** Validate inputs and enforce authorization on the server.
6. **Testable:** Design business logic so it can be tested independently.
7. **Accessible:** Follow semantic HTML and accessibility requirements.
8. **Consistent:** Follow existing project conventions.
9. **Efficient:** Avoid unnecessary queries, rendering, and dependencies.
10. **Documented:** Explain complex decisions, not obvious code.

Do not introduce abstractions merely to reduce the number of lines. Optimize for clarity and future development.

---

## 3. Project Structure

Organize source code by responsibility and feature.

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── tournaments/
│   ├── teams/
│   ├── matches/
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
├── features/
│   ├── auth/
│   ├── teams/
│   ├── tournaments/
│   ├── registrations/
│   ├── matches/
│   └── standings/
├── lib/
│   ├── supabase/
│   ├── validations/
│   ├── utils/
│   └── env.ts
├── hooks/
├── types/
└── config/
```

The exact structure may evolve as the application grows.

### Responsibilities

- `app/`: Routes, layouts, loading states, and route-level error handling.
- `components/ui/`: Reusable low-level UI components, including shadcn/ui components.
- `components/layout/`: Application shell, navigation, sidebar, and headers.
- `components/shared/`: Shared application-level UI components.
- `features/`: Feature-specific components, schemas, actions, and domain logic.
- `lib/supabase/`: Browser and server Supabase clients and related helpers.
- `lib/validations/`: Shared Zod schemas when they are not better owned by a feature.
- `lib/utils/`: Generic utilities without business-specific behavior.
- `hooks/`: Reusable client-side React hooks.
- `types/`: Shared domain types and generated database types.
- `config/`: Application configuration that does not contain secrets.

Do not place all business logic in route files or create an oversized `utils.ts` file.

---

## 4. Naming Conventions

Use descriptive, consistent names.

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase | `TournamentCard.tsx` |
| Hooks | camelCase with `use` | `useTournamentFilters.ts` |
| Utility functions | camelCase | `formatMatchDate.ts` |
| Variables | camelCase | `tournamentStatus` |
| Constants | UPPER_SNAKE_CASE for true global constants | `MAX_TEAM_SIZE` |
| Types and interfaces | PascalCase | `TournamentRegistration` |
| Zod schemas | camelCase ending in `Schema` | `createTeamSchema` |
| Server Actions | Descriptive verb-first names | `createTournament` |
| Test files | Match the tested module | `TournamentCard.test.tsx` |
| Route segments | lowercase, URL-friendly | `/tournaments` |
| Database tables and columns | snake_case | `tournament_registrations` |
| Environment variables | UPPER_SNAKE_CASE | `NEXT_PUBLIC_SUPABASE_URL` |

Prefer specific names such as `approvedRegistrations` over vague names such as `data`, `items`, or `result` when the context is not obvious.

Short names such as `i` are acceptable for simple loop indexes.

---

## 5. TypeScript Standards

### 5.1 Strict typing

- Keep TypeScript strict mode enabled.
- Avoid `any`.
- Prefer `unknown` when a value's type is not yet known, then validate it.
- Use explicit return types for exported business logic and public utility functions where helpful.
- Infer simple local variable types when the result is obvious.
- Use discriminated unions for operations with multiple outcomes.
- Prefer narrow, accurate types over broad types.

Avoid:

```ts
const registration: any = response;
```

Prefer:

```ts
type RegistrationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";
```

Use the project's actual domain types and generated Supabase database types where available.

### 5.2 Avoid unsafe type assertions

Do not use `as` to silence errors without proving that the assertion is correct.

Bad:

```ts
const status = input.status as RegistrationStatus;
```

Better:

```ts
const registrationStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "cancelled",
]);

const parsedStatus =
  registrationStatusSchema.safeParse(input.status);

if (!parsedStatus.success) {
  throw new Error("Invalid registration status");
}

const status = parsedStatus.data;
```

Return a user-safe validation error through the application's standard error-handling mechanism rather than exposing internal exception details.

### 5.3 Type imports

Use type-only imports when importing types without runtime values.

```ts
import type { Tournament } from "@/types/tournament";
```

Follow the project's TypeScript and ESLint configuration for import ordering.

### 5.4 Database types

Prefer generated Supabase types over manually duplicating database row definitions.

If a database migration changes a table or column, update the generated types using the project's established workflow.

Avoid maintaining multiple contradictory definitions of the same database entity.

---

## 6. React and Next.js Standards

### 6.1 Server Components by default

Use Server Components unless client-side interaction or browser APIs require a Client Component.

Prefer Server Components for:

- Fetching public tournament data
- Loading dashboard data after verifying access
- Rendering static content
- Reading server-side configuration
- Reducing unnecessary browser JavaScript

Use Client Components for:

- Interactive forms
- Client-side state and effects
- Interactive dialogs and dropdowns
- Browser APIs
- Components requiring client-side event handlers

Add `"use client"` only when necessary. Keep the client boundary as low in the component tree as practical.

### 6.2 Data fetching

- Fetch data close to where it is needed.
- Avoid unnecessary duplicate database requests.
- Select only the required database columns.
- Paginate large lists.
- Handle loading, empty, and error states.
- Verify permissions before returning protected data.
- Use the correct Supabase client for the execution environment.

Do not assume that hiding a button prevents unauthorized database operations.

### 6.3 Server Actions and Route Handlers

Use Server Actions for suitable application mutations and Route Handlers for HTTP endpoints, integrations, and cases that require explicit request/response handling.

Every sensitive operation must:

1. Authenticate the caller.
2. Validate input.
3. Check authorization for the requested resource.
4. Apply business rules.
5. Execute the database operation safely.
6. Return a consistent response.
7. Log appropriate operational information without exposing secrets.

Do not trust role names, user IDs, team IDs, or organization IDs supplied by the browser without verifying them against trusted server-side data.

### 6.4 React state

- Keep state as close as practical to the component that uses it.
- Use controlled inputs when form behavior requires them.
- Avoid duplicating values that can be derived from existing state.
- Use URL search parameters for shareable filters and pagination where appropriate.
- Do not use effects for calculations that can be performed during rendering.
- Clean up subscriptions and event listeners when required.

Avoid adding a global state-management library unless the application has a demonstrated need.

---

## 7. Component Standards

Each component should have one clear responsibility.

### Good component practices

- Use semantic HTML.
- Accept explicit, well-defined props.
- Keep complex business logic outside presentation-only components.
- Reuse shared components when behavior and appearance genuinely match.
- Support loading, empty, disabled, and error states where relevant.
- Avoid deeply nested conditional JSX.
- Use stable keys when rendering lists.
- Avoid unnecessary prop drilling when a suitable composition pattern is clearer.

Example:

```tsx
type TournamentCardProps = {
  id: string;
  name: string;
  sportName: string;
  status: "upcoming" | "ongoing" | "completed";
};

export function TournamentCard({
  id,
  name,
  sportName,
  status,
}: TournamentCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{sportName}</p>
      <p>{status}</p>
    </article>
  );
}
```

This example illustrates component structure. Use the project's actual design-system components and status types in production.

### Component size

There is no mandatory line limit. However, if a component handles several unrelated responsibilities, extract focused components or hooks.

Do not split every small JSX element into a separate file without a practical benefit.

---

## 8. Styling Standards

Use Tailwind CSS and the established design system.

- Follow `07-COLOR-TYPOGRAPHY.md`.
- Follow `08-DESIGN-SYSTEM.md`.
- Use the approved design tokens and semantic color names.
- Prefer existing shadcn/ui components over creating inconsistent duplicates.
- Use responsive layouts.
- Avoid unnecessary inline styles.
- Avoid adding a second styling framework.
- Keep global CSS limited to genuine global styles.
- Use consistent spacing, typography, radii, and interaction states.

Do not introduce arbitrary colors or one-off component styles when an existing design token provides the intended result.

### Responsive design

Test the main user flows on:

- Mobile screens
- Tablet screens
- Desktop screens
- Wide desktop screens

Tournament tables may use responsive alternatives such as horizontally scrollable tables or mobile-specific cards where appropriate.

---

## 9. Forms and Validation

Use React Hook Form and Zod where appropriate.

Every important form must include:

- Clearly labeled fields
- Client-side validation for immediate feedback
- Server-side validation before mutations
- Accessible error messages
- Submission loading states
- Disabled states during relevant submissions
- Success or failure feedback
- Protection against duplicate submissions where necessary

Client-side validation improves usability but does not establish security.

Example:

```ts
import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(50),
  sportId: z.string().uuid(),
});

export type CreateTeamInput =
  z.infer<typeof createTeamSchema>;
```

Adapt the schema to the actual database and product rules. Verify that referenced sports exist and that the user is authorized to create the team on the server.

---

## 10. Supabase and Database Standards

### 10.1 Database access

- Use centralized Supabase client factories.
- Use generated database types.
- Handle query errors explicitly.
- Avoid selecting all columns unless necessary.
- Use database constraints for critical invariants.
- Use migrations for schema changes.
- Keep queries and business rules organized by feature.

### 10.2 Security

- Enable and test RLS on applicable tables.
- Enforce resource ownership and membership rules.
- Never expose a privileged Supabase key.
- Do not treat client-provided role information as authoritative.
- Validate file uploads and storage permissions.
- Restrict updates to fields the caller is permitted to change.

### 10.3 Data integrity

Important tournament operations must remain correct under concurrent requests.

Examples include:

- Preventing duplicate active tournament registrations
- Enforcing tournament capacity
- Approving or rejecting registrations
- Publishing match results
- Updating tournament standings

Use appropriate database constraints, transactions, or carefully designed database functions for operations that must be atomic.

Do not rely solely on a browser-side check to enforce uniqueness or capacity.

---

## 11. Error Handling

Use consistent error handling across features.

- Validate expected failures explicitly.
- Return safe, actionable messages to users.
- Keep technical details in appropriately restricted logs.
- Avoid swallowing errors silently.
- Avoid exposing SQL errors, stack traces, tokens, or secrets.
- Distinguish validation errors, authorization errors, not-found responses, and unexpected failures.

Example response type:

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
      };
    };
```

Use the application's established response conventions rather than creating a different response structure for each feature.

---

## 12. Accessibility Standards

All user-facing features must follow the accessibility guidance in `06-UI-UX-GUIDELINES.md`.

Requirements include:

- Semantic HTML
- Keyboard-accessible controls
- Visible focus states
- Appropriate labels
- Sufficient color contrast
- Accessible dialog behavior
- Clear form errors
- Meaningful image alternative text
- Status information that does not rely only on color
- Respect for reduced-motion preferences

Do not use clickable `<div>` elements when a semantic button or link is appropriate.

Use ARIA attributes when necessary, not as a replacement for correct HTML semantics.

---

## 13. Performance Standards

Write code that avoids unnecessary work.

- Use pagination for large datasets.
- Select only required database columns.
- Optimize images.
- Avoid unnecessary client-side JavaScript.
- Use appropriate caching for public data.
- Avoid publicly caching permission-sensitive responses.
- Debounce expensive search requests when appropriate.
- Avoid unnecessary dependencies.
- Measure performance before introducing complex optimizations.

Do not use memoization everywhere. Apply `useMemo`, `useCallback`, and `React.memo` when they provide a practical benefit or are required by an existing pattern.

---

## 14. Testing Standards

Tests must be maintained alongside application code.

### Unit tests

Test isolated functions such as:

- Score validation
- Tournament eligibility
- Standings calculations
- Date and time formatting
- Input parsing

### Component tests

Test:

- Form validation and submission states
- Button interactions
- Loading and empty states
- Error messages
- Accessible interactions

### Integration tests

Test:

- Server-side mutations
- Database behavior
- Authentication and authorization
- Registration rules
- Result publishing and standings consistency

### End-to-end tests

Use Playwright for critical user journeys such as signing in, creating a team, registering for a tournament, and viewing matches.

Never run destructive automated tests against production data.

---

## 15. Git and Commit Standards

Use clear commit messages.

Recommended format:

```text
feat: add tournament registration
fix: prevent duplicate team registration
refactor: simplify match result validation
test: cover standings calculation
docs: update deployment guide
style: improve tournament card spacing
chore: update development dependencies
```

### Git rules

- Commit focused changes.
- Avoid committing generated build output.
- Never commit secrets.
- Keep migrations version-controlled.
- Review diffs before pushing.
- Do not rewrite shared branch history without coordination.
- Keep pull requests focused and explain important changes.

---

## 16. Dependency Management

Before installing a package:

1. Check whether the functionality already exists in the project.
2. Prefer maintained packages compatible with the current stack.
3. Review the package's purpose and security considerations.
4. Add it to the correct dependency section.
5. Commit the updated lockfile.
6. Verify the build and relevant tests.

Do not add multiple libraries that solve the same problem without a clear reason.

Avoid upgrading major framework versions during unrelated feature work.

---

## 17. Code Comments and Documentation

Comments should explain why code exists or why a non-obvious decision was made.

Good examples include:

- Why a database transaction is necessary
- Why a specific authorization check is required
- Why a cache is invalidated after a mutation
- Why a complex standings rule is implemented in a particular way

Avoid comments that simply repeat the code.

Keep README instructions and relevant Markdown documents synchronized with significant architectural changes.

---

## 18. Pull Request and Code Review Checklist

Before merging a feature, verify:

- [ ] The code follows existing architecture.
- [ ] TypeScript checks pass.
- [ ] Linting passes.
- [ ] Relevant tests pass.
- [ ] Validation occurs on the server.
- [ ] Authorization is enforced.
- [ ] RLS remains correct.
- [ ] Loading, empty, success, and error states are handled.
- [ ] Responsive behavior is acceptable.
- [ ] Accessibility has been considered.
- [ ] No secrets or sensitive user data are exposed.
- [ ] Documentation is updated where necessary.
- [ ] No unrelated files were modified unnecessarily.

---

## 19. Instructions for AI Coding Agents

Every AI coding agent working on Sport Organizer must:

1. Read the relevant project documents before implementing a major feature.
2. Inspect existing files and patterns before creating new files.
3. Follow the current project structure and naming conventions.
4. Implement complete, working features rather than placeholder UI.
5. Preserve existing functionality unless a change is explicitly required.
6. Avoid duplicating components, schemas, types, or Supabase clients.
7. Use TypeScript and avoid unnecessary `any` types.
8. Use Server Components by default and Client Components only when needed.
9. Validate user input on the server.
10. Verify authorization for every sensitive mutation.
11. Preserve RLS and database integrity.
12. Write or update tests for important logic.
13. Run available lint, type-check, test, and build commands.
14. Fix regressions caused by the implementation.
15. Never claim a test passed unless it was actually executed successfully.
16. Explain any manual setup or configuration that remains.
17. Report files changed, key decisions, test results, and known limitations.
18. Do not replace the project's architecture or install major dependencies without justification.

When a task is too large to implement safely in one step, divide it into small, testable changes.

---

## 20. Definition of Done

Code is ready for review when:

1. It follows the established project architecture.
2. It is readable and appropriately typed.
3. It handles expected failures.
4. It validates inputs and enforces permissions.
5. It respects the design system and accessibility requirements.
6. Relevant tests pass.
7. No known regression remains unresolved.
8. Documentation is updated where necessary.
9. The change is ready for deployment through the documented workflow.

**End of Coding Standards.**