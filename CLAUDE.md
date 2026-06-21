# myacademicweapon — Claude Context

A full-stack study resource platform for Singaporean students (Primary / Secondary / JC levels). Users can browse practice papers and study notes, track their completion/bookmarks, and manage reminders.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Auth | Clerk | @clerk/nextjs 6.x |
| Database | MongoDB via Mongoose | 8.x |
| Styling | Tailwind CSS | 3.x (NOT v4) |
| UI Components | Shadcn/UI + Radix UI | Latest |
| Animations | framer-motion | 12.x |
| Typography | next/font — Bricolage Grotesque · Hanken Grotesk · JetBrains Mono | — |
| Deployment | Vercel | — |

## Key File Paths

```
src/
├── proxy.ts                         # Clerk auth — route protection (Next 16 proxy convention, renamed from middleware.ts June 2026)
├── app/
│   ├── layout.tsx                   # Root layout — ClerkProvider, Navbar, Footer, next/font (3 fonts → CSS vars)
│   ├── page.tsx                     # Landing page (HeroParallax)
│   ├── (auth)/sign-in|sign-up/      # Clerk hosted auth pages
│   ├── api/webhooks/clerk/route.ts  # Clerk webhook: user.created/updated/deleted → MongoDB
│   ├── study-resources/[level]/     # Study resource browser (level = "secondary" | "jc")
│   ├── profile/[username]/          # User profile + activity
│   └── contribute/                  # Contribution form; /admin/* requires planId >= 100
├── components/
│   ├── shared/                      # Business components (Navbar, Calendar, UserProfile, etc.)
│   └── ui/                          # Shadcn/Radix primitives + hero-parallax (framer-motion)
├── lib/
│   ├── actions/                     # Server actions ("use server") — all DB mutations go here
│   │   ├── user.actions.ts
│   │   ├── studyresource.actions.ts
│   │   ├── resourcecontribution.actions.ts
│   │   ├── reminder.action.ts
│   │   └── useractivity.actions.ts
│   └── database/
│       ├── mongoose.ts              # Cached connection (dbName: "myacademicweapon")
│       └── models/                  # Mongoose models: User, StudyResource, UserActivity, etc.
├── types/index.d.ts                 # All global TypeScript types (UserObject, PracticePaper*, etc.)
├── utils/                           # cn.ts, tablecolumns.tsx, toggles.tsx
└── assets/                          # SVG backgrounds
next.config.js                       # Image remotePatterns for img.clerk.com
tailwind.config.ts                   # fontFamily (display/sans/mono), color tokens (ink, canvas, hairline, pri_*), shadows
.npmrc                               # legacy-peer-deps=true (react-day-picker v8 runtime-compatible with React 19)
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_SECRET_KEY=sk_test_...
MONGODB_URL=mongodb+srv://...
WEBHOOK_SECRET=whsec_...   # Svix webhook signing secret from Clerk Dashboard
```

## Authentication Patterns

**Proxy (middleware)** — `src/proxy.ts` uses `clerkMiddleware` under Next 16's `proxy` file convention (renamed from `middleware.ts` in June 2026 to clear the deprecation warning; @clerk/nextjs ≥6.39 fully supports Next 16 / the Node.js proxy runtime). Public routes are explicitly listed; everything else requires auth.

**Server components** — use `currentUser()` or `auth()` from `@clerk/nextjs/server`:
```ts
import { currentUser, auth } from '@clerk/nextjs/server'
const user = await currentUser()           // full user object
const { userId } = await auth()            // just the ID
```

**Client components** — use `useUser()` hook from `@clerk/nextjs`.

**Webhook flow** — `POST /api/webhooks/clerk` receives Svix-signed events and syncs to MongoDB. After creating a user, it calls `clerkClient().users.updateUserMetadata` to write the MongoDB `_id` into Clerk's `publicMetadata.userId`.

## Database Patterns

All DB calls go through server actions in `src/lib/actions/`. Always call `connectToDatabase()` first:

```ts
"use server"
import { connectToDatabase } from "@/lib/database/mongoose"

export async function myAction() {
  await connectToDatabase()
  // ...
}
```

**User identity**: The `UserObject` type (in `src/types/index.d.ts`) represents the MongoDB user doc. Use `getUserByClerkId(clerkId)` or `getUserByUsername(username)` to fetch it.

**Admin access**: Routes under `/contribute/admin/*` check `user.planId >= 100`. Regular users have `planId = 1`.

**Study resource types**: `"Notes"` | `"Topical"` | `"Yearly"`. Levels: `"Primary"` | `"Secondary"` | `"JC"`.

## Next.js 16 Rules (Async APIs)

In Next.js 16, `params`, `searchParams`, `headers()`, `cookies()` are **fully async**. Always `await` them:

```ts
// Page with dynamic route
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}

// API route
import { headers } from "next/headers"
const headerPayload = await headers()  // must await!
```

## Styling Conventions

The UI follows a bold **"Academic Weapon"** performance-dashboard design system — crisp white canvas, deep-navy ink, electric mint + gold accents, big type. Applied site-wide in the June 2026 redesign. Match it when building/restyling any surface.

- Tailwind v3 — do **not** upgrade to v4 (requires full config migration)
- **Fonts** (loaded in `src/app/layout.tsx` via `next/font/google`, exposed as CSS vars, wired into Tailwind `fontFamily`):
  - `font-display` → Bricolage Grotesque (titles, headings, big stat numbers)
  - `font-sans` → Hanken Grotesk (body default — replaced Roboto)
  - `font-mono` → JetBrains Mono (stats / scores / years / marks; pair with `.tnum` for tabular figures)
- **Color tokens** in `tailwind.config.ts`:
  - Structural (added in redesign): `ink` (deep-navy headings), `ink_soft` (secondary text), `canvas` (page bg), `hairline` (navy@10% borders), `mint_electric`
  - Brand palette (kept): `pri_navy_*`, `pri_mint_*`, `pri_gold_*`, `pri_red_*`, `pri_bg_card*`. Semantics: **mint** = primary/active/completion, **gold** = achievement, **red** = destructive only
  - Custom shadows: `shadow-card`, `shadow-card_hover`, `shadow-hero`, `shadow-mint`
- **Utility classes** in `src/app/globals.css`:
  - Layout: `flex_center`, `flex_col_center`, `flex_between`, `flex_col_between`
  - Design system: `.aw-card` (standard white surface = rounded-2xl + hairline border + shadow-card), `.eyebrow` (uppercase tracked label), `.tnum` (tabular figures), `.mint_grad_text` / `gold_grad_text(_2)` / `red_grad_text(_2)`, `.hero-glow` + `.hero-grid` (atmosphere behind dark hero bands), `.reveal` (staggered page-load animation — set inline `--d` for per-element delay; respects `prefers-reduced-motion`)
- Body background = `bg-canvas` + a faint dot-grid texture (set on `body` in `globals.css`)
- **`.tooltip` gotcha**: it only sets `position: relative` (so it won't override an element's own `display`). For a centered icon button, pair it with a flex utility (`inline-flex items-center justify-center` or `flex_center`) — `.tooltip` alone will NOT center the contents.
- Shadcn config: `components.json` — style `"default"`, base color `"slate"`, **no** CSS variables (`cssVariables: false`)

## framer-motion 12 Note

When defining animation `Variants`, the `ease` property must be a typed literal, not a plain `string`:

```ts
// ✅ correct
ease: "easeOut" as const

// ❌ will fail TypeScript
ease: "easeOut"  // inferred as string, not Easing
```

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm audit        # Check for vulnerabilities
```

> `next lint` was removed in Next.js 16. Set up ESLint separately if needed.

## Architecture Notes

- **No `getServerSideProps` or `getStaticProps`** — pure App Router with server components
- **Server actions** live in `src/lib/actions/` with `"use server"` directive (no leading space)
- **`next.config.js`** is the single config file (the empty `.mjs` was deleted — it was silently overriding the `.js` and breaking Clerk image loading)
- **`.npmrc`** sets `legacy-peer-deps=true` because `react-day-picker@8` doesn't declare React 19 in its peer deps (but works fine at runtime)
- **Shared `DataTable`** (`src/components/shared/DataTable.tsx`, TanStack Table) drives both the study-resources and profile tables. It renders a real `<table>` on `md+` and `renderCard` touch cards on mobile (`hidden md:block` / `md:hidden`). Pass `tableWrapperClassName="overflow-x-auto"` to drop the card chrome when nesting it inside another card (e.g. profile tabs). Per-column styling is supplied via props from the call sites (`StudyResourceSection`, `ProfileTable`); cell renderers live in `src/utils/tablecolumns.tsx`.