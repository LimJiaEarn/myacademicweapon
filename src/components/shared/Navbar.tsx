"use client"

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
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
import { navLinks } from "../../../constants";


const ProfileLink = ({fullPath, username, imageUrl, imgSize} : {fullPath : string, username: string | null | undefined, imageUrl: string | null | undefined, imgSize: number}) => {

  if (!username) return <></>
  const isActive : boolean = fullPath==`/profile/${username}`;


  return(
    <Link
      href={`/profile/${username}`}
      className={`rounded-full ${isActive ? 'border-2 border-pri_gold_light' : ''}`}
    >
      <Image className="rounded-full hover:scale-[1.05] transition ease-in-out delay-100" src={imageUrl || "/images/Logo.svg"} alt="userDP" height={imgSize} width={imgSize}/>
    </Link>
  )
}




const Navbar = () => {

  const fullPath = usePathname();
  const pathSegments = fullPath.split('/').filter(Boolean);


  const pathname = pathSegments.length > 0 ? '/' + pathSegments[0] : '/';


  const { user } = useUser();

  return (

    <nav className="z-50 px-2 sm:px-6 py-2 xl:px-10 flex_between border-b bg-pri_nav_color fixed bottom-0 sm:bottom-auto sm:top-0 left-0 right-0">

        <div className="hidden sm:flex_center">
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
                  <li key={link.id} className={`flex w-full mr-4 transition-all hover:text-text-pri_navy_main ${isActive? 'text-pri_navy_main' : 'text-pri_navy_main'}`}>
                    <Link href={link.route} className="flex gap-2 hover:opacity-75">
                      <Image src={link.icon} alt="icon" height={24} width={24}/>
                      <p className="font-bold">{link.label}</p>
                    </Link>
                  </li>
                  )
              })}
            </ul>
            
            <ProfileLink
              fullPath={fullPath}
              username={user?.username}
              imageUrl={user?.imageUrl}
              imgSize={40}
            />

          </SignedIn>

          <SignedOut>
            <ul className="flex_center gap-4">
                {navLinks.map((link) => {

                  const isActive = link.route === pathname;

                  return (
                    <li key={link.id} className={`flex w-full px-4 transition-all hover:text-pri_navy_main ${isActive? 'text-pri_navy_main' : 'text-pri_navy_main'}`}>
                      <Link href={link.route} className="flex gap-2 hover:opacity-75">
                        <Image src={link.icon} alt="icon" height={24} width={24} />
                        <p className="text-md font-bold">{link.label}</p>
                      </Link>
                    </li>                  
                    )
                })}

                <li className="hidden lg:flex w-full px-4 transition-all hover:text-pri_navy_darker text-gray-100">
                  <div className="relative group">
                    {/* Div belows gives the glowing effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pri_navy_light via-pri_navy_light to-pri_navy_darker rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <div className="relative pl-4 pr-6 py-4 bg-pri_navy_light rounded-lg leading-none flex items-center divide-x divide-white">
                      
                      <Link href="/sign-in">
                        <div className="flex pr-6">
                          <Image src="/icons/sign-up-banner.svg" height={15} width={15} alt="icon"/>
                          <p className="text-md whitespace-nowrap space-x-5 pl-4 pr-2 text-white hover:text-pri_mint_lighter transition duration-125 text-center">Sign In</p>
                        </div>
                      </Link>
                      <Link href="/sign-up">
                        <p className="text-md whitespace-nowrap pl-4 text-white hover:text-pri_mint_lighter transition duration-125 text-center">Sign Up</p>
                      </Link>
                    </div>
                  </div>
                </li>

                <li className={`flex lg:hidden w-full px-4 transition-all hover:text-pri_navy_main ${pathname==='/sign-in'? 'text-pri_navy_main' : 'text-pri_navy_main'}`}>
                  <Link href='/sign-in' className="flex gap-2 hover:opacity-75">
                    <Image src="/icons/sign-in.svg" alt="icon" height={24} width={24}/>
                    <p className="text-md whitespace-nowrap font-semibold">Sign In / Up</p>
                  </Link>
                </li>

              </ul>
          </SignedOut>

        </div>
        
        {/* iPad Navigation */}
        <div className="hidden sm:flex md:hidden gap-4">
            <SignedIn>
              <ProfileLink
                fullPath={fullPath}
                username={user?.username}
                imageUrl={user?.imageUrl}
                imgSize={40}
              />
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
                          <li key={link.id} className={`flex w-full transition-all hover:text-pri_navy_main ${isActive? 'text-pri_navy_main' : 'text-pri_navy_main'}`}>
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
                    
                  </SignedIn>

                  <SignedOut>
                    <ul className="flex_col_center gap-4">
                        {navLinks.map((link) => {

                          const isActive = link.route === pathname;

                          return (
                            <li key={link.id} className={`flex w-full px-4 transition-all hover:text-pri_navy_main ${isActive? 'text-pri_navy_main' : 'text-pri_navy_main'}`}>
                              <SheetClose asChild>
                                <Link href={link.route} className="flex gap-2">
                                  <Image src={link.icon} alt="icon" height={24} width={24}/>
                                  <p className="font-bold">{link.label}</p>
                                </Link>
                              </SheetClose>
                            </li>                  
                            )
                        })}

                        <li className={`flex w-full px-4 transition-all hover:text-pri_navy_main ${pathname==='/sign-in'? 'text-pri_navy_main' : 'text-pri_navy_main'}`}>
                          <SheetClose asChild>
                            <Link href='/sign-in' className="flex gap-2">
                              <Image src="/icons/sign-in.svg" alt="icon" height={24} width={24}/>
                              <p className="font-bold">Sign In / Up</p>
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

        {/* Mobile Navigation */}
        <div className="flex items-center sm:hidden w-full min-h-[38px]">
          <SignedIn>
            <ul className="grow flex justify-evenly py-1">
              {navLinks.map((link) => {

                const isActive = link.route === pathname;

                return (
                  <li key={link.id} className={`flex hover:text-pri_navy_main ${isActive? 'text-pri_navy_main bg-pri_gold_light rounded-full p-2' : 'text-pri_navy_main'}`}>
                  <Link href={link.route} className="flex_col_center gap-1">
                    <Image src={link.icon} alt="icon" height={28} width={28} />
                    {/* <p className="font-bold text-center w-[90px]">{link.label}</p> */}
                  </Link>
                </li>   
                  )
              })}
              <div className="pr-2">
                <Link href={`/profile/${user?.username}`}>
                  <Image
                    className={`rounded-full hover:scale-[1.05] transition ease-in-out delay-100 ${fullPath === `/profile/${user?.username}` ? 'border-2 border-pri_gold_light' : ''}`}
                    src={user?.imageUrl || "/images/Logo.svg"}
                    alt="userDP"
                    height={38}
                    width={38}
                  />
                </Link>
              </div>
            
            </ul>
            



          </SignedIn>

          <SignedOut>
            <ul className="w-full flex justify-evenly py-1">
                {navLinks.map((link) => {

                  const isActive = link.route === pathname;

                  return (
                    <li key={link.id} className={`flex hover:text-pri_navy_main ${isActive? 'text-pri_navy_main bg-pri_gold_light rounded-full p-2' : 'text-pri_navy_main'}`}>
                      <Link href={link.route} className="flex_col_center gap-1">
                        <Image src={link.icon} alt="icon" height={28} width={28} />
                        {/* <p className="font-bold text-center w-[90px]">{link.label}</p> */}
                      </Link>
                    </li>                  
                    )
                })}

                <li className={`flex hover:text-pri_navy_main ${pathname==='/sign-in'? 'text-pri_navy_main bg-pri_gold_light rounded-full p-2' : 'text-pri_navy_main'}`}>
                  <Link href='/sign-in' className="flex_col_center gap-1">
                    <Image src="/icons/sign-in.svg" alt="icon" height={28} width={28}/>
                    {/* <p className="font-bold text-center w-[90px]">Sign In / Up</p> */}
                  </Link>
                </li>

              </ul>
          </SignedOut>

        </div>

    </nav>
  )
}


export default Navbar