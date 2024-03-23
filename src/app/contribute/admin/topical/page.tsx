import Form from '@/components/shared/Form';
import { createStudyResource } from '@/lib/actions/studyresource.actions';

const createStudyResourceFormDetails : FormFieldConfig[] = [
    {
        id:"resourceLevel",
        type:"select",
        title:"Choose Level",
        placeholder:"eg: Secondary",
        options:["Primary", "Secondary", "JC"],
        compulsory: true,
      },
      {
        id:"resourceSubject",
        type:"text",
        title:"Subject",
        placeholder:"eg: Chinese",
        compulsory: true,
      },
      {
        id:"resourceDesc",
        type:"textarea",
        styles:"h-[80px]",
        title:"Description",
        placeholder:"",
        compulsory: false,
      },
      {
        id:"resourceUrl",
        type:"text",
        styles: "h-[35px]",
        title:"Resource URL",
        placeholder:"drive.com/resource",
        compulsory: true,
      },
      {
        id:"resourceUrl",
        type:"text",
        styles: "h-[35px]",
        title:"Working Solution URL",
        placeholder:"drive.com/solution",
        compulsory: false,
      },
      {
        id:"resourceUrl",
        type:"text",
        styles: "h-[35px]",
        title:"Video Solution URL",
        placeholder:"drive.com/solution",
        compulsory: false,
      },
      {
        id:"topicName",
        type:"text",
        styles: "h-[35px]",
        title:"Topic Name",
        placeholder:"drive.com/solution",
        compulsory: false,
      },
      {
        id:"resourceDesc",
        type:"text",
        styles:"h-[80px]",
        title:"Contributor",
        placeholder:"",
        compulsory: false,
      },
]


const AdminPage = () => {

    const resourceType = "Topical"


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

        console.log("Success!");
    }

    return (
        <div className="flex_col_center gap-8 px-2 py-8 pb-8">

            <h1 className="text-3xl md:text-5xl font-bold text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
                Admin Mode
            </h1>


            
            <Form
                fieldsConfig = {createStudyResourceFormDetails}
                customStyles="w-[240px] bg-[#bfdbfe] text-black rounded-md"
                handleSubmit={handleSubmit}
            />

            

        </div>
    )
}

export default AdminPage