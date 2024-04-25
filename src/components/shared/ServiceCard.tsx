"use client"


import Image from 'next/image';
import { motion } from 'framer-motion';

const cardVariants = {
    offscreenTop: {
        y: -50,
        opacity: 0
      },
    offscreenLeft: {
      x: -50,
      opacity: 0
    },
    offscreenRight: {
      x: 50,
      opacity: 0
    },
    onscreen: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: "easeOut"
      }
    }
};


const ServiceCard = ({ initial, header, desc, imagePath }: { initial: string, header: string, desc: string, imagePath: string }) => {
    
    
    const isMobile = window.innerWidth <= 768;

    const getInitialVariant = (initial : string) => {
        if (isMobile) {
            return 'offscreenLeft';
        }
        return initial;
    };
    
    return (

    <motion.div
        initial={getInitialVariant(initial)}
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        variants={cardVariants}
        className="w-full h-full bg-pri_bg_card rounded-xl border-2 border-pri_mint_dark flex flex-col p-2"
    >
        <div className="relative w-full min-h-[240px] lg:min-h-[280px]">
            <Image 
                src={imagePath}
                alt="icon"
                fill
                style={{ objectFit: 'cover' }}
            />
        </div>
        <div className="flex flex-col h-full justify-start items-start gap-4 p-2">
            <h2 className="text-base md:text-lg font-semibold text-pri_navy_dark">
                {header}
            </h2>
            <p className="text-sm leading-relaxed text-pri_navy_main md:text-base">
                {desc}
            </p>
        </div>
     </motion.div>
    )
}

export default ServiceCard;