"use client"

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import {navLinks} from "../../../constants";

const Navbar = () => {

  const pathname = usePathname();

  return (

    <nav className="px-6 py-2 xl:px-10 flex_between border-b bg-teal_green max-w-[100%]">

        <div className="flex_center">
          <Link href="/" className="flex items-center justify-center gap-2">
                <Image src="/images/BigLogo.svg" alt="logo" width={150} height={120}/>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex_between gap-4">
          <SignedIn>
            <ul className="flex_center gap-4">
              {navLinks.map((link) => {

                const isActive = link.route === pathname;

                return (
                  <li key={link.id} className={`flex w-full transition-all hover:text-purple-900 ${isActive? 'text-green-700' : 'text-gray-700'}`}>
                    <Link href={link.route} className="flex gap-2">
                      <Image src={link.icon} alt="icon" height={24} width={24}/>
                      <p className="font-bold">{link.label}</p>
                    </Link>
                  </li>
                  )
              })}
            </ul>

            <UserButton afterSignOutUrl="/"/>
          </SignedIn>

          <SignedOut>
            <ul className="flex_center gap-4">
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

                <li className={`flex w-full px-4 transition-all hover:text-purple-900 ${pathname==='/sign-in'? 'text-green-700' : 'text-gray-700'}`}>
                  <Link href='/sign-in' className="flex gap-2">
                    <Image src="/icons/sign-in.svg" alt="icon" height={24} width={24}/>
                    <p className="font-bold">Sign In</p>
                  </Link>
                </li>

                <li className={`flex w-full px-4 transition-all hover:text-purple-900 ${pathname==='/sign-up'? 'text-green-700' : 'text-gray-700'}`}>
                  <Link href='/sign-up' className="flex gap-2">
                    <Image src="/icons/sign-up.svg" alt="icon" height={24} width={24}/>
                    <p className="font-bold">Sign Up</p>
                  </Link>
                </li>

              </ul>
          </SignedOut>

        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden right-2 flex gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/"/>
            </SignedIn>

            <Sheet>
              <SheetTrigger>
                <Image src="/images/BigLogo.svg" alt="menu" height={32} width={32}/>
              </SheetTrigger>

              <SheetContent className="w-64">
                <SheetHeader>
                <div className="flex flex-col items-center justify-center">

                  <Link href="/" className="flex items-center justify-center gap-2 mb-10">
                    <Image src="/images/logo.png" alt="logo" width={160} height={160}/>
                  </Link>

                  <SignedIn>
                    <ul className="flex_col_center gap-4">
                      {navLinks.map((link) => {

                        const isActive = link.route === pathname;

                        return (
                          <li key={link.id} className={`flex w-full transition-all hover:text-purple-900 ${isActive? 'text-green-700' : 'text-gray-700'}`}>
                            <SheetClose asChild>
                              <Link href={link.route} className="flex gap-2">
                                <Image src={link.icon} alt="icon" height={24} width={24}/>
                                <p className="font-bold">{link.label}</p>
                              </Link>
                            </SheetClose>
                            
                          </li>
                          )
                      })}
                    </ul>
                    
                    {/* This User Button renders but features are unusable, commented out till fix found*/}
                    {/* <div className="mt-10">
                      <UserButton afterSignOutUrl="/"/>
                    </div> */}
                  </SignedIn>

                  <SignedOut>
                    <ul className="flex_col_center gap-4">
                        {navLinks.map((link) => {

                          const isActive = link.route === pathname;

                          return (
                            <li key={link.id} className={`flex w-full px-4 transition-all hover:text-purple-900 ${isActive? 'text-green-700' : 'text-gray-700'}`}>
                              <SheetClose asChild>
                                <Link href={link.route} className="flex gap-2">
                                  <Image src={link.icon} alt="icon" height={24} width={24}/>
                                  <p className="font-bold">{link.label}</p>
                                </Link>
                              </SheetClose>
                            </li>                  
                            )
                        })}

                        <li className={`flex w-full px-4 transition-all hover:text-purple-900 ${pathname==='/sign-in'? 'text-green-700' : 'text-gray-700'}`}>
                          <SheetClose asChild>
                            <Link href='/sign-in' className="flex gap-2">
                              <Image src="/icons/sign-in.svg" alt="icon" height={24} width={24}/>
                              <p className="font-bold">Sign In</p>
                            </Link>
                          </SheetClose>
                        </li>

                        <li className={`flex w-full px-4 transition-all hover:text-purple-900 ${pathname==='/sign-up'? 'text-green-700' : 'text-gray-700'}`}>
                          <SheetClose asChild>
                            <Link href='/sign-up' className="flex gap-2">
                              <Image src="/icons/sign-up.svg" alt="icon" height={24} width={24}/>
                              <p className="font-bold">Sign Up</p>
                            </Link>
                          </SheetClose>
                        </li>

                      </ul>
                  </SignedOut>



                </div>
                

                </SheetHeader>
              </SheetContent>
            
            </Sheet>

        </div>

    </nav>
  )
}


export default Navbar