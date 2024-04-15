"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import LinkButton from '@/components/shared/LinkButton';
import { useUser } from '@clerk/nextjs';


export const HeroParallax = (
  {products,}: {
  products: {
    title: string;
    thumbnail: string;
  }[];
}) => {

  
  const firstRow = products.slice(0, 8);
  const secondRow = products.slice(8, 16);
  const thirdRow = products.slice(16, 24);

  const ref = React.useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 50, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 500]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -500]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 400]),
    springConfig
  );
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.8, 1]);



  return (
    <div ref={ref} className="min-h-[2270px] sm:min-h-[2480px] w-full max-w-[2360px] overflow-hidden antialiased relative flex flex-col mx-auto self-auto [perspective:1200px] [transform-style:preserve-3d] py-20 lg:py-40">
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >

        <motion.div style={{ opacity: textOpacity }} className="mb-4 md:mb-6 text-xl md:text-3xl font-semibold text-gray-600 text-center">
          FREE Topical Practice Papers
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="mb-4 md:mb-6 text-xl md:text-3xl font-semibold text-gray-600 text-center">
          FREE MYE / Prelim Practice Papers
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-10">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="mb-4 md:mb-6 text-xl md:text-3xl font-semibold text-gray-600 text-center">
          FREE Solution Sheets, Walkthroughs, Notes & More !
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 mb-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {

    const { user } = useUser();
    
    const buttonMsg = user ? "Let's Go!" : "Get Started Now !";
    const linksTo = user ? "/study-resources" : "/sign-up";


    return (
      <div className="mx-auto max-w-full gap-4 z-20 pl-2">
        <h1 className="text-3xl font-bold leading-tight text-pri_navy_dark sm:text-5xl sm:leading-normal md:text-5xl md:leading-relaxed lg:text-6xl">
          Your <span className="red_grad_text">Ultimate Weapon</span>
          <br/>
          To <span className="gold_grad_text">Conquer</span> Your Academics
        </h1>
        <div className="flex flex-col items-start gap-4 md:align-center lg:flex-row lg:items-center">

          <p className="mt-6 text-lg leading-relaxed text-pri_navy_darker md:text-2xl max-w-sm md:max-w-[570px]">
              Chart through the treacherous waters of education with our map of study guides and practice papers!<br/>We're than just a collection of materials, we're your steadfast ally in your pursuit of academic excellence!
          </p>
          <div className="flex_center">
            <LinkButton iconUrl="/icons/sword.svg" buttonMsg={buttonMsg} buttonColorClass="py-3 px-6 bg-gradient-to-r from-pink-600 to-yellow-600 hover:from-pink-500 hover:to-yellow-500 hover:pr-8" linksTo={linksTo}/>
          </div>

        </div>


      </div>
    );
};
  

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -5,
      }}
      key={product.title}
      className="group/product relative flex-shrink-0"
    >
      <div
        // href={product.link}
        className="block group-hover/product:shadow-lg relative h-[339px] w-[240px] sm:h-[385px] sm:w-[290px]"
      >
          <Image
            src={product.thumbnail}
            fill
            sizes="(max-width:290px) 100vw"
            className="object-cover"
            alt={product.title}
            quality={40}
          />
        
      </div>
    </motion.div>
  );
};
