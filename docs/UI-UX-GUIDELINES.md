# UI/UX Guidelines — Sport Organizer

## 1. Purpose

This document defines the user interface and user experience standards for Sport Organizer, a web-based sports tournament management platform.

The application must feel like a modern sports SaaS product: professional, energetic, easy to navigate, responsive, and trustworthy.

Every screen must prioritize clarity, useful information, fast workflows, and consistent visual design.

## 2. Core Design Principles

1. **Sports-focused:** Use subtle sports-inspired visuals, team identity, tournament imagery, and match-related indicators.
2. **SaaS-quality:** Use clean layouts, consistent spacing, structured dashboards, and reusable components.
3. **User-first:** Make important actions easy to find and complete.
4. **Data clarity:** Present scores, schedules, registrations, and standings in an easy-to-scan format.
5. **Responsive by default:** Design for mobile, tablet, and desktop instead of treating mobile as an afterthought.
6. **Accessible:** Support keyboard navigation, readable contrast, clear labels, and assistive technologies.
7. **Consistent:** Reuse the same components and interaction patterns throughout the application.
8. **Honest feedback:** Never display fake statistics, fabricated matches, or misleading success messages.

## 3. Visual Direction

### 3.1 Overall aesthetic

Use a modern sports-management aesthetic with:

- A clean, structured interface.
- Strong typography and clear content hierarchy.
- Subtle borders and restrained shadows.
- Medium-radius cards and buttons.
- Small, purposeful animations.
- Real team logos and tournament artwork when available.
- Scoreboards, status badges, and match cards designed specifically for sports.

Avoid excessive gradients, excessive glassmorphism, oversized empty sections, unnecessary decorative elements, and generic dashboard templates.

### 3.2 Theme

Support a light theme initially. Keep the component architecture compatible with adding a dark theme later.

The primary theme must maintain readable contrast and consistent colors across every page.

Detailed color values and typography rules are defined in `07-COLOR-TYPOGRAPHY.md`.

## 4. Application Layout

### 4.1 Public pages

Public pages are accessible without signing in, except when an action requires authentication.

Expected routes include:

- `/` — Landing page
- `/tournaments` — Tournament discovery
- `/tournaments/[id]` — Tournament details
- `/matches` — Match listings
- `/teams` — Public team directory
- `/teams/[id]` — Team details
- `/login` — Sign in
- `/signup` — Create account
- `/forgot-password` — Password recovery

The landing page should explain the product clearly and guide users toward discovering tournaments or creating an account.

Public navigation should contain the Sport Organizer logo, primary links, and authentication actions.

### 4.2 Authenticated application

Authenticated pages should use a consistent application shell.

**Desktop layout:**

- Left sidebar for primary navigation.
- Top header for page context, notifications, and profile actions.
- Main content area with consistent padding.
- Optional secondary panel for contextual information.
- Scrollable content without unnecessary nested scrolling.

**Mobile layout:**

- Compact header.
- Collapsible navigation drawer or suitable mobile navigation.
- Main content optimized for narrow screens.
- Full-width forms where appropriate.
- Tables transformed into readable cards or horizontally scrollable regions when necessary.
- Important actions placed where users can easily reach them.

Do not simply shrink the desktop sidebar and tables to fit mobile screens.

### 4.3 Sidebar navigation

Navigation must reflect the user's permissions and responsibilities.

Suggested sections:

**Main**
- Overview
- Tournaments
- Matches
- Teams

**Management**
- Registrations
- Results
- Standings
- Announcements

**Account**
- Notifications
- Profile
- Settings
- Sign out

Only display sections relevant to the current role and available features. Organizer and administrator navigation may include additional management pages.

Use Lucide icons consistently. Each icon must have an accessible label when the icon alone would not communicate its purpose.

Highlight the active navigation item clearly. Navigation must not disappear unexpectedly when users move between pages.

## 5. Dashboard Experience

The dashboard should present information relevant to the signed-in user's role.

### 5.1 Player dashboard

Prioritize:

- Upcoming matches.
- Current team.
- Tournament registrations.
- Recent match results.
- Relevant announcements.
- Quick access to tournament discovery.

### 5.2 Team captain dashboard

Prioritize:

- Team overview.
- Team members and invitations.
- Pending team-related actions.
- Tournament registration status.
- Upcoming fixtures.
- Recent team results.

### 5.3 Tournament organizer dashboard

Prioritize:

- Tournaments managed.
- Pending registrations.
- Upcoming matches.
- Matches requiring results.
- Recent activity.
- Quick actions to create tournaments, manage registrations, schedule matches, and publish results.

### 5.4 Organization administrator dashboard

Prioritize:

- Organization overview.
- Managed teams and tournaments.
- Member management.
- Pending approvals, where applicable.
- Upcoming activities.
- Organization-level announcements.

### 5.5 Platform administrator dashboard

Provide platform-level management tools only to authorized platform administrators.

Potential sections include user management, reported issues, platform activity, and system-level oversight.

Do not expose administrative data or actions to ordinary users.

### 5.6 Dashboard card rules

- Each metric card must have a clear label and meaningful value.
- Include contextual information only when it adds value.
- Use loading skeletons while data is being fetched.
- Show an appropriate empty state when no data exists.
- Do not invent percentages, statistics, or recent activities.
- Every clickable metric card must lead to a relevant destination.
- Do not fill dashboards with charts simply for decoration.

## 6. Tournament Discovery and Details

### 6.1 Tournament listing

The tournament discovery page should provide:

- Page title and short description.
- Search field.
- Filters for sport, status, location, and date when supported by available data.
- Sort options.
- Tournament cards.
- Clear pagination or a suitable load-more pattern.

Search and filters must actually affect the displayed results.

Preserve active filter state when practical, including through URL search parameters, so users can share or revisit a filtered listing.

### 6.2 Tournament card

Each card should display relevant information such as:

- Tournament name.
- Sport.
- Organizer or organization.
- Tournament image or logo, if available.
- Date or date range.
- Location or online format.
- Registration status.
- Available capacity, when reliable.
- A clear action to view details.

Avoid cramming every database field into the card.

### 6.3 Tournament details page

Use a clear information hierarchy:

1. Tournament banner or header.
2. Tournament title, sport, and status.
3. Date, location, organizer, and team capacity.
4. Registration call to action.
5. Tournament description and rules.
6. Participating teams.
7. Match schedule.
8. Results and standings, when available.
9. Announcements.

Use tabs or grouped sections when the page becomes too long.

Registration actions must reflect the actual state: open, closed, pending, approved, rejected, or otherwise unavailable.

Never show a registration button as successful before the server confirms the operation.

## 7. Teams and Players

### 7.1 Team listing

Team cards should emphasize team identity and useful information.

Display the team name, logo or initials, sport, captain, and member count when available.

Provide a clear link to the team details page.

### 7.2 Team details

Include:

- Team name and logo.
- Sport.
- Team captain.
- Roster.
- Upcoming matches.
- Recent results.
- Relevant tournament participation.

Only show management actions to authorized team members.

### 7.3 Roster management

Use a structured list or table for team members.

Where supported, provide actions to invite members, review invitations, update membership, or remove members.

Destructive actions must require confirmation. Users must not be able to modify teams they do not have permission to manage.

## 8. Matches, Scores, and Standings

### 8.1 Match cards

Each match card should clearly display:

- Participating teams.
- Team logos or initials.
- Scheduled date and time.
- Venue, when applicable.
- Match status.
- Final score, if available.
- A link to match details.

Use a consistent visual arrangement for team names and scores.

For completed matches, emphasize the final score without relying exclusively on color to identify the winner.

### 8.2 Match statuses

Use consistent status labels throughout the application.

Examples:

- Scheduled
- Live
- Completed
- Postponed
- Cancelled

Only show a Live status when supported by reliable application data. Do not simulate live matches.

Status colors must remain consistent throughout all modules.

### 8.3 Match details

Display the fixture, schedule, teams, venue, score, and relevant match information.

Authorized organizers may receive controls for scheduling or updating match details.

Score entry and result publication must have clear validation and confirmation steps.

### 8.4 Standings table

Standings should present relevant columns based on the selected sport and tournament format.

Possible columns include:

- Rank
- Team
- Played
- Won
- Drawn
- Lost
- Points
- Goal or score difference

Only display applicable statistics. For sports without draws, omit the Drawn column.

Explain the points system where appropriate. If standings are derived from results, recalculate them through trusted backend logic rather than trusting values submitted by the browser.

On small screens, prioritize essential columns or use a readable horizontal scrolling region with visible column context.

## 9. Forms and Data Entry

All forms must be consistent and easy to understand.

### 9.1 Form structure

- Give every field a visible label.
- Use appropriate input types.
- Mark required fields clearly.
- Provide short helper text when needed.
- Group related fields together.
- Use sensible defaults only when they are safe and unambiguous.
- Show validation errors near the relevant fields.
- Preserve entered values when a recoverable submission error occurs.

### 9.2 Form submission

When a user submits a form:

1. Validate input on the client for immediate feedback.
2. Display a pending state while the request is processing.
3. Prevent accidental duplicate submissions.
4. Validate and authorize the operation on the server.
5. Display a clear success or error message based on the actual response.
6. Navigate to the appropriate page only after the operation succeeds.

Client-side validation is not a substitute for server-side validation.

### 9.3 High-impact forms

For tournament creation, registration approval, match result entry, and other important actions:

- Make the intended action explicit.
- Show relevant information before confirmation.
- Explain important consequences.
- Require confirmation for destructive or difficult-to-reverse actions.
- Never silently discard unsaved changes.

## 10. Search, Filters, and Tables

### Search

Search fields must have clear labels or accessible names, sensible empty states, and useful no-results feedback.

Show a loading indicator when searching asynchronously. Debounce repeated search requests when appropriate.

### Filters

- Use clearly labeled controls.
- Display active filters when useful.
- Provide a way to clear filters.
- Avoid duplicate or contradictory filter options.
- Preserve filters in the URL when practical.

### Tables

Use consistent table styling, spacing, headings, and status badges.

Tables should support sorting or pagination when the dataset requires it.

On mobile, choose a suitable strategy for each table: responsive cards, selected essential fields, or horizontal scrolling. Do not hide critical information without providing an alternative.

## 11. Feedback and Notifications

Use the existing notification system consistently.

### Toast notifications

Use brief toast messages for outcomes such as:

- Registration submitted successfully.
- Team updated successfully.
- Match scheduled successfully.
- Result published successfully.
- Changes could not be saved.

A toast must describe the real outcome returned by the application.

### Inline feedback

Use inline messages for form validation, permission issues, missing data, and errors that require user attention.

### Confirmation dialogs

Use confirmation dialogs for destructive actions and significant changes.

A confirmation dialog must include a clear title, an explanation, and distinct Cancel and Confirm actions.

Do not use confirmation dialogs for every routine action.

### Notifications page

If implemented, provide readable notification items with a title, description, timestamp, read/unread state, and relevant destination when available.

Unread indicators must reflect actual notification state.

## 12. Loading, Empty, and Error States

Every data-driven page must account for loading, empty, error, and success states.

### Loading state

- Use skeletons that resemble the final layout.
- Avoid flashing unrelated placeholder content.
- Do not show misleading zero values while data is still loading.
- Disable repeated submissions while a request is processing.

### Empty state

Explain what is missing and, where appropriate, provide a useful next action.

Examples:

- No tournaments found — adjust the filters or explore other sports.
- No upcoming matches — check the tournament schedule.
- No teams yet — create a team to get started, if the user's role permits it.
- No notifications — display a simple, friendly message.

Do not show creation actions to users who lack permission to create the relevant resource.

### Error state

- Explain the problem in plain language.
- Offer retry when retrying is safe.
- Preserve user input where possible.
- Avoid exposing database errors, stack traces, secret values, or internal implementation details.
- Distinguish temporary network problems from permission errors and invalid input.

### Not found and access denied

Provide dedicated pages or clear inline states for unavailable resources and unauthorized access.

Do not reveal private resource details to unauthorized users.

## 13. Responsive Design

Use a mobile-first approach with Tailwind CSS responsive utilities.

Suggested layout targets:

- **Small mobile:** approximately 320–639 px.
- **Large mobile and tablet:** approximately 640–1023 px.
- **Desktop:** approximately 1024 px and above.
- **Wide desktop:** approximately 1280 px and above.

These are design targets, not rigid device categories. Components must adapt naturally between widths.

### Mobile requirements

- No unintended page-level horizontal overflow.
- Comfortable touch targets and adequate spacing.
- Readable text without requiring zoom for ordinary tasks.
- Forms that fit the available viewport.
- Navigation that remains easy to access.
- Tables and scoreboards that remain usable.
- Dialogs that fit small screens and can be dismissed accessibly.
- Important actions that are not hidden behind hover-only interactions.

Test at narrow widths, common phone sizes, tablet sizes, and wide desktop screens.

## 14. Accessibility

Target WCAG 2.2 Level AA as the design and testing goal. <https://www.w3.org/WAI/WCAG22/Understanding/>

Requirements:

- Use semantic HTML elements.
- Maintain a logical heading hierarchy.
- Provide keyboard access to all interactive functionality.
- Keep focus indicators clearly visible.
- Ensure dialogs and menus support appropriate keyboard interaction.
- Provide accessible names for icon-only controls.
- Associate form labels and validation messages with their inputs.
- Use sufficient text and component contrast.
- Do not communicate status using color alone.
- Provide alternative text for meaningful images.
- Mark decorative images appropriately.
- Respect reduced-motion preferences.
- Ensure focus is not obscured by sticky headers, footers, or dialogs.
- Announce important asynchronous feedback appropriately to assistive technologies.

Use native buttons for actions and links for navigation. Avoid clickable generic elements when a semantic control is available.

Accessibility must be considered during implementation, not postponed until final testing.

## 15. Animation and Microinteractions

Animations should communicate state changes, not distract from the task.

Acceptable examples:

- Subtle hover and focus transitions.
- Small menu and dialog transitions.
- Loading indicators.
- Smooth but restrained card interactions.

Avoid excessive motion, unnecessary parallax, continuously animated backgrounds, and decorative effects that reduce readability or performance.

Respect the user's reduced-motion preference.

## 16. Reusable UI Components

Build reusable components with shadcn/ui, Tailwind CSS, and the project's established component patterns.

Expected shared components include:

- Application sidebar and header.
- Page heading.
- Primary and secondary buttons.
- Form fields.
- Search input and filter controls.
- Cards and statistic cards.
- Tournament card.
- Team card.
- Match card.
- Score display.
- Status badge.
- Data table.
- Pagination.
- Dialog and confirmation dialog.
- Dropdown menu.
- Tabs.
- Toast notifications.
- Loading skeleton.
- Empty state.
- Error state.
- Avatar and team logo fallback.

Place globally reusable UI primitives in the shared UI component directory and domain-specific components in their respective feature modules.

Do not duplicate slightly different versions of the same component across multiple pages. Use variants and props where appropriate.

## 17. Content and Visual Assets

Use concise, consistent language.

Button labels should describe the action, such as:

- Create Tournament
- Join Tournament
- View Details
- Approve Registration
- Schedule Match
- Publish Result
- Save Changes

Avoid vague labels such as "Click Here" or "Submit" when a more specific label improves clarity.

Use real application data wherever available. If sample data is necessary for development, clearly separate it from production data.

Do not use random external images as permanent team logos or tournament artwork. Provide a consistent fallback using initials or a neutral sports icon when an image is unavailable.

All dates, times, and score formats must be displayed consistently. Handle timezone conversion explicitly and avoid ambiguous date formats.

## 18. Performance and Perceived Speed

- Avoid unnecessarily large client-side components.
- Prefer server rendering and server components where appropriate for the chosen Next.js architecture.
- Use client components only where interactivity requires them.
- Load images efficiently and define appropriate dimensions.
- Paginate large lists instead of loading every record.
- Avoid repeated network requests and unnecessary full-page reloads.
- Use loading states that help users understand ongoing operations.
- Avoid layout shifts when data or images load.
- Keep animations lightweight.
- Do not delay critical interactions for decorative effects.

Performance optimizations must preserve correct authorization, data freshness, and application behavior.

## 19. UX Security Rules

The interface must never be treated as the security boundary.

- Hide unavailable actions for usability, but enforce permissions on the server and in Supabase Row Level Security policies.
- Do not expose privileged controls to unauthorized users.
- Do not trust role names, IDs, scores, prices, registration states, or permissions supplied by the client.
- Display private information only when the user is authorized to access it.
- Do not reveal secret keys in browser-visible code.
- Show clear access-denied feedback without leaking sensitive details.
- Confirm destructive operations and clearly communicate their consequences.

## 20. UX Acceptance Checklist

Before marking a page complete, verify:

- [ ] The layout matches the application's established design system.
- [ ] Desktop, tablet, and mobile layouts are usable.
- [ ] Navigation links lead to the correct destinations.
- [ ] Buttons perform their advertised actions.
- [ ] Forms validate inputs and display useful feedback.
- [ ] Loading, empty, and error states are implemented.
- [ ] Status labels reflect real backend data.
- [ ] No fake production statistics or fabricated activity are displayed.
- [ ] Role-specific actions are presented appropriately.
- [ ] Server-side authorization remains enforced.
- [ ] Keyboard navigation and visible focus work correctly.
- [ ] Text, icons, and controls have suitable contrast and accessible labels.
- [ ] No unintended horizontal overflow exists.
- [ ] Important operations provide accurate success or failure feedback.
- [ ] No browser console errors or broken interactions remain.

## 21. Implementation Rules for AI Coding Agents

When implementing or modifying the UI:

1. Read this document along with `01-PROJECT-OVERVIEW.md`, `02-PRD.md`, and `03-TECH-STACK.md`.
2. Check the existing project structure and shared components before creating new ones.
3. Reuse established styles and components instead of inventing a separate design for each page.
4. Implement real interactions and connect them to the correct backend operations.
5. Do not replace functional code with static mockups.
6. Do not invent data, successful operations, or unsupported features.
7. Handle loading, error, empty, and permission states.
8. Test responsive behavior and keyboard accessibility.
9. Keep components modular, typed, and maintainable.
10. Update relevant tests when changing behavior.
11. Do not change the database schema, authentication model, or application architecture without checking the relevant project documents first.
12. If a requirement is unclear, choose the simplest consistent implementation and document any important assumption.

## 22. Related Documentation

- `01-PROJECT-OVERVIEW.md`
- `02-PRD.md`
- `03-TECH-STACK.md`
- `04-DATABASE-SCHEMA.md`
- `05-AUTHENTICATION-AND-AUTHORIZATION.md`
- `07-COLOR-TYPOGRAPHY.md`
- `08-DESIGN-SYSTEM.md`
- `09-FEATURES-AND-MODULES.md`

---

**End of UI-UX Guidelines**