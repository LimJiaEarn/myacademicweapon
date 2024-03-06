import WelcomeSection from '@/components/shared/WelcomeSection';

export default function SecondaryResourcesLayout({children,}: Readonly<{children: React.ReactNode;}>) {


  return (

      <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center">
        
        <WelcomeSection/>

        <div className="flex_col_between">
        
          <div className="w-1/4">
            
            <p>What would you like to accomplish today?</p>
            
            <div>
              Side Bar
            </div>

          </div>

          <div className="w-3/4">
            {children}
          </div>
        
      </div>

      </div>


    
  );
}
