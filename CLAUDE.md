# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server on http://localhost:3000

# Build & Lint
npm run build      # Production build (TypeScript errors are intentionally ignored)
npm run lint       # Run ESLint
npm run start      # Start production server
```

The project uses pnpm lockfile but npm/pnpm both work.

## Architecture

**SmartCar Care** is a Next.js app that functions as a client-side SPA — there is only one route (`app/page.tsx`). All navigation is handled via React context, not the Next.js file router.

### Two-tier navigation system

**Top-level (page flow)** — managed by `components/app-router.tsx` using local state:
- `landing` → `login` / `signup` → `dashboard`
- Driven by `AuthContext.isAuthenticated`; navigates with an `onNavigate(page: string)` prop pattern

**In-app (screen switching)** — managed by `lib/navigation-context.tsx` using a history stack:
- Screens: `home`, `add-car`, `subscription`, `cleaning-status`, `history`, `rating`, `complaint`, `profile`
- `AppShell` (`components/smartcar/app-shell.tsx`) maps the current `Screen` value to a component and renders it
- Navigation is via `useNavigation()` hook which provides `navigate`, `goBack`, and `history`

### Context providers

| Context | File | Purpose |
|---|---|---|
| `AuthProvider` | `lib/auth-context.tsx` | User session (mock — no real backend). Login accepts any email + password ≥ 6 chars. |
| `NavigationProvider` | `lib/navigation-context.tsx` | In-app screen history stack |

Both providers are mounted at the root in `app/page.tsx`.

### Component layers

- `components/ui/` — shadcn/ui primitives (Radix-based)
- `components/smartcar/` — custom design-system components: `GlassCard`, `AnimatedButton`, `AnimatedCard`, `StatusRing`, `FloatingParticles`, etc.
- `components/screens/` — full dashboard screens consumed by `AppShell`
- `components/landing/` — assembled into `LandingPage`; each section is its own file
- `components/auth/` — `LoginScreen` and `SignupScreen`

### Data

All app data is static mock data in `lib/mock-data.ts`: `userCar`, `cleaningStatus`, `subscriptionPlan`, `serviceHistory`, `subscriptionPlans`, `complaintIssues`.

### Styling

- Tailwind CSS v4 with `tw-animate-css`
- App is always dark mode — `html` has `className="dark"` hardcoded in `app/layout.tsx`
- Design uses oklch color tokens (see `app/globals.css`) with a glassmorphism aesthetic
- Custom tokens: `--glass`, `--glass-border`, `--glow`, `--surface`, `--metallic`
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge)

### Key build notes

- `next.config.mjs` has `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`
- `@vercel/analytics` is wired in `app/layout.tsx`
