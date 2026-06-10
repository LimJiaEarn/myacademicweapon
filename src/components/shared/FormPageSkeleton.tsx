// Loading skeleton for the contribute / admin form pages. Mirrors the centered
// title + narrow Form card layout so there's no shift when the real page loads.
// Pure presentational (no hooks) — safe to render from a server `loading.tsx`.

const Bar = ({ className }: { className?: string }) => (
  <div className={`bg-hairline animate-pulse ${className ?? ""}`} aria-hidden />
);

type FormPageSkeletonProps = {
  /** Render the second title line + subtitle (matches the /contribute hero). */
  withSubtitle?: boolean;
  /** Number of field stubs — set to the page's real form-config length. */
  fields?: number;
};

const FormPageSkeleton = ({ withSubtitle = false, fields = 7 }: FormPageSkeletonProps) => {
  return (
    <div className="flex_col_center gap-8 px-2 py-8 pb-8" aria-hidden>
      {/* Title */}
      <div className="flex_col_center gap-3 w-full">
        <Bar className="h-8 md:h-11 w-[280px] max-w-[80vw] rounded-lg" />
        {withSubtitle && <Bar className="h-8 md:h-11 w-[230px] max-w-[70vw] rounded-lg" />}
        {withSubtitle && <Bar className="mt-2 h-4 w-[320px] max-w-[85vw] rounded" />}
      </div>

      {/* Form card */}
      <div className="aw-card w-full max-w-[300px] p-6">
        <div className="flex_col_center gap-4 w-full">
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="flex_col_center gap-2 w-full">
              <Bar className="h-3 w-32 rounded" />
              <Bar className="h-9 w-full rounded-md" />
            </div>
          ))}
          <Bar className="mt-2 h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default FormPageSkeleton;
