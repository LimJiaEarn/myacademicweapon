
import Form from '@/components/shared/Form';
import { contributionFormDetails } from '../../../constants'

const ContributePage = () => {

    const handleSubmit = async (formData : {[key:string]:string}) => {
        "use server"
        console.log("TODO: Submitting Form through a server function..");
        console.table(formData);
    }

    return (
        <div className="flex_col_center ">
            
            <h1 className="font-bold text-2xl text-center">Hello,<br/>thanks for contributing to a greater cause!</h1>

            <p className="text-lg mb-4">Fill up the form!</p>

            <Form
                fieldsConfig = {contributionFormDetails}
                customStyles="w-[240px] bg-slate-400 text-black rounded-md"
                handleSubmit={handleSubmit}
            />


        </div>
    )
}

export default ContributePage