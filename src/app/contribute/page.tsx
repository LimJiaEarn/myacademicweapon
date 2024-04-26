
import Form from '@/components/shared/Form';
import { contributionFormDetails } from '../../../constants'
import { createResourceContribution } from '@/lib/actions/resourcecontribution.actions';
import { auth } from "@clerk/nextjs";
import { getUserByClerkId } from '@/lib/actions/user.actions';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Contributor!",
  description: "Give back to the student community & help enrich our resource hub!"
};

const ContributePage = async ({searchParams} : {searchParams : { [key:string]:string}}) => {

    const { userId } = auth();
    const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
    const userID = currentSignedInUserObject?._id || null;


    const initialFormValues : { [key: string]: string } = searchParams.resourceLevel ? {'resourceLevel': searchParams.resourceLevel} : {}

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
    }

    return (
        <div className="flex_col_center gap-8 px-2 py-8 pb-8">

            <h1 className="text-3xl md:text-5xl font-bold text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
                <span className="gold_grad_text_2">Lend</span> Your Learning
                <br/>
                <span className="red_grad_text_2">Gift </span> Your Wisdom!
            </h1>

            <p className="text-xl md:text-2xl text-center text-pri_navy_darker max-w-[60ch] mx-auto leading-normal">
                Embark on our mission to share the <span className="gold_grad_text font-semibold">wealth of academic resources</span>  and
                let's build a world where knowledge knows no boundaries!
            </p>

            
            <Form
                fieldsConfig = {contributionFormDetails}
                customStyles="w-[240px] bg-[#bfdbfe] text-black rounded-md"
                handleSubmit={handleSubmit}
                clearFieldsAfterSubmit={true}
                initialFormValues = {initialFormValues}
            />

            

        </div>
    )
}

export default ContributePage