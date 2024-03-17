"use client"

import { useUser } from '@clerk/nextjs';
import { Progress } from "@/components/ui/progress"
import Link from 'next/link';

interface SummarySectionProps{
  subjectSelection: String;
}

const SummarySection = (props: SummarySectionProps) => {

  const { user } = useUser();

  let mongoDbId: string | undefined = undefined;
  if (user)
    mongoDbId = (user?.publicMetadata as { userId: string }).userId; 

    // TODO: GET USER PROGRESS

  return (
    <section className="flex flex-col items-center mb-4 p-4 bg-light_gray rounded-lg shadow">
      {user ? 
        <div className="text-center">
          <p className="py-4 md:py-6 text-2xl md:text-3xl text-success_gold">Welcome, <span className="font-bold">{user.firstName}!</span></p>
          {props.subjectSelection ?
            <div className="flex flex-col items-center gap-2">
              <p className="text-info_blue">Your Stats in <span className="font-bold">{props.subjectSelection}:</span></p>
              <Progress value={33} className="w-full" />
            </div> :
            <p className="text-text_gray">What would you like to accomplish today?</p>}
        </div> :
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
