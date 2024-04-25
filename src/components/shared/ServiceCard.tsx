"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

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

type ServiceCardProps = {
    initial: string,
    header: string,
    desc: string,
    imagePath: string[],
    cardStyles: string,
    headerStyles: string,
    paraStyles: string,
    variant: number, // 1 - Image Top, 2 - Image Right, 3 - Image Bottom, 4- Image top
}


const ServiceCard = ({ initial, header, desc, imagePath, cardStyles, headerStyles, paraStyles, variant }: ServiceCardProps) => {
    
    
    const isMobile = window.innerWidth <= 768;

    let motionVariant = "";
    
    useEffect(()=>{
        const getInitialVariant = (initial : string) => {
            if (isMobile) {
                return 'offscreenLeft';
            }
            return initial;
        };
        motionVariant = getInitialVariant(initial);
    }, [])
    
    return (

    <motion.div
        initial={motionVariant}
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        variants={cardVariants}
        className={`${cardStyles} rounded-3xl p-2`}
    >
        <div className="relative w-full min-h-[240px] lg:min-h-[280px]">
            <Image 
                src={imagePath[0]}
                alt="icon"
                fill
                style={{ objectFit: 'cover' }}
            />
        </div>
        <div className="flex flex-col h-full justify-start items-start gap-4 p-2">
            <h2 className={`text-base md:text-lg font-semibold ${headerStyles}`}>
                {header}
            </h2>
            <p className={`text-sm md:text-base leading-relaxed ${paraStyles}`}>
                {desc}
            </p>
        </div>
     </motion.div>
    )
}

export default ServiceCard;