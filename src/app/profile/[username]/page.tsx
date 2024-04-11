import { currentUser, SignOutButton } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getAllUserActivities } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';
import ProfilePageTable from "@/components/shared/ProfileTable";
import LinkButton from "@/components/shared/LinkButton";
import Link from "next/link";
import Image from "next/image";




const ProfilePage = async ({ params }: { params: { username: string } }) => {

    
    const { username } = params;

    const user = await currentUser();

    const currentUserProfileObject : UserObject= await getUserByUsername(username);
    const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user.id) : null;
    const userID = currentUserProfileObject._id; // this is the mongoDB id
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
                ...(resourceObject.date && { date: resourceObject.date}), 

            }
        else if (resourceObject.type==="Topical" && 'topicName' in resourceObject && 'subject' in resourceObject)
            return {
                _id: resourceObject._id.toString(),
                status: true,
                bookmark: true,
                subject: resourceObject.subject,
                title : resourceObject.subject + " " + resourceObject.topicName,
                url : resourceObject.url,
                ...(resourceObject.workingSolution && { workingSolution: resourceObject.workingSolution}),
                ...(resourceObject.videoSolution && { videoSolution: resourceObject.videoSolution}),
                ...(resourceObject.score && { score: resourceObject.score}), 
                ...(resourceObject.totMarks && { totMarks: resourceObject.totMarks}), 
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


    const simplifiedBookmarkedResourceObjects = (bookmarkedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);


    
    const simplifiedCompletedResourceObjects = (completedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);


    return (
        <div className="flex flex-col items-center mx-auto md:flex-row md:items-start gap-2 md:gap-4 px-2 md:px-4 min-h-screen relative max-w-[1500px]">

            {/* User meta datas */}
            <section className="bg-pri_bg_card rounded-lg flex flex-col w-full md:w-1/4 items-center justify-center md:items-start gap-4 px-2 md:px-4 py-2 md:py-4">

                <div className="flex_center gap-2 md:gap-4">
                    
                    {/* Mini Profile Section */}
                    <div className="relative group w-45 h-45 overflow-hidden">
                        <Image src={user?.imageUrl || "/images/placeholderDP.webp"} alt="profile pic" height={70} width={70} className="rounded-lg"/>
                        {/* { isOwnUser && <div className="absolute bottom-0 w-full flex justify-center items-end pb-2 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform group-hover:-translate-y-2 flex_center">
                            <Link href={`/profile/${username}/edit#/profile`} className="text-white text-sm py-1 px-4 rounded shadow-md">
                                Edit Image
                            </Link>
                        </div>} */}
                    </div>

                    <div>
                        <p className="text-lg font-bold leading-tight md:text-xl md:leading-relaxed text-text_gray">{currentUserProfileObject?.firstName} {currentUserProfileObject?.lastName}</p>
                        <p className="text-sm italic leading-tight md:text-md md:leading-relaxed text-text_gray text-center">@{currentUserProfileObject?.username}</p>
                    </div>

                </div>

                {/* Bio/Desc */}
                {currentUserProfileObject?.bio &&
                <div>
                    <p className="font-semibold">Bio:</p>
                    <p className="italic">{currentUserProfileObject?.bio}</p>
                </div>}
                
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
                        <li>English</li>
                        <li>E Math</li>
                        <li>A Math</li>

                    </ul>

                </div>


            </section>

            

            {currentUserProfileObject &&
                <div className="w-3/4 flex_col_center gap-2 md:gap-4">
                    <div className="bg-pri_bg_card rounded-lg px-2 md:px-4 py-2 md:py-4 w-full flex_col_center">
                        <ProfilePageTable data={simplifiedBookmarkedResourceObjects} userID={userID} sectionType="Bookmarks" isOwnUser={isOwnUser} user_name={currentUserProfileObject?.firstName  + currentUserProfileObject?.lastName}/>
                    </div>

                    <div className="bg-pri_bg_card rounded-lg px-2 md:px-4 py-2 md:py-4 w-full flex_col_center">
                        <ProfilePageTable data={simplifiedCompletedResourceObjects} userID={userID} sectionType="Completed" isOwnUser={isOwnUser} user_name={currentUserProfileObject?.firstName + currentUserProfileObject?.lastName}/>
                    </div>
                </div>
            }
            
            


        </div>
    )


}
    

export default ProfilePage;