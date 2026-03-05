# AGENTS.md

## Project Context
- This project is a website for an original murder mystery setting called **Necropolis**.
- Tone: gothic, ceremonial, dramatic, and intentional.
- The visual direction is part of the storytelling, not decoration.

## Core Frontend Priorities
- Theme and color quality are top priority.
- CSS must stay organized and easy to evolve.
- Different pages can have different visual themes.
- Main typography behavior (especially nav and hero/display text) should be able to change per page.
- Background treatment should also support per-page variation with smooth transitions.

## CSS Architecture Guidelines
- Use CSS custom properties (variables) for all key visual tokens.
- Keep global/base tokens in `:root` and override page-specific tokens at page scope (example: `[data-page="..."]`).
- Prefer semantic variables such as:
  - `--theme-nav-font`
  - `--theme-heading-color`
  - `--theme-kicker-color`
  - page background tokens when needed
- Avoid hardcoding one-off colors in components when a token can be used.

## Transitions
- Theme changes between pages should feel intentional and smooth.
- Use subtle transitions for color, background, and type-driven accents.
- Keep motion restrained; avoid flashy effects.

## Typography
- Typography is a core storytelling layer.
- Preserve custom font usage and fallback stacks.
- Navigation typography should be able to switch by page theme.
- Display headings should be themeable per page.

## Concords Page Expectations
- Nav item `Concords` should route to a dedicated concords page.
- Concords page should show a square-based tile layout.
- Include the red **Desire & Conspire** tile once (ignore duplicate mention in source art direction).
- Base background colors can remain unchanged unless explicitly updated.

## Implementation Notes
- Keep layouts responsive for desktop and mobile.
- Favor clear class naming and low-specificity selectors.
- Prefer extending existing styles over rewriting working structure.
