import Image from 'next/image';

const OurServices = () => {
  return (
    <div className="grid mx-auto max-w-[1500px] auto-rows-auto grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="Secure that knowledge bag!"
                desc="Time for your academic glow-up and slay your exams in dazzling style with our notes collection! "
                imagePath="/images/service5.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="To your academic comeback!"
                desc="Catalog your completions and mark your milestones!"
                imagePath="/images/service2.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="Shoot your shot!"
                desc="Set Goals! If you fail to plan, you plan to fail!"
                imagePath="/images/service3.png"
            />
        </div>

        <div className="col-span-1 md:col-span-2 row-span-1">
            <ServiceCard
                header="Spilling the tea on those prelim papers!"
                desc="Grab a cup, it's time to catch the tea on the latest prelim papers and exam tips!"
                imagePath="/images/service5.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                header="Academic Victim to Victor!"
                desc="Bookmark and never lose sight of your favourite materials. No more delulu is the only solulu!"
                imagePath="/images/service5.png"
            />
        </div>

    </div>
  )
}


const ServiceCard = ({ header, desc, imagePath }: { header: string, desc: string, imagePath: string }) => {
    return (
        <div className="flex flex-col w-full h-full bg-pri_bg_card rounded-xl border-2 border-pri_navy_dark p-4">
            <div className="relative w-full min-h-[280px]">
                <Image 
                    src={imagePath} 
                    alt="icon" 
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="flex flex-col justify-start items-start flex-1 gap-4 p-2">
                <h2 className="text-md md:text-xl font-semibold text-gray-600 text-center">
                    {header}
                </h2>
                <p className="text-lg leading-relaxed text-text_gray md:text-xl">
                    {desc}
                </p>
            </div>
        </div>
    )
}


export default OurServices