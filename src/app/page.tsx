import { HeroParallax } from '@/components/ui/hero-parallax';
import { heroImages } from '../../constants';
import Image from 'next/image';

const ServiceCard = ({header, desc, iconUrl, imagePath} : {header:string, desc:string, iconUrl:string, imagePath:string}) => {


  return(
    <div className="col-span-1 grid grid-rows-3 gap-4">

      <div className="row-span-1 flex_center gap-4">
        {iconUrl && <Image src={iconUrl} alt="icon" height={48} width={48} className=""/>}
        <h2 className="text-md md:text-xl font-semibold text-gray-600 text-center max-w-[300px]">
          {header}
        </h2>
      </div>

      <div className="row-span-2 flex_center gap-2 md:gap-4">
        <Image src={imagePath} alt="icon" height={100} width={100}/>
        <p className="text-lg leading-relaxed text-text_gray md:text-xl md:max-w-[200px]">{desc}</p>
      </div>
      

    </div>
  )
}


const HomePage = () => {

  return (
    <div className="flex_col_center w-full">

      <section className="w-full px-2 sm:px-4 md:px-6">
        <HeroParallax products={heroImages} />
      </section>

      <section className="w-full max-w-[1800px] flex_col_center px-2 sm:px-4">
        
        <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl font-semibold text-gray-600 text-center">Our Suite of Services</h1>

        <div className="grid grid-rows-3 w-full md:grid-cols-3 gap-2">
          <ServiceCard
            header="Mark to Master!"
            desc="Bookmark your favourite materials to streamline your study!"
            iconUrl="/icons/bookmarkIcon.svg"
            imagePath="/images/heroImg1.png"
          />
          <ServiceCard
            header="Accomplishments Archive!"
            desc="Catalog your completions and mark your milestones!"
            iconUrl="/icons/completedIcon.svg"
            imagePath="/images/heroImg1.png"
          />
          <ServiceCard
            header="Score and Soar!"
            desc="Track your completed papers & scores. Feel the heartbeat of your progress!"
            iconUrl="/icons/progressIcon.svg"
            imagePath="/images/heroImg1.png"
          />
        </div>
    </section>



    </div>
  )
}

export default HomePage