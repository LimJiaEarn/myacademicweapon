import Image from 'next/image';



const OurServices = () => {
  return (
    <div className="grid mx-auto max-w-[1500px] md:auto-rows-[25rem] grid-cols-1 md:grid-cols-3 gap-2">
        
        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="Secure that knowledge bag!"
                desc="Time for your academic glow-up and slay your exams in dazzling style with our notes collection! "
                iconUrl="/icons/progressIcon.svg"
                imagePath="/images/heroImg1.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="To your academic comeback!"
                desc="Catalog your completions and mark your milestones!"
                iconUrl="/icons/completedIcon.svg"
                imagePath="/images/heroImg1.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="Shoot your shot!"
                desc="Set Goals! If you fail to plan, you plan to fail!"
                iconUrl="/icons/completedIcon.svg"
                imagePath="/images/heroImg1.png"
            />
        </div>

        <div className="col-span-1 md:col-span-2 row-span-1">
            <ServiceCard
                header="Spilling the tea on those prelim papers!"
                desc="Grab a cup, it's time to catch the tea on the latest prelim papers and exam tips!"
                iconUrl="/icons/progressIcon.svg"
                imagePath="/images/heroImg1.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="Academic Victim to Victor!"
                desc="Bookmark and never lose sight of your favourite materials. No more delulu is the only solulu!"
                iconUrl="/icons/bookmarkIcon.svg"
                imagePath="/images/heroImg1.png"
            />
        </div>

    </div>
  )
}


const ServiceCard = ({header, desc, iconUrl, imagePath} : {header:string, desc:string, iconUrl:string, imagePath:string}) => {


    return(
        <div className="w-full h-full bg-pri_bg_card rounded-xl p-4 flex flex-col justify-start items-start">
            <div className="flex items-center gap-2 md:gap-4">
                <Image src={imagePath} alt="icon" height={100} width={100}/>
            </div>

            <div className="w-full flex_col_center gap-4">
            {/* {iconUrl && <Image src={iconUrl} alt="icon" height={48} width={48} />} */}
            <h2 className="text-md md:text-xl font-semibold text-gray-600 text-center">
                {header}
            </h2>
            <p className="text-lg leading-relaxed text-text_gray md:text-xl">{desc}</p>
            </div>

      </div>
    )
  }

export default OurServices