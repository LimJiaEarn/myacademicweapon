import Image from "next/image";
// Inspiration: https://www.givingli.com/

const Features = () => {
    const baseHeadingStyle = "font-bold text-2xl lg:font-semibold sm:text-3xl z-20 mb-4";
    const baseParaStyle = "font-medium text-lg z-20";

    return (
        <section className="grid mx-auto max-w-[1500px] auto-rows-min grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">

            <div className="bg-pink_bg p-4 md:p-6 rounded-2xl group col-span-1 lg:col-span-2 row-span-1 w-full h-full flex flex-col gap-4 text-pink_text">
                <h2 className={`${baseHeadingStyle} `}>Set Goals</h2>
                <p className={`${baseParaStyle} lg:max-w-[450px]`}>Set your ambitious targets and don't lose sight of it! If you fail to plan, you plan to fail!</p>

                <div className="flex-grow relative w-full flex justify-center items-center gap-2 min-h-[330px]">
                    <div className="absolute h-[200px] w-[320px] xl:h-[300px] xl:w-[420px]">
                        <Image src="/images/feature1.png" alt="f2" fill={true}
                            className="rounded-lg object-cover object-top md:-translate-x-20 lg:-translate-x-40 -translate-y-12 -rotate-2 group-hover:-rotate-12 md:group-hover:-translate-x-24 lg:group-hover:-translate-x-48 group-hover:-translate-y-16 duration-300 ease-in-out"/>
                    </div>
                    <div className="absolute z-10 h-[200px] w-[320px] xl:h-[300px] xl:w-[420px]">
                        <Image src="/images/feature1.1.png" alt="f2" fill={true} quality={100}
                            className="rounded-lg object-cover object-top md:translate-x-24 lg:translate-x-40 translate-y-16 md:translate-y-8 rotate-6 group-hover:rotate-12 md:group-hover:translate-x-28 lg:group-hover:translate-x-48 group-hover:translate-y-16 md:group-hover:translate-y-16 duration-300 ease-in-out"/>
                    </div>
                </div>

            </div>

            <div className="bg-purple_bg p-2 rounded-2xl group col-span-1 row-span-1 lg:row-span-2 w-full h-full flex flex-col text-purple_text overflow-hidden">
                
                <h2 className={`${baseHeadingStyle} px-2 py-4`}>Track Your Progress</h2>
                <div className="flex flex-col justify-start items-center h-full gap-8 lg:gap-12">
                    <p className={`${baseParaStyle} w-full text-left px-4`}>Reflect on your performance and celebrate milestones towards academic excellence!</p>
                    <div className="relative flex justify-center items-center gap-2 w-3/5 lg:w-full h-[400px] lg:h-[600px]">
                        <Image src="/images/feature2.png" alt="f2" fill={true} quality={100}
                            className="absolute rounded-lg object-cover object-top -rotate-6 lg:rotate-2 lg:group-hover:object-bottom duration-300 ease-linear"
                        />
                    </div>
                </div>
                
            </div>

            <div className="bg-blue_bg p-4 md:p-6 rounded-2xl group col-span-1 row-span-1 w-full h-full flex flex-col gap-6 text-blue_text">
                <h2 className={`${baseHeadingStyle} col-span-full row-span-1`}>Unlimited Bookmarks</h2>

                <Image src="/images/feature3.png" alt="f4" width={280} height={250} 
                    className="rounded-lg mx-auto skew-x-1 group-hover:skew-x-0 -translate-x-4 translate-y-2 -rotate-6 group-hover:-rotate-12 group-hover:-translate-x-6 group-hover:-translate-y-4 group-hover:scale-[1.1] duration-200 ease-in-out"/>

                <p className={`${baseParaStyle} `}>Bookmark your favourite resources and revisit them anytime you wish!</p>
            </div>

            <div className="bg-green_bg p-4 md:p-6 rounded-2xl group col-span-1 row-span-1 w-full h-full flex flex-col gap-4 text-green_text">
                <h2 className={`${baseHeadingStyle} col-span-full row-span-1`}>Unlimited Downloads</h2>
                <p className={`${baseParaStyle}`}>Download our coveted resources to review them offline or just for practice anytime anywhere!</p>
                <div className="relative w-full flex justify-center items-center min-h-[250px]">
                    <div className="absolute transition-transform duration-300 ease-in-out transform -translate-x-12 rotate-[-12deg] group-hover:-translate-x-24 group-hover:rotate-[-24deg]">
                        <Image src="/images/heroImg11.png" alt="f4" width={160} height={224} className="rounded-sm object-cover object-top"/>
                    </div>
                    <div className="absolute z-[9] transition-transform duration-300 ease-in-out transform -translate-x-6 rotate-[-6deg] group-hover:-translate-x-12 group-hover:rotate-[-12deg]">
                        <Image src="/images/heroImg12.png" alt="f4" width={160} height={224} className="rounded-sm object-cover object-top"/>
                    </div>
                    <div className="absolute z-[10] transition-transform duration-300 ease-in-out transform translate-x-3 rotate-3 group-hover:translate-x-6 group-hover:rotate-6">
                        <Image src="/images/heroImg13.png" alt="f4" width={160} height={224} className="rounded-sm object-cover object-top"/>
                    </div>
                    <div className="absolute z-[11] transition-transform duration-300 ease-in-out transform -translate-x-3 rotate-[-3deg] group-hover:-translate-x-6 group-hover:rotate-[-6deg]">
                        <Image src="/images/heroImg16.png" alt="f4" width={160} height={224} className="rounded-sm object-cover object-top"/>
                    </div>
                    <div className="absolute z-[12] transition-transform duration-300 ease-in-out transform translate-x-6 rotate-6 group-hover:translate-x-12 group-hover:rotate-12">
                        <Image src="/images/heroImg15.png" alt="f4" width={160} height={224} className="rounded-sm object-cover object-top"/>
                    </div>
                    <div className="absolute z-[13] transition-transform duration-300 ease-in-out transform translate-x-12 rotate-12 group-hover:translate-x-24 group-hover:rotate-24">
                        <Image src="/images/heroImg14.png" alt="f4" width={160} height={224} className="rounded-sm object-cover object-top"/>
                    </div>
                </div>
            </div>

            <div className="bg-yellow_bg p-4 md:p-6 rounded-2xl col-span-1 row-span-1 w-full h-full flex flex-col justify-start items-center gap-4 text-yellow_text group ">
                <h2 className={`${baseHeadingStyle} w-full text-left`}>No Paywall, No Hidden Fees</h2>
                <div className="relative w-full flex justify-center items-center gap-2 h-[170px]">
                    <div className="absolute w-40 h-40">
                        <Image src="/images/feature5.png" alt="f4" width={160} height={160} 
                            className="rounded-lg -translate-x-4 translate-y-2 -rotate-6 group-hover:-rotate-12 group-hover:-translate-x-6 group-hover:-translate-y-4 duration-100 ease-in-out"/>
                    </div>
                    <div className="absolute w-40 h-40 z-10">
                        <Image src="/images/feature5.1.webp" alt="f4" width={160} height={160} 
                            className="rounded-lg translate-x-4 translate-y-2 rotate-6 group-hover:rotate-12 group-hover:translate-x-6 group-hover:translate-y-4 duration-100 ease-in-out"/>
                    </div>
                </div>
                <p className={`${baseParaStyle} w-full text-left`}>All our resources are free for practice & download and we aren't planning to change this! Ever.</p>
            </div>

            <div className="bg-orange_bg p-4 md:p-6 rounded-2xl col-span-1 lg:col-span-2 row-span-1 w-full h-full flex flex-col justify-start items-center text-orange_text group ">
                <h2 className={`${baseHeadingStyle} w-full text-left`}>Solution Recordings & Walkthroughs</h2>

                <div className="flex flex-col md:flex-row justify-evenly items-center gap-4">
                    <p className={`${baseParaStyle} w-full text-left min-h-[140px] sm:min-h-[100px]`}>Catch the latest tea on exam strategies and tips<br className="sm:hidden"/> brewed by tutors with proven track records!</p>
                    
                    <div className="relative left-14 lg:left-10 -top-8 lg:top-8 w-full flex justify-center items-center gap-2 min-w-[200px] min-h-[200px] md:min-h-[220px]">
                        <div className="absolute h-[230px] w-[230px] md:h-[280px] md:w-[280px]">
                            <Image src="/images/heroImg22.png" alt="f4" fill={true}
                                className="rounded-lg object-cover object-top -translate-x-4 -translate-y-2 -rotate-2 group-hover:rotate-4 group-hover:-translate-x-10 group-hover:-translate-y-4 duration-100 ease-in-out"/>
                        </div>
                        <div className="absolute z-10 h-[230px] w-[230px] md:h-[280px] md:w-[280px]">
                            <Image src="/images/heroImg17.png" alt="f4" fill={true} quality={100}
                                className="rounded-lg object-cover object-top translate-y-2 rotate-6 group-hover:rotate-12 group-hover:translate-x-10 group-hover:translate-y-4 duration-100 ease-in-out"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}






export default Features