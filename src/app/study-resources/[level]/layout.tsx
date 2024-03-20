import SummarySection from '@/components/shared/SummarySection';
import StudyResourceNav from '@/components/shared/StudyResourceNav';

export default function StudyResourcesLayout({ children,}: Readonly<{children: React.ReactNode;}>) {

  return (
    <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center">

      <SummarySection />

      <StudyResourceNav/>


      {children}
      
      
  </div>
  );
}
