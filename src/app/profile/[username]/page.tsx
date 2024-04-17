import { currentUser, SignOutButton } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getAllUserActivities } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';
import LinkButton from "@/components/shared/LinkButton";
import Image from "next/image";
import Calendar from "@/components/shared/Calendar";

import UserAbout from '@/components/shared/UserAbout';
import UserProfile from "@/components/shared/UserProfile";
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
type Props = {
  params: { username: string }
}
 
export async function generateMetadata( { params }: Props): Promise<Metadata> {
    const user = await currentUser();
    const username = params.username;
    const currentUserProfileObject : UserObject= await getUserByUsername(username);
    if (!currentUserProfileObject){
        return {
            title: "Invalid User"
        }
    }
    const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user.id) : null;
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;
    


    return {
        title: `${isOwnUser ? "Your Profile" : currentUserProfileObject?.firstName + "'s Profile"}`,

    }
}
 


const ProfilePage = async ({ params }: { params: { username: string } }) => {

    
    const { username } = params;

    const user = await currentUser();

    const currentUserProfileObject : UserObject= await getUserByUsername(username);
    if (!currentUserProfileObject) throw new Error("Invalid User");

    const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user.id) : null;
    const userID : string = currentUserProfileObject._id as string; // this is the mongoDB id
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;

    revalidatePath(`/username/${username}`);

        
    const formattedJoinDate = new Date(currentUserProfileObject.joinDate).toLocaleDateString('en-GB', {
    day: 'numeric', // numeric day
    month: 'short', // abbreviated month
    year: 'numeric' // full year
    });

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
    
        // Directly adding score & completed date to the _doc object
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



  

    return (
        <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row justify-start gap-4 md:gap-6 px-2 md:px-4 py-2">

            {/* Profile Page Side Bar (lg) */}
            <section className="bg-pri_bg_card rounded-xl w-full px-6 md:px-4 py-4 md:py-6 flex flex-col justify-start gap-4 md:gap-6 lg:max-w-[340px]">
            
                <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center gap-4 md:gap-6">
                    {/* Mini Profile Section */}
                    <div className="flex flex-row justify-start items-center gap-2 md:gap-4">
                                    
                        <Image src={currentUserProfileObject?.photo || "/images/placeholderDP.webp"} alt="profile pic" height={90} width={90} className="rounded-lg"/>
                        <div className="">
                            <p className="text-lg font-bold leading-tight md:text-xl md:leading-relaxed text-pri_navy_dark">{currentUserProfileObject?.firstName} {currentUserProfileObject?.lastName}</p>
                            <p className="text-sm italic leading-tight md:text-md md:leading-relaxed text-pri_navy_main">joined {formattedJoinDate}</p>
                        </div>
                    </div>
                    
                    {/* Buttons */}
                    { isOwnUser &&
                    <div className="flex flex-row sm:flex-col lg:flex-row lg:w-full justify-center items-center gap-2 md:gap-4">
                        <LinkButton
                            buttonMsg="Edit Profile"
                            buttonMsgClass="text-white text-xs md:text-sm"
                            buttonColorClass="opacity-90 bg-teal-400 hover:bg-teal-500 border-gray-300 py-1 px-4 shadow-lg"
                            linksTo={`/profile/${username}/edit`}
                        />

                        <SignOutButton>
                            <LinkButton
                                buttonMsg="Sign Out"
                                buttonMsgClass="text-white text-xs md:text-sm"
                                // Updated to a gentle red with some opacity
                                buttonColorClass="opacity-90 bg-rose-300 hover:bg-rose-400 border-gray-300 py-1 px-4 shadow-lg"
                                linksTo={`/`}
                            />
                        </SignOutButton>
                    </div>}
                </div>



                <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />


                <UserAbout isOwnUser={isOwnUser} username={username} currentUserProfileObject={currentUserProfileObject}/>


                <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />
                
                <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center lg:items-start gap-4 md:gap-6">

                    <p className="w-full text-center text-pri_navy_dark font-bold text-lg lg:text-xl">Don't count the days;<br className="hidden lg:flex"/> Make the days count</p>

                </div>

                <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />
                
                <div className="flex_center w-full">        
                    <Calendar/>
                </div>



            </section>

            {/* Profile Page Client Components */}
            <section className="w-full flex-grow">

                <UserProfile
                    isOwnUser={isOwnUser}
                    userID={userID}
                    simplifiedCompletedResourceObjects={simplifiedCompletedResourceObjects}
                    simplifiedBookmarkedResourceObjects={simplifiedBookmarkedResourceObjects}

                />

            </section>


        </div>
    )
}

export default ProfilePage