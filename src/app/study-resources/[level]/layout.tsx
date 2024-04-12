import SummarySection from '@/components/shared/SummarySection';
import StudyResourceNav from '@/components/shared/StudyResourceNav';
import { auth } from "@clerk/nextjs";


export default function StudyResourcesLayout({ children,}: Readonly<{children: React.ReactNode;}>) {

  return (
    <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center max-w-[1500px] mx-auto">

      {/* <SummarySection/> */}


      <div className="w-full px-2 md:px-4 py-2">
        <StudyResourceNav/>
        <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_navy_dark to-transparent opacity-25" />

        {children}
      </div>


      
      
  </div>
  );
}
