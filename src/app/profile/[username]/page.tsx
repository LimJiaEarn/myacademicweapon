import { auth } from "@clerk/nextjs";
import { Suspense } from 'react';
import Image from 'next/image';
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getAllUserActivities } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';

import ProfilePageTable from "@/components/shared/ProfileTable";

type UserActivityDict = {
    completed: string[];
    bookmarked: string[];
}

const ProfilePage = async ({ params }: { params: { username: string } }) => {

    const { userId } = auth();
    const { username } = params;


    const currentUserProfileObject : UserObject= await getUserByUsername(username);
    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const userID = currentUserProfileObject._id; // this is the mongoDB id
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;


    // Get user data
    const currentUserProfileTopicalData : UserActivityDict = await getAllUserActivities({userID: currentUserProfileObject._id, resourceType: "Topical"});
    const currentUserProfileYearlyData : UserActivityDict = await getAllUserActivities({userID: currentUserProfileObject._id, resourceType: "Yearly"});

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

        if (resourceObject.type==="Yearly" && 'year' in resourceObject && 'assessment' in resourceObject)
            return {
                _id: resourceObject._id.toString(),
                status: true,
                bookmark: true,
                title : resourceObject.subject + " " + resourceObject.year + " " + resourceObject.assessment,
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

    console.log(simplifiedCompletedResourceObjects);

    return (
        <div className="flex flex-col items-center gap-8 px-2 md:px-4 min-h-screen">

            {/* User meta datas */}
            <section className="flex flex-col md:flex-row items-center gap-8">
                
                <Image className="rounded-full" src={currentUserProfileObject.photo} alt="userDP" height={150} width={150}/>
                
                <div className="flex_col_center gap-4">

                    <div className="flex_col_Center">
                        <p className="font-bold">{currentUserProfileObject.firstName} {currentUserProfileObject.lastName}</p>
                        <p className="italic">{currentUserProfileObject.bio}</p>
                    </div>

                    <div className="flex_center gap-4">
                        <div className="flex_col_center">
                            <p className="font-bold text-center">Completed <br className="sm:hidden"/> Papers:</p>
                            <p className="italic text-center">{simplifiedCompletedResourceObjects.length}</p>
                        </div>

                        <div className="flex_col_center">
                            <p className="font-bold text-center">Bookmarked <br className="sm:hidden"/> Resources:</p>
                            <p className="italic text-center">{simplifiedBookmarkedResourceObjects.length}</p>
                        </div>
                    </div>

                </div>

                
            </section>

            {/* Bookmarks - only shown for own user's page */}
            {isOwnUser &&
            <section className="w-full flex_col_center">
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Bookmarks</h2>


                <ProfilePageTable data={simplifiedBookmarkedResourceObjects} userID={userID} sectionType="Bookmarks"/>
            
            </section>
            }

            {/* Completed Papers */}
            <section className="w-full flex_col_center">
                
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Completed Practice Papers</h2>

                <ProfilePageTable data={simplifiedCompletedResourceObjects} userID={userID} sectionType="Completed"/>


            </section>
            
            {/* TODO: Likes */}
            {/* <section className="w-full text-center">
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Liked Resources</h2>
            </section> */}
            


        </div>
    )


}
    

export default ProfilePage;