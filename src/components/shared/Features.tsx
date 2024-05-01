import Image from "next/image";

// Inspiration: https://www.givingli.com/

const Features = () => {
    const baseHeadingStyle = "font-bold text-2xl lg:font-semibold lg:text-3xl z-20";
    const baseParaStyle = "font-medium text-base lg:text-lg z-20";

    return (
        <section className="grid mx-auto max-w-[1500px] auto-rows-min grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
            <div className="bg-pink_bg p-4 md:p-6 rounded-2xl group col-span-1 lg:col-span-2 row-span-1 w-full h-full flex flex-col text-pink_text">
                <h2 className={`${baseHeadingStyle} `}>Set Goals</h2>
                <p className={`${baseParaStyle} max-w-[450px]`}>Set your ambitious targets and don't lose sight of it! If you fail to plan, you plan to fail!</p>

                <div className="flex-grow relative w-full flex justify-center items-center gap-2 min-h-[350px]">
                    <div className="absolute h-[200px] w-[280px] md:h-[300px] md:w-[420px]">
                        <Image src="/images/feature1.png" alt="f2" fill={true}
                            className="rounded-lg object-cover object-top -translate-x-8 -translate-y-2 -rotate-2 group-hover:rotate-4 group-hover:-translate-x-6 group-hover:-translate-y-4 duration-100 ease-in-out"/>
                    </div>
                    <div className="absolute z-10 h-[200px] w-[280px] md:h-[300px] md:w-[420px]">
                        <Image src="/images/feature1.1.png" alt="f2" fill={true} quality={100}
                            className="rounded-lg object-cover object-top translate-x-4 translate-y-2 rotate-6 group-hover:rotate-12 group-hover:translate-x-6 group-hover:translate-y-4 duration-100 ease-in-out"/>
                    </div>
                </div>

            </div>

            <div className="bg-purple_bg p-4 md:p-6 rounded-2xl group col-span-1 row-span-1 lg:row-span-2 w-full h-full flex flex-col text-purple_text">
                
                <h2 className={`${baseHeadingStyle} `}>Track Your Progress</h2>
                
                <div className="flex-grow relative w-full flex justify-center items-center gap-2 min-h-[350px] lg:min-h-[450px]">
                    <div className="absolute h-[250px] w-[160px] lg:h-[400px] lg:w-[300px]">
                        <Image src="/images/feature2.1.png" alt="f2" fill={true}
                            className="rounded-lg object-cover object-top -translate-x-8 -translate-y-2 -rotate-2 group-hover:rotate-4 group-hover:-translate-x-6 group-hover:-translate-y-4 duration-100 ease-in-out"/>
                    </div>
                    <div className="absolute z-10 h-[250px] w-[160px] lg:h-[400px] lg:w-[300px]">
                        <Image src="/images/feature2.png" alt="f2" fill={true} quality={100}
                            className="rounded-lg object-cover object-top translate-x-4 translate-y-2 rotate-6 group-hover:rotate-12 group-hover:translate-x-6 group-hover:translate-y-4 duration-100 ease-in-out"/>
                    </div>
                </div>

                <p className={`${baseParaStyle}`}>Reflect on your performance and celebrate milestones towards academic excellence!</p>
                
            </div>

            <div className="bg-green_bg p-4 md:p-6 rounded-2xl col-span-1 row-span-1 w-full h-full grid grid-cols-2 grid-rows-3 text-green_text">
                <h2 className={`${baseHeadingStyle} col-span-full row-span-1`}>Unlimited Downloads</h2>
                <p className={`${baseParaStyle} `}>Download our coveted resources to review them offline or just for practice anytime anywhere!</p>
            </div>

            <div className="bg-blue_bg p-4 md:p-6 rounded-2xl col-span-1 row-span-1 w-full h-full grid grid-cols-2 grid-rows-3 text-blue_text">
                <h2 className={`${baseHeadingStyle} col-span-full row-span-1`}>Unlimited Bookmarks</h2>
                <p className={`${baseParaStyle} `}>Bookmark your favourite resources and revisit them anytime you wish!</p>
            </div>

            <div className="bg-yellow_bg p-4 md:p-6 rounded-2xl col-span-1 row-span-1 w-full h-full flex flex-col justify-center items-center gap-4 text-yellow_text group ">
                <h2 className={baseHeadingStyle}>No Paywall, No Hidden Fees</h2>
                <div className="relative w-full flex justify-center items-center gap-2 h-[170px]">
                    <div className="absolute w-40 h-40">
                        <Image src="/images/feature4.png" alt="f4" width={160} height={160} 
                            className="rounded-lg -translate-x-4 translate-y-2 -rotate-6 group-hover:-rotate-12 group-hover:-translate-x-6 group-hover:-translate-y-4 duration-100 ease-in-out"/>
                    </div>
                    <div className="absolute w-40 h-40 z-10">
                        <Image src="/images/feature4.1.webp" alt="f4" width={160} height={160} 
                            className="rounded-lg translate-x-4 translate-y-2 rotate-6 group-hover:rotate-12 group-hover:translate-x-6 group-hover:translate-y-4 duration-100 ease-in-out"/>
                    </div>
                </div>
                <p className={baseParaStyle}>All our dazzling study resources are free to view and download to ensure your academic glow up!</p>
            </div>

            <div className="bg-orange_bg p-4 md:p-6 rounded-2xl col-span-1 lg:col-span-2 row-span-1 w-full h-full grid grid-cols-2 grid-rows-3 text-orange_text group ">
                <h2 className={`${baseHeadingStyle} col-start-1 col-span-full`}>Solution Recordings & Walkthroughs</h2>
                <p className={`${baseParaStyle} col-start-1 col-span-1`}>Catch the latest tea on exam strategies and tips<br className="sm:hidden"/> brewed by tutors with proven track records!</p>
                
                <div className="col-start-2 row-span-2 relative w-full flex justify-center items-center gap-2 min-h-[200px]">
                    <div className="absolute h-[250px] w-[250px] md:h-[280px] md:w-[280px] lg:h-[320px] lg:w-[320px]">
                        <Image src="/images/heroImg22.png" alt="f4" fill={true}
                            className="rounded-lg object-cover object-top -translate-x-8 -translate-y-2 -rotate-2 group-hover:rotate-4 group-hover:-translate-x-6 group-hover:-translate-y-4 duration-100 ease-in-out"/>
                    </div>
                    <div className="absolute z-10 h-[250px] w-[250px] md:h-[280px] md:w-[280px] lg:h-[320px] lg:w-[320px]">
                        <Image src="/images/heroImg17.png" alt="f4" fill={true} quality={100}
                            className="rounded-lg object-cover object-top translate-x-4 translate-y-2 rotate-6 group-hover:rotate-12 group-hover:translate-x-6 group-hover:translate-y-4 duration-100 ease-in-out"/>
                    </div>
                </div>
            </div>
        </section>
    )
}






export default Features