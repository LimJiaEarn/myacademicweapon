import Form from '@/components/shared/Form';
import { createNote } from '@/lib/actions/studyresource.actions';
import { currentUser } from "@clerk/nextjs";
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
        id:"resourceUrl",
        type:"text",
        styles: "h-[35px]",
        title:"Notes URL",
        placeholder:"drive.com/resource",
        compulsory: true,
      },
      {
        id:"title",
        type:"text",
        styles: "h-[35px]",
        title:"Note Title",
        placeholder:"Kinematics Overview",
        compulsory: true,
      },
      {
        id:"topicNames",
        type:"text",
        styles: "h-[35px]",
        title:"Topic Names (comma separated)",
        placeholder:"Algebra, Circle Properties",
        compulsory: false,
      },
      {
        id:"note",
        type:"number",
        styles: "h-[35px]",
        title:"Note",
        placeholder:"",
        compulsory: true,
      },
      {
        id:"contributor",
        type:"text",
        styles:"h-[35px]",
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


  const user = await currentUser();
  
  const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user.id) : null;
  const userPlan = currentSignedInUserObject.planId;


  if (userPlan<100){
    redirect('/contribute');
  }

    const handleSubmit = async (formData : {[key:string]:string}) => {
        "use server"  
        const contributorUrl = "https://www.myacademicweapon.com";

        const {
          resourceLevel,
          resourceSubject : subject,
          resourceUrl : url,
          title,
          topicNames: topicNamesToSplit,
          note : stringednote,
          contributor,
        } = formData;
        
        const note = Number(stringednote);

        // hardcoded values
        const level = resourceLevel as "Primary" | "Secondary" | "JC";
        const type : string = "Notes";
        const topicNames : string[]= topicNamesToSplit?.length > 0 ? topicNamesToSplit.split(',') : [];
        
        const data = {
            level,
            subject,
            url,
            title,
            topicNames,
            note,
            type,
            // Including optional properties only if they exist
            ...(contributor && { currentSignedInUserObject }), 
            ...(contributorUrl && { contributorUrl }),
        };
        

        try{
          await createNote(data);
          return {success:true};
        }
        catch (error){  

          return {sucess:false, message:`failed to submit form due to ${error}`}
        }

    }

    return (
        <div className="flex_col_center gap-8 px-2 py-8 pb-8">

            <h1 className="text-3xl md:text-5xl font-bold text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
            Admin Mode Notes
            </h1>


            
            <Form
                fieldsConfig = {createStudyResourceFormDetails}
                customStyles="w-[240px] bg-[#bfdbfe] text-black rounded-md"
                handleSubmit={handleSubmit}
                clearFieldsAfterSubmit={false}
                initialFormValues={{}}
            />

            

        </div>
    )
}

export default AdminPage