import Link from 'next/link';
import type { Metadata } from "next";
import { studyResourcesNav } from '../../../constants';

export const metadata: Metadata = {
  title: "Study Resources",
};

interface StudyResourcesSectionCardProps {
  title: string;
  desc: string;
  route: string;
  image: string;
}

const StudyResourcesSectionCard = (props: StudyResourcesSectionCardProps) => {
  return (
    <div className="relative rounded-2xl overflow-hidden group border-1 border-gray-700">

      <img src={props.image} alt={props.title}
        className="w-[900px] h-[200px] sm:h-[350px] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4">

        <h1 className="text-xl font-bold text-white text-center">
          {props.title}
        </h1>

        <p className="hidden md:flex text-white text-sm text-center">
          {props.desc}
        </p>

        {props.route === "" ? (
          <p className="text-center text-white">Coming Soon!</p>
        ) : (
          <Link href={props.route} className="block mt-2 text-center text-white underline">
            Get Started!
          </Link>
        )}
        
      </div>
    </div>
  );
};


const StudyResourcesPage = () => {

  return (

    <div className="w-full flex_center sm:items-start gap-8 px-2 py-8 pb-8">      
      <div className="max-w-[100%] flex_col_center px-4">

        {/* Hero and Description Sections */}
        <div className="flex_col_center gap-6 mb-10">

          <h1 className="text-3xl md:text-5xl font-bold text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
            Your <span className="text-amber-600">Royal Treasury</span><br/> of Study Notes, Plans and Papers!
          </h1>

          <p className="text-lg md:text-xl text-center max-w-[80ch] mx-auto leading-normal">
            Forged in the academic foundry by an alliance of experienced tutors, dedicated teachers, and
            victorious students, our Royal Treasury brims with
            meticulously crafted study materials. Each material is
            <span className="font-bold text-orange-400"> polished through years of teaching wisdom and triumphant exam strategies.</span>
          </p>

          <p className="text-lg md:text-xl text-center max-w-[80ch] mx-auto leading-normal">
            Embark on your royal quest towards <span className="text-amber-500 font-bold">academic success now!</span>
          </p>

        </div>
        
        <div className="flex_col_center gap-4">
          {studyResourcesNav.map((studyResource, index) => {

          return (
          <StudyResourcesSectionCard
            key={studyResource.id}
            title={studyResource.title}
            desc={studyResource.desc}
            route={studyResource.route}
            image={studyResource.image}  
          />
          );
          })}
        </div>
        
        


      </div>
    </div>

  )
}

export default StudyResourcesPage;


