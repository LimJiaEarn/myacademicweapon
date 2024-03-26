
import Form from '@/components/shared/Form';
import { contributionFormDetails } from '../../../constants'
import { createResourceContribution } from '@/lib/actions/resourcecontribution.actions';
import { auth } from "@clerk/nextjs";
import { getUserByClerkId } from '@/lib/actions/user.actions';


const ContributePage = async () => {

    const { userId } = auth();
    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const userID = currentSignedInUserObject._id || null;

    // TODO: Pass userID if user is signed in
    const handleSubmit = async (formData : {[key:string]:string}) => {
        "use server"

        const {
            resourceLevel,
            resourceType,
            resourceSubject: subject,
            resourceUrl: url,
            resourceDesc: desc,
            resourceUserID: userID
        } = formData;
        
        const level = resourceLevel as "Primary" | "Secondary" | "JC";
        const type = resourceType as "Notes/Summaries" | "Yearly Practice Papers" | "Topical Practice Papers" | "Others";
        
        const data: ResourceContributionParams = {
            level,
            type,
            subject,
            url,
            // Including optional properties only if they exist
            ...(desc && { desc }), 
            ...(userID && { userID }) 
        };

        createResourceContribution(data as ResourceContributionParams);
        console.log("Success!");
    }

    return (
        <div className="flex_col_center gap-8 px-2 py-8 pb-8">

            <h1 className="text-3xl md:text-5xl font-bold text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
                <span className="text-success_gold">Lend</span> Your Learning & <span className="text-academic_red">Gift </span> Your Wisdom!
            </h1>

            <p className="text-lg md:text-xl text-center max-w-[80ch] mx-auto leading-normal">
                Your contributions are the beacon for students navigating their educational journeys.
                Embark on our mission to share the wealth of academic resources and
                let's build a world where <span className="text-[#fbbf24]"> knowledge knows no boundaries!</span> 
            </p>

            
            <Form
                fieldsConfig = {contributionFormDetails}
                customStyles="w-[240px] bg-[#bfdbfe] text-black rounded-md"
                handleSubmit={handleSubmit}
            />

            

        </div>
    )
}

export default ContributePage