# Performance Audit & Implementation Plan — `/study-resources/*`

**Repo:** `LimJiaEarn/myacademicweapon`
**Scope:** `src/app/study-resources/**` and the components/actions they pull in
**Goal:** Make the study-resources pages snappier — faster initial load, instant filtering, less server work per request.

This document is written as an implementation brief. Each issue lists the file(s), the problem, the fix, and example code. Work through them in the order listed — Issues 1–5 deliver the vast majority of the improvement.

---

## Architecture summary (for context)

Request flow for `/study-resources/[level]?subject=X&resourceType=Y`:

```
src/app/study-resources/[level]/page.tsx        (RSC, dynamic)
  ├─ await currentUser()                        ← Clerk, BLOCKS shell
  ├─ await getUserByClerkId(user.id)            ← Mongo, BLOCKS shell, sequential
  ├─ <StudyBreadcrumbs/> (client)
  └─ <Suspense>
       └─ StudyResourceDataLoader (RSC)
            ├─ await getStudyResources(...)     ← Mongo, no .lean(), no index, no cache
            ├─ await getUserActivities(...)     ← Mongo, sequential, could be parallel
            └─ <StudyResourceSection/> (client)
                 └─ <DataTable/> (client, TanStack Table)
                      └─ router.push() on every filter change  ← re-runs ALL of the above
```

Key files:
- `src/app/study-resources/[level]/page.tsx`
- `src/components/shared/StudyResourceDataLoader.tsx`
- `src/components/shared/StudyResourceSection.tsx`
- `src/components/shared/DataTable.tsx`
- `src/lib/actions/studyresource.actions.ts`
- `src/lib/actions/useractivity.actions.ts`
- `src/lib/actions/user.actions.ts`
- `src/lib/database/models/studyresource.model.ts`
- `src/app/study-resources/page.tsx` (landing page)

---

## Issue 1 — `router.push` on every filter change re-runs the entire server page (HIGHEST IMPACT)

**File:** `src/components/shared/DataTable.tsx`

**Problem.** `updateSearchParams` syncs dropdown filter selections into the URL via `router.push`:

```ts
const updateSearchParams = useCallback(
  (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.push(pathname + "?" + params.toString());
  },
  [searchParams]
);
```

In the App Router, `router.push` is **not shallow**: it re-fetches the RSC payload for the page. That re-runs `currentUser()` (Clerk) + `getUserByClerkId` + `getStudyResources` + `getUserActivities` (three Mongo round trips) on **every dropdown filter selection** — even though TanStack Table has already applied the filter client-side via `setFilterValue`. This is the single biggest cause of sluggish interaction.

**Fix.** Use the History API for shallow URL updates (officially supported in Next.js 14+; the app is on Next 16). No server round trip:

```ts
const updateSearchParams = useCallback(
  (name: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(name, value);
    else params.delete(name);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  },
  [pathname]
);
```

Notes:
- Use `replaceState` (not `pushState`) so each filter click doesn't pollute browser history.
- Also fix the original `useCallback` dependency array — it listed only `searchParams` but used `router` and `pathname`.
- The "Clear Filter" path currently calls `updateSearchParams(selectorFilter.id, "")` which with the old code did `params.set(name, "")`, leaving `?assessment=` dangling in the URL. The new version deletes the param instead — keep that behavior.

---

## Issue 2 — User lookup blocks the entire page shell (HIGH IMPACT)

**File:** `src/app/study-resources/[level]/page.tsx`

**Problem.** These awaits run in the page body, **outside** the `<Suspense>` boundary:

```ts
const user = await currentUser();
const currentSignedInUserObject: UserObject = user ? await getUserByClerkId(user?.id) : null;
```

Consequences:
1. The static hero header and breadcrumbs cannot stream until Clerk **and** a Mongo query finish — on every navigation.
2. The two calls are sequential (Clerk first, then Mongo).
3. When no subject/type is selected, the page still pays for both calls just to render the "Pick a subject to begin" CTA (the loader fetches nothing in that case).

**Fix.** Move `currentUser()` + `getUserByClerkId` **inside** `StudyResourceDataLoader` (already wrapped in `<Suspense>`), so the shell streams immediately and only the table section waits:

`page.tsx` becomes:

```tsx
const StudyResourcePage = async ({ params, searchParams }: Props) => {
  const [{ level: levelParam }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const resourceLevel = paramsMap(levelParam);
  const resourceSubject = resolvedSearchParams.subject;
  const resourceType = resolvedSearchParams.resourceType?.split(" ")[0];

  // ... hero header + breadcrumbs unchanged (no user data needed there) ...

  <Suspense fallback={...}>
    <StudyResourceDataLoader
      resourceLevel={resourceLevel}
      resourceSubject={resourceSubject}
      resourceType={resourceType}
      searchParams={resolvedSearchParams}
    />
  </Suspense>
```

`StudyResourceDataLoader` takes over the user resolution (see Issue 3 for the parallelized version). It already returns `userID`/`userName` to `StudyResourceSection`, so the prop surface barely changes — `userID`/`userName` props are simply removed from the page→loader boundary and computed inside the loader.

Additional micro-fix: skip user resolution entirely when `!resourceType || !resourceSubject` (the CTA state needs no data at all).

---

## Issue 3 — Sequential awaits inside the data loader (HIGH IMPACT)

**File:** `src/components/shared/StudyResourceDataLoader.tsx`

**Problem.** `getStudyResources` and the user lookups are independent but awaited sequentially. Combined with Issue 2 the full waterfall is: Clerk → user doc → resources → activities (4 serial round trips).

**Fix.** Parallelize what's independent:

```ts
export default async function StudyResourceDataLoader({ resourceLevel, resourceSubject, resourceType, searchParams }) {
  let data: StudyResourceInterface[] = [];
  let userID: string | null = null;
  let userName: string | null = null;

  if (resourceType && resourceSubject) {
    try {
      const user = await currentUser(); // fast: reads session, no DB

      // resources + user doc in parallel
      const [fetchedData, userObject] = await Promise.all([
        getStudyResources({
          type: resourceType as "Notes" | "Topical" | "Yearly",
          level: resourceLevel as "Primary" | "Secondary" | "JC",
          subject: resourceSubject,
        }),
        user ? getUserByClerkId(user.id) : Promise.resolve(null),
      ]);

      userID = userObject?._id ?? null;
      userName = userObject?.username ?? null;

      const [bookmarkedResourceIDs, completedResourceObject] = userID
        ? await getUserActivities({ userID, resourceType: resourceType as "Notes" | "Yearly" | "Topical" })
        : [[], []];

      // ... merge (see Issue 6) ...
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return <StudyResourceSection userID={userID} userName={userName} ... initialTableData={data} />;
}
```

Optional further win: change `getUserActivities` to accept a `clerkId` and resolve the user inside one action (or look up activities by clerkId directly) so resources, user, and activities can all run in a single `Promise.all`.

---

## Issue 4 — Mongoose: no `.lean()`, per-document serialization, and no index (HIGH IMPACT)

**Files:** `src/lib/actions/studyresource.actions.ts`, `src/lib/actions/user.actions.ts`, `src/lib/database/models/studyresource.model.ts`

**Problem (a) — document hydration.** `getStudyResources` does:

```ts
resources = await StudyResource.find(query).sort({ year: -1, schoolName: 1 });
return resources.map(resource => JSON.parse(JSON.stringify(resource)));
```

- `find()` without `.lean()` hydrates full Mongoose documents (change tracking, getters, virtuals) — pure overhead for read-only data.
- `JSON.parse(JSON.stringify(...))` is called **once per document** instead of once on the array.

**Fix:**

```ts
resources = await StudyResource.find(query)
  .sort({ year: -1, schoolName: 1 })
  .lean();
return JSON.parse(JSON.stringify(resources)); // single pass, converts ObjectIds/Dates to strings
```

Apply the same `.lean()` treatment to `getUserByClerkId` (`User.findOne({ clerkId }).lean()`) and the read inside `getUserActivities` (`UserActivity.findOne(...).lean()` — note `updateStatusStudyResource`/bookmark writers must keep full documents since they call `.save()`).

Also consider `.select(...)` projections in `getStudyResources` to send only the fields the table uses (drops payload size for large subjects).

**Problem (b) — no index.** `StudyResourceSchema` (in `studyresource.model.ts`) defines **no indexes**. Every page load runs `find({ type, level, subject })` plus a sort as a collection scan + in-memory sort.

**Fix.** Add a compound index covering the query and the most common sort:

```ts
StudyResourceSchema.index({ level: 1, subject: 1, type: 1, year: -1, schoolName: 1 });
// Optionally also:
StudyResourceSchema.index({ level: 1, subject: 1, type: 1, topicName: 1, practice: 1 });
```

And on `UserActivity`:

```ts
UserActivitySchema.index({ userObjectId: 1, type: 1 });
```

(Mongoose creates these automatically on startup unless `autoIndex` is disabled; verify they exist in Atlas after deploy.)

---

## Issue 5 — No caching of the (effectively static) resource list (HIGH IMPACT)

**File:** `src/lib/actions/studyresource.actions.ts` (+ a small wrapper, + the mutation actions)

**Problem.** The page is necessarily dynamic (per-user state via Clerk), but the resource catalogue is identical for every visitor and changes rarely. Today every single visit hits MongoDB for it. There is also a stale `revalidatePath("/resources")` in `deleteStudyResource` that doesn't match any real route.

**Fix.** Cache the catalogue with `unstable_cache` keyed by query, tagged for invalidation:

```ts
// src/lib/actions/studyresource.actions.ts (or a new cached wrapper module)
import { unstable_cache, revalidateTag } from "next/cache";

export async function getCachedStudyResources(params: GetStudyResourcesParams) {
  const cached = unstable_cache(
    () => getStudyResources(params),
    ["study-resources", params.level, params.subject, params.type],
    { revalidate: 3600, tags: ["study-resources"] }
  );
  return cached();
}
```

- `StudyResourceDataLoader` calls `getCachedStudyResources` instead of `getStudyResources`.
- In `createPracticePaper`, `createNote`, update and delete actions: call `revalidateTag("study-resources")` (and remove/replace the dead `revalidatePath("/resources")`).
- Per-user data (`getUserActivities`) stays uncached/dynamic — it's a tiny single-document query once Issue 4's index exists.

Result: warm requests skip the heavy Mongo query entirely; only the small per-user lookup remains dynamic.

---

## Issue 6 — O(n×m) status merge + three sequential array passes (MEDIUM)

**File:** `src/components/shared/StudyResourceDataLoader.tsx`

**Problem.**

```ts
status: completedResourceIDs.includes(item._id),     // O(m) per row
bookmark: bookmarkedResourceIDs.includes(item._id),  // O(m) per row
```

…followed by a *second* full `.map()` pass to build the `resource` display label. For a few hundred papers × a diligent user's completion list this is wasted work on every request.

**Fix.** Use `Set` lookups and a single pass:

```ts
const completedSet = new Set(
  completedResourceObject.map((i: any) => i.resourceObjectId)
);
const bookmarkSet = new Set(bookmarkedResourceIDs);

const buildResourceLabel = (type: string, item: any): string => {
  if (type === "Yearly")
    return item.paper === 0
      ? `${item.year} ${item.assessment} ${item.schoolName}`
      : `${item.year} ${item.assessment} ${item.schoolName} P${item.paper}`;
  if (type === "Topical") return `${item.topicName} Practice ${item.practice}`;
  return item.title; // Notes
};

data = (fetchedData ?? []).map((item: any) => ({
  ...item,
  status: completedSet.has(item._id),
  bookmark: bookmarkSet.has(item._id),
  resource: buildResourceLabel(resourceType, item),
  ...(resourceType === "Notes" && {
    topicNames: item.topicNames?.length ? item.topicNames.join(", ") : "",
  }),
}));
```

---

## Issue 7 — Every row renders twice: table AND mobile cards (MEDIUM, biggest mobile win)

**File:** `src/components/shared/DataTable.tsx`

**Problem.** When `renderCard` is provided (always, from `StudyResourceSection`), the component renders **both** the full `<table>` (`hidden md:block`) and the card stack (`md:hidden`), merely hiding one with CSS. With `maxRows={16}`, that's 32 row trees mounted and hydrated per page — each containing `ResourceActions` with its Radix `Dialog`. Mobile devices (where snappiness matters most) pay to hydrate a desktop table they never see.

**Fix.** Render only one presentation, decided by a `matchMedia` hook:

```ts
function useIsDesktop(query = "(min-width: 768px)") {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return isDesktop;
}
```

Render the table when `isDesktop !== false` and cards when `isDesktop === false` (server/first paint defaults to the existing CSS-hidden dual render only for the initial frame if you want zero layout flash — or simply accept a one-frame default-to-table and let the effect correct it). Either way, after hydration only one tree should exist.

---

## Issue 8 — Hook-level cleanups in `DataTable` / `StudyResourceSection` (LOW–MEDIUM)

**Files:** `src/components/shared/DataTable.tsx`, `src/components/shared/StudyResourceSection.tsx`

These are the "unoptimised hooks" suspected in the original request — real but secondary to Issues 1–5.

**8a. Column visibility set in a post-mount `useEffect`.**
The table first renders with ALL columns visible, then a `useEffect` hides `toHideColumns` and sets page size — forcing an immediate second render (and a visible flash on slow devices). Replace with initial state:

```ts
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
  Object.fromEntries(toHideColumns.map((c) => [c, false]))
);

const table = useReactTable({
  // ...
  initialState: { pagination: { pageSize: maxRows } },
});
```

Then delete the `useEffect` entirely (keep a small effect only if `toHideColumns` can genuinely change at runtime — in this app it can't; it's fixed per resourceType and the component remounts via the `key` on `StudyResourceSection`).

**8b. Side effect inside a `useState` initializer.**
The `filterSelectorValue` initializer calls `col?.setFilterValue(currentValue)` during render — a side effect in render, double-invoked under Strict Mode. Move URL→filter restoration into the table's initial `columnFilters` state instead:

```ts
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
  (selectorFilters ?? [])
    .map((f) => ({ id: f.id, value: searchParams.get(f.id) || "" }))
    .filter((f) => f.value)
);
```

and derive `filterSelectorValue`'s initial map from the same data, with no `setFilterValue` calls during render.

**8c. Unstable handler identities in `StudyResourceSection`.**
`onToggleStatus` / `onToggleBookmark` are recreated every render but captured by `tableColumns` (memoized with the exhaustive-deps lint disabled). It works today only because they use functional `setTableData` updates. Wrap both in `useCallback` (deps: `resourceType`, `toast`) so the memo is honest and the lint suppression can be removed.

**8d. `getSelectorFilters` recomputed on every render.**
It does two full passes + `Set` construction over `tableData` on every render — including every keystroke in the search input (search updates table state → section re-renders). Wrap in `useMemo`:

```ts
const selectorFilters = useMemo(
  () => getSelectorFilters(resourceType, tableData),
  [resourceType, tableData]
);
```

**8e. Random quote forces a guaranteed post-hydration re-render.**
`randomQuoteIndex` starts at 0, then a `useEffect` immediately randomizes it — re-rendering the entire section (table included) right after hydration. Pick the quote on the server in `StudyResourceDataLoader` and pass it as a prop (`quote={quotes[Math.floor(Math.random() * quotes.length)]}`), removing the state + effect entirely.

---

## Issue 9 — Landing page (`/study-resources`) image handling (LOW–MEDIUM, helps LCP)

**Files:** `src/app/study-resources/page.tsx`, `public/images/*`

**Problems.**
- Section cards use a raw `<img>` (`w-[900px] h-[240px] sm:h-[350px]`) for 200–370 KB webp files — no `next/image`, no responsive `sizes`, no `priority`. The first card is the page's LCP element.
- `public/images/BigLogo.svg` is **~1 MB** — extremely large for an SVG; if it appears in the shared `NavBar`/`Footer` it taxes every page including study-resources.

**Fixes.**
- Replace `<img>` with `next/image`:

```tsx
import Image from "next/image";

<Image
  src={props.image}
  alt={props.title}
  width={900}
  height={350}
  priority={props.priority}        // pass true for the first card only
  sizes="(max-width: 940px) 100vw, 900px"
  className="w-[900px] h-[240px] sm:h-[350px] object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
/>
```

- Run `BigLogo.svg` through SVGO (it likely contains an embedded raster image — if so, replace with a properly sized webp/avif via `next/image`).

---

## Issue 10 — Misc small fixes (LOW)

- **`src/app/study-resources/[level]/page.tsx`:** `await params` and `await searchParams` sequentially in both `generateMetadata` and the page body — trivial, but `Promise.all([params, searchParams])` is free.
- **`handleOpenStudyResourceLink` (`src/utils/toggles.tsx`):** fires a server action (`incrementStudyResourceClicks`) on every resource click and `await`s it. It's already after `window.open`, so it doesn't block the open, but make it fire-and-forget explicitly (`void incrementStudyResourceClicks(resourceId)` with `.catch(() => {})`) and consider `navigator.sendBeacon`-style batching later.
- **Dead revalidation path:** `revalidatePath("/resources")` in `deleteStudyResource` targets a non-existent route — replace with `revalidateTag("study-resources")` per Issue 5.

---

## Implementation order & expected impact

| # | Change | Effort | Impact |
|---|--------|--------|--------|
| 1 | Shallow URL updates in `DataTable` (`history.replaceState`) | XS | Filtering becomes instant; eliminates Clerk + 3 Mongo calls per filter click |
| 2 | Move user lookup inside Suspense boundary | S | Hero/breadcrumbs stream immediately; perceived nav speed |
| 3 | Parallelize loader awaits | XS | ~40–50% faster dynamic section server time |
| 4 | `.lean()` + single serialize + compound indexes | S | Faster queries, less CPU/memory per request |
| 5 | `unstable_cache` + `revalidateTag` for the catalogue | S | Warm requests skip the heavy query entirely |
| 6 | Set-based merge, single pass | XS | Removes O(n×m) work per request |
| 7 | Render table OR cards, not both | M | Halves hydration cost; biggest mobile win |
| 8 | Hook cleanups (visibility init state, no render side-effects, useCallback/useMemo, server-picked quote) | S | Removes redundant re-renders/flash |
| 9 | `next/image` + priority on landing cards; shrink BigLogo.svg | S | LCP improvement on `/study-resources` |
| 10 | Misc (Promise.all params, fire-and-forget click tracking, dead revalidatePath) | XS | Hygiene |

## Verification checklist (after implementation)

1. `npm run build` passes; no new ESLint errors (the `exhaustive-deps` suppression in `StudyResourceSection` should be removable after 8c).
2. Selecting a dropdown filter updates the URL **without** a network request to the page route (check DevTools Network — no RSC fetch).
3. Navigating to `/study-resources/secondary?subject=...&resourceType=...` streams the hero immediately, table follows.
4. Refreshing a URL with `?assessment=Prelims` still restores the filter into the dropdown and the table (regression check for 8b).
5. Bookmark/complete toggles still work signed-in, still show the sign-in toast signed-out, and the row updates optimistically.
6. Mobile (<768px) shows cards only; desktop shows table only — confirm via React DevTools that only one row tree is mounted.
7. After creating/deleting a resource through the admin flow, the cached list refreshes (revalidateTag works).
8. MongoDB Atlas shows the new indexes; the `find({level,subject,type})` query plan uses IXSCAN, not COLLSCAN.
