import { HeroParallax } from '@/components/ui/hero-parallax';
import { heroImages } from '../../constants';
import Features from '@/components/shared/Features';


const HomePage = () => {

  return (
    <div className="flex_col_center w-full overflow-hidden">

      <section className="w-full px-2 sm:px-4 md:px-6">
        <HeroParallax products={heroImages} />
      </section>


      {/* <section className="w-full px-2 sm:px-4 md:px-6 mx-auto mb-[200px]">
        <Features/>
      </section> */}


    </div>
  )
}

export default HomePage