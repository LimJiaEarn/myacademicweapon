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
    <div ref={ref} className="min-h-[2200px] sm:min-h-[2480px] max-w-full overflow-hidden antialiased relative flex flex-col self-auto [perspective:1200px] [transform-style:preserve-3d] py-20 lg:py-40">
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

        <motion.div style={{ opacity: textOpacity }} className="mb-4 md:mb-6 text-lg md:text-2xl font-semibold text-gray-600 text-center">
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

        <motion.div style={{ opacity: textOpacity }} className="mb-4 md:mb-6 text-lg md:text-2xl font-semibold text-gray-600 text-center">
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

        <motion.div style={{ opacity: textOpacity }} className="mb-4 md:mb-6 text-lg md:text-2xl font-semibold text-gray-600 text-center">
          FREE Solution Recordings, Answer Sheets, Notes & More !
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
    return (
      <div className="mx-auto max-w-full ">
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl sm:leading-normal md:text-5xl md:leading-relaxed lg:text-6xl">
          Your <span className="text-academic_red">Ultimate Weapon</span>
          <br/>
          To Seize Your <span className="text-success_gold">Academic Destiny</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text_gray md:text-2xl max-w-sm md:max-w-xl">
            Chart through the treacherous waters of education with our map of study guides and practice papers!<br/>More than just a collection of materials, we're your steadfast ally in your pursuit of academic excellence!
        </p>
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
        className="block group-hover/product:shadow-lg"
      >
        <div className="relative h-[339px] w-[240px] sm:h-[385px] sm:w-[290px]">
          <Image
            src={product.thumbnail}
            fill
            sizes="(max-width:290px) 100vw"
            className="object-cover"
            alt={product.title}
          />
        </div>
        
      </div>
      {/* <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80  bg-black pointer-events-none"></div> */}
      {/* <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2> */}
    </motion.div>
  );
};
