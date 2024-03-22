
import Form from '@/components/shared/Form';
import { contributionFormDetails } from '../../../constants'
import { createResourceContribution } from '@/lib/actions/resourcecontribution.actions';


const ContributePage = () => {

    const handleSubmit = async (formData : {[key:string]:string}) => {
        "use server"
        console.log("TODO: Submitting Form through a server function..");
        console.table(formData);
    }

    return (
        <div className="flex_col_center gap-8 px-2 py-8 pb-8">

            <h1 className="text-3xl md:text-5xl font-bold text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
                <span className="text-success_gold">Lend</span> Your Learning & <span className="text-academic_red">Gift </span> Your Wisdom!
            </h1>

            <p className="text-lg md:text-xl text-center max-w-[80ch] mx-auto leading-normal">
                Your grand generosity helps <span className="text-[#fbbf24]">illuminate </span> the path for students!
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