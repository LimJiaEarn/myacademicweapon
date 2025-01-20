import { auth } from '@clerk/nextjs/server'
import { UserProfile } from '@clerk/nextjs';
import LinkButton from "@/components/shared/LinkButton";
import { getUserByClerkId } from '@/lib/actions/user.actions';


const page = async () => {

    const { userId } = await auth();

    console.log("auth:", userId);

    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const username = currentSignedInUserObject.username;

    return (
        <div className="flex_col_center gap-4">
            <LinkButton
                buttonMsg="Save & Exit"
                buttonMsgClass="text-white text-sm"
                buttonColorClass="opacity-90 bg-info_blue hover:bg-dark_info_blue border-gray-300 py-1 w-[135px] shadow-md"
                linksTo={`/profile/${username}`}
            />
            <UserProfile />
        </div>
    )
}

export default page