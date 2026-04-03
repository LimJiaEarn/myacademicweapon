import { getPopulatedUserActivities } from "@/lib/actions/useractivity.actions";

export async function getFormattedProfileData(userID: string) {
  // Get user data
  const currentUserProfileTopicalData = await getPopulatedUserActivities({
    userID: userID,
    resourceType: "Topical",
  });
  
  const currentUserProfileYearlyData = await getPopulatedUserActivities({
    userID: userID,
    resourceType: "Yearly",
  });

  const completed = [
    ...currentUserProfileTopicalData.completed,
    ...currentUserProfileYearlyData.completed,
  ];
  const bookmarked = [
    ...currentUserProfileTopicalData.bookmarked,
    ...currentUserProfileYearlyData.bookmarked,
  ];

  const simplifiedCompletedResourceObjects: ISummarisedPracticePaper[] =
    completed.map((item: any) => {
      const resource = item.resourceDetails;

      const scorePercent =
        (resource.totMarks &&
          Number(item.score) /
            Number(resource.totMarks > 0 ? resource.totMarks : 100)) ||
        -1;

      return {
        _id: resource._id.toString(),
        level: resource.level,
        status: true,
        bookmark: false,
        subject: resource.subject,
        title:
          resource.type === "Yearly"
            ? resource.paper === 0
              ? `${resource.subject} ${resource.year} ${resource.schoolName} ${resource.assessment}`
              : `${resource.subject} ${resource.year} ${resource.schoolName} ${resource.assessment} P${resource.paper}`
            : `${resource.subject} ${resource.topicName} Practice ${resource.practice}`,
        url: resource.url,
        workingSolution: resource.workingSolution,
        videoSolution: resource.videoSolution,
        score: item.score,
        totMarks: resource.totMarks,
        scorePercent: scorePercent,
        date: item.date,
      };
    });

  const simplifiedBookmarkedResourceObjects: ISummarisedPracticePaper[] =
    bookmarked.map((doc: any) => {
      const resource = doc.resourceDetails;
      return {
        _id: resource._id.toString(),
        level: resource.level,
        status: true,
        bookmark: true,
        subject: resource.subject,
        title:
          resource.type === "Yearly"
            ? `${resource.subject} ${resource.year} ${resource.schoolName} ${resource.assessment} P${resource.paper}`
            : `${resource.subject} ${resource.topicName} Practice ${resource.practice}`,
        url: resource.url,
        workingSolution: resource.workingSolution,
        videoSolution: resource.videoSolution,
      };
    });

  return {
    simplifiedCompletedResourceObjects,
    simplifiedBookmarkedResourceObjects,
  };
}
