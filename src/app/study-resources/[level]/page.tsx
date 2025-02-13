import StudyResourceNav from '@/components/shared/StudyResourceNav';
import StudyResourceSection from '@/components/shared/StudyResourceSection'
import { currentUser } from '@clerk/nextjs/server'
import { getUserByClerkId } from '@/lib/actions/user.actions';
import { Metadata } from 'next'
import { quotes } from '../../../../constants/quotes';

function paramsMap(str : string) : string{

  switch(str){
    case 'secondary':
      return 'Secondary';
    case 'jc':
      return 'JC';
  
    default:
      return 'Invalid';
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

    const userName = currentSignedInUserObject?.username || null;
    
    const resourceSubject = searchParams.subject;
    const resourceType = searchParams.resourceType?.split(' ')[0];
    
    return (

        <div className="min-h-screen w-full py-2 md:py-4">

          <StudyResourceNav level={params.level}/>

          <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_navy_dark to-transparent opacity-25" />

          <StudyResourceSection
            userID={userID} 
            userName={userName}
            resourceLevel={resourceLevel}
            resourceSubject={resourceSubject}
            resourceType={resourceType}
            searchParams={searchParams}
          />

      </div>

        
    )
  }

export default StudyResourcePage