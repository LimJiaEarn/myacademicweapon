import Form from '@/components/shared/Form';
import { createPracticePaper } from '@/lib/actions/studyresource.actions';
import { auth } from "@clerk/nextjs";
import { getUserByClerkId } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';


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
        id:"assessment",
        type:"text",
        styles: "h-[35px]",
        title:"Assessment",
        placeholder:"Prelims",
        compulsory: true,
      },
      {
        id:"year",
        type:"number",
        styles: "h-[35px]",
        title:"Year",
        placeholder:"1",
        compulsory: true,
      },
      {
        id:"schoolName",
        type:"text",
        styles: "h-[35px]",
        title:"School Name",
        placeholder:"Woodrove Sec",
        compulsory: true,
      },
      {
        id:"paper",
        type:"number",
        styles: "h-[35px]",
        title:"Paper",
        placeholder:"Woodrove Sec",
        compulsory: true,
      },
      {
        id:"totMarks",
        type:"number",
        title:"Total Marks",
        placeholder:"eg: 100",
        compulsory: false,
      },
      {
        id:"contributor",
        type:"text",
        styles:"h-[80px]",
        title:"Contributor",
        placeholder:"",
        compulsory: false,
      },
      {
        id:"contributorUrl",
        type:"text",
        styles:"h-[35px]",
        title:"Contributor URL",
        placeholder:"",
        compulsory: false,
      },
]


const AdminPage = async () => {

  const { userId } = auth();
  const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;
  const userID = currentSignedInUserObject._id || null;
  const contributorUrl = "https://www.myacademicweapon.com";

  console.log("auth:", userId);

    const handleSubmit = async (formData : {[key:string]:string}) => {
        "use server"  


        const {
            resourceLevel,
            resourceSubject : subject,
            resourceDesc : desc,
            resourceUrl : url,
            workingUrl : workingSolution,
            videoUrl : videoSolution,
            assessment,
            year,
            schoolName,
            paper,
            totMarks : stringedtotMarks,
            contributor,
            contributorUrl,
        } = formData;
        
        const totMarks = stringedtotMarks ? Number(stringedtotMarks) : undefined;

        // hardcoded values
        const level = resourceLevel as "Primary" | "Secondary" | "JC";
        const type = "Yearly";
        const status = false;
        
        const data: CreateYearlyPracticePaperParams = {
            level,
            subject,
            desc,
            url,
            likes:0,
            assessment,
            year:Number(year),
            schoolName,
            paper:Number(paper),
            status,
            type,
            // Including optional properties only if they exist
            ...(workingSolution && { workingSolution }), 
            ...(videoSolution && { videoSolution }), 
            ...(totMarks && { totMarks }), 
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
                Admin Mode Yearly
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