"use client"

import { UserButton } from "@clerk/nextjs";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import {navLinks} from "../../../constants";

const Navbar = () => {

  const pathname = usePathname();

  return (

    <nav className="px-6 xl:px-10 flex_between border-b border-red-600">

        <div className="flex_center">
          <Link href="/" className="flex items-center justify-center gap-2">
                <Image src="/images/logo.png" alt="logo" width={180} height={180}/>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex_between gap-4">

          <ul className="flex_center">
            {navLinks.map((link) => {

              const isActive = link.route === pathname;

              return (
                <li key={link.id} className={`flex w-full px-4 transition-all hover:text-purple-900 ${isActive? 'text-green-700' : 'text-gray-700'}`}>
                  <Link href={link.route} className="flex gap-2">
                    <Image src={link.icon} alt="icon" height={24} width={24}/>
                    <p className="font-bold">{link.label}</p>
                  </Link>
                </li>
              
                )

            })}
          </ul>

          <UserButton showName/>
        </div>



    </nav>
  )
}


export default Navbar