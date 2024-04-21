
import StudyResourceNav from '@/components/shared/StudyResourceNav';
import StudyResourceSection from '@/components/shared/StudyResourceSection'
import { currentUser } from "@clerk/nextjs";
import { getUserByClerkId } from '@/lib/actions/user.actions';


import { Metadata } from 'next'
 
function capitalize(str : string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function paramsMap(str : string) : string{

  switch(str){
    case 'secondary':
      return 'Secondary';
    case 'jc':
      return 'JC';
  
    default:
      return 'JC';
    }


}

type Props = {
  params: { level: string }
  searchParams: { [key: string]: string }
}
 
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {

    const level = paramsMap(params.level)
    
    return {
      title: searchParams.subject ? `${level} ${searchParams.subject}` : `${level} Resources`,

    }
}


const StudyResourcePage = async ( {params, searchParams} : {params: { level: string }, searchParams : { [key:string]:string}} ) => {

    const user = await currentUser();

    // Get the encoded data from url
    const resourceLevel = paramsMap(params.level);

    const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user?.id) : null;
    
    const userID = currentSignedInUserObject?._id || null;
    
    const resourceSubject = searchParams.subject;
    const resourceType = searchParams.resourceType?.split(' ')[0];

    return (

        <div className="min-h-screen w-full py-2 md:py-4">

        <div className="bg-pri_bg_card p-4 rounded-lg shadow-dropdown text-center mb-2 w-full max-w-[800px] mx-auto">
          <p className="text-pri_navy_main font-bold italic">
            Disclaimer:
          </p>
          <p className="text-pri_navy_light">
            Our watermarks are used solely to <span className="font-medium underline">deter resellers</span> & keep these valuable resources <span className="font-medium underline">free for students</span>. <span className="font-medium text-pri_red_main">My Academic Weapon do not claim ownership of these study resources.</span> We have the utmost respect for the creators of these resources & have made every effort to acknowledge them as thoroughly as possible.
          </p>
        </div>

          <StudyResourceNav level={params.level}/>

          <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_navy_dark to-transparent opacity-25" />

          <StudyResourceSection
            userID={userID} 
            resourceLevel={resourceLevel}
            resourceSubject={resourceSubject}
            resourceType={resourceType}
          />

      </div>

        
    )
  }

export default StudyResourcePage