import StudyResourceNav from '@/components/shared/StudyResourceNav';
import StudyResourceDataLoader from '@/components/shared/StudyResourceDataLoader';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

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
  params: Promise<{ level: string }>
  searchParams: Promise<{ [key: string]: string }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {

    const { level: levelParam } = await params;
    const resolvedSearchParams = await searchParams;
    const level = paramsMap(levelParam)

    return {
      title: resolvedSearchParams.subject ? `${level} ${resolvedSearchParams.subject}` : `${level} Resources`,

    }
}


const StudyResourcePage = async ( {params, searchParams} : {params: Promise<{ level: string }>, searchParams: Promise<{ [key:string]:string}>} ) => {

    const user = await currentUser();

    const { level: levelParam } = await params;
    const resolvedSearchParams = await searchParams;

    // Get the encoded data from url
    const resourceLevel = paramsMap(levelParam);

    const currentSignedInUserObject : UserObject = user ? await getUserByClerkId(user?.id) : null;

    const userID = currentSignedInUserObject?._id || null;

    const userName = currentSignedInUserObject?.username || null;

    const resourceSubject = resolvedSearchParams.subject;
    const resourceType = resolvedSearchParams.resourceType?.split(' ')[0];

    return (

        <div className="min-h-screen w-full py-2 md:py-4">

          <StudyResourceNav level={levelParam}/>

          <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_navy_dark to-transparent opacity-25" />

          <Suspense fallback={
            <div className="w-full flex_center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <p className="text-center text-slate-400">Loading resources...</p>
            </div>
          }>
            <StudyResourceDataLoader
              userID={userID} 
              userName={userName}
              resourceLevel={resourceLevel}
              resourceSubject={resourceSubject}
              resourceType={resourceType}
              searchParams={resolvedSearchParams}
            />
          </Suspense>

      </div>

        
    )
  }

export default StudyResourcePage