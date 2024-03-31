import { UserProfile } from "@clerk/nextjs";
import Link from 'next/link';
import { auth } from "@clerk/nextjs";
import { getUserByClerkId } from '@/lib/actions/user.actions';


const page = async () => {

    const { userId } = auth();
    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const username = currentSignedInUserObject.username;

    return (
        <div className="flex_col_center gap-4">
            <Link href={`/profile/${username}`}>
                Save and Exit
            </Link>
            <UserProfile />
        </div>
    )
}

export default page