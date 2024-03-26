import SummarySection from '@/components/shared/SummarySection';
import StudyResourceNav from '@/components/shared/StudyResourceNav';
// import { getUserByClerkId } from '@/lib/actions/user.actions';
// import { auth } from "@clerk/nextjs";


export default function StudyResourcesLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  // const { userId } = auth();
  // const currentSignedInUserObject : UserObject = userId ? await getUserByClerkId(userId) : null;

  // const userID = currentSignedInUserObject ? currentSignedInUserObject._id : null;

  return (
    <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center">

      <SummarySection />

      <StudyResourceNav/>


      {children}
      
      
  </div>
  );
}
