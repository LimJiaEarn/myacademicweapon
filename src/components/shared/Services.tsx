import ServiceCard from "./ServiceCard";
  

const Services = () => {
  return (
    <div className="grid mx-auto max-w-[1500px] auto-rows-auto grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-3">
        
        <div className="col-span-1 row-span-1">
            <ServiceCard
                initial="offscreenLeft"
                header="Secure That Knowledge Bag!"
                desc="Our dazzling study resources are free to download to ensure your academic glow up!"
                imagePath="/images/service5.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                initial="offscreenTop"
                header="Chart Your Academic Comeback!"
                desc="Track your achievements and milestones to academic excellence!"
                imagePath="/images/service2.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                initial="offscreenRight"
                header="Shoot your shot!"
                desc="Lock in your target! Remember, if you fail to plan, you plan to fail!"
                imagePath="/images/service3.png"
            />
        </div>

        <div className="col-span-1 lg:col-span-2 row-span-1">
            <ServiceCard
                initial="offscreenLeft"
                header="Spilling The Latest Tea!"
                desc="Grab a cup, it's time to catch the latest exam tips and resources!"
                imagePath="/images/service5.png"
            />
        </div>

        <div className="col-span-1 row-span-1">
            <ServiceCard
                initial="offscreenRight"
                header="Academic Victim to Victor!"
                desc="Bookmark and revisit your favourite materials anytime! Your victory is inevitable!"
                imagePath="/images/service5.png"
            />
        </div>

    </div>
  )
}





export default Services