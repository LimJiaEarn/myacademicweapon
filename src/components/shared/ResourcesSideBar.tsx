import {
    Sheet,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetHeader,
    SheetTrigger,
    SheetClose
  } from "@/components/ui/sheet";
import Image from 'next/image';



const ResourcesSideBar = () => {
  return (
    <div className="">

        <Sheet>
            <SheetTrigger>
                <Image src="/icons/rightArrow.svg" alt="menu" height={32} width={32}/>
            </SheetTrigger>

            <SheetContent side="left" className="relative">
                <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    </div>
  )
}

export default ResourcesSideBar