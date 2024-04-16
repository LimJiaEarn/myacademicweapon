
import Image from 'next/image';
import StudyResourceSection from '@/components/shared/StudyResourceSection'
import { currentUser } from "@clerk/nextjs";
import { getUserByClerkId } from '@/lib/actions/user.actions';


import { Metadata, ResolvingMetadata } from 'next'
 
function capitalize(str : string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type Props = {
  params: { level: string }
  searchParams: { [key: string]: string }
}
 
export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const level = capitalize(params.level)
 
  return {
    title: searchParams.subject ? `${level} ${searchParams.subject}` : `${level} Resources`,

  }
}

const StudyResourcePage = async ( {params, searchParams} : {params: { level: string }, searchParams : { [key:string]:string}} ) => {

    const user = await currentUser();

    // Get the encoded data from url
    const resourceLevel = capitalize(params.level);

    const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user?.id) : null;
    
    const userID = currentSignedInUserObject?._id || null;
    
    const resourceSubject = searchParams.subject;
    const resourceType = searchParams.resourceType?.split(' ')[0];

    return (

        <div className="min-h-screen w-full py-2 md:py-4">

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