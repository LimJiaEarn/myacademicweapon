import { currentUser, SignOutButton } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getPopulatedUserActivities } from '@/lib/actions/useractivity.actions';
import LinkButton from "@/components/shared/LinkButton";
import Image from "next/image";
import Calendar from "@/components/shared/Calendar";
import UserAbout from '@/components/shared/UserAbout';
import UserProfile from "@/components/shared/UserProfile";
import { Metadata } from 'next'


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
        
    const formattedJoinDate = new Date(currentUserProfileObject.joinDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
    });

    // Get user data
    const currentUserProfileTopicalData : { completed: completedStudyResourceItem[], bookmarked: string[] } = await getPopulatedUserActivities({userID: currentUserProfileObject._id, resourceType: "Topical"});
    const currentUserProfileYearlyData : { completed: completedStudyResourceItem[], bookmarked: string[] } = await getPopulatedUserActivities({userID: currentUserProfileObject._id, resourceType: "Yearly"});



    const completed : any[] = [...currentUserProfileTopicalData.completed, ...currentUserProfileYearlyData.completed];
    const bookmarked : any[] = [...currentUserProfileTopicalData.bookmarked, ...currentUserProfileYearlyData.bookmarked];


    const simplifiedCompletedResourceObjects : ISummarisedPracticePaper[] = completed.map((item:any) => {
        const resource = item.resourceDetails;

        const scorePercent = resource.totMarks && Number(item.score)/Number(resource.totMarks) || -1;

        return {
            _id: resource._id.toString(),
            level: resource.level,
            status: true,
            bookmark: false,
            subject: resource.subject,
            title: resource.type === "Yearly" ?
            (resource.paper === 0 ?
                `${resource.subject} ${resource.year} ${resource.schoolName} ${resource.assessment}` :
                `${resource.subject} ${resource.year} ${resource.schoolName} ${resource.assessment} P${resource.paper}`
            ) :
            `${resource.subject} ${resource.topicName} Practice ${resource.practice}`,
            url: resource.url,
            workingSolution: resource.workingSolution,
            videoSolution: resource.videoSolution,
            score: item.score,
            totMarks: resource.totMarks,
            scorePercent: scorePercent,
            date: item.date,
        };
    });
    
    const simplifiedBookmarkedResourceObjects : ISummarisedPracticePaper[]= bookmarked.map((doc: any) => {
        const resource = doc.resourceDetails;
        return {
            _id: resource._id.toString(),
            level: resource.level,
            status: true,
            bookmark: true,
            subject: resource.subject,
            title: resource.type === "Yearly" ? `${resource.subject} ${resource.year} ${resource.schoolName} ${resource.assessment} P${resource.paper}` : `${resource.subject} ${resource.topicName} Practice ${resource.practice}`,
            url: resource.url,
            workingSolution: resource.workingSolution,
            videoSolution: resource.videoSolution,
        };
    });

  

    return (
        <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row justify-start gap-4 md:gap-6 px-2 md:px-4 py-2">

            {/* Profile Page Side Bar (lg) */}
            <section className="bg-pri_bg_card rounded-xl w-full px-6 md:px-4 py-4 md:py-6 flex flex-col justify-start gap-4 md:gap-6 lg:max-w-[340px]">
            
                <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center gap-4 md:gap-6">
                    {/* Mini Profile Section */}
                    <div className="flex flex-row justify-start items-center gap-2 md:gap-4">
                                    
                        <Image src={currentUserProfileObject?.photo || "/images/placeholderDP.webp"} alt="profile pic" height={100} width={100} className="rounded-lg"/>
                        <div className="">
                            <p className="text-lg font-bold leading-tight md:text-xl md:leading-relaxed text-pri_navy_dark">{currentUserProfileObject?.firstName} {currentUserProfileObject?.lastName}</p>
                            <p className="text-sm italic leading-tight md:text-md md:leading-relaxed text-pri_navy_main">joined {formattedJoinDate}</p>
                        </div>
                    </div>
                    
                    {/* Buttons */}
                    { isOwnUser &&
                    <div className="flex flex-row sm:flex-col lg:flex-row lg:w-full justify-center items-center gap-2 md:gap-4">
                        <LinkButton
                            buttonMsg="Edit Account"
                            buttonMsgClass="text-white text-xs md:text-sm"
                            buttonColorClass="opacity-90 bg-teal-400 hover:bg-teal-500 border-gray-300 py-1 px-4 shadow-lg"
                            linksTo={`/profile/${username}/edit`}
                        />

                        <SignOutButton>
                            <LinkButton
                                buttonMsg="Sign Out"
                                buttonMsgClass="text-white text-xs md:text-sm"
                                buttonColorClass="opacity-90 bg-rose-300 hover:bg-rose-400 border-gray-300 py-1 px-4 shadow-lg"
                                linksTo={`/`}
                            />
                        </SignOutButton>
                    </div>}
                </div>



                <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />


                <UserAbout isOwnUser={isOwnUser} username={username} currentUserProfileObject={currentUserProfileObject}/>
                
                <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />
                
                <div className="flex_center w-full">        
                    <Calendar/>
                </div>

                <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />
                
                <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center lg:items-start gap-4 md:gap-6">

                    <p className="w-full text-center text-pri_navy_dark font-bold text-lg lg:text-xl">Don't count the days;<br className="hidden lg:flex"/> Make the days count</p>

                </div>


            </section>

            {/* Profile Page Client Components */}
            <section className="w-full flex-grow">

                <UserProfile
                    currentUserProfileObject = {currentUserProfileObject}
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