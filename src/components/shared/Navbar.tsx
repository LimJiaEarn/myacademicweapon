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

    <nav className="z-50 px-6 py-2 xl:px-10 flex_between border-b bg-teal_green fixed top-0 left-0 right-0">

        <div className="flex_center">
          <Link href="/" className="flex items-center justify-center gap-2">
            <div className="w-30 md:w-40"> 
              <Image src="/images/BigLogo.svg" alt="logo" width={160} height={120}/>
            </div>
          </Link>

        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex_between gap-4">
          <SignedIn>
            <ul className="flex_center gap-4">
              {navLinks.map((link) => {

                const isActive = link.route === pathname;

                return (
                  <li key={link.id} className={`flex w-full mr-4 transition-all hover:text-text-green-600 ${isActive? 'text-green-700' : 'text-gray-800'}`}>
                    <Link href={link.route} className="flex gap-2 hover:opacity-75">
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
                    <li key={link.id} className={`flex w-full px-4 transition-all hover:text-green-600 ${isActive? 'text-green-700' : 'text-gray-800'}`}>
                      <Link href={link.route} className="flex gap-2 hover:opacity-75">
                        <Image src={link.icon} alt="icon" height={24} width={24} />
                        <p className="text-md font-bold">{link.label}</p>
                      </Link>
                    </li>                  
                    )
                })}

                <li className="hidden lg:flex w-full px-4 transition-all hover:text-green-200 text-gray-200">
                  <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-lime-200 to-lime-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <div className="relative pl-4 pr-6 py-4 bg-green-700 rounded-lg leading-none flex items-center divide-x divide-white">
                      
                      <Link href="/sign-in">
                        <div className="flex pr-6">
                          <Image src="/icons/sign-up-banner.svg" height={15} width={15} alt="icon"/>
                          <p className="text-md whitespace-nowrap space-x-5 pl-4 pr-2 text-white hover:text-green-200 transition duration-125 text-center">Sign In</p>
                        </div>
                      </Link>
                      <Link href="/sign-up">
                        <p className="text-md whitespace-nowrap pl-4 text-white hover:text-green-200 transition duration-125 text-center">Sign Up</p>
                      </Link>
                    </div>
                  </div>
                </li>

                <li className={`flex lg:hidden w-full px-4 transition-all hover:text-green-600 ${pathname==='/sign-in'? 'text-green-700' : 'text-gray-800'}`}>
                  <Link href='/sign-in' className="flex gap-2 hover:opacity-75">
                    <Image src="/icons/sign-in.svg" alt="icon" height={24} width={24}/>
                    <p className="text-md whitespace-nowrap font-semibold">Sign In / Up</p>
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
                <Image src="/icons/menu.svg" alt="menu" height={35} width={35}/>
              </SheetTrigger>

              <SheetContent className="w-64">
                <SheetHeader>
                <div className="flex flex-col items-center justify-center">

                  <Link href="/" className="flex items-center justify-center gap-2 mb-10">
                    <Image src="/images/BigLogo.svg" alt="menu" height={160} width={160}/>
                  </Link>

                  <SignedIn>
                    <ul className="flex_col_center gap-4">
                      {navLinks.map((link) => {

                        const isActive = link.route === pathname;

                        return (
                          <li key={link.id} className={`flex w-full transition-all hover:text-green-600 ${isActive? 'text-green-700' : 'text-gray-800'}`}>
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
                            <li key={link.id} className={`flex w-full px-4 transition-all hover:text-green-600 ${isActive? 'text-green-700' : 'text-gray-800'}`}>
                              <SheetClose asChild>
                                <Link href={link.route} className="flex gap-2">
                                  <Image src={link.icon} alt="icon" height={24} width={24}/>
                                  <p className="font-bold">{link.label}</p>
                                </Link>
                              </SheetClose>
                            </li>                  
                            )
                        })}

                        <li className={`flex w-full px-4 transition-all hover:text-green-600 ${pathname==='/sign-in'? 'text-green-700' : 'text-gray-800'}`}>
                          <SheetClose asChild>
                            <Link href='/sign-in' className="flex gap-2">
                              <Image src="/icons/sign-in.svg" alt="icon" height={24} width={24}/>
                              <p className="font-bold">Sign In / Up</p>
                            </Link>
                          </SheetClose>
                        </li>

                        {/* <li className={`flex w-full px-4 transition-all hover:text-gray-400 ${pathname==='/sign-up'? 'text-green-700' : 'text-gray-800'}`}>
                          <SheetClose asChild>
                            <Link href='/sign-up' className="flex gap-2">
                              <Image src="/icons/sign-up.svg" alt="icon" height={24} width={24}/>
                              <p className="font-bold">Sign Up</p>
                            </Link>
                          </SheetClose>
                        </li> */}

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