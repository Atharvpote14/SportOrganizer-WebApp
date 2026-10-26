# 15 — Deployment Guide

## 1. Purpose

This document defines the deployment process for the Sport Organizer Web App, from local development to a production-ready application.

The goal is to deploy a secure, responsive, and reliable sports tournament management platform using:

- **Frontend and application hosting:** Vercel
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **File storage:** Supabase Storage
- **Source control:** GitHub
- **Framework:** Next.js App Router with TypeScript

Follow this document before releasing the application to real users.

---

## 2. Deployment Architecture

The production architecture should follow this structure:

```text
                         Users
                           |
                           v
                   Vercel Deployment
                           |
                   Next.js Application
                    /              \
                   v                v
            Supabase Auth     Server Actions /
                              Route Handlers
                                      |
                                      v
                              Supabase PostgreSQL
                                      |
                                      v
                               Supabase Storage
```

### Responsibilities

| Service | Responsibility |
|---|---|
| Vercel | Hosts the Next.js application |
| Supabase Auth | User registration, login, and sessions |
| Supabase PostgreSQL | Stores application data |
| Supabase Storage | Stores approved profile and tournament images |
| GitHub | Source control and deployment integration |

Never place database passwords or privileged Supabase keys in client-side code.

---

## 3. Prerequisites

Before deployment, ensure that:

- [ ] The project runs successfully on the local machine.
- [ ] The project is pushed to GitHub.
- [ ] TypeScript checks pass.
- [ ] ESLint checks pass.
- [ ] Unit and integration tests pass.
- [ ] Production build succeeds.
- [ ] Supabase database schema and migrations are ready.
- [ ] Row Level Security (RLS) is enabled on applicable tables.
- [ ] Authentication redirects use the correct production URLs.
- [ ] No secrets are committed to GitHub.
- [ ] `.env.example` documents all required environment variables.

Do not deploy an incomplete application simply because the homepage renders successfully.

---

## 4. Prepare the Project for Production

### 4.1 Verify the project structure

The project should contain the required application files, including:

```text
sport-organizer/
├── docs/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   └── types/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

The actual structure may vary slightly according to the implementation.

### 4.2 Verify package scripts

Ensure `package.json` contains suitable scripts for the project's installed tools.

Example:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Adjust the scripts to match the installed ESLint, Vitest, and Playwright configurations. Do not add a script until its underlying tool is configured.

### 4.3 Run local verification

Run the following commands from the project root:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

Run end-to-end tests separately when the required test environment is available:

```bash
npm run test:e2e
```

Resolve blocking errors before deploying.

Use the package manager and lockfile already established by the project. Do not switch package managers unnecessarily.

---

## 5. Configure Supabase for Production

### 5.1 Create or select the production project

1. Open the Supabase Dashboard.
2. Create a dedicated production project or select the approved production project.
3. Choose the appropriate region.
4. Set a strong database password and store it securely.
5. Keep development and production data separate.
6. Configure backups and monitoring appropriate to the project's expected usage.

Do not use a development database containing test accounts as the production database without reviewing and cleaning its data.

### 5.2 Configure environment variables

Obtain the project URL and publishable key from the Supabase project's API settings.

The Next.js application should use:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Replace the example values with the real production values.

If a trusted server-side administrative task genuinely requires a privileged key, configure it separately:

```env
SUPABASE_SECRET_KEY=YOUR_SERVER_ONLY_SECRET_KEY
```

**Security rules:**

- `NEXT_PUBLIC_` variables are exposed to browser-side code.
- Never place secret keys in `NEXT_PUBLIC_` variables.
- Never commit real environment files containing secrets.
- Do not expose privileged keys through API responses, logs, or frontend bundles.
- Use the publishable key with correctly configured RLS for normal application operations.
- Prefer migrations and narrowly scoped database permissions over routine privileged runtime operations.

### 5.3 Apply database migrations

Keep all production database changes in version-controlled migration files.

If the project uses the Supabase CLI and its migrations are configured, apply reviewed migrations using the project's established workflow. For example:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Review the planned database changes and confirm that the linked project is the intended production project before applying them.

Do not run destructive database commands against production without a verified backup and an approved recovery plan.

### 5.4 Verify database security

Before launch, confirm:

- [ ] RLS is enabled on tables exposed through the Supabase API.
- [ ] Guests can only access intended public information.
- [ ] Players can modify only their own permitted profile fields.
- [ ] Team captains can manage only authorized teams.
- [ ] Organizers can manage only tournaments within their permissions.
- [ ] Organization administrators are restricted to their organizations.
- [ ] Privileged platform actions require server-side authorization.
- [ ] Users cannot approve their own registrations unless explicitly allowed.
- [ ] Users cannot alter published match results without authorization.
- [ ] Audit logs cannot be modified by ordinary users.

Test the policies using different authenticated accounts, not only an administrator account.

### 5.5 Configure Supabase Auth

In the Supabase Dashboard, review the authentication URL configuration.

Set the production site URL to the deployed application's canonical URL, for example:

```text
https://your-domain.com
```

Add the necessary redirect URLs for:

- Email verification
- Password recovery
- Authentication callbacks
- OAuth callbacks, if OAuth is implemented
- Local development, where required

Keep redirect URLs as specific as practical. Avoid unrestricted redirects to arbitrary destinations.

If Google sign-in is enabled, also configure the required OAuth credentials and authorized callback URLs.

### 5.6 Configure Storage

Create the storage buckets required by the application, such as:

- `avatars`
- `tournament-assets`
- `team-logos`

Use public buckets only for files intended to be publicly accessible. Private files should use appropriate authorization policies and signed URLs where necessary.

Validate file type, file size, permissions, and upload paths on the server. Do not rely on file extensions alone.

---

## 6. Deploy to Vercel

### 6.1 Import the GitHub repository

1. Open the Vercel Dashboard.
2. Choose **Add New → Project**.
3. Import the Sport Organizer GitHub repository.
4. Select the correct repository and production branch.
5. Verify the detected framework is Next.js.
6. Review the build settings.

For a standard Next.js project, Vercel generally detects the correct build configuration automatically.

Do not override the build command or output directory unless the project specifically requires it.

### 6.2 Add environment variables

In the Vercel project settings, open **Environment Variables**.

Add the required variables:

| Variable | Environments |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development as needed |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production, Preview, Development as needed |
| `SUPABASE_SECRET_KEY` | Server-side only, if genuinely required |

Use the correct values for each environment. Preview deployments should preferably use a separate staging Supabase project.

Do not put secret keys in client-side environment variables.

After changing environment variables, trigger a new deployment so the updated configuration is applied.

### 6.3 Configure the build

Verify that:

- The package manager is detected correctly.
- The project's lockfile is committed.
- Required dependencies are listed in the correct dependency sections.
- The production build completes without errors.
- TypeScript errors are resolved.
- Required server-side environment variables are present.
- No build step depends on local files that are absent from GitHub.

### 6.4 Deploy

Start the deployment from the Vercel Dashboard.

After the build completes:

1. Open the generated deployment URL.
2. Confirm the homepage loads.
3. Test navigation and page refreshes.
4. Test sign-up and login.
5. Test protected dashboard routes.
6. Check browser console and server logs.
7. Test key tournament workflows.

A successful deployment does not automatically mean the application is fully production-ready.

---

## 7. Domain Configuration

### 7.1 Add a custom domain

If a custom domain is available:

1. Open the Vercel project.
2. Go to **Settings → Domains**.
3. Add the domain.
4. Follow Vercel's instructions to configure the required DNS records.
5. Wait for DNS verification and HTTPS provisioning.
6. Choose a canonical domain, such as `www.your-domain.com` or `your-domain.com`.
7. Configure the other hostname to redirect to the canonical version where appropriate.

Do not copy generic DNS values from an unrelated guide. Use the exact values Vercel provides for the project.

### 7.2 Update authentication URLs

Once the canonical domain is active:

- Update the Supabase Site URL.
- Add the required authentication redirect URLs.
- Update OAuth provider settings, if applicable.
- Verify password reset and email verification links.
- Confirm generated links use the correct HTTPS domain.

### 7.3 Verify HTTPS

Confirm that:

- The production domain uses HTTPS.
- HTTP requests redirect to HTTPS.
- Authentication redirects use HTTPS.
- No insecure mixed-content resources are loaded.

---

## 8. Development, Preview, and Production Environments

Maintain clear separation between environments.

| Environment | Purpose | Database |
|---|---|---|
| Local | Development and debugging | Local or development Supabase |
| Preview | Testing proposed changes | Staging Supabase |
| Production | Real users and live tournaments | Production Supabase |

### Rules

1. Do not use production accounts for automated test runs.
2. Do not run seed scripts that overwrite production data.
3. Keep environment-specific secrets separate.
4. Review preview deployments before merging changes.
5. Use database migrations for schema changes.
6. Test authentication and RLS in staging before production changes.
7. Restrict access to production configuration.

For a student or small-team project, staging may initially use a separate Supabase project with a reduced dataset. Production data should remain isolated.

---

## 9. CI/CD and GitHub Workflow

Use a predictable development workflow:

```text
Feature Branch
      |
      v
Local Tests
      |
      v
GitHub Pull Request
      |
      v
Automated Checks + Preview Deployment
      |
      v
Code Review and Approval
      |
      v
Merge to Production Branch
      |
      v
Production Deployment
      |
      v
Post-Deployment Verification
```

### Recommended rules

- Keep the production branch protected when the repository supports it.
- Require successful checks before merging where practical.
- Review preview deployments before release.
- Do not commit `.env.local` or other real secret files.
- Use small, reviewable changes.
- Keep database migrations synchronized with application changes.
- Maintain a rollback plan for releases that introduce regressions.

Automated CI checks should run linting, type checking, and applicable tests. Ensure the commands match the scripts configured in `package.json`.

---

## 10. Production Security Checklist

Before making the application public, verify the following.

### Application security

- [ ] Protected routes require authentication.
- [ ] Server Actions and Route Handlers verify authorization.
- [ ] Server-side validation uses trusted schemas.
- [ ] RLS policies enforce database access restrictions.
- [ ] Privileged keys remain server-side.
- [ ] Secrets are absent from the repository and browser bundle.
- [ ] Authentication redirect URLs are restricted.
- [ ] File uploads enforce size and type limits.
- [ ] User-generated content is safely rendered.
- [ ] Rate limiting or abuse controls protect sensitive operations where appropriate.

### Competition integrity

- [ ] Tournament capacity is enforced on the server.
- [ ] Duplicate active registrations are prevented by database constraints.
- [ ] Only authorized users can approve registrations.
- [ ] Only authorized users can schedule matches.
- [ ] Match results are validated before being saved.
- [ ] Standings are calculated from trusted match results.
- [ ] Sensitive administrative actions are logged.

### Privacy and reliability

- [ ] User data is not unintentionally public.
- [ ] Error responses do not expose internal details.
- [ ] Production logs do not contain passwords or authentication tokens.
- [ ] Backup and recovery procedures are understood.
- [ ] Account deletion and data-retention requirements are addressed where applicable.

---

## 11. Post-Deployment Smoke Tests

Run these tests against the deployed production application using approved test accounts and safe test data.

| Test | Expected result |
|---|---|
| Open homepage | Page loads without a server error |
| Open tournament discovery | Public tournaments appear correctly |
| Register a new account | Account creation follows the configured verification flow |
| Log in | User reaches the appropriate page |
| Open a protected route while logged out | User is redirected or shown an authorization response |
| Create a team | Authorized user can create a valid team |
| Register a team for a tournament | Registration follows eligibility and capacity rules |
| Attempt duplicate registration | Duplicate active registration is rejected |
| Submit an invalid form | Helpful validation messages appear |
| Open a match | Correct schedule and status are displayed |
| Submit a result as an unauthorized user | The action is denied |
| Open standings | Standings match the saved match results |
| Upload an image | Valid uploads succeed and unauthorized uploads fail |
| Refresh a nested route | The page loads correctly |
| Sign out | Protected pages no longer expose authenticated data |

Avoid creating unnecessary production records during testing. Use dedicated test accounts and remove temporary test data through an authorized, documented process.

---

## 12. Performance and Reliability

Before launch, inspect the application using browser developer tools and available Vercel monitoring.

Verify that:

- Images use appropriate formats and dimensions.
- Pages avoid unnecessary client-side JavaScript.
- Database queries retrieve only required fields.
- Large result sets use pagination.
- Repeated database calls are minimized.
- Search and filtering remain responsive.
- Loading states prevent confusing user experiences.
- Errors are logged without exposing sensitive information.
- Rate limits and resource usage are monitored where available.

Do not cache user-specific or permission-sensitive responses publicly. Review caching behavior before enabling shared caching for authenticated pages.

Set resource limits and monitoring appropriate to the expected traffic and hosting plan.

---

## 13. Rollback and Recovery

If a deployment introduces a serious regression:

1. Identify the affected release and symptoms.
2. Use Vercel's deployment controls to restore a known-good application deployment when appropriate.
3. Check server logs and recent code changes.
4. Verify whether a database migration also contributed to the issue.
5. Avoid assuming that rolling back the frontend automatically reverses database changes.
6. Restore data only through a reviewed recovery procedure if needed.
7. Fix the issue, test it in preview or staging, and redeploy.
8. Record the cause and preventive action.

**Important:** Database migrations may be irreversible or incompatible with an older application version. Prefer backward-compatible schema changes and separately reviewed rollback migrations.

---

## 14. Common Deployment Problems

### Build fails on Vercel

Check:

- Missing dependencies
- TypeScript errors
- Incorrect import paths or filename capitalization
- Missing environment variables
- Invalid build scripts
- Differences between local and production Node.js versions

### Supabase connection fails

Check:

- Project URL spelling
- Correct publishable key
- Vercel environment-variable scope
- Whether a new deployment was created after changing variables
- Supabase project availability
- Server and browser Supabase client configuration

Never resolve a connection issue by exposing a privileged key to the browser.

### Login works locally but fails in production

Check:

- Supabase Site URL
- Allowed redirect URLs
- OAuth callback URLs, if used
- Cookie and SSR session configuration
- HTTPS and canonical domain
- Whether the authentication callback correctly exchanges the authorization code

### Database operations return permission errors

Check:

- RLS policies
- User authentication state
- Ownership and organization membership
- Role permissions
- Whether the operation is executed through the intended server or browser client

Do not disable RLS as a quick fix.

### Images do not load

Check:

- Storage bucket name
- Public versus private bucket configuration
- Storage policies
- Signed URL expiration
- Image URL generation
- Next.js image configuration, if using `next/image`

### A nested page returns an error after refresh

Check the route implementation, deployment logs, and any middleware or proxy configuration. Confirm that the route works when opened directly, not only when navigating from the homepage.

---

## 15. Final Release Checklist

### Before deployment

- [ ] Code is committed and pushed to GitHub.
- [ ] Linting and type checking pass.
- [ ] Tests pass.
- [ ] Production build passes.
- [ ] Environment variables are configured.
- [ ] Database migrations have been reviewed.
- [ ] RLS and authorization policies have been tested.
- [ ] Authentication redirects are configured.

### During deployment

- [ ] The correct repository and production branch are selected.
- [ ] Vercel environment variables are correct.
- [ ] The deployment completes successfully.
- [ ] HTTPS and domain configuration are valid.

### After deployment

- [ ] Homepage and important routes work.
- [ ] Authentication works.
- [ ] Team and tournament workflows work.
- [ ] Match results and standings are correct.
- [ ] Unauthorized operations are denied.
- [ ] Logs show no unresolved critical errors.
- [ ] Backup and rollback procedures are understood.

---

## 16. Definition of Done

Deployment is considered complete when:

1. The application is available through its approved production URL.
2. The production database is configured and migrations are applied.
3. Authentication and authorization work correctly.
4. RLS policies protect application data.
5. Core tournament workflows pass smoke tests.
6. Environment secrets are protected.
7. The application has a documented rollback and recovery approach.
8. No known critical security or functionality issue remains unresolved.

---

## 17. Instructions for AI Coding Agents

When implementing deployment-related changes:

1. Inspect the existing project before modifying configuration.
2. Preserve the current framework, package manager, and lockfile.
3. Never invent real credentials or domain names.
4. Never commit secrets or expose privileged keys.
5. Do not disable RLS to bypass authorization problems.
6. Keep deployment configuration compatible with the existing Next.js version.
7. Do not run destructive commands against production without explicit approval.
8. Verify build commands and scripts against the actual project.
9. Document any manual dashboard configuration that cannot be completed through code.
10. Report deployment blockers clearly and distinguish verified steps from steps that still require manual configuration.

**End of Deployment Guide.**