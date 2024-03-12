"use client"

import { useUser } from '@clerk/nextjs';
import { Progress } from "@/components/ui/progress"
import Link from 'next/link';

interface SummarySectionProps{
  subjectSelection : String
}

const SummarySection = (props:SummarySectionProps) => {
const { user } = useUser();

let mongoDbId: string | undefined = undefined;
if (user)
  mongoDbId = (user?.publicMetadata as { userId: string }).userId; // MongoDB's _id stored as public metadata in clerk


  return (
    <section className="flex_col_center mb-4">
     
      {user ? 
      <div>
         <p>{mongoDbId}</p>
        <p className="py-4 md:py-6 text-3xl md:text-4xl ">Welcome <span className="font-bold">{user.firstName}</span> !</p>
        {props.subjectSelection ?
        <div className="flex_col_center gap-2">
          <p>Your Stats in {props.subjectSelection}:</p>
          <Progress value={33} />

        </div>
        
        :
        <p>What would you like to accomplish today?</p>}
      </div>
      :
      <p> 
          Sign in to track your progress !

          {/* TODO: STYLE THIS */}
          <Link href="/sign-in" className="flex gap-2">
              Sign in !
          </Link>
      </p>
      }
      
      
      

    </section>
  )
}

export default SummarySection