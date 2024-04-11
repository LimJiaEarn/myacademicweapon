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
        <div className="flex flex-col items-center gap-8 px-2 md:px-4 min-h-screen relative">

            {/* User meta datas */}
            <section className="flex flex-col md:flex-row items-center gap-8">

                <div className="relative group w-45 h-45 rounded-full overflow-hidden">
                    <Image src={user?.imageUrl || "/images/placeholderDP.webp"} alt="profile pic" height={180} width={180} className="rounded-full"/>
                    <div className="absolute bottom-0 w-full flex justify-center items-end pb-2 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform group-hover:-translate-y-2 flex_center">
                        <Link href={`/profile/${username}/edit#/profile`} className="text-white text-sm py-1 px-4 rounded shadow-md">
                            Edit Image
                        </Link>
                    </div>
                </div>


                <div className="flex_col_center gap-4">
                    <div className="flex_col_center">
                        <h1 className="text-3xl font-bold leading-tight sm:text-3xl sm:leading-normal md:text-4xl md:leading-relaxed text-text_gray">{currentUserProfileObject?.firstName} {currentUserProfileObject?.lastName}</h1>
                        <p className="italic">{currentUserProfileObject?.bio}</p>

                        {isOwnUser &&
                        <div className="flex_center gap-2">
                            <LinkButton
                                buttonMsg="Edit Profile"
                                buttonMsgClass="text-white text-sm"
                                // Adjusted for a softer blue
                                buttonColorClass="opacity-90 bg-cyan-500 hover:bg-cyan-600 border-gray-300 py-1 w-[135px] shadow-lg"
                                linksTo={`/profile/${username}/edit`}
                            />

                            {/* Navigates user to home page */}
                            <SignOutButton>
                                <LinkButton
                                    buttonMsg="Sign Out"
                                    buttonMsgClass="text-white text-sm"
                                    // Adjusted for a gentler red
                                    buttonColorClass="opacity-90 bg-rose-300 hover:bg-red-400 border-gray-300 py-1 w-[135px] shadow-lg"
                                    linksTo={`/`}
                                />
                            </SignOutButton>
                        </div>}
                    </div>
                </div>

                
            </section>
            {currentUserProfileObject &&
                <section className="w-full">
                    <div className="w-full flex_col_center">
                        <ProfilePageTable data={simplifiedBookmarkedResourceObjects} userID={userID} sectionType="Bookmarks" isOwnUser={isOwnUser} user_name={currentUserProfileObject?.firstName  + currentUserProfileObject?.lastName}/>
                    </div>

                    <div className="w-full flex_col_center">
                        <ProfilePageTable data={simplifiedCompletedResourceObjects} userID={userID} sectionType="Completed" isOwnUser={isOwnUser} user_name={currentUserProfileObject?.firstName + currentUserProfileObject?.lastName}/>
                    </div>
                </section>
            }
            
            


        </div>
    )


}
    

export default ProfilePage;