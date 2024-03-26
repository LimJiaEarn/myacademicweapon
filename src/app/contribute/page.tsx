
import Form from '@/components/shared/Form';
import { GlobeDemo } from '@/components/ui/GlobeDemo';
import { contributionFormDetails } from '../../../constants'
import { createResourceContribution } from '@/lib/actions/resourcecontribution.actions';


const ContributePage = () => {


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
                let's build a world where knowledge knows no boundaries! 
            </p>

            <div className="w-full flex justify-evenly items-center gap-4">

                <div className="flex-auto hidden lg:flex debugger">
                    <GlobeDemo />
                </div>

                <div className="flex-1">
                    <Form
                        fieldsConfig = {contributionFormDetails}
                        customStyles="w-[240px] bg-[#bfdbfe] text-black rounded-md"
                        handleSubmit={handleSubmit}
                    />
                </div>

            </div>
            

            

        </div>
    )
}

export default ContributePage