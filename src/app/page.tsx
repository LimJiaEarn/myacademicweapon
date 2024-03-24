import {HeroParallax} from '@/components/ui/hero-parallax';
import { heroImages } from '../../constants';


const HomePage = () => {

  return (
    <div className="flex_col_center">

      <section className="max-w-full px-2 sm:px-4 md:px-6">
        <HeroParallax products={heroImages} />
      </section>

      <section>
        Next Section
      </section>

    </div>
  )
}

export default HomePage