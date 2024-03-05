import ResourcesSideBar from "@/components/shared/ResourcesSideBar"
import WelcomeSection from '@/components/shared/WelcomeSection';

export default function SecondaryResourcesLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (

      <div>
        
        <WelcomeSection/>

        <div className="flex">
        
          <div className="w-1/4">
            <ResourcesSideBar />
          </div>

          <div className="w-3/4 debugger">
            {children}
          </div>
        
      </div>

      </div>


    
  );
}
