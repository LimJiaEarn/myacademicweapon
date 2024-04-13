import { currentUser, SignOutButton } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getAllUserActivities } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';
import LinkButton from "@/components/shared/LinkButton";
import Image from "next/image";
import Tab from "@/components/shared/Tab";

const ProfilePage = async ({ params }: { params: { username: string } }) => {

  const { username } = params;

  const user = await currentUser();

  const currentUserProfileObject : UserObject= await getUserByUsername(username);
  const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user.id) : null;
  const userID : string = currentUserProfileObject._id as string; // this is the mongoDB id
  const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;

  // Utility Function
  const simplifyResourceObject = (resourceObject : PracticePaperInterface) => {
      if (!resourceObject) return null;


      if (resourceObject.type==="Yearly" && 'year' in resourceObject && 'assessment' in resourceObject && 'schoolName' in resourceObject && 'paper' in resourceObject && 'subject' in resourceObject)
          return {
              _id: resourceObject._id.toString(),
              status: true,
              bookmark: true,
              subject: resourceObject.subject,
              title : resourceObject.subject + " " + resourceObject.year + " " + resourceObject.schoolName + " " + resourceObject.assessment + " P" + resourceObject.paper,
              url : resourceObject.url,
              ...(resourceObject.workingSolution && { workingSolution: resourceObject.workingSolution}),
              ...(resourceObject.videoSolution && { videoSolution: resourceObject.videoSolution}),
              ...(resourceObject.score && { score: resourceObject.score}), 
              ...(resourceObject.totMarks && { totMarks: resourceObject.totMarks}), 
              ...(resourceObject.score && resourceObject.totMarks && { scorePercent: resourceObject.score/resourceObject.totMarks}), 
              ...(resourceObject.date && { date: resourceObject.date}), 

          }
      else if (resourceObject.type==="Topical" && 'topicName' in resourceObject && 'subject' in resourceObject && 'practice' in resourceObject)
          return {
              _id: resourceObject._id.toString(),
              status: true,
              bookmark: true,
              subject: resourceObject.subject,
              title : resourceObject.subject + " " + resourceObject.topicName + " Practice " + resourceObject.practice,
              url : resourceObject.url,
              ...(resourceObject.workingSolution && { workingSolution: resourceObject.workingSolution}),
              ...(resourceObject.videoSolution && { videoSolution: resourceObject.videoSolution}),
              ...(resourceObject.score && { score: resourceObject.score}), 
              ...(resourceObject.totMarks && { totMarks: resourceObject.totMarks}), 
              ...(resourceObject.score && resourceObject.totMarks && { scorePercent: resourceObject.score/resourceObject.totMarks}), 
              ...(resourceObject.date && { date: resourceObject.date}), 
            
          }

      return null;
  }

  // Get user data
  const currentUserProfileTopicalData : { completed: completedStudyResourceItem[], bookmarked: string[] } = await getAllUserActivities({userID: currentUserProfileObject._id, resourceType: "Topical"});
  const currentUserProfileYearlyData : { completed: completedStudyResourceItem[], bookmarked: string[] } = await getAllUserActivities({userID: currentUserProfileObject._id, resourceType: "Yearly"});

  // Merge the completed , bookmarked resourceId strings
  const completedItems : completedStudyResourceItem[] = [...currentUserProfileTopicalData.completed, ...currentUserProfileYearlyData.completed];
  const bookmarkedResourceIDs : string[] = [...currentUserProfileTopicalData.bookmarked, ...currentUserProfileYearlyData.bookmarked];
  


  const bookmarkedResourceObjectPromises = bookmarkedResourceIDs.map(async (resourceId) => {
      return await getStudyResourceByID(resourceId);
  });




  const completedResourceObjectPromises = completedItems.map(async (item) => {
      const resourceObj = await getStudyResourceByID(item.resourceObjectId);

      if (!resourceObj || ('_doc' in resourceObj && !resourceObj._doc)) return null; // Check for null and structure
  
      // Directly adding score to the _doc object
      

      if ('_doc' in resourceObj){

          const mDoc : object = resourceObj._doc as object
          return { ...mDoc, score: item.score, date: item.date };
           
      }
      return null;
  });


  const bookmarkedResourceObjects = (await Promise.all(bookmarkedResourceObjectPromises)).filter(obj => obj !== null);
  const completedResourceObjects = (await Promise.all(completedResourceObjectPromises)).filter(obj => obj !== null);


  const simplifiedBookmarkedResourceObjects: ISummarisedPracticePaper[] = (bookmarkedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);


  
  const simplifiedCompletedResourceObjects: ISummarisedPracticePaper[] = (completedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);


  // Get unique subjects
  const userAttemptedSubjects : Record<string, number> = {};
  simplifiedCompletedResourceObjects.forEach((curr : ISummarisedPracticePaper)=>{
    userAttemptedSubjects[curr.subject] = (userAttemptedSubjects[curr.subject] || 0) + 1;
  });
  

  return (
    <div className="grid grid-rows-5 grid-cols-1 gap-y-4 md:grid-cols-5 md:gap-4 px-2 md:px-4 min-h-screen max-w-[1800px] mx-auto">

    {/* User Profile */}
    <section className="bg-pri_bg_card w-full rounded-xl row-span-2 md:row-span-4 col-span-1 p-2 flex flex-col justify-start gap-2 md:gap-4">
      
      <div className="flex_center gap-2 md:gap-4">
                    
          {/* Mini Profile Section */}
        <Image src={user?.imageUrl || "/images/placeholderDP.webp"} alt="profile pic" height={70} width={70} className="rounded-lg"/>
          <div>
              <p className="text-lg font-bold leading-tight md:text-xl md:leading-relaxed text-text_gray">{currentUserProfileObject?.firstName} {currentUserProfileObject?.lastName}</p>
              <p className="text-sm italic leading-tight md:text-md md:leading-relaxed text-text_gray text-center">@ {currentUserProfileObject?.username}</p>
          </div>
      </div>

      {/* Bio/Desc */}
      {/* {currentUserProfileObject?.bio &&
      <div>
          <p className="font-semibold">Bio:</p>
          <p className="italic">{currentUserProfileObject?.bio}</p>
      </div>} */}
      
      {/* Buttons */}
      { isOwnUser &&
      <div className="flex flex-col justify-center items-center md:flex-row gap-2 md:gap-4">
          <LinkButton
              buttonMsg="Edit Profile"
              buttonMsgClass="text-white text-xs"
              buttonColorClass="opacity-90 bg-teal-400 hover:bg-teal-500 border-gray-300 py-1 px-4 shadow-lg"
              linksTo={`/profile/${username}/edit`}
          />

          <SignOutButton>
              <LinkButton
                  buttonMsg="Sign Out"
                  buttonMsgClass="text-white text-xs"
                  // Updated to a gentle red with some opacity
                  buttonColorClass="opacity-90 bg-rose-300 hover:bg-rose-400 border-gray-300 py-1 px-4 shadow-lg"
                  linksTo={`/`}
              />
          </SignOutButton>
      </div>}
      
      <div className="flex flex-col w-full justify-start">
          <h2 className="w-full text-start pl-2 text-md md:text-lg font-bold md:text-md text-text_gray">Your Subjects</h2>
          <ul className="w-full text-start pl-4 text-sm md:text-md md:text-md text-slate-600">
            {Object.entries(userAttemptedSubjects).map(([subject, completions])=>{


                return(
                    <li key={`${subject}_${completions}`}>
                        <p>{subject}</p>
                        <p>{completions}</p>
                    </li>
                )
            })}

          </ul>

      </div>
    </section>

    {/* More Stats */}
    <section className="bg-pri_bg_card rounded-xl row-span-1 col-span-4">

    </section>



    {/* Bookmarks/Completed*/}
    <section className="bg-pri_bg_card rounded-xl row-span-4 col-span-4">

        <Tab
            Tabs={[
                {
                    title:"Completed Papers",
                    titleIcon: "/icons/completed.svg",
                    data: simplifiedCompletedResourceObjects,
                    sectionType: "Completed",
                },
                {
                    title:"Bookmarks",
                    titleIcon: "/icons/bookmarked.svg",
                    data: simplifiedBookmarkedResourceObjects,
                    sectionType: "Bookmarks",
                    
                },
            ]}
            isOwnUser= {isOwnUser}
            userID = {userID}
            username={username}
        />

    </section>


</div>
  )
}

export default ProfilePage