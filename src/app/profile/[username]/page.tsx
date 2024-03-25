import { auth } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';
import { getStatusStudyResource, getBookmarksStudyResource } from '@/lib/actions/useractivity.actions';

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
                <div>
                    {currentUserProfileObject.firstName}'s Bookmarks
                
                
                </div>
            }

            {/* Completed Papers */}
            <div className="w-full text-center">
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Completed Practice Papers</h2>
            </div>
            
            {/* Likes */}
            <div className="w-full text-center">
                <h2 className="text-xl font-bold">{isOwnUser ? "Your" : currentUserProfileObject.firstName+"'s"} Liked Resources</h2>
            </div>
            


        </div>
    )


}
    

export default ProfilePage;