import { HeroParallax } from '@/components/ui/hero-parallax';
import { heroImages } from '../../constants';
import OurServices from '@/components/shared/OurServices';




const HomePage = () => {

  return (
    <div className="flex_col_center w-full">

      <section className="w-full px-2 sm:px-4 md:px-6">
        <HeroParallax products={heroImages} />
      </section>


      <section className="w-full px-2 sm:px-4 md:px-6 mx-auto">
        {/* <OurServices/> */}
      </section>

    {/* <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl font-semibold text-pri_navy_dark text-center">From Academic Victim to Victor!</h1>
      
        
      <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl font-semibold text-pri_navy_dark text-center">Ready for your grade glow-up? Track your improvements</h1> */}

    </div>
  )
}

export default HomePage