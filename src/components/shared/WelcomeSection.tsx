"use client"

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';


const WelcomeSection = () => {

const { user } = useUser();

console.log(user?.firstName);

  return (
    <div>

        {user ? 
        <p>Welcome {user.firstName} !</p>
        :
        <p> 
            Sign in to track your progress !
            <Link href="/sign-in" className="flex gap-2">
                Sign in !
            </Link>
        </p>
        }



    </div>
  )
}

export default WelcomeSection