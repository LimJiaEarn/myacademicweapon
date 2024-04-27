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
  const y = useParallax(scrollYProgress, 110);

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-16 pt-20">
      <div ref={ref} className="col-span-1 flex justify-end items-center">
        <Image src={imagePath} alt="image" height={500} width={500} />
      </div>
      <motion.h2 style={{ y }}  className="col-span-1">
      <div className="flex flex-col items-start justify-center h-full">
        <h2 className={`font-semibold text-lg sm:text-2xl`}>{header}</h2>
        <p className={`text-base sm:text-lg`}>{desc}</p>
      </div>
      
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
      <motion.div style={{ scaleX }} />
    </div>
  );
}

export default Features;
