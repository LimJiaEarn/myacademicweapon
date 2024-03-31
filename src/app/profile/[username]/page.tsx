import { auth, SignOutButton } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getAllUserActivities } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';
import ProfilePageTable from "@/components/shared/ProfileTable";
import Link from 'next/link';

const ProfilePage = async ({ params }: { params: { username: string } }) => {

    const { userId } = auth();
    const { username } = params;

    const currentUserProfileObject : UserObject= await getUserByUsername(username);
    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const userID = currentUserProfileObject._id; // this is the mongoDB id
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;


    // Get user data
    const currentUserProfileTopicalData : { completed: string[], bookmarked: string[] } = await getAllUserActivities({userID: currentUserProfileObject._id, resourceType: "Topical"});
    const currentUserProfileYearlyData : { completed: string[], bookmarked: string[] } = await getAllUserActivities({userID: currentUserProfileObject._id, resourceType: "Yearly"});

    // fetch resource data
    const completedResourceIDs : string[] = [...currentUserProfileTopicalData.completed, ...currentUserProfileYearlyData.completed];
    const bookmarkedResourceIDs : string[] = [...currentUserProfileTopicalData.bookmarked, ...currentUserProfileYearlyData.bookmarked];
    
    const bookmarkedResourceObjectPromises = bookmarkedResourceIDs.map(async (resourceId) => {
        return getStudyResourceByID(resourceId);
    });

    const completedResourceObjectPromises = completedResourceIDs.map(async (resourceId) => {
        return getStudyResourceByID(resourceId);
    });

    const bookmarkedResourceObjects = (await Promise.all(bookmarkedResourceObjectPromises)).filter(obj => obj !== null);
    const completedResourceObjects = (await Promise.all(completedResourceObjectPromises)).filter(obj => obj !== null);


    const simplifyResourceObject = (resourceObject : PracticePaperInterface) => {
        if (!resourceObject) return null;

        if (resourceObject.type==="Yearly" && 'year' in resourceObject && 'assessment' in resourceObject && 'schoolName' in resourceObject && 'paper' in resourceObject)
            return {
                _id: resourceObject._id.toString(),
                status: true,
                bookmark: true,
                title : resourceObject.subject + " " + resourceObject.year + " " + resourceObject.schoolName + " " + resourceObject.assessment + " P" + resourceObject.paper,
                url : resourceObject.url,
                ...(resourceObject.workingSolution && { workingSolution: resourceObject.workingSolution}),
                ...(resourceObject.videoSolution && { videoSolution: resourceObject.videoSolution}), 
            }
        else if (resourceObject.type==="Topical" && 'topicName' in resourceObject)
            return {
                _id: resourceObject._id.toString(),
                status: true,
                bookmark: true,
                title : resourceObject.subject + " " + resourceObject.topicName,
                url : resourceObject.url,
                ...(resourceObject.workingSolution && { workingSolution: resourceObject.workingSolution}),
                ...(resourceObject.videoSolution && { videoSolution: resourceObject.videoSolution}), 
            }

        return null;
    }

    const simplifiedCompletedResourceObjects = (completedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);
    const simplifiedBookmarkedResourceObjects = (bookmarkedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);

    // To test loading
    // const delay = (ms: number) => new Promise<number>(resolve => setTimeout(() => resolve(ms), ms));

    // delay(1000).then((value) => {
    // console.log(`Waited for ${value / 1000} seconds`);
    // });


    return (
        <div className="flex flex-col items-center gap-8 px-2 md:px-4 min-h-screen">

            {/* User meta datas */}
            <section className="flex flex-col md:flex-row items-center gap-8">
            
                
                <div className="flex_col_center gap-4">

                    <div className="flex_col_Center">
                        <p className="font-bold">{currentUserProfileObject.firstName} {currentUserProfileObject.lastName}</p>
                        <p className="italic">{currentUserProfileObject.bio}</p>

                        <Link href={`/profile/${username}/edit`}><p>Edit Profile</p></Link>
                        <SignOutButton />
                    </div>



                </div>

                
            </section>

            {/* Bookmarks - only shown for own user's page */}
            {isOwnUser &&
            <section className="w-full flex_col_center">
                <ProfilePageTable data={simplifiedBookmarkedResourceObjects} userID={userID} sectionType="Bookmarks" isOwnUser={isOwnUser} user_name={currentUserProfileObject.firstName + currentUserProfileObject.lastName}/>
            </section>
            }

            {/* Completed Papers */}
            <section className="w-full flex_col_center">
                <ProfilePageTable data={simplifiedCompletedResourceObjects} userID={userID} sectionType="Completed" isOwnUser={isOwnUser} user_name={currentUserProfileObject.firstName + currentUserProfileObject.lastName}/>
            </section>
            
            {/* TODO: Likes */}
            {/* <section className="w-full text-center">
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Liked Resources</h2>
            </section> */}
            


        </div>
    )


}
    

export default ProfilePage;