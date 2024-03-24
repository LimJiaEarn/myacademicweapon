import { auth } from "@clerk/nextjs";
import { getUserByUsername, getUserByClerkId } from '@/lib/actions/user.actions';

const SetContext = async ({ params }: { params: { username: string } }) => {

    const { userId } = auth();
    const { username } = params;


    const currentUserProfileObject : UserObject= await getUserByUsername(username);

    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;

    
    const isOwnUser : boolean = currentSignedInUserObject && currentSignedInUserObject._id === currentUserProfileObject._id;

    return (
        <div>
            <p>
                {currentUserProfileObject.firstName}
            </p>
            
            {isOwnUser && <p>{currentUserProfileObject.email}</p>}

            {isOwnUser && <p>{currentUserProfileObject._id}</p>}

        </div>
    )


}
    

export default SetContext;