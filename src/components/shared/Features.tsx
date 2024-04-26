"use client"

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue
} from "framer-motion";
import Image from 'next/image';
import { FeaturesInfo } from '../../../constants/index';

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

function FeatureCard({ header, desc, imagePath }: { header: string, desc: string, imagePath: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 300);

  return (
    <div className="grid grid-cols-3 gap-4 rows-auto ">
      <div ref={ref} className="col-span-2 flex_center">
        <Image src={imagePath} alt="image" height={500} width={500} />
      </div>
      <motion.h2 style={{ y }}  className="col-span-1 flex_col_center text-left">
        
        <h2>{header}</h2>
        <p>{desc}</p>
      
      </motion.h2>
    </div>
  );
}

const Features = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="flex flex-col w-full px-4">
      {FeaturesInfo.map((feature) => (
        <FeatureCard
            header={feature.header}
            desc={feature.desc}
            imagePath={feature.imagePath}
        />
      ))}
      <motion.div className="progress" style={{ scaleX }} />
    </div>
  );
}

export default Features;
