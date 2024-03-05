import Link from 'next/link';
import { studyResources } from '../../../constants';

interface LevelCardProps {
  h2text: string;
  para: string;
}

const LevelCard = ({ h2text, para }: LevelCardProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>
        {h2text}
      </h2>
      <p>
        {para}
      </p>
    </div>
  )
}

const StudyResourcesPage = () => {

  return (

    <div className="w-full flex flex-col items-center sm:flex-row sm:items-start gap-8 mx-2 my-4">

      {/* Sidebar for navigating between different levels of resources */}
      <div className="w-[250px] bg-gray-300 rounded-xl flex_col_center sm:flex_center py-2 gap-6">
        {studyResources?.map( (curr) => {
        return(
          <div key={curr.id}>
            <Link href={curr.route} className="flex gap-2">
              {curr.label} Resources
            </Link>
          </div>
        )
        })}
        
      </div>

      {/* Hero and Description Sections */}
      <div className="max-w-[100%] flex_col_center px-4">
        
        <div className="flex_col_center gap-4">

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
        
        <LevelCard h2text="PSLE Resources" para="Coming Soon!" />

        

        
      </div>

    </div>

  )
}

export default StudyResourcesPage;

