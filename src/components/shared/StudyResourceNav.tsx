"use client"

import Link from "next/link";
import { usePathname } from 'next/navigation'
import { StudyResourceNavItems } from '../../../constants';


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


  const pathname = usePathname();


  // Get the encoded data from url
  const resourceLevel = pathname.split('/').pop() || '';

  const navBarContent : StudyResourceNavItem[] = StudyResourceNavItems[resourceLevel] || [];


  return (
    <div className="rounded-md px-2 md:px-4 py-2 flex_center gap-2 font-bold">
    <NavigationMenu>
        <NavigationMenuList>

            <NavigationMenuItem>

            <NavigationMenuTrigger className="text-lg md:text-xl font-bold">
              <>
                <p className="hidden sm:inline text-pri_navy_dark">Topical Practice Papers</p>
                <p className="inline sm:hidden text-pri_navy_dark">Topical Papers</p>
              </>
            </NavigationMenuTrigger>

                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-100 opacity-90">
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

                <NavigationMenuTrigger className="text-lg md:text-xl font-bold text-pri_navy_darker">
                  <>
                    <p className="hidden sm:inline">Yearly Practice Papers</p>
                    <p className="inline sm:hidden">Yearly Papers</p>
                  </>
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-100 opacity-90">
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
            <div className="text-md text-pri_navy_dark font-semibold leading-none">{title}</div>
            {/* <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p> */}
          </Link>
        </NavigationMenuLink>
      </li>
    );
  };
  
  
