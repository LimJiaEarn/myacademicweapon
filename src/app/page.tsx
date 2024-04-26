import { HeroParallax } from '@/components/ui/hero-parallax';
import { heroImages } from '../../constants';
import Services from '@/components/shared/Services';




const HomePage = () => {

  return (
    <div className="flex_col_center w-full">

      <section className="w-full px-2 sm:px-4 md:px-6">
        <HeroParallax products={heroImages} />
      </section>


      <section className="w-full px-2 sm:px-4 md:px-6 mx-auto">
        <Services/>
      </section>

      
        

    </div>
  )
}

export default HomePage