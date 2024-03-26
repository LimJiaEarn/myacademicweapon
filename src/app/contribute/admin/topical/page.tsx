import Form from '@/components/shared/Form';
import { createPracticePaper } from '@/lib/actions/studyresource.actions';
import { auth } from "@clerk/nextjs";
import { getUserByClerkId } from '@/lib/actions/user.actions';


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
        id:"workingUrl",
        type:"text",
        styles: "h-[35px]",
        title:"Working Solution URL",
        placeholder:"drive.com/solution",
        compulsory: false,
      },
      {
        id:"videoUrl",
        type:"text",
        styles: "h-[35px]",
        title:"Video Solution URL",
        placeholder:"drive.com/video",
        compulsory: false,
      },
      {
        id:"topicName",
        type:"text",
        styles: "h-[35px]",
        title:"Topic Name",
        placeholder:"Kinematics",
        compulsory: true,
      },
      {
        id:"contributor",
        type:"text",
        styles:"h-[80px]",
        title:"Contributor",
        placeholder:"",
        compulsory: false,
      },
]


const AdminPage = async () => {

  const { userId } = auth();
  const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
  const userID = currentSignedInUserObject._id || null;

  const contributorUrl = "https://www.myacademicweapon.com";

    const handleSubmit = async (formData : {[key:string]:string}) => {
        "use server"  


        const {
          resourceLevel,
          resourceSubject : subject,
          resourceDesc : desc,
          resourceUrl : url,
          workingUrl : workingSolution,
          videoUrl : videoSolution,
          topicName,
          contributor,
        } = formData;
        
        // hardcoded values
        const level = resourceLevel as "Primary" | "Secondary" | "JC";
        const type = "Topical";
        const status = false;
        
        const data: CreateTopicalPracticePaperParams = {
            level,
            subject,
            desc,
            url,
            likes:0,
            topicName,
            status,
            type,
            // Including optional properties only if they exist
            ...(workingSolution && { workingSolution }), 
            ...(videoSolution && { videoSolution }), 
            ...(contributor && { userID }), 
            ...(contributorUrl && { contributorUrl }),
            ...(desc && { desc }), 
        };
        
        console.log("Creating:");
        console.table(data);

        await createPracticePaper(data);

        console.log("Success!");

    }

    return (
        <div className="flex_col_center gap-8 px-2 py-8 pb-8">

            <h1 className="text-3xl md:text-5xl font-bold text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
            Admin Mode Topical
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