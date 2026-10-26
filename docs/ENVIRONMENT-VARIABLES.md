# 16 — Environment Variables

## 1. Purpose

This document defines the environment variables required to configure, run, test, and deploy the Sport Organizer Web App.

The application uses:

- Next.js App Router
- React and TypeScript
- Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage
- Vercel hosting

Environment variables allow configuration to change without modifying application source code.

**Important:** Never commit real credentials, passwords, access tokens, or secret keys to GitHub.

---

## 2. Environment Variable Principles

Follow these rules throughout the project:

1. Store local development values in `.env.local`.
2. Commit `.env.example` with placeholder values only.
3. Configure production values in Vercel project settings.
4. Use separate Supabase projects for development, staging, and production where practical.
5. Prefix a variable with `NEXT_PUBLIC_` only when its value is intentionally safe to expose to the browser.
6. Keep privileged credentials exclusively on the server.
7. Validate required environment variables during application initialization.
8. Never print secret values in application logs or error messages.
9. Restart the development server after changing local environment variables.
10. Redeploy the application after changing Vercel environment variables.

A variable's name does not make it secret. Its value and intended use determine how it must be protected.

---

## 3. Required Environment Variables

The minimum required configuration is:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Public client key used to access Supabase APIs under configured security policies |

Example format:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholders with the actual values from the Supabase Dashboard.

These variables are required by the standard application setup described in the project documentation.

The publishable key is designed for client-side use. **It does not replace database security:** RLS policies and server-side authorization must still protect application data.

---

## 4. Optional Server-Only Environment Variables

Add an optional variable only when the implemented feature requires it.

| Variable | Purpose | Security |
|---|---|---|
| `SUPABASE_SECRET_KEY` | Privileged server-side Supabase operations, if necessary | Secret; server only |
| `SUPABASE_DB_PASSWORD` | Direct database tooling, only if the chosen workflow requires it | Secret; never expose to the browser |
| `CRON_SECRET` | Authenticates a protected scheduled endpoint, if implemented | Secret; server only |
| `SENTRY_DSN` | Error monitoring, if Sentry is integrated | Follow the provider's DSN and privacy guidance |
| `SENTRY_AUTH_TOKEN` | Sentry build or source-map upload operations, if configured | Secret; build/server tooling only |

### Rules for optional variables

- Do not add unused variables simply because they appear in this document.
- Do not use `SUPABASE_SECRET_KEY` for ordinary browser queries.
- Never expose `SUPABASE_DB_PASSWORD`, `CRON_SECRET`, or `SENTRY_AUTH_TOKEN` through client components.
- Do not create a custom authentication secret when Supabase Auth already provides the required session handling.
- Configure optional integrations only after their code and provider settings are implemented.

If the application does not need a privileged Supabase client, do not configure a Supabase secret key.

---

## 5. The `.env.example` File

Create `.env.example` in the project root.

This file documents the required configuration without containing real secrets.

Recommended contents:

```env
# =========================================
# SPORT ORGANIZER — ENVIRONMENT TEMPLATE
# =========================================

# Supabase project configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

# Optional: server-only privileged operations
# SUPABASE_SECRET_KEY=

# Optional: direct database tooling
# SUPABASE_DB_PASSWORD=

# Optional: protected scheduled jobs
# CRON_SECRET=

# Optional: error monitoring
# SENTRY_DSN=
# SENTRY_AUTH_TOKEN=
```

### Important

1. Keep `.env.example` synchronized with the actual configuration.
2. Use placeholders instead of real credentials.
3. Do not copy production values into the example file.
4. Remove variables that the project does not use if maintaining a minimal template is preferable.
5. Update the README whenever a new required variable is introduced.

---

## 6. The `.env.local` File

For local development, create `.env.local` in the project root.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_DEV_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_DEV_PUBLISHABLE_KEY
```

Use credentials from the development Supabase project.

### Local setup procedure

1. Open the project root in your code editor.
2. Create `.env.local`.
3. Add the required environment variables.
4. Save the file.
5. Restart the Next.js development server.
6. Open the application and verify that Supabase requests succeed.

Run the application with:

```bash
npm run dev
```

Do not share `.env.local` in screenshots, public repositories, or support messages containing real credentials.

---

## 7. Configure `.gitignore`

Ensure `.gitignore` prevents real environment files from being committed.

Example:

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Local environment files
.env
.env.*
!.env.example

# Build output
dist/
build/

# Logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Local tooling
.DS_Store
.vercel/
```

Review this configuration against the project's framework and deployment workflow before applying it.

The intended behavior is:

- `.env.local` remains untracked.
- `.env.production` and other real environment files remain untracked.
- `.env.example` is allowed in Git.
- No real credentials are committed.

If a secret was already committed, removing the file in a later commit is not sufficient. Revoke or rotate the exposed credential and review the repository history.

---

## 8. Accessing Environment Variables in Next.js

### 8.1 Server-side access

Server Components, Server Actions, Route Handlers, and server-side utility modules can access environment variables through `process.env`, subject to the Next.js execution environment.

Example:

```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

For privileged variables, access them only in server-only modules.

When a module must never be imported into browser code, use the `server-only` package where appropriate:

```ts
import "server-only";

const secretKey = process.env.SUPABASE_SECRET_KEY;
```

Never return a secret value to the browser as part of a response.

### 8.2 Client-side access

Client Components can access variables intentionally exposed through the `NEXT_PUBLIC_` prefix.

Example:

```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

Next.js may inline public environment values into the browser bundle at build time. Treat these values as public.

### 8.3 Never do this

```env
NEXT_PUBLIC_SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
```

This would incorrectly mark a privileged credential as public.

Also avoid:

```ts
"use client";

const secret = process.env.SUPABASE_SECRET_KEY;
```

Do not rely on server-only secrets being accessible in client code. Move privileged operations to a properly authorized server-side function.

---

## 9. Validate Environment Variables

Fail early when required configuration is missing or invalid.

Create a server-side validation module such as:

`src/lib/env.ts`

Example:

```ts
import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
});

export const serverEnv = serverEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL,

  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,

  SUPABASE_SECRET_KEY:
    process.env.SUPABASE_SECRET_KEY,
});
```

This example validates the variables used by server-side code. Adapt it to the project's actual requirements.

### Validation rules

- Required variables must be present.
- URLs must be valid URLs.
- Optional variables should remain optional until a feature requires them.
- Do not log the full environment object.
- Do not include secret values in validation errors.
- Keep browser-safe configuration separate from server-only configuration where that improves clarity.

If a client-side validation module is needed, create a separate module containing only intentionally public variables. Never import the server-only module into a Client Component.

---

## 10. Supabase Client Configuration

Keep Supabase client initialization centralized rather than repeating configuration throughout the application.

A typical project may have:

```text
src/
└── lib/
    └── supabase/
        ├── client.ts
        ├── server.ts
        └── proxy.ts
```

Use the actual project conventions and installed version of `@supabase/ssr`.

### Browser client

- Uses the Supabase project URL.
- Uses the publishable key.
- Supports browser-side operations allowed by RLS.
- Must not use a privileged secret key.

### Server client

- Uses the project's SSR session and cookie configuration.
- Must respect the user's authenticated identity and permissions.
- Should use the publishable key for normal user-scoped operations.
- Must not bypass authorization checks.

### Privileged administrative client

If one is genuinely required:

- Keep it in a separate server-only module.
- Use the secret key only in trusted server-side operations.
- Validate the requested operation and the caller's permissions.
- Do not assume that authentication alone grants administrative permission.
- Never expose the client or its credentials to browser code.

---

## 11. Vercel Environment Configuration

Configure variables in the Vercel Dashboard under the project's environment variable settings.

### Production

Use:

- Production Supabase URL
- Production publishable key
- Optional production-only server secrets

### Preview

Prefer a separate staging Supabase project.

Preview deployments may be accessible through public URLs, so do not populate them with production credentials unnecessarily.

### Development

Use development credentials through local environment configuration or the relevant Vercel development workflow.

### Configuration checklist

- [ ] Required variables exist in the correct environment.
- [ ] Production and staging values are not mixed.
- [ ] Secret variables are not exposed through public prefixes.
- [ ] Preview deployments do not accidentally access production data.
- [ ] New environment values are applied through a fresh deployment.
- [ ] No real credentials appear in build logs.

**Note:** Environment variables may be captured during the build or accessed at runtime depending on how they are used. Public Next.js variables are generally inlined during the build, so a new build is necessary when their values change.

---

## 12. Environment-Specific Configuration

Maintain separate configuration for local development, preview, and production.

| Setting | Local | Preview | Production |
|---|---|---|---|
| Supabase project | Development | Staging | Production |
| Database data | Test data | Staging data | Real application data |
| Domain | Localhost | Preview URL | Approved production domain |
| Authentication redirects | Local callback URLs | Preview callback URLs as needed | Production callback URLs |
| Debug logging | Development detail | Limited diagnostics | Minimal, sanitized |
| Privileged keys | Usually unnecessary | Only when required | Only when required |

Do not depend on hardcoded production URLs throughout the codebase. Centralize public URL configuration when the application needs a canonical origin for emails, callbacks, metadata, or generated links.

For example, if the application implements an application URL variable, define and validate it consistently:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, replace the value with the canonical HTTPS domain and configure it in the appropriate Vercel environment.

Only add this variable if the application actually uses it.

---

## 13. Troubleshooting

### Error: Missing Supabase URL

Possible causes:

- `.env.local` does not exist.
- The variable name is incorrect.
- The development server was not restarted.
- Vercel does not have the variable configured for the deployment environment.

### Error: Supabase authentication fails

Check:

- The project URL and publishable key belong to the same project.
- Authentication redirect URLs are configured.
- The cookie and SSR session implementation is correct.
- The deployment uses the expected environment variables.

### Error: Database permission denied

Check RLS policies, authenticated identity, membership records, and role authorization.

Do not solve permission errors by exposing a privileged key or disabling RLS.

### Error: Secret variable is undefined

Check that:

- The variable is configured in the correct environment.
- It is being accessed only on the server.
- The code is not running in a client-side bundle.
- A new deployment was created after configuration changes.

### Environment changes do not take effect

1. Verify the variable name and value.
2. Restart the local development server or create a new deployment.
3. Check which environment the running deployment uses.
4. Inspect sanitized logs without printing secret values.

---

## 14. Security Checklist

Before production release:

- [ ] `.env.local` is ignored by Git.
- [ ] `.env.example` contains placeholders only.
- [ ] No credentials are committed to the repository.
- [ ] Public variables contain only browser-safe values.
- [ ] Privileged keys are server-only.
- [ ] Required variables are validated.
- [ ] Logs never print secrets.
- [ ] Production and staging credentials are separate.
- [ ] Supabase RLS policies have been tested.
- [ ] Server-side authorization protects sensitive operations.
- [ ] Exposed credentials are rotated immediately.
- [ ] Deployment configuration is documented.

---

## 15. Instructions for AI Coding Agents

When adding or changing environment variables:

1. Inspect the existing environment files and client initialization first.
2. Reuse existing variables whenever appropriate.
3. Update `.env.example` when configuration requirements change.
4. Update this document if a new required variable is introduced.
5. Never invent real credentials.
6. Never request that users paste privileged production secrets into source code.
7. Never add privileged credentials to a `NEXT_PUBLIC_` variable.
8. Keep server-only code separate from browser modules.
9. Validate required configuration without logging secret values.
10. Do not make optional integrations mandatory unless the feature requires them.
11. Preserve the current Next.js and Supabase SSR implementation conventions.
12. Explain which values the user must configure manually in Supabase or Vercel.

---

## 16. Definition of Done

Environment configuration is complete when:

1. Local development works using `.env.local`.
2. `.env.example` documents the required variables.
3. Real environment files are excluded from Git.
4. Supabase clients use the correct configuration.
5. Required environment values are validated.
6. Production and preview deployments use the correct project credentials.
7. Privileged keys are never exposed to browser code.
8. The application builds and runs successfully in its target environment.

**End of Environment Variables Guide.**