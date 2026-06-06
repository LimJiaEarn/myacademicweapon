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
| Deployment | Vercel | — |

## Key File Paths

```
src/
├── middleware.ts                    # Clerk auth — route protection (kept as middleware, NOT proxy)
├── app/
│   ├── layout.tsx                   # Root layout — ClerkProvider, Navbar, Footer
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
tailwind.config.ts                   # Custom color palette (pri_navy_*, pri_mint_*, etc.)
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

**Middleware** — `src/middleware.ts` uses `clerkMiddleware`. Public routes are explicitly listed; everything else requires auth. Do NOT rename this file to `proxy.ts` — the edge runtime is required for Clerk and is not supported in Next.js 16's new `proxy` convention.

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

- Tailwind v3 — do **not** upgrade to v4 (requires full config migration)
- Custom color tokens defined in `tailwind.config.ts`: `pri_navy_*`, `pri_mint_*`, `pri_gold_*`, `pri_red_*`, `pri_bg_card`, etc.
- Custom utility classes defined in `src/app/globals.css`: `flex_center`, `flex_col_center`, `gold_grad_text`, `red_grad_text`, `gold_grad_text_2`, `red_grad_text_2`
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