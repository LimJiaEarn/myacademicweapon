const LoadingProfilePage = () => {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-2 md:px-4 py-2">

      {/* Hero band skeleton */}
      <header className="relative overflow-hidden rounded-3xl bg-pri_navy_darker shadow-hero">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-pri_mint_main/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-5 p-6 md:p-8 sm:flex-row sm:items-center">
          <div className="h-[112px] w-[112px] shrink-0 rounded-2xl bg-white/10 animate-pulse" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
            <div className="h-9 w-3/5 rounded-lg bg-white/15 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-7 w-20 rounded-full bg-white/10 animate-pulse" />
              <div className="h-7 w-28 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 rounded-full bg-white/10 animate-pulse" />
            <div className="h-10 w-24 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Body skeleton */}
      <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5 lg:flex-row">

        {/* Sidebar */}
        <aside className="flex w-full flex-col gap-4 md:gap-5 lg:max-w-[340px]">
          <div className="aw-card space-y-3 p-5">
            <div className="h-5 w-28 rounded bg-hairline animate-pulse" />
            <div className="h-4 w-full rounded bg-hairline animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-hairline animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-hairline animate-pulse" />
          </div>
          <div className="aw-card space-y-3 p-5">
            <div className="h-5 w-32 rounded bg-hairline animate-pulse" />
            <div className="h-4 w-full rounded bg-hairline animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-hairline animate-pulse" />
          </div>
          <div className="aw-card p-5">
            <div className="h-5 w-44 rounded bg-hairline animate-pulse" />
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 space-y-4 md:space-y-5">

          {/* Stat row */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aw-card flex items-center gap-3 p-4 md:p-5">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-hairline animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-12 rounded bg-hairline animate-pulse" />
                  <div className="h-3 w-16 rounded bg-hairline animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Goal + subject breakdown */}
          <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
            <div className="aw-card flex min-h-[200px] items-center justify-center gap-8 p-5 md:p-6">
              <div className="h-36 w-36 rounded-full bg-hairline animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 w-16 rounded bg-hairline animate-pulse" />
                <div className="h-8 w-16 rounded bg-hairline animate-pulse" />
              </div>
            </div>
            <div className="aw-card min-h-[200px] space-y-4 p-5 md:p-6">
              <div className="h-5 w-40 rounded bg-hairline animate-pulse" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-hairline animate-pulse" />
                  <div className="h-2 w-full rounded-full bg-hairline animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Tabbed ledger */}
          <div className="aw-card min-h-[320px] space-y-4 p-4 md:p-6">
            <div className="h-12 w-full rounded-xl bg-hairline animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-full rounded bg-hairline animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingProfilePage;
