# Color and Typography Guidelines — Sport Organizer

## 1. Purpose

This document establishes the visual foundation for the Sport Organizer Web App.

It defines:

- Primary and secondary colors.
- Backgrounds, surfaces, borders, and text colors.
- Typography and font sizes.
- Spacing and sizing conventions.
- Border radii and shadows.
- Status colors.
- Accessibility requirements.
- Implementation rules for Tailwind CSS and shadcn/ui.

All pages and components must follow these guidelines instead of introducing arbitrary styles.

## 2. Design Direction

Sport Organizer should have a modern, energetic, professional sports SaaS appearance.

The visual identity combines:

- Deep navy for structure and authority.
- Athletic blue for primary interactions.
- Emerald green for success and positive outcomes.
- Neutral backgrounds for clarity.
- Strong typography for scores, statistics, and tournament information.

The design must remain clean and readable. Avoid excessive gradients, neon colors, decorative shadows, and inconsistent accent colors.

## 3. Color Palette

### 3.1 Primary colors

Use these colors as the foundation of the brand.

| Token              | Hex       | Usage                                   |
| ------------------ | --------- | --------------------------------------- |
| Primary            | `#2563EB` | Primary buttons, links, active controls |
| Primary Hover      | `#1D4ED8` | Hover state for primary actions         |
| Primary Active     | `#1E40AF` | Pressed state                           |
| Primary Light      | `#DBEAFE` | Soft blue backgrounds and highlights    |
| Primary Foreground | `#FFFFFF` | Text and icons on primary buttons       |

The primary blue should be the main interactive accent throughout the application.

### 3.2 Brand and structural colors

| Token        | Hex       | Usage                                   |
| ------------ | --------- | --------------------------------------- |
| Navy         | `#0F172A` | Sidebar, major headings, brand elements |
| Navy Light   | `#1E293B` | Secondary dark surfaces                 |
| Slate        | `#334155` | Strong secondary text                   |
| Slate Medium | `#64748B` | Supporting text and icons               |
| Slate Light  | `#94A3B8` | Muted icons and metadata                |
| White        | `#FFFFFF` | Cards, dialogs, and clean surfaces      |

Use navy to establish the sports-management identity without making the entire interface dark.

### 3.3 Background and surface colors

| Token            | Hex       | Usage                                    |
| ---------------- | --------- | ---------------------------------------- |
| Page Background  | `#F8FAFC` | Main application background              |
| Surface          | `#FFFFFF` | Cards, forms, dialogs                    |
| Surface Muted    | `#F1F5F9` | Secondary sections and subtle highlights |
| Surface Hover    | `#F8FAFC` | Hovered neutral cards and rows           |
| Border           | `#E2E8F0` | Standard borders and separators          |
| Border Strong    | `#CBD5E1` | Emphasized borders                       |
| Input Background | `#FFFFFF` | Form controls                            |

Use white surfaces against the light page background to create subtle separation.

Do not place every element inside a separate card. Use whitespace and section headings to organize content naturally.

### 3.4 Text colors

| Token          | Hex       | Usage                                    |
| -------------- | --------- | ---------------------------------------- |
| Text Primary   | `#0F172A` | Main headings and important content      |
| Text Secondary | `#475569` | Body text and descriptions               |
| Text Muted     | `#64748B` | Metadata, timestamps, supporting details |
| Text Disabled  | `#94A3B8` | Disabled controls                        |
| Text Inverse   | `#FFFFFF` | Text on dark backgrounds                 |

Do not use light gray text for essential information. Muted text must remain readable at its rendered size.

### 3.5 Semantic status colors

Use semantic colors consistently across match statuses, registration states, form feedback, and administrative actions.

| Status      | Text      | Background | Usage                                      |
| ----------- | --------- | ---------- | ------------------------------------------ |
| Success     | `#166534` | `#DCFCE7`  | Approved registrations, successful actions |
| Warning     | `#92400E` | `#FEF3C7`  | Pending approvals, attention required      |
| Error       | `#991B1B` | `#FEE2E2`  | Failed actions, rejected registrations     |
| Information | `#1E40AF` | `#DBEAFE`  | Informational messages                     |
| Neutral     | `#334155` | `#F1F5F9`  | Drafts and inactive states                 |
| Live        | `#9F1239` | `#FFE4E6`  | Live match indicators, when genuinely live |

Status must never be communicated through color alone. Always include a readable label or another suitable visual indicator.

Do not use the success color for unrelated primary actions or the error color for ordinary navigation.

### 3.6 Sports-specific colors

Sports-specific colors may be introduced for tournament artwork, team identity, charts, and sport categories.

Rules:

- Keep the global interface palette consistent.
- Use team-specific colors only where they improve team recognition.
- Do not allow team colors to override accessible text contrast.
- Use chart colors that remain distinguishable.
- Do not assign meaning to colors without a clear legend or label.

## 4. Typography

### 4.1 Font family

Use **Inter** as the primary font family.

Preferred font stack:

`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Load Inter through a reliable font provider or a locally hosted font when appropriate. In Next.js, prefer `next/font` when using a supported font source to reduce layout shifts and improve font loading behavior.

Always provide system fallbacks.

### 4.2 Font weights

| Weight     | Value | Usage                                  |
| ---------- | ----: | -------------------------------------- |
| Regular    |   400 | Body text, descriptions                |
| Medium     |   500 | Labels, navigation, metadata emphasis  |
| Semibold   |   600 | Card headings, buttons, section titles |
| Bold       |   700 | Page titles, important statistics      |
| Extra Bold |   800 | Optional major promotional headings    |

Use font weights purposefully. Avoid using bold text for every element.

### 4.3 Typography scale

Use the following scale as the default.

| Style           |  Size | Line Height | Weight |
| --------------- | ----: | ----------: | -----: |
| Display         | 48 px |         1.1 |    700 |
| Page Heading    | 32 px |         1.2 |    700 |
| Section Heading | 24 px |         1.3 |    600 |
| Card Heading    | 18 px |         1.4 |    600 |
| Body Large      | 16 px |         1.6 |    400 |
| Body Default    | 14 px |         1.5 |    400 |
| Label           | 14 px |         1.4 |    500 |
| Small Text      | 12 px |         1.5 |    400 |
| Statistic       | 28 px |         1.2 |    700 |

Use responsive typography where needed. Large marketing headings can scale down on mobile, while dashboard headings should remain compact and functional.

Do not make important table content or form labels unnecessarily small.

### 4.4 Typography hierarchy

Every page should follow a clear hierarchy:

1. One main page heading.
2. Section headings.
3. Card or subsection headings.
4. Body text.
5. Supporting metadata.

Use sentence case for headings and button labels unless a specific brand element requires otherwise.

Avoid unnecessary all-caps text. Compact labels such as match status or tournament category may use uppercase sparingly.

### 4.5 Numbers, scores, and statistics

Use clear, consistent number formatting for dashboard metrics and sports data.

- Use tabular numerals where available for changing numerical values.
- Make final scores easy to scan.
- Keep the same score layout across match cards.
- Use appropriate locale formatting for dates and large numbers.
- Avoid decorative number formatting that changes the meaning of a statistic.

## 5. Spacing System

Use a consistent spacing scale based on multiples of 4 pixels.

| Token |  Size | Typical usage              |
| ----- | ----: | -------------------------- |
| 1     |  4 px | Tiny icon gaps             |
| 2     |  8 px | Compact internal spacing   |
| 3     | 12 px | Field and label gaps       |
| 4     | 16 px | Standard component spacing |
| 5     | 20 px | Compact card padding       |
| 6     | 24 px | Standard card padding      |
| 8     | 32 px | Section separation         |
| 10    | 40 px | Large section gaps         |
| 12    | 48 px | Major layout spacing       |
| 16    | 64 px | Large page section spacing |

Prefer Tailwind's spacing utilities where possible.

Examples:

- `gap-2` for compact icon-and-label groups.
- `gap-4` for related controls.
- `p-4` for compact cards.
- `p-6` for standard desktop cards.
- `mb-8` for separation between major sections.

Do not use arbitrary spacing values when an existing spacing token works.

## 6. Border Radius

Use a consistent radius scale.

| Component                 | Recommended radius |
| ------------------------- | ------------------ |
| Small controls and badges | 6–8 px             |
| Inputs and buttons        | 8 px               |
| Standard cards            | 12 px              |
| Large panels and dialogs  | 16 px              |
| Avatars                   | 50%                |
| Pill indicators           | Fully rounded      |

Avoid mixing sharp corners and heavily rounded components without a clear design reason.

## 7. Borders and Shadows

### Borders

- Use `#E2E8F0` for standard card and divider borders.
- Use `#CBD5E1` for stronger boundaries.
- Use the primary color for focused form controls.
- Keep separators subtle and consistent.

### Shadows

Use shadows sparingly.

Recommended hierarchy:

- Default cards: subtle border, minimal or no shadow.
- Hovered interactive cards: a slightly stronger shadow or border.
- Dropdowns and popovers: moderate shadow.
- Dialogs: clear elevation from the page.

Do not add heavy shadows to every card, button, and section.

## 8. Buttons and Interactive States

### Primary button

- Background: Primary.
- Text: Primary Foreground.
- Hover: Primary Hover.
- Active: Primary Active.
- Focus: visible focus ring.
- Disabled: muted appearance and non-interactive behavior.

### Secondary button

Use a white or neutral background with a visible border and dark text.

### Destructive button

Use the semantic error palette. Reserve destructive styling for actions that remove data or perform other high-impact operations.

### Interactive state requirements

All interactive controls must have clear:

- Default state.
- Hover state where applicable.
- Focus state.
- Active state where applicable.
- Disabled state.
- Loading state where applicable.

Never rely only on a color change that is difficult to perceive.

## 9. Form Styling

Form fields must use consistent typography, spacing, and borders.

- Label: 14 px, medium weight.
- Input text: 14–16 px.
- Helper text: 12–14 px.
- Error text: 12–14 px with accessible contrast.
- Border radius: approximately 8 px.
- Input height: generally 40–44 px for standard controls.

Provide a visible focus ring and clear validation feedback.

Use semantic input types, including email, password, date, and number where appropriate.

Do not communicate errors through red borders alone; include explanatory text.

## 10. Cards, Tables, and Data Visualization

### Cards

Use a white surface, subtle border, consistent padding, and clear content hierarchy.

Not every section needs a card. Use open layouts for simple lists and grouped content.

### Tables

Use consistent header styling, row spacing, separators, and hover states.

Use tabular numerals for scores and numerical statistics where supported.

Ensure text and status badges remain readable in dense tables.

### Charts

When charts are useful:

- Use the primary blue for the main data series.
- Use semantic colors only when their meanings are appropriate.
- Include readable labels, legends, and tooltips.
- Provide a textual or tabular alternative when needed.
- Never rely solely on color to distinguish important data.
- Avoid charts that communicate no actionable information.

## 11. Responsive Typography and Spacing

Use responsive Tailwind utilities to adapt typography and layout.

General guidance:

- On mobile, reduce large display headings before reducing body text.
- Keep form controls comfortably sized for touch.
- Reduce card padding only when space requires it.
- Stack dashboard cards on narrow screens.
- Keep scores and important statistics prominent.
- Prevent headings and long tournament names from overflowing.
- Allow appropriate wrapping for long team names and labels.

Test the typography scale at 320 px, 375 px, 768 px, 1024 px, and 1440 px viewport widths.

These sizes are test targets, not restrictions on supported viewport sizes.

## 12. Accessibility and Contrast

Target WCAG 2.2 Level AA contrast requirements.

As a general rule:

- Normal text should have a contrast ratio of at least 4.5:1.
- Large text should have a contrast ratio of at least 3:1.
- Meaningful user-interface components and graphical indicators should meet applicable non-text contrast requirements.

Reference: [https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

Additional requirements:

- Do not use color as the only way to communicate status.
- Keep keyboard focus clearly visible.
- Avoid extremely light text on white surfaces.
- Ensure hover and disabled states remain understandable.
- Check actual foreground/background combinations rather than assuming every palette pairing is accessible.

## 13. Tailwind CSS Implementation

Implement the palette and design tokens through the project's existing Tailwind CSS and shadcn/ui configuration.

Before adding new global styles, inspect the installed Tailwind version and the current project configuration.

Use CSS variables for shared theme values where appropriate. If shadcn/ui is configured with semantic variables, map the design tokens to those variables rather than duplicating values across components.

Example semantic tokens:

```css
:root {
  --background: #F8FAFC;
  --foreground: #0F172A;

  --card: #FFFFFF;
  --card-foreground: #0F172A;

  --primary: #2563EB;
  --primary-foreground: #FFFFFF;

  --secondary: #F1F5F9;
  --secondary-foreground: #0F172A;

  --muted: #F1F5F9;
  --muted-foreground: #64748B;

  --border: #E2E8F0;
  --input: #E2E8F0;
  --ring: #2563EB;

  --destructive: #DC2626;
  --radius: 0.75rem;
}
```

This is a token reference, not a replacement for the project's complete theme configuration. Adapt it to the installed shadcn/ui and Tailwind versions, including any required HSL, OKLCH, or other color format conventions.

Keep semantic tokens consistent across the application. Do not hardcode new colors in individual components when an existing token already represents the intended meaning.

## 14. Design Consistency Rules

1. Use the defined color tokens before introducing new colors.
2. Use Inter or its declared fallback stack consistently.
3. Follow the typography scale.
4. Use the shared spacing and radius system.
5. Reuse shared buttons, inputs, cards, and badges.
6. Use semantic status colors consistently.
7. Keep accessible contrast in all component states.
8. Avoid random gradients, shadows, and decorative effects.
9. Do not create a separate visual style for each feature.
10. Test both responsive layouts and accessibility after significant visual changes.

## 15. Visual Quality Checklist

Before approving a page, verify:

- [ ] Colors match the shared palette.
- [ ] Text hierarchy is clear.
- [ ] Typography is consistent.
- [ ] Spacing follows the defined scale.
- [ ] Borders and shadows are restrained.
- [ ] Buttons and inputs have consistent sizing.
- [ ] Status badges use appropriate semantic colors.
- [ ] Scores and statistics are easy to scan.
- [ ] Mobile layouts remain readable.
- [ ] Contrast requirements are checked.
- [ ] Focus indicators are visible.
- [ ] No unnecessary one-off styles have been introduced.

## 16. Instructions for AI Coding Agents

When building or updating the application:

1. Read `06-UI-UX-GUIDELINES.md` and this document before implementing page styles.
2. Inspect the existing global stylesheet and theme configuration.
3. Reuse existing design tokens and shared components.
4. Avoid duplicating CSS variables or creating competing palettes.
5. Use Tailwind utilities for standard layout and spacing.
6. Use semantic theme variables for colors.
7. Preserve responsive behavior.
8. Verify contrast for important foreground/background combinations.
9. Do not rewrite the entire theme just to style one page.
10. Update the shared theme only when a genuine design-system change is needed.

## 17. Related Documentation

- `06-UI-UX-GUIDELINES.md`
- `08-DESIGN-SYSTEM.md`
- `09-FEATURES-AND-MODULES.md`
- `17-CODING-STANDARDS.md`

---

**End of Color and Typography Guidelines**
