import {HeroParallax} from '@/components/ui/hero-parallax';
import { heroImages } from '../../constants';

const HomePage = () => {

  return (
    <div className="flex_col_center px-2 md:px-6">

      <section className="">
        <HeroParallax products={heroImages} />
      </section>



    </div>
  )
}

export default HomePage