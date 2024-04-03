"use client"

import { useState, useEffect } from 'react';
import { useUser, SignOutButton } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getAllUserActivities } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';
import ProfilePageTable from "@/components/shared/ProfileTable";
import Link from 'next/link';

const ProfilePage = ({ params }: { params: { username: string } }) => {

    
    const { username } = params;


    const getUserId = () => new Promise<string>(resolve => {
        const { userId } = auth();
        return userId;
    });

    const userId = await getUserId();

    const currentUserProfileObject : UserObject= await getUserByUsername(username);
    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const userID = currentUserProfileObject._id; // this is the mongoDB id
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;

    console.log(`Clerk Auth userId: ${userId}`);
    console.log(`MongoDb userID: ${userID}`);
    console.table(currentUserProfileObject);
    console.table(currentSignedInUserObject);


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
            }

        return null;
    }

    const simplifiedCompletedResourceObjects = (completedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);
    const simplifiedBookmarkedResourceObjects = (bookmarkedResourceObjects.map(simplifyResourceObject as any).filter(obj => obj !== null)  as ISummarisedPracticePaper[]);

                console.table(simplifiedCompletedResourceObjectstoSet);
                console.log(simplifiedCompletedResourceObjectstoSet)
                console.table(simplifiedBookmarkedResourceObjectstoSet);
                console.log(simplifiedBookmarkedResourceObjectstoSet);
                
                setSimplifiedCompletedResourceObjects(simplifiedCompletedResourceObjectstoSet);
                setSimplifiedBookmarkedResourceObjects(simplifiedBookmarkedResourceObjectstoSet);

            }

        };
    
        fetchData();

      }, [userId]);


    return (
        <div className="flex flex-col items-center gap-8 px-2 md:px-4 min-h-screen">

            {/* User meta datas */}
            <section className="flex flex-col md:flex-row items-center gap-8">
            
                
                <div className="flex_col_center gap-4">

                    <div className="flex_col_Center">
                        <p className="font-bold">{currentUserProfileObject?.firstName} {currentUserProfileObject?.lastName}</p>
                        <p className="italic">{currentUserProfileObject?.bio}</p>

                        {isOwnUser && <div>
                            <Link href={`/profile/${username}/edit`}>
                                <p>Edit Profile</p>
                            </Link>
                            {/* Navigates user to home page */}
                            <Link href={`/`}>
                                <SignOutButton/>
                            </Link>
                        </div>}
                    </div>



                </div>

                
            </section>
            {currentUserProfileObject &&
                <>
                <section className="w-full flex_col_center">
                    <ProfilePageTable data={simplifiedBookmarkedResourceObjects} userID={userId} sectionType="Bookmarks" isOwnUser={isOwnUser} user_name={currentUserProfileObject?.firstName  + currentUserProfileObject?.lastName}/>
                </section>

                <section className="w-full flex_col_center">
                    <ProfilePageTable data={simplifiedCompletedResourceObjects} userID={userId} sectionType="Completed" isOwnUser={isOwnUser} user_name={currentUserProfileObject?.firstName + currentUserProfileObject?.lastName}/>
                </section>
                </>
            }
            
            


        </div>
    )


}
    

export default ProfilePage;