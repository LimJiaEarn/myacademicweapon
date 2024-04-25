import ServiceCard from "./ServiceCard";
  

// Inspiration: https://www.givingli.com/

const Services = () => {
  return (
    <div className="grid mx-auto max-w-[1500px] auto-rows-auto grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-3">
        
        <ServiceCard
            initial="offscreenLeft"
            variant={1}
            header="No Paywall, No Fees"
            desc="Our dazzling study resources are free to download to ensure your academic glow up!"
            imagePath={["/images/service5.png"]}
            cardStyles="col-span-1 lg:col-span-2 row-span-1 bg-purple_bg flex flex-col"
            headerStyles="text-purple_text"
            paraStyles="text-purple_text"
        />

        <ServiceCard
            initial="offscreenTop"
            variant={1}
            header="Progress Tracker"
            desc="Track your progress and milestones towards academic excellence!"
            imagePath={["/images/service2.png"]}
            cardStyles="col-span-1 row-span-1 lg:row-span-2 bg-pink_bg flex flex-col"
            headerStyles="text-pink_text"
            paraStyles="text-pink_text"
        />

        <ServiceCard
            initial="offscreenRight"
            variant={1}
            header="Goal Settings"
            desc="Lock in your target! Remember, if you fail to plan, you plan to fail!"
            imagePath={["/images/service3.png"]}
            cardStyles="col-span-1 lg:col-span-2 row-span-1 bg-blue_bg flex flex-col"
            headerStyles="text-blue_text"
            paraStyles="text-blue_text"
        />

        <ServiceCard
            initial="offscreenLeft"
            variant={1}
            header="Solution Recordings"
            desc="Grab a cup, it's time to catch the latest tea on exam tips and resources!"
            imagePath={["/images/service5.png"]}
            cardStyles="col-span-1 row-span-1 bg-yellow_bg flex flex-col"
            headerStyles="text-yellow_text"
            paraStyles="text-yellow_text"
        />

        <ServiceCard
            initial="offscreenRight"
            variant={1}
            header="Bookmark Materials"
            desc="Never lose sight of your favourite materials and revisit them anytime!"
            imagePath={["/images/service5.png"]}
            cardStyles="col-span-1 lg:col-span-2 row-span-1 bg-orange_bg flex flex-col"
            headerStyles="text-orange_text"
            paraStyles="text-orange_text"
        />

    </div>
  )
}





export default Services