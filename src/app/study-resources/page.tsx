import Link from 'next/link';
import { studyResourcesNav } from '../../../constants';
import type { Metadata } from "next";

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
        <h1 className="text-xl md:text-2xl font-bold text-white text-center">
          {props.title}
        </h1>
        <h3 className="text-md md:text-lg italic text-slate-100 text-center">
          ( {props.descShort} )
        </h3>
        <p className="hidden sm:flex text-slate-200 text-md text-center max-w-xl pt-2">
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

          {/* <p className="text-lg md:text-xl text-pri_navy_darker text-center max-w-[80ch] mx-auto leading-normal">
            Embark on your quest towards <span className="gold_grad_text_2 font-bold">academic success now!</span>
          </p> */}

        <div className="bg-pri_bg_card p-4 rounded-lg shadow-dropdown text-center mb-2 px-4 max-w-[900px] mx-auto">
          <p className="text-pri_navy_dark font-bold mb-2">
            Disclaimer:
          </p>
          <p className="text-pri_navy_light">
            <span className="font-medium text-pri_red_main">My Academic Weapon does not claim ownership of these study resources.</span><br/>
            Our watermarks are used solely to <span className="font-medium underline">deter resellers</span>, and we intend to keep these resources <span className="font-medium underline">free for students</span> indefinitely.
          </p>
        </div>

        </div>
        
        <div className="flex_col_center gap-4">
          {studyResourcesNav.map((studyResource) => {

          return (
            <Link href={studyResource.route} key={studyResource.id} prefetch={true}>
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


