import { getCachedStudyResources } from "@/lib/actions/studyresource.actions";
import { getSessionUserActivities } from "@/lib/actions/useractivity.actions";
import { quotes } from "../../../constants/quotes";
import StudyResourceSection from "./StudyResourceSection";

interface StudyResourceDataLoaderProps {
  resourceLevel: string;
  resourceSubject: string;
  resourceType: string;
  searchParams: { [key: string]: string };
}

function buildResourceLabel(resourceType: string, item: any): string {
  if (resourceType === "Yearly")
    return item.paper === 0
      ? `${item.year} ${item.assessment} ${item.schoolName}`
      : `${item.year} ${item.assessment} ${item.schoolName} P${item.paper}`;
  if (resourceType === "Topical")
    return `${item.topicName} Practice ${item.practice}`;
  return item.title; // Notes
}

export default async function StudyResourceDataLoader({
  resourceLevel,
  resourceSubject,
  resourceType,
  searchParams,
}: StudyResourceDataLoaderProps) {

  let data: StudyResourceInterface[] = [];
  let userID: string | null = null;
  let userName: string | null = null;

  // The CTA state ("pick a subject to begin") needs no data at all
  if (resourceType && resourceSubject) {
    try {
      // Catalogue (cached, shared by all visitors) + per-user state in parallel
      const [fetchedData, activities] = await Promise.all([
        getCachedStudyResources({
          type: resourceType as "Notes" | "Topical" | "Yearly",
          level: resourceLevel as "Primary" | "Secondary" | "JC",
          subject: resourceSubject,
        }),
        getSessionUserActivities(resourceType as "Notes" | "Yearly" | "Topical"),
      ]);

      userID = activities?.userID ?? null;
      userName = activities?.userName ?? null;

      const completedSet = new Set(activities?.completedResourceIDs ?? []);
      const bookmarkSet = new Set(activities?.bookmarkedResourceIDs ?? []);

      data = (fetchedData ?? []).map((item: any) => ({
        ...item,
        status: completedSet.has(item._id),
        bookmark: bookmarkSet.has(item._id),
        resource: buildResourceLabel(resourceType, item),
        ...(resourceType === "Notes" && {
          topicNames: item.topicNames?.length ? item.topicNames.join(", ") : "",
        }),
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <StudyResourceSection
      key={`${resourceLevel}-${resourceSubject}-${resourceType}`}
      userID={userID}
      userName={userName}
      resourceLevel={resourceLevel}
      resourceSubject={resourceSubject}
      resourceType={resourceType}
      searchParams={searchParams}
      initialTableData={data}
      quote={quotes[Math.floor(Math.random() * quotes.length)]}
    />
  );
}
