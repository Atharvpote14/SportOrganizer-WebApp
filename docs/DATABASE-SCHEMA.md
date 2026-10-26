# Sport Organizer Web App — Database Schema

## 1. Document Information

- **Project:** Sport Organizer
- **Document:** Database Schema Specification
- **Version:** 1.0
- **Database:** Supabase PostgreSQL
- **Primary Key Strategy:** UUID
- **Authentication:** Supabase Auth
- **Security:** Row Level Security (RLS)
- **Migration Directory:** `supabase/migrations/`
- **Related Documents:** `01-PROJECT-OVERVIEW.md`, `02-PRD.md`, `03-TECH-STACK.md`, `05-AUTHENTICATION-AND-AUTHORIZATION.md`

---

## 2. Database Design Objectives

The database must:

1. Store users, organizations, teams, tournaments, registrations, and matches.
2. Maintain correct relationships between all entities.
3. Support multiple colleges, clubs, and independent organizers.
4. Enforce roster limits and registration rules.
5. Prevent duplicate team registrations.
6. Maintain match scores and result history.
7. Support different sports and tournament formats.
8. Protect private information using RLS.
9. Support concurrent operations without exceeding tournament capacity.
10. Allow future features without requiring a complete database redesign.

## 3. Database Conventions

### 3.1 Primary Keys

Use UUID primary keys for application entities.

```sql
id uuid primary key default gen_random_uuid()
```

For user profiles, use the Supabase Auth user ID as the primary key.

### 3.2 Timestamps

Use `timestamptz` for timestamps.

Common fields:

```sql
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

The `updated_at` field must be maintained by a database trigger or an explicitly reliable update mechanism.

### 3.3 Naming Conventions

- Use lowercase `snake_case` for tables and columns.
- Use plural names for tables.
- Use descriptive foreign-key names.
- Store dates and times using appropriate PostgreSQL types.
- Store money as integer minor units when monetary functionality is introduced.
- Avoid reserved SQL keywords as column names.
- Use foreign keys and constraints instead of relying solely on application validation.

### 3.4 Data Integrity

The database must enforce important invariants wherever practical.

Examples:
- Unique team membership.
- Valid tournament date ranges.
- Nonnegative scores.
- Unique active registrations for the same team and tournament.
- Valid match participants.
- Valid foreign-key references.

Rules involving multiple rows, such as tournament capacity and concurrent registration, must be enforced transactionally.

---

## 4. Entity Relationship Overview

The main relationships are:

```text
auth.users
    |
    | 1:1
    v
profiles

organizations ---- organization_members
      |
      +---- teams ---- team_members ---- profiles
      |
      +---- tournaments
                    |
                    +---- tournament_registrations ---- teams
                    |
                    +---- matches ---- participating teams
                    |        |
                    |        +---- match_results
                    |
                    +---- tournament_standings
                             (derived data)

profiles ---- notifications
profiles ---- audit_logs (actor)

tournaments ---- tournament_announcements
```

Some relationships are optional. For example, an independent organizer may create a tournament without belonging to a college organization.

The application must distinguish between team membership, organization membership, and tournament participation. They represent different permissions and must not be merged into one table.

---

## 5. Table Specifications

### 5.1 `profiles`

Stores public and permitted application profile information for authenticated users.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key, references `auth.users.id` |
| `full_name` | TEXT | Required |
| `avatar_url` | TEXT | Nullable |
| `phone` | TEXT | Nullable, private |
| `bio` | TEXT | Nullable |
| `created_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Rules:
- Create profiles through a secure signup workflow or database trigger.
- The profile ID must match the authenticated user's ID.
- Users may update only permitted profile fields.
- Users must not be allowed to change their role or administrative permissions through profile updates.
- Do not expose private phone numbers in public profile queries.

### 5.2 `organizations`

Represents colleges, sports clubs, and other participating institutions.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Required |
| `slug` | TEXT | Unique |
| `description` | TEXT | Nullable |
| `logo_url` | TEXT | Nullable |
| `organization_type` | TEXT | Required |
| `city` | TEXT | Nullable |
| `state` | TEXT | Nullable |
| `country` | TEXT | Nullable |
| `created_by` | UUID | References `profiles.id` |
| `created_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Suggested organization types:
- `college`
- `sports_club`
- `other`

Rules:
- Organization names and slugs must be validated.
- Organization management requires explicit membership permissions.
- Creating an organization must establish an authorized owner or administrator.
- A user's organization membership does not automatically grant tournament or team management permissions.

### 5.3 `organization_members`

Connects users to organizations.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `organization_id` | UUID | References `organizations.id` |
| `user_id` | UUID | References `profiles.id` |
| `role` | TEXT | Required |
| `status` | TEXT | Required |
| `joined_at` | TIMESTAMPTZ | Nullable |
| `created_at` | TIMESTAMPTZ | Required |

Suggested roles:
- `owner`
- `admin`
- `coordinator`
- `member`

Suggested statuses:
- `pending`
- `active`
- `suspended`

Constraints:
- Unique `(organization_id, user_id)`.
- Membership roles must be validated.
- Only authorized organization administrators can assign privileged membership roles.
- A user cannot promote themselves by updating their own membership row.

### 5.4 `sports`

Stores supported sports and their configuration.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Required |
| `slug` | TEXT | Unique |
| `description` | TEXT | Nullable |
| `icon_name` | TEXT | Nullable |
| `scoring_type` | TEXT | Required |
| `is_active` | BOOLEAN | Required, default true |
| `created_at` | TIMESTAMPTZ | Required |

Examples:
- Football
- Cricket
- Basketball
- Volleyball
- Badminton
- Table tennis
- Chess

The `scoring_type` identifies the supported scoring model. Detailed sport-specific rules must be implemented and documented separately.

Do not assume every sport uses goals, sets, or points in the same way.

### 5.5 `teams`

Stores team information.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Required |
| `slug` | TEXT | Nullable |
| `description` | TEXT | Nullable |
| `logo_url` | TEXT | Nullable |
| `sport_id` | UUID | References `sports.id` |
| `organization_id` | UUID | Nullable, references `organizations.id` |
| `created_by` | UUID | References `profiles.id` |
| `is_active` | BOOLEAN | Required, default true |
| `created_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Rules:
- A team belongs to one sport.
- An organization association is optional.
- Team creation does not automatically register the team for a tournament.
- Only authorized team managers can update team details.
- Team deactivation must preserve historical tournament records.

### 5.6 `team_members`

Represents membership of users in teams.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `team_id` | UUID | References `teams.id` |
| `user_id` | UUID | References `profiles.id` |
| `role` | TEXT | Required |
| `status` | TEXT | Required |
| `jersey_number` | INTEGER | Nullable |
| `joined_at` | TIMESTAMPTZ | Nullable |
| `created_at` | TIMESTAMPTZ | Required |

Suggested roles:
- `captain`
- `vice_captain`
- `player`
- `manager`

Suggested statuses:
- `pending`
- `active`
- `removed`

Constraints:
- Unique `(team_id, user_id)`.
- Jersey numbers must be nonnegative where supplied.
- Only authorized team managers can modify membership.
- The application must define whether one user may actively play for multiple teams in the same sport.
- Removing a member must not delete the user account.

Team roster limits may differ by sport and tournament. The final validation must consider the applicable tournament's rules, not just the team's general membership count.

### 5.7 `tournaments`

Stores tournament details and lifecycle information.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Required |
| `slug` | TEXT | Unique |
| `description` | TEXT | Nullable |
| `sport_id` | UUID | References `sports.id` |
| `organization_id` | UUID | Nullable, references `organizations.id` |
| `created_by` | UUID | References `profiles.id` |
| `banner_url` | TEXT | Nullable |
| `venue_name` | TEXT | Nullable |
| `venue_address` | TEXT | Nullable |
| `city` | TEXT | Nullable |
| `starts_at` | TIMESTAMPTZ | Required |
| `ends_at` | TIMESTAMPTZ | Required |
| `registration_deadline` | TIMESTAMPTZ | Required |
| `format` | TEXT | Required |
| `status` | TEXT | Required |
| `max_teams` | INTEGER | Required |
| `min_roster_size` | INTEGER | Required |
| `max_roster_size` | INTEGER | Required |
| `rules` | JSONB | Nullable |
| `published_at` | TIMESTAMPTZ | Nullable |
| `created_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Supported initial formats:
- `single_elimination`
- `round_robin`
- `group_stage`

Suggested lifecycle statuses:
- `draft`
- `published`
- `registration_closed`
- `in_progress`
- `completed`
- `cancelled`

Constraints:
- `ends_at` must be later than `starts_at`.
- `max_teams` must be positive.
- `min_roster_size` must be positive.
- `max_roster_size` must be greater than or equal to `min_roster_size`.
- The registration deadline must satisfy the approved scheduling rules.
- The selected sport must be active when required.
- Only authorized organizers may modify tournament settings.
- Draft tournaments must not be publicly visible.
- A tournament's lifecycle must follow permitted state transitions.

The `rules` JSONB field may hold sport-specific settings, but core relationships and frequently queried attributes must remain in proper columns.

### 5.8 `tournament_registrations`

Records team applications to participate in tournaments.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `tournament_id` | UUID | References `tournaments.id` |
| `team_id` | UUID | References `teams.id` |
| `submitted_by` | UUID | References `profiles.id` |
| `status` | TEXT | Required |
| `notes` | TEXT | Nullable |
| `reviewed_by` | UUID | Nullable, references `profiles.id` |
| `reviewed_at` | TIMESTAMPTZ | Nullable |
| `rejection_reason` | TEXT | Nullable |
| `created_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Suggested statuses:
- `pending`
- `approved`
- `rejected`
- `withdrawn`
- `cancelled`

Rules:
- The team sport must match the tournament sport.
- The submitter must be authorized to manage the team.
- The tournament must accept registrations.
- Only authorized tournament organizers can approve or reject applications.
- The reviewer's identity and review timestamp must be recorded.
- Rejection reasons must not be exposed to unauthorized users.
- A team must not have duplicate active registrations for the same tournament.

**Important uniqueness rule:** A normal unique constraint on `(tournament_id, team_id)` would prevent a team from applying again after a withdrawal. The intended design should allow a new application after a permitted withdrawal while preventing duplicate active applications.

One approach is a partial unique index:

```sql
CREATE UNIQUE INDEX unique_active_tournament_registration
ON public.tournament_registrations (tournament_id, team_id)
WHERE status IN ('pending', 'approved');
```

The final implementation must validate registration transitions so that rejected or withdrawn applications can be resubmitted only when permitted.

### 5.9 `matches`

Stores tournament fixtures.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `tournament_id` | UUID | References `tournaments.id` |
| `home_team_id` | UUID | References `teams.id` |
| `away_team_id` | UUID | References `teams.id` |
| `round_name` | TEXT | Nullable |
| `round_number` | INTEGER | Nullable |
| `match_number` | INTEGER | Nullable |
| `scheduled_at` | TIMESTAMPTZ | Required |
| `venue_name` | TEXT | Nullable |
| `status` | TEXT | Required |
| `winner_team_id` | UUID | Nullable, references `teams.id` |
| `created_by` | UUID | References `profiles.id` |
| `created_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Suggested statuses:
- `scheduled`
- `in_progress`
- `completed`
- `postponed`
- `cancelled`

Constraints and rules:
- `home_team_id` and `away_team_id` must differ.
- Both teams must be eligible for the tournament.
- Match participants must be approved tournament participants when the format requires approval.
- The winner must be one of the participants.
- A winner must not be assigned to an unfinished or cancelled match.
- Match scheduling and status transitions must be validated.
- Duplicate fixtures must be prevented where required by the tournament format.

A database constraint can prevent a team from playing itself. More complex rules, including participant eligibility and overlapping schedules, require transactional validation.

### 5.10 `match_results`

Stores official score and result information.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `match_id` | UUID | Unique, references `matches.id` |
| `home_score` | INTEGER | Required |
| `away_score` | INTEGER | Required |
| `result_summary` | TEXT | Nullable |
| `outcome_type` | TEXT | Required |
| `recorded_by` | UUID | References `profiles.id` |
| `recorded_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Suggested outcome types:
- `normal`
- `draw`
- `forfeit`
- `walkover`
- `abandoned`

This is a baseline result model for simple numeric scoring.

Sport-specific scoring may require additional tables or structured score records. For example, cricket innings, badminton sets, and football goals cannot all be represented completely by two generic score fields.

Rules:
- Scores must be nonnegative for sports that use nonnegative numeric scores.
- The result must match the tournament's sport-specific rules.
- A draw is permitted only when supported by the sport and format.
- Official results may be edited only by authorized users.
- Result corrections must preserve an audit trail.
- Match completion and result recording must be handled consistently.

### 5.11 `tournament_standings`

Stores optional cached standings for faster display.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `tournament_id` | UUID | References `tournaments.id` |
| `team_id` | UUID | References `teams.id` |
| `matches_played` | INTEGER | Required, default 0 |
| `wins` | INTEGER | Required, default 0 |
| `losses` | INTEGER | Required, default 0 |
| `draws` | INTEGER | Required, default 0 |
| `points_for` | INTEGER | Required, default 0 |
| `points_against` | INTEGER | Required, default 0 |
| `tournament_points` | INTEGER | Required, default 0 |
| `rank` | INTEGER | Nullable |
| `updated_at` | TIMESTAMPTZ | Required |

Constraints:
- Unique `(tournament_id, team_id)`.
- Statistics must not be negative.
- A team must belong to the tournament's eligible participant set.

Design note:

Standings are derived data. The authoritative source is the set of valid finalized match results and the tournament's scoring rules.

For the initial implementation, calculate standings through a database view or a trusted calculation function where practical. Use a cached table only when needed for performance, with a defined refresh strategy.

Do not allow users to directly edit their standings.

### 5.12 `notifications`

Stores in-app notifications.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | References `profiles.id` |
| `type` | TEXT | Required |
| `title` | TEXT | Required |
| `message` | TEXT | Required |
| `resource_type` | TEXT | Nullable |
| `resource_id` | UUID | Nullable |
| `is_read` | BOOLEAN | Required, default false |
| `created_at` | TIMESTAMPTZ | Required |
| `read_at` | TIMESTAMPTZ | Nullable |

Examples:
- Registration approved
- Registration rejected
- Match rescheduled
- Result published
- Tournament cancelled

Rules:
- Users can read their own notifications.
- Users can mark their own notifications as read.
- Clients must not be allowed to create arbitrary system notifications for other users.
- Notification creation should occur through trusted server-side logic or database functions.
- Notification messages must not expose unauthorized information.

### 5.13 `tournament_announcements`

Stores organizer announcements.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `tournament_id` | UUID | References `tournaments.id` |
| `created_by` | UUID | References `profiles.id` |
| `title` | TEXT | Required |
| `body` | TEXT | Required |
| `is_published` | BOOLEAN | Required, default false |
| `published_at` | TIMESTAMPTZ | Nullable |
| `created_at` | TIMESTAMPTZ | Required |
| `updated_at` | TIMESTAMPTZ | Required |

Rules:
- Only authorized organizers can publish announcements.
- Public users can view published announcements for public tournaments.
- Draft announcements must remain restricted.
- Announcement updates must respect the tournament's permissions.

### 5.14 `audit_logs`

Stores important security and administrative events.

| Column | Type | Rules |
|---|---|---|
| `id` | UUID | Primary key |
| `actor_id` | UUID | Nullable, references `profiles.id` |
| `action` | TEXT | Required |
| `resource_type` | TEXT | Required |
| `resource_id` | UUID | Nullable |
| `metadata` | JSONB | Required, default empty object |
| `created_at` | TIMESTAMPTZ | Required |

Example actions:
- `tournament_published`
- `registration_approved`
- `registration_rejected`
- `match_rescheduled`
- `result_recorded`
- `result_corrected`
- `account_suspended`

Rules:
- Ordinary users cannot edit or delete audit records.
- Only trusted backend operations may create sensitive audit entries.
- Metadata must not contain passwords, authentication tokens, secret keys, or unnecessary personal information.
- Access to audit records must be restricted.
- Audit records should be retained according to the project's retention policy.

---

## 6. Database Constraints and Indexes

The implementation must add indexes for common query patterns.

Recommended indexes:

```sql
CREATE INDEX idx_tournaments_status_starts_at
ON public.tournaments (status, starts_at);

CREATE INDEX idx_tournaments_sport_id
ON public.tournaments (sport_id);

CREATE INDEX idx_tournaments_organization_id
ON public.tournaments (organization_id);

CREATE INDEX idx_team_members_user_status
ON public.team_members (user_id, status);

CREATE INDEX idx_organization_members_user_status
ON public.organization_members (user_id, status);

CREATE INDEX idx_registrations_tournament_status
ON public.tournament_registrations (tournament_id, status);

CREATE INDEX idx_registrations_team_id
ON public.tournament_registrations (team_id);

CREATE INDEX idx_matches_tournament_schedule
ON public.matches (tournament_id, scheduled_at);

CREATE INDEX idx_matches_home_team
ON public.matches (home_team_id);

CREATE INDEX idx_matches_away_team
ON public.matches (away_team_id);

CREATE INDEX idx_notifications_user_created
ON public.notifications (user_id, created_at DESC);

CREATE INDEX idx_announcements_tournament_published
ON public.tournament_announcements
(tournament_id, is_published, published_at DESC);
```

Additional requirements:
- Add indexes to frequently queried foreign keys where useful.
- Avoid redundant indexes when an existing primary-key or unique index already covers the access pattern.
- Use `EXPLAIN ANALYZE` on representative queries before introducing unnecessary indexes.
- Consider full-text search or trigram indexes if tournament search requires them.

---

## 7. Critical Transactional Operations

Some operations involve multiple rows and must be atomic.

### 7.1 Tournament Registration

When registering a team:

1. Verify the authenticated user.
2. Verify that the user manages the team.
3. Lock or otherwise safely coordinate access to the tournament capacity.
4. Check the tournament status and registration deadline.
5. Verify sport compatibility and roster eligibility.
6. Check for an existing active registration.
7. Check available capacity.
8. Insert the registration.
9. Commit the transaction.

If any required check fails, the operation must fail without leaving partial changes.

Use a trusted database function or backend transaction with appropriate locking. Do not depend on a frontend count of registrations to enforce capacity.

### 7.2 Recording a Match Result

1. Verify organizer permissions.
2. Lock or safely coordinate access to the match.
3. Verify that the match can accept a result.
4. Validate the score against sport-specific rules.
5. Record the result.
6. Update the match status and winner where appropriate.
7. Write the audit record.
8. Trigger or schedule the necessary standings recalculation.
9. Commit the transaction.

The result and match status must not become inconsistent if any step fails.

### 7.3 Approving Registrations

1. Verify organizer permissions for the tournament.
2. Verify that the registration is pending.
3. Verify that tournament capacity has not been exceeded.
4. Update the registration status and reviewer information.
5. Write the audit record.
6. Create a notification through trusted logic.
7. Commit the transaction.

Capacity must be rechecked during approval because other registrations may have been approved after submission.

---

## 8. Row Level Security Requirements

Enable RLS on every application table exposed through Supabase APIs.

### Profiles
- Authenticated users can read permitted profile information.
- Users can update their own allowed profile fields.
- Users cannot assign themselves privileged roles.

### Organizations
- Public users can read only information intended to be public.
- Authorized organization members can manage permitted organization fields.
- Membership changes require appropriate permissions.

### Teams
- Public users may view appropriate public team information.
- Active team managers can manage their teams.
- Roster membership is restricted to authorized users.

### Tournaments
- Public users can read published tournaments.
- Authorized organizers can manage their tournaments.
- Private and draft data remains restricted.

### Registrations
- Team managers can view relevant registrations for their teams.
- Organizers can review registrations within their authorized tournaments.
- Approval and rejection are restricted to authorized organizers.
- Private review notes and rejection reasons must be protected.

### Matches and Results
- Public users can view published match information and official results.
- Only authorized organizers can schedule matches and publish results.
- Corrections require explicit permissions.

### Standings
- Users can read published standings.
- Direct client writes are prohibited unless a narrowly defined, trusted workflow requires them.

### Notifications
- Users can read and update their own notification read state.
- Creating notifications for other users requires trusted server-side logic.

### Announcements
- Public users can read published announcements for public tournaments.
- Only authorized organizers can create, edit, or publish announcements.

### Audit Logs
- Ordinary users cannot access or modify sensitive audit records.
- Access is limited to authorized administrative workflows.

**Important:** These are access-control requirements, not ready-to-deploy RLS policies. Actual policies must be written and tested against the final schema and authorization model.

---

## 9. Deletion and Data Retention

Use deliberate deletion policies.

- Profiles should follow the account deletion and retention strategy.
- Historical match results should not disappear simply because a user leaves a team.
- Teams with tournament history should generally be deactivated or archived rather than hard-deleted.
- Tournaments with registrations or matches should normally be cancelled or archived rather than deleted.
- Foreign keys should use `RESTRICT`, `CASCADE`, or `SET NULL` intentionally.
- Authentication account deletion must be tested against all dependent records.
- Audit records should follow an explicit retention policy.

Do not use cascading deletion indiscriminately across tournament history.

---

## 10. Supabase Storage

Use Supabase Storage for uploaded media when required.

Suggested buckets:
- `avatars`
- `team-logos`
- `tournament-banners`
- `tournament-documents`

Requirements:
- Configure bucket access deliberately.
- Restrict uploads to authorized users.
- Validate file size and permitted MIME types.
- Generate unique storage paths.
- Do not trust filename extensions alone.
- Use signed URLs for private documents when appropriate.
- Do not allow arbitrary users to overwrite another user's files.
- Avoid storing image binaries directly in PostgreSQL.
- Store the relevant storage path or URL in the appropriate database record.

Public logos and banners may use public buckets if their contents are intended to be publicly accessible. Private documents must use appropriate access controls.

---

## 11. Migration Strategy

All database schema changes must be tracked in migration files.

Suggested directory:

```text
supabase/
├── migrations/
│   ├── 0001_create_profiles.sql
│   ├── 0002_create_organizations.sql
│   ├── 0003_create_sports_and_teams.sql
│   ├── 0004_create_tournaments.sql
│   ├── 0005_create_registrations.sql
│   ├── 0006_create_matches_and_results.sql
│   ├── 0007_create_notifications_and_announcements.sql
│   ├── 0008_create_audit_logs.sql
│   ├── 0009_add_indexes_and_constraints.sql
│   └── 0010_enable_rls_and_policies.sql
├── seed.sql
└── config.toml
```

This is a suggested breakdown; migrations may be split further as needed.

Rules:
1. Never rely on undocumented manual production database changes.
2. Review migrations before applying them.
3. Test migrations against a development database.
4. Preserve existing data during schema changes.
5. Avoid destructive changes without a backup and migration plan.
6. Regenerate TypeScript database types after schema updates.
7. Test RLS policies after every relevant schema change.
8. Keep development seed data separate from real production data.

---

## 12. Seed Data

Development seed data may include:
- Supported sports
- Example organizations
- Sample teams
- Sample tournaments
- Example match fixtures

Rules:
- Use clearly fictional sample data.
- Do not seed real passwords or production credentials.
- Do not create production administrator accounts through public seed scripts.
- Make seed scripts repeatable where practical.
- Keep production data separate from development fixtures.

---

## 13. Database Testing Requirements

Test the following:

1. Duplicate team membership is rejected.
2. Duplicate active tournament registration is rejected.
3. Registration cannot exceed tournament capacity.
4. Teams cannot register for incompatible sports.
5. Matches cannot contain the same team twice.
6. Unauthorized users cannot modify protected records.
7. Non-organizers cannot approve registrations.
8. Non-organizers cannot change official results.
9. Invalid tournament date ranges are rejected.
10. Roster constraints are enforced.
11. Standings are calculated correctly.
12. Concurrent requests cannot corrupt registration capacity.
13. Failed transactional operations do not leave partial updates.
14. Account deletion does not unintentionally destroy historical results.
15. Audit logs cannot be modified by ordinary users.

Test both expected success cases and deliberate unauthorized requests.

---

## 14. Implementation Notes and Design Decisions

### 14.1 Roles

Platform-wide administrative roles must be managed through trusted authorization logic. Do not allow users to assign themselves administrator permissions.

Organization roles, team roles, and tournament permissions are separate concepts.

### 14.2 Standings

Standings should be derived from official match results. The implementation must define tie-breaking rules separately for each supported sport and tournament format.

### 14.3 Sport-Specific Scoring

The initial `match_results` table supports simple numeric scores. More complex scoring systems may require additional related tables, such as innings, sets, periods, or individual events.

### 14.4 Tournament Formats

The selected tournament format must determine valid fixtures and progression rules. A single generic match table is not enough to generate every type of tournament bracket automatically.

### 14.5 Slugs and Identifiers

UUIDs should remain the authoritative internal identifiers. Slugs are for readable URLs and must be unique where required.

### 14.6 Security

RLS is necessary but not sufficient by itself. Sensitive multi-step operations, capacity checks, result finalization, and privileged role changes must use trusted transactional logic.

---

## 15. Definition of Done

The database implementation is considered ready for core application development when:

- All required tables and relationships exist.
- Foreign keys and constraints are validated.
- Relevant indexes are created.
- Migrations apply successfully.
- RLS is enabled on exposed application tables.
- Policies have been tested using different user roles.
- Critical operations use safe transactional logic.
- Supabase TypeScript types are generated.
- Seed data works in the development environment.
- Database tests pass.
- No privileged keys are exposed to the frontend.

---

## 16. Related Documents

- `01-PROJECT-OVERVIEW.md`
- `02-PRD.md`
- `03-TECH-STACK.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `09-FEATURES-AND-MODULES.md`
- `10-API-AND-BACKEND.md`
- `11-SECURITY-RULES.md`
- `14-TESTING-STRATEGY.md`
- `16-ENVIRONMENT-VARIABLES.md`
- `19-AI-CODING-INSTRUCTIONS.md`
