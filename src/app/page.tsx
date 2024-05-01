import { HeroParallax } from '@/components/ui/hero-parallax';
import { heroImages } from '../../constants';
import Features from '@/components/shared/Features';


const HomePage = () => {

  return (
    <div className="flex_col_center w-full overflow-hidden">

      <section className="w-full px-2 sm:px-4 md:px-6">
        <HeroParallax products={heroImages} />
      </section>


      <section className="w-full px-2 sm:px-4 md:px-6 mx-auto mb-[200px] flex_col_center">
        <h1 className="text-2xl font-bold leading-tight text-pri_navy_dark sm:text-4xl sm:leading-normal md:text-5xl md:leading-relaxed">
          Explore Our Features
        </h1>
        <p className="mt-6 mb-12 text-lg text-center leading-relaxed text-pri_navy_main md:text-2xl max-w-[700px] px-2">
          We're more than just a collection of study resources, we're your steadfast ally in your pursuit of academic success!
        </p>
        <Features/>
      </section>


    </div>
  )
}

export default HomePage