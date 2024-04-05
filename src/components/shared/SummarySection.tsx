"use client"

import { Progress } from "@/components/ui/progress"
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';


// interface SummarySectionProps{
//   subjectSelection: String;
// }

const SummarySection = () => {

  const { user } = useUser();

  console.log(user);

    // TODO: GET USER PROGRESS

  return (
    <section className="flex flex-col items-center mb-4 p-4 bg-light_gray rounded-lg shadow">
      {user ? 
        <div className="text-center">
          <p className="py-4 md:py-6 text-2xl md:text-3xl text-success_gold">Welcome, <span className="font-bold">{user.firstName}!</span></p>
        </div>
        :
        <div className="flex_col_center gap-4">
          <p className="text-text_gray">
            Sign in to track your progress!
          </p>
          <Link href="/sign-in">
            <p className="inline-flex items-center gap-2 ml-2 px-4 py-2 bg-info_blue text-white rounded-md hover:bg-info_blue_hover transition-colors duration-150">
              Sign in!
            </p>
        </Link>
        </div>

      }
    </section>
  )
}

export default SummarySection
