// Loading skeleton for /profile/[username]/edit — mirrors the page's
// "Save & Exit" button above Clerk's large <UserProfile/> card.
const LoadingEditProfile = () => {
  return (
    <div className="flex_col_center gap-4" aria-hidden>
      {/* Save & Exit button */}
      <div className="h-9 w-[135px] rounded-full bg-hairline animate-pulse" />

      {/* Clerk <UserProfile/> stand-in */}
      <div className="aw-card w-full max-w-[880px] p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full bg-hairline animate-pulse" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-hairline animate-pulse" />
            <div className="h-3 w-56 max-w-[70%] rounded bg-hairline animate-pulse" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded-md bg-hairline animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingEditProfile;
