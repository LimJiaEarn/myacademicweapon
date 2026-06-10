import FormPageSkeleton from "@/components/shared/FormPageSkeleton";

// /contribute — 2-line title + subtitle + contributionFormDetails (6 fields)
export default function Loading() {
  return <FormPageSkeleton withSubtitle fields={6} />;
}
