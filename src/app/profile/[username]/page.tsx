import { auth } from "@clerk/nextjs";
import { Suspense } from 'react';
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';

import ProfileSection from "@/components/shared/ProfileSection";

const ProfilePage = async ({ params }: { params: { username: string } }) => {

    const { userId } = auth();
    const { username } = params;


    const currentUserProfileObject : UserObject= await getUserByUsername(username);
    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;


    // Get user data


    return (
        <div className="flex_col_center gap-8">

            {/* Bookmarks - only shown for own user's page */}
            {isOwnUser &&
                <div className="w-full flex_col_center">
                   <h2 className="text-xl font-bold">{currentUserProfileObject.firstName}'s Bookmarks</h2>

                    <Suspense fallback={<p>Loading your bookmarks...</p>}>
                        <ProfileSection muserID={currentUserProfileObject._id} retrieveType="bookmark"/>
                    </Suspense>
                
                </div>
            }

            {/* Completed Papers */}
            <div className="w-full flex_col_center">
                
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Completed Practice Papers</h2>

                <Suspense fallback={<p>Loading completed practice papers...</p>}>
                    <ProfileSection muserID={currentUserProfileObject._id} retrieveType="status"/>
                </Suspense>

            </div>
            
            {/* TODO: Likes */}
            {/* <div className="w-full text-center">
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Liked Resources</h2>
            </div> */}
            


        </div>
    )


}
    

export default ProfilePage;