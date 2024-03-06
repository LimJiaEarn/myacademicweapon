import Link from 'next/link';
import { studyResources } from '../../../constants';

interface StudyResourcesSectionCardProps {
  title: string;
  desc: string;
  route: string;
}

const StudyResourcesSectionCard = (props: StudyResourcesSectionCardProps) => {

  return (
    <div className="flex_col_center px-4 gap-2 bg-slate-300 rounded-2xl hover:bg-slate-400 transition-[1.25s]">
      <h1 className="text-2xl font-bold text-center max-w-[80ch]">
        {props.title}
      </h1>
      <p className="max-w-[60ch]">
        {props.desc}
      </p>

      {props.route==="" ?
      <p>Coming Soon!</p> 
      :
        <Link href={props.route}>
          Get Started!
        </Link>
      }

    </div>
  );
};


const StudyResourcesPage = () => {

  return (

    <div className="w-full flex_center sm:items-start gap-8 px-2 my-4 pb-8">      
      <div className="max-w-[100%] flex_col_center px-4">

        {/* Hero and Description Sections */}
        <div className="flex_col_center gap-4 mb-8">

          <h1 className="text-2xl font-bold text-center max-w-[80ch]">
            The Royal Treasury of Study Notes, Plans and Papers !
          </h1>

          <p className="max-w-[60ch]">
            Forged in the academic foundry by an alliance of experienced tutors, dedicated teachers, and
            victorious students, our Royal Treasury brims with
            meticulously crafted study materials. Each material is
            polished through years of teaching wisdom and triumphant exam strategies.
            Are you ready for your royal quest towards academic success? 
          </p>

        </div>
        
        <div className="flex_col_center gap-4">
          {studyResources.map((studyResource, index) => {

          return (
          <StudyResourcesSectionCard
            key={studyResource.id}
            title={studyResource.title}
            desc={studyResource.desc}
            route={studyResource.route}
          />
          );
          })}
        </div>
        
        


      </div>
    </div>

  )
}

export default StudyResourcesPage;


