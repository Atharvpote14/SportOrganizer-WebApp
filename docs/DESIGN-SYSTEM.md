# Design System — Sport Organizer

## 1. Purpose

This document defines the reusable UI components, component behavior, design tokens, composition patterns, and implementation conventions for the Sport Organizer Web App.

The goal is to create a consistent, maintainable, accessible, and professional interface across public pages, user dashboards, tournament management, teams, matches, and administration.

The design system builds upon:

- `06-UI-UX-GUIDELINES.md`
- `07-COLOR-TYPOGRAPHY.md`

All developers and AI coding agents must follow these guidelines when creating or modifying UI components.

## 2. Technology and Principles

Use the established project stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons
- React Hook Form and Zod for forms
- Sonner for toast notifications, if compatible with the selected shadcn/ui setup

Use shadcn/ui as the foundation for accessible, composable components. Its source code can be customized to meet the application's design requirements. Refer to the official documentation: https://ui.shadcn.com/docs

### Core principles

1. Reuse before rebuilding.
2. Compose small components into larger features.
3. Keep components strongly typed.
4. Separate visual presentation from business logic where practical.
5. Follow semantic color tokens.
6. Support loading, empty, error, disabled, and success states.
7. Maintain responsive behavior and accessibility.
8. Do not duplicate components simply because different pages use them.
9. Do not introduce another component library without a clear need.
10. Never treat UI visibility as a replacement for server-side authorization.

## 3. Component Architecture

Organize shared components separately from feature-specific components.

Recommended structure:

```text
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── app-header.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── app-shell.tsx
│   │   └── page-header.tsx
│   ├── shared/
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   ├── loading-state.tsx
│   │   ├── confirm-dialog.tsx
│   │   └── status-badge.tsx
│   └── providers/
├── features/
│   ├── tournaments/
│   │   └── components/
│   ├── teams/
│   │   └── components/
│   ├── matches/
│   │   └── components/
│   ├── registrations/
│   │   └── components/
│   └── notifications/
│       └── components/
└── lib/
    ├── utils.ts
    └── constants/
```

This is a recommended structure, not a requirement to create every file immediately. Adapt it to the existing repository and the feature-module structure established in `03-TECH-STACK.md`.

### Directory responsibilities

- `components/ui/`: Generic, reusable UI primitives.
- `components/layout/`: Application shell and navigation.
- `components/shared/`: Reusable application-level patterns.
- `components/providers/`: React context providers, where required.
- `features/`: Domain-specific components, forms, and interactions.
- `lib/`: Shared utilities and constants.

Avoid placing tournament-specific logic inside generic UI primitives.

## 4. Design Tokens

Use the design tokens defined in `07-COLOR-TYPOGRAPHY.md`.

### Primary tokens

| Token | Value |
|---|---|
| Primary | `#2563EB` |
| Primary hover | `#1D4ED8` |
| Navy | `#0F172A` |
| Page background | `#F8FAFC` |
| Surface | `#FFFFFF` |
| Border | `#E2E8F0` |
| Text primary | `#0F172A` |
| Text secondary | `#475569` |
| Text muted | `#64748B` |
| Success | `#166534` |
| Warning | `#92400E` |
| Error | `#991B1B` |
| Information | `#1E40AF` |

Use semantic tokens such as `bg-primary`, `text-foreground`, `bg-muted`, `border-border`, and `text-muted-foreground` rather than introducing arbitrary colors into individual components.

Use CSS variables where appropriate and follow the installed Tailwind CSS and shadcn/ui configuration.

### Layout tokens

- Standard card radius: 12 px.
- Input and button radius: approximately 8 px.
- Compact component spacing: 8–16 px.
- Standard card padding: 20–24 px.
- Main section spacing: 24–32 px.
- Standard form-control height: approximately 40–44 px.

These are defaults. Adjust them when a component's purpose or responsive layout requires it.

## 5. Component Tiers

Organize components into three levels.

### Tier 1: UI primitives

Examples:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio group
- Badge
- Card
- Avatar
- Separator
- Tooltip
- Dialog
- Dropdown menu
- Tabs
- Skeleton

These components should remain generic and reusable.

### Tier 2: Application components

Examples:

- Page header
- Search and filter toolbar
- Status badge
- Empty state
- Loading state
- Error state
- Confirmation dialog
- Notification item
- Data table wrapper
- Dashboard statistic card

These components combine UI primitives into common application patterns.

### Tier 3: Feature components

Examples:

- Tournament card
- Tournament registration form
- Team roster
- Match card
- Scoreboard
- Tournament standings
- Registration approval panel
- Match result form

These components represent specific Sport Organizer features and should use lower-tier components wherever practical.

## 6. Buttons

Use the shared shadcn/ui Button component.

### Variants

| Variant | Purpose |
|---|---|
| Default / Primary | Main action on a page or form |
| Secondary | Supporting action |
| Outline | Lower-emphasis bordered action |
| Ghost | Minimal action, often in toolbars |
| Destructive | Delete, remove, or other high-impact actions |
| Link | Navigation-style action |

Use the variants actually supported by the installed component implementation. Extend them consistently if required.

### Sizes

Provide or reuse suitable sizes for:

- Small: compact controls and dense tables.
- Default: standard page and form actions.
- Large: prominent landing-page or primary onboarding actions.
- Icon: icon-only buttons with accessible names.

### Rules

- Use one visually dominant primary action per main action area where practical.
- Use descriptive labels such as `Create Tournament` or `Publish Result`.
- Disable repeated submissions while an operation is in progress.
- Provide a visible loading indicator when appropriate.
- Keep disabled actions visually distinguishable.
- Use destructive styling only for destructive actions.
- Icon-only buttons must have accessible labels.
- Do not render a button as a navigation link when a semantic link is more appropriate.

## 7. Cards

Use the shared Card component for related content.

Expected composition:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Tournament Overview</CardTitle>
    <CardDescription>
      View the tournament details and current status.
    </CardDescription>
  </CardHeader>

  <CardContent>
    {/* Tournament information */}
  </CardContent>

  <CardFooter>
    {/* Relevant actions */}
  </CardFooter>
</Card>
```

Import the appropriate subcomponents from the project's actual Card implementation.

### Card variants

Use consistent patterns for:

- Standard content cards.
- Dashboard statistic cards.
- Tournament cards.
- Team cards.
- Match cards.
- Highlighted information panels.

Do not create separate styling systems for each card type.

Cards should not automatically be clickable. When an entire card navigates to a destination, implement accessible link behavior and ensure nested controls do not create conflicting interactions.

## 8. Badges and Status Indicators

Use the shared Badge component for compact status labels.

Create a reusable `StatusBadge` component when the same business statuses appear in multiple features.

Example API:

```tsx
type StatusBadgeProps = {
  status: string;
};
```

The component must map known statuses to predefined variants or semantic classes.

Example status mapping:

| Status | Visual treatment |
|---|---|
| Approved | Success |
| Completed | Success or neutral |
| Pending | Warning |
| Rejected | Error |
| Cancelled | Neutral |
| Draft | Neutral |
| Live | Live indicator |
| Scheduled | Information |

Use actual application status values and define a consistent mapping. Do not assume that every database status is already covered by this table.

For unknown statuses, show a safe neutral fallback instead of crashing or applying arbitrary styling.

Never rely on badge color alone to communicate the status.

## 9. Form Components

Use shared form components with React Hook Form and Zod where suitable.

Expected primitives:

- Input
- Textarea
- Select
- Checkbox
- Radio group
- Date picker
- Form label
- Helper text
- Validation message

### Form behavior

Every form must:

1. Have a clear title and purpose.
2. Associate labels with their controls.
3. Validate inputs using appropriate schemas.
4. Display field-specific errors.
5. Preserve values when recoverable errors occur.
6. Prevent duplicate submissions.
7. Show accurate success or failure feedback.
8. Be usable by keyboard and assistive technologies.

Use the same schema rules on the server where appropriate, but never trust client-side validation alone.

### Example component pattern

```tsx
<div className="flex flex-col gap-2">
  <Label htmlFor="tournament-name">
    Tournament name
  </Label>

  <Input
    id="tournament-name"
    name="name"
    placeholder="Enter tournament name"
    required
  />

  <p className="text-sm text-muted-foreground">
    Choose a clear name participants can recognize.
  </p>
</div>
```

This example demonstrates basic composition. Production forms should use the project's selected form architecture, proper controlled or registered fields, and accessible validation behavior.

## 10. Dialogs and Confirmation Patterns

Use dialogs for focused tasks that require user attention.

Use a confirmation dialog for destructive or high-impact operations.

Examples:

- Delete a team.
- Remove a team member.
- Cancel a tournament.
- Reject a registration.
- Publish or correct a match result.

A confirmation dialog should include:

- An accessible title.
- A clear explanation of the action.
- A Cancel action.
- A clearly labeled confirmation action.
- Loading and error handling where the action is asynchronous.

Use the appropriate alert-dialog primitive for destructive confirmations.

Every dialog must have an accessible title. Dialogs must support keyboard interaction, focus management, and appropriate dismissal behavior.

Do not use a dialog for every simple interaction.

## 11. Search, Filters, and Pagination

Build shared components for recurring list controls.

### Search field

Requirements:

- Clear label or accessible name.
- Search icon where appropriate.
- Controlled state when necessary.
- Debounced requests for remote search when beneficial.
- Clearable input where useful.
- Loading and no-results feedback.

### Filter toolbar

Support relevant filters such as sport, date, location, and tournament status.

Rules:

- Use appropriate input controls.
- Display active filters when useful.
- Provide a clear-filters action.
- Avoid requesting unsupported filter fields.
- Preserve filter state in URL parameters when appropriate.

### Pagination

For large datasets, provide pagination or a suitable incremental-loading pattern.

Pagination must reflect the actual server result count and must not fabricate additional pages.

## 12. Tables and Data Lists

Use a shared table pattern for structured management data.

Typical uses:

- Tournament registrations.
- Team members.
- Match schedules.
- Administrative user lists.
- Tournament standings.

### Requirements

- Clear column headings.
- Consistent row spacing.
- Accessible sorting controls where sorting is available.
- Pagination when necessary.
- Loading skeletons.
- Empty and error states.
- Mobile-friendly presentation.

On narrow screens, use responsive cards or horizontal scrolling as appropriate.

Do not implement sorting, filtering, or pagination controls that only change the visual appearance without affecting the actual data.

## 13. Application Layout Components

### AppShell

Provides the authenticated application layout.

Responsibilities:

- Shared header.
- Sidebar or mobile navigation.
- Main content area.
- Responsive structure.
- Shared navigation context.

It must not perform privileged operations merely because it renders an authenticated layout.

### AppHeader

May include:

- Brand logo.
- Current page context where appropriate.
- Notifications.
- User avatar.
- Account menu.

Keep the header compact and responsive.

### AppSidebar

Responsibilities:

- Navigation links.
- Active route indication.
- Role-aware navigation presentation.
- Collapsible or mobile behavior.

Navigation visibility improves usability but does not enforce access control.

### PageHeader

Recommended information:

- Page title.
- Optional description.
- Breadcrumbs when useful.
- Primary action.
- Optional secondary actions.

Keep page headings consistent across dashboard and management pages.

## 14. Sport Organizer Feature Components

### TournamentCard

Suggested properties:

```tsx
type TournamentCardProps = {
  id: string;
  name: string;
  sportName: string;
  status: string;
  startDate?: string;
  location?: string | null;
  imageUrl?: string | null;
};
```

Adapt the types to the actual database schema and application data model.

Responsibilities:

- Display the tournament identity.
- Show relevant metadata.
- Present a consistent status badge.
- Provide a clear details link.
- Handle missing images and optional fields.
- Avoid exposing private information.

### TeamCard

Suggested properties:

```tsx
type TeamCardProps = {
  id: string;
  name: string;
  sportName?: string;
  memberCount?: number;
  logoUrl?: string | null;
};
```

Display team identity and relevant public details. Show management actions only when the current user has permission.

### MatchCard

Suggested properties:

```tsx
type MatchCardProps = {
  id: string;
  homeTeamName: string;
  awayTeamName: string;
  scheduledAt?: string | null;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
};
```

The exact property names must match the project's established data types or be adapted through a mapping layer.

Responsibilities:

- Display both teams clearly.
- Show the scheduled date and time when available.
- Display scores only when available and valid.
- Use a consistent status indicator.
- Link to match details.
- Avoid implying a match is live unless the stored state supports that claim.

### Scoreboard

Use a dedicated scoreboard when scores are the main focus.

Requirements:

- Clear team names.
- Consistent score alignment.
- Appropriate completed/live status.
- Accessible text alternatives for meaningful icons.
- Validated numerical scores.

Do not allow arbitrary client-submitted scores to bypass server-side result validation.

### StandingsTable

Responsibilities:

- Display rankings and relevant statistics.
- Follow the tournament's applicable scoring rules.
- Clearly distinguish rank, team, and points.
- Adapt to narrow screens.
- Indicate when standings have not yet been generated.

Standings should come from trusted backend calculations or validated stored results, not browser-only calculations treated as authoritative.

## 15. Loading, Empty, and Error Components

Build shared components rather than reimplementing these states on every page.

### LoadingState

Use Skeleton components that resemble the content being loaded.

Examples:

- Tournament card skeleton.
- Table row skeleton.
- Dashboard statistic skeleton.
- Profile skeleton.

Avoid showing fake data as loading placeholders.

### EmptyState

Suggested properties:

```tsx
type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};
```

The action should be optional. Use it only when a relevant action exists and the user is authorized to perform it.

### ErrorState

Suggested properties:

```tsx
type ErrorStateProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
};
```

Provide retry only when retrying is meaningful and safe.

Never display raw server exceptions, stack traces, secret values, or database implementation details.

## 16. Toast Notifications

Use the project's selected toast implementation consistently.

If Sonner is selected, standardize usage through a small shared helper or established application convention.

Examples of feedback:

- Tournament created successfully.
- Registration submitted successfully.
- Team details updated.
- Match result published.
- The operation could not be completed.

Only display success after the operation has actually succeeded.

Use inline field errors for form validation rather than relying entirely on toast messages.

Avoid showing multiple duplicate notifications for a single action.

## 17. Icons and Imagery

Use Lucide icons consistently.

Rules:

- Use icons with recognizable meanings.
- Maintain consistent sizing and alignment.
- Provide accessible labels for icon-only controls.
- Avoid decorative icons that clutter the interface.
- Use image fallbacks for missing team logos and avatars.
- Use optimized image loading where appropriate.
- Do not use random images as permanent production assets.

Do not mix multiple icon libraries without a clear reason.

## 18. Component Variants and Styling

Prefer existing component variants over one-off styling.

For custom variants:

- Use a documented and typed variant API.
- Reuse semantic design tokens.
- Preserve accessibility and responsive behavior.
- Keep default styling consistent.
- Avoid arbitrary per-page overrides.

Use the project's existing class-name utility, commonly `cn()`, when combining conditional Tailwind classes.

Example:

```tsx
import { cn } from "@/lib/utils";

type SectionProps = {
  className?: string;
  children: React.ReactNode;
};

export function Section({
  className,
  children,
}: SectionProps) {
  return (
    <section
      className={cn("flex flex-col gap-4", className)}
    >
      {children}
    </section>
  );
}
```

Adjust import paths and component conventions to match the actual repository.

Avoid building a complicated abstraction when a simple shared component is sufficient.

## 19. Server and Client Component Boundaries

Follow the Next.js App Router architecture.

- Prefer Server Components for content that does not require client-side interactivity.
- Use Client Components for browser interaction, local state, event handlers, or client-only libraries.
- Keep client boundaries as small as practical.
- Do not pass unsupported values across server/client boundaries.
- Do not expose server-only environment variables to client components.
- Keep authorization and privileged database operations on trusted server-side paths.

Reusable UI components must not automatically become Client Components unless their functionality requires it.

## 20. Accessibility Standards

All shared components must be designed with accessibility in mind.

Requirements:

- Semantic HTML.
- Keyboard-accessible interactions.
- Visible focus indicators.
- Correct label associations.
- Accessible names for icon-only controls.
- Proper dialog and menu behavior.
- Appropriate status announcements.
- Sufficient contrast.
- No color-only status communication.
- Reduced-motion support where relevant.

Use the accessibility patterns provided by the selected shadcn/ui primitives. Do not remove their focus management, keyboard support, or semantic structure when customizing styles.

## 21. Component Testing

Test reusable components according to their behavior and complexity.

### Unit and component tests

Use the project's selected testing tools to verify:

- Correct rendering.
- Props and variants.
- Optional and missing values.
- Status mapping.
- Loading and disabled states.
- Empty and error states.
- Button and form interactions.
- Accessible labels.
- Conditional actions.

### Integration and end-to-end tests

Verify important real-world flows, including:

- Creating a tournament.
- Registering a team.
- Approving a registration.
- Scheduling a match.
- Publishing a result.
- Viewing updated standings.

Tests must verify actual behavior and permissions, not merely whether a button is visible.

## 22. Implementation Workflow

When creating a new feature:

1. Identify which existing UI primitives are required.
2. Check whether shared application components already solve part of the problem.
3. Build or extend reusable components where appropriate.
4. Implement feature-specific components in the relevant feature directory.
5. Connect components to validated application data.
6. Add loading, empty, error, and permission states.
7. Verify responsive behavior.
8. Check accessibility.
9. Add tests for important behavior.
10. Update documentation when a shared component API or design convention changes.

Do not create every possible component in advance. Build components as features require them, while preserving these shared conventions.

## 23. Design System Acceptance Checklist

Before a component is considered complete:

- [ ] It uses the shared color and typography tokens.
- [ ] It follows existing component conventions.
- [ ] It has a clear, typed API where appropriate.
- [ ] It handles missing or optional data safely.
- [ ] It has the necessary interactive states.
- [ ] It is responsive.
- [ ] It supports keyboard interaction when applicable.
- [ ] It has accessible labels and semantic structure.
- [ ] It does not duplicate existing shared functionality.
- [ ] It does not bypass authorization or validation.
- [ ] It has tests appropriate to its behavior.
- [ ] It has no unnecessary styling overrides.

## 24. Related Documentation

- `01-PROJECT-OVERVIEW.md`
- `02-PRD.md`
- `03-TECH-STACK.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `06-UI-UX-GUIDELINES.md`
- `07-COLOR-TYPOGRAPHY.md`
- `09-FEATURES-AND-MODULES.md`
- `13-VALIDATION-AND-ERROR-HANDLING.md`
- `17-CODING-STANDARDS.md`

---

**End of Design System**