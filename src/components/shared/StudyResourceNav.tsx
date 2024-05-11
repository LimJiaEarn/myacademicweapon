"use client"

import Link from "next/link";
import { StudyResourceNavItems } from '../../../constants';


import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"



export default function StudyResourceNav({level} : {level: string}) {

  const navBarContent : StudyResourceNavItem[] = StudyResourceNavItems[level] || [];

  return (
    <div className="rounded-md px-2 md:px-4 py-2 flex_center gap-2 font-bold">
    <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>

              <NavigationMenuTrigger className="text-lg md:text-xl font-bold text-pri_navy_darker">
                <>
                  <p className="text-pri_navy_main">Notes</p>
                </>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-100 opacity-90 text-pri_navy_main">
                  {navBarContent.map((content) => (
                      <ListItem
                          key={content.id}
                          title={content.title}
                          
                          href={`?${new URLSearchParams({
                              level:level,
                              subject:content.title,
                              resourceType:"Notes"
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
                  <p className="text-pri_navy_main">Topical<br className="inline sm:hidden"/> Papers</p>
                </>
              </NavigationMenuTrigger>

                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-100 opacity-90 text-pri_navy_main">
                    {navBarContent.map((content) => (
                        <ListItem
                            key={content.id}
                            title={content.title}
                            
                            href={`?${new URLSearchParams({
                                level:level,
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
                    <p className="text-pri_navy_main text-center">Yearly<br className="inline sm:hidden"/> Papers</p>
                  </>
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-slate-100 opacity-90 text-pri_navy_main">
                    {navBarContent.map((content) => (
                        <ListItem
                            key={content.id}
                            title={content.title}
                            href={`?${new URLSearchParams({
                                level:level,
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
  
  
