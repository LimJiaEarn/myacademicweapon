"use client"

import * as React from "react"
import { useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { StudyResourceNavItems } from '../../../constants';
import Image from 'next/image';


import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"



export default function StudyResourceNav() {

const [resourceSubject, setResourceSubject] = useState("");

const [currentHover, setcurrentHover] = useState<string | null>(null);

const pathname = usePathname();


// Get the encoded data from url
const resourceLevel = pathname.split('/').pop() || '';

const navBarContent : StudyResourceNavItem[] = StudyResourceNavItems[resourceLevel] || [];

  return (
    <div className="bg-light_gray rounded-md px-4 py-2 mx-4 my-4 md:mx-8 md:my-8 flex_center gap-2 font-bold shadow-md">
    <NavigationMenu>
        <NavigationMenuList>

            <NavigationMenuItem>

                <NavigationMenuTrigger>Topical Practice Papers</NavigationMenuTrigger>

                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {navBarContent.map((content) => (
                        <ListItem
                            key={content.id}
                            title={content.title}
                            
                            href={`?${new URLSearchParams({
                                level:resourceLevel as string,
                                subject:content.title,
                                resourceType:"Topical Practice Papers"
                            })}`}
                        >
                        {content.title}
                        </ListItem>
                    ))}
                    </ul>
                </NavigationMenuContent>

            </NavigationMenuItem>

            <NavigationMenuItem>

                <NavigationMenuTrigger>Yearly Practice Papers</NavigationMenuTrigger>

                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {navBarContent.map((content) => (
                        <ListItem
                            key={content.id}
                            title={content.title}
                            href={`?${new URLSearchParams({
                                level:resourceLevel as string,
                                subject:content.title,
                                resourceType:"Yearly Practice Papers"
                            })}`}
                        >
                        {content.title}
                        </ListItem>
                    ))}
                    </ul>
                </NavigationMenuContent>

            </NavigationMenuItem>


        </NavigationMenuList>

    </NavigationMenu>
    </div>

    
  )
}

interface ListItemProps {
    className?: string;
    title: string;
    href: string;
    children: React.ReactNode;
  }
  
const ListItem = ({ className, title, children, href } : ListItemProps) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            href={href} 
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  };
  
  
