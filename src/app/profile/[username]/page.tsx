import { auth } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';

const SetContext = async ({ params }: { params: { username: string } }) => {

    const { userId } = auth();
    const { username } = params;


    const currentUserProfileObject : UserObject= await getUserByUsername(username);

    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;

    
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;

    return (
        <div className="flex_col_center gap-8">

            <div className="w-full text-center">
                <h2 className="text-xl font-bold">{currentUserProfileObject.firstName}'s Completed Papers</h2>
            </div>
            
            <div className="w-full text-center">
                <h2 className="text-xl font-bold">{currentUserProfileObject.firstName}'s Likes</h2>
            </div>
            
            {isOwnUser && <p>{currentUserProfileObject.email}</p>}

            {isOwnUser && <p>{currentUserProfileObject._id}</p>}

        </div>
    )


}
    

export default SetContext;