import Link from 'next/link';
import type { Metadata } from "next";
import { studyResourcesNav } from '../../../constants';

export const metadata: Metadata = {
  title: "Explore Study Resources",
  description: "Our comprehensive collection of practice papers and study notes tailored for each academic levels. Empower your learning journey with these essential study resources!"
};

interface StudyResourcesSectionCardProps {
  title: string;
  descShort: string;
  desc: string;
  image: string;
  route:string;
}

const StudyResourcesSectionCard = (props: StudyResourcesSectionCardProps) => {
  return (
    <div className="relative rounded-2xl overflow-hidden group border">
      {props.route === "" && (
        <div className="absolute top-2 right-0 z-10 bg-red-600 text-white text-md font-semibold py-2 md:py-4 px-4 md:px-10 border-red-700 border-2 shadow-lg text-center">
          Coming Soon!
        </div>
      )}

      <img src={props.image} alt={props.title}
        className="w-[900px] h-[240px] sm:h-[350px] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 flex_col_center">
        <h1 className="text-xl font-bold text-white text-center">
          {props.title}
        </h1>
        <h3 className="text-sm md:text-md italic text-white text-center">
          {props.descShort}
        </h3>
        <p className="hidden md:flex text-white text-sm text-center max-w-xl pt-2">
          {props.desc}
        </p>

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

          <h1 className="text-3xl md:text-5xl font-bold text-pri_navy_dark text-center max-w-[90ch] mx-auto mb-4 leading-[1.5]">
            Your <span className="gold_grad_text">Royal Treasury</span><br/> of Study Notes, Plans and Papers!
          </h1>

          {/* <p className="text-lg md:text-xl text-center max-w-[80ch] mx-auto leading-normal">
            Forged in the academic foundry by an alliance of <span className="font-semibold gold_grad_text_2"> experienced tutors, dedicated teachers, and
            victorious students</span>, our Royal Treasury brims with
            meticulously crafted study materials!
          </p> */}

          <p className="text-lg md:text-xl text-pri_navy_darker text-center max-w-[80ch] mx-auto leading-normal">
            Embark on your quest towards <span className="gold_grad_text_2 font-bold">academic success now!</span>
          </p>

        </div>
        
        <div className="flex_col_center gap-4">
          {studyResourcesNav.map((studyResource) => {

          return (
            <Link href={studyResource.route} key={studyResource.id}>
              <StudyResourcesSectionCard
                title={studyResource.title}
                desc={studyResource.desc}
                descShort={studyResource.descShort}
                image={studyResource.image}  
                route={studyResource.route}
              />
          </Link>
          );
          })}
        </div>
        
        


      </div>
    </div>

  )
}

export default StudyResourcesPage;


