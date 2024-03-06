"use client"

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';


const WelcomeSection = () => {

const { user } = useUser();


  return (
    <section className="flex_col_center">

      {user ? 
      <p className="py-4 md:py-6 text-3xl md:text-4xl ">Welcome <span className="font-bold">{user.firstName}</span> !</p>
      :
      <p> 
          Sign in to track your progress !
          <Link href="/sign-in" className="flex gap-2">
              Sign in !
          </Link>
      </p>
      }
      
      

    </section>
  )
}

export default WelcomeSection