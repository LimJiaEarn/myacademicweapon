"use client"

import { UserProfile } from "@clerk/nextjs";
 
import { useState } from "react";
// Dialog
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"


const AccountManager = () => {
    
    const [showSettings, setshowSettings] = useState(false);


  
    return (
        <div className="relative">

            <button onClick={
                ()=> {
                    setshowSettings((prevVal)=>!prevVal);
                }
            }>
                Edit Profile
            </button>

            {showSettings ?
            <div className="absolute z-20">
                <UserProfile />
            </div>
            :
                <p>No Show</p>
            }

<Dialog>
            <DialogTrigger asChild>
                <p>Edit Profile2</p>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">

                <DialogHeader>
                    <DialogTitle>Title</DialogTitle>
                    <DialogDescription>
                        Desc
                    </DialogDescription>
                </DialogHeader>

                    <div className="flex_center overflow-hidden">
                        <UserProfile />

                    </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <div className="flex_center gap-2">
                            Close
                        </div>
                    </DialogClose>
                </DialogFooter>

            </DialogContent>

        </Dialog>


        </div>
    )
}

export default AccountManager