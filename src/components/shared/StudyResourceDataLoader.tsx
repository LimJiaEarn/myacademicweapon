import { getStudyResources } from "@/lib/actions/studyresource.actions";
import { getUserActivities } from "@/lib/actions/useractivity.actions";
import StudyResourceSection from "./StudyResourceSection";

interface StudyResourceDataLoaderProps {
  userID: string | null;
  userName: string | null;
  resourceLevel: string;
  resourceSubject: string;
  resourceType: string;
  searchParams: { [key: string]: string };
}

export default async function StudyResourceDataLoader({
  userID,
  userName,
  resourceLevel,
  resourceSubject,
  resourceType,
  searchParams,
}: StudyResourceDataLoaderProps) {

  let data: StudyResourceInterface[] = [];

  if (resourceType && resourceSubject) {
    try {
      // Call a server action to get data to populate the table
      let fetchedData: StudyResourceInterface[] | undefined = await getStudyResources({
        type: resourceType as "Notes" | "Topical" | "Yearly",
        level: resourceLevel as "Primary" | "Secondary" | "JC",
        subject: resourceSubject,
      });

      if (userID && fetchedData) {
        const [bookmarkedResourceIDs, completedResourceObject] = await getUserActivities({
          userID,
          resourceType: resourceType as "Notes" | "Yearly" | "Topical",
        });

        const completedResourceIDs = completedResourceObject.map(
          (item: any) => item.resourceObjectId
        );

        // Update the data with status and bookmarked fields
        fetchedData = fetchedData.map((item) => ({
          ...item,
          status: completedResourceIDs.includes(item._id),
          bookmark: bookmarkedResourceIDs.includes(item._id),
        }));
      } else if (fetchedData) {
        // If user is not signed in, set all statuses and bookmarked fields to false
        fetchedData = fetchedData.map((item) => ({
          ...item,
          status: false,
          bookmark: false,
        }));
      }

      // Summarise the data into `resource` for the table
      if (resourceType === "Yearly" && fetchedData) {
        fetchedData = (fetchedData as YearlyPracticePaper[]).map((item) => ({
          ...item,
          resource:
            item.paper === 0
              ? `${item.year} ${item.assessment} ${item.schoolName}`
              : `${item.year} ${item.assessment} ${item.schoolName} P${item.paper}`,
        }));
      } else if (resourceType === "Topical" && fetchedData) {
        fetchedData = (fetchedData as TopicalPracticePaper[]).map((item) => ({
          ...item,
          resource: item.topicName + " Practice " + item.practice,
        }));
      } else if (resourceType === "Notes" && fetchedData) {
        fetchedData = (fetchedData as StudyNotesInterface[]).map((item) => ({
          ...item,
          resource: item.title,
          topicNames:
            item.topicNames.length > 0 ? item.topicNames.join(", ") : "",
        }));
      }

      data = fetchedData || [];
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
    />
  );
}
