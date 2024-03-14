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
import Link from "next/link";

export const HeroParallax = (
  {products,}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const ref = React.useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 50, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
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
    <div ref={ref} className="min-h-[1700px] sm:min-h-[2180px] lg:min-h-[2100px] max-w-full overflow-hidden antialiased relative flex flex-col self-auto [perspective:1200px] [transform-style:preserve-3d] py-20">
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

        <motion.div style={{ opacity: textOpacity }} className="mb-4 text-lg font-semibold text-gray-600">
          Topical Practice Papers
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="mb-4 text-lg font-semibold text-gray-600">
          Yearly Prelim & TYS Papers
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="mb-4 text-lg font-semibold text-gray-600">
          Video Recordings for Solutions
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
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
      <div className="mx-auto max-w-full">
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl sm:leading-normal md:text-5xl md:leading-relaxed lg:text-6xl">
          Your <span className="text-academic_red">Ultimate Weapon</span>
          <br/>
          To Seize Your <span className="text-success_gold">Academic Destiny</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text_gray md:text-2xl max-w-sm md:max-w-xl">
            Chart your course through the treacherous waters of education with our map of study guides and practice papers!<br/>More than just a collection of materials, we're your steadfast ally in the pursuit of excellence.
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
    link: string;
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
        y: -20,
      }}
      key={product.title}
      className="group/product relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <div className="relative h-[200px] w-[200px] sm:h-[300px] sm:w-[300px]">
          <Image
            src={product.thumbnail}
            fill
            className="object-cover"
            alt={product.title}
          />
        </div>
        
      </Link>
      {/* <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80  bg-black pointer-events-none"></div> */}
      {/* <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2> */}
    </motion.div>
  );
};
