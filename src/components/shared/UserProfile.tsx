"use client"

import Image from "next/image";
import Tab from "@/components/shared/Tab";
import { useState } from 'react';
import Pie from '@/components/shared/Piechart';
import { updateUserByUserID } from '@/lib/actions/user.actions';
import { useToast } from '../ui/use-toast';

interface UserProfileProps {
  currentUserProfileObject: UserObject;
  isOwnUser : boolean;
  userID : string;
  simplifiedCompletedResourceObjects : ISummarisedPracticePaper[];
  simplifiedBookmarkedResourceObjects : ISummarisedPracticePaper[];
}


const UserProfile = ({currentUserProfileObject, isOwnUser, userID, simplifiedCompletedResourceObjects, simplifiedBookmarkedResourceObjects} : UserProfileProps) => {
    
    // Set it as states so we can sync the data changes to other cards
    const [completedTableData, setCompletedTableData] = useState<ISummarisedPracticePaper[]>(simplifiedCompletedResourceObjects);
    const [bookmarkTableData, setBookmarkTableData] = useState<ISummarisedPracticePaper[]>(simplifiedBookmarkedResourceObjects);
    const { toast } = useToast();

    const [goal, setGoal] = useState<number>(currentUserProfileObject.goal);
    const [goal2, setGoal2] = useState<number>(3);
    const [editGoal, setEditGoal] = useState<boolean>(false);
    
    const updateGoal = async () => {
      
      try{
        await updateUserByUserID(currentUserProfileObject._id, {...currentUserProfileObject, goal: goal});
        toast({
            description:"Goal Updated!"
        })
    }
    catch (error){
        toast({
            description:"Encountered error in updating goal. Try again later!"
        })
    }
      
      setEditGoal(false)
    }


    const completed = completedTableData.length;
    const percentShade = Math.min(100, (completed/goal) * 100); 
    const data = [percentShade, 100 - percentShade];
    const colors =  ['hsl(49.3, 99%, 45%)', 'hsla(177.4, 76.9%, 46%, 0.02)'];
    const radius = 70;
    const hole = 62;
    const innerText = `${completed}/${goal}`;

    const completedRecords: Record<string, number> = {};

    completedTableData?.forEach((paper) => {
      completedRecords[paper.subject] = (completedRecords[paper.subject] || 0) + 1;
    });

    const bookmarkedRecords: Record<string, number> = {};

    bookmarkTableData?.forEach((paper) => {
      bookmarkedRecords[paper.subject] = (bookmarkedRecords[paper.subject] || 0) + 1;
    });


    return (
    <div className="grid row-auto gap-4 md:gap-6">

      <div className="bg-pri_bg_card rounded-xl px-2 py-2 md:py-4 md:px-4 grid grid-rows-auto lg:grid-cols-2 gap-2 w-full">
        
        <div className="col-span-1 row-span-1 flex flex-col justify-start items-center">
            <h2 className="w-full px-2 text-md md:text-lg font-bold md:text-md text-pri_navy_darker text-center mb-2">{isOwnUser && "Your "}Progress</h2>
            
            {Object.keys(completedRecords).length === 0 ?
                <p className="w-full text-center italic text-pri_navy_main">0 completed papers found</p>
                :
                <ul className="w-4/5 px-4 lg:px-10 text-sm md:text-md md:text-md text-pri_navy_main max-w-[240]">
                {Object.entries(completedRecords).map(([subject, completions])=>{
                    return(
                        <li key={`${subject}_${completions}`} className="flex my-1">
                            <p className="font-semibold">{subject}</p>
                            <p className="font-bold ml-auto">{completions} <span className="italic font-normal">completed</span></p>
                        </li>
                    )
                })}

            </ul>}
        </div>

        <div className="col-span-1 row-span-1 relative flex items-center justify-center">
            <Pie
                data={goal > 0 ? data : [50, 50]}
                colors={colors}
                radius={radius}
                hole={hole}
                strokeWidth={1}
            />
            <div className="absolute flex flex-col items-center justify-center inset-0">
                <p className="text-center">{innerText}<br/>completed</p>
            </div>
        </div>
        
        {isOwnUser && <>
          {editGoal ?
          <div className="absolute top-0 right-0 w-[50] flex_center gap-2">

            <input
              className="bg-pri_mint_main w-20 h-20"
              type="number"
              min="0"
              max="1000"
              onChange={(e)=>setGoal2(Number(e.target.value))}
            />

            <button className="cursor-pointer bg-red-500 rounded-lg p-1" onClick={()=>{setGoal2(goal); setEditGoal(false)}}>
              <Image src='/icons/cancelW.svg' alt='save' height={18} width={18} />
            </button>
            <button className="cursor-pointer bg-blue-500 rounded-lg p-1" onClick={updateGoal}>
              <Image src='/icons/saveW.svg' alt='save' height={18} width={18} />
            </button>
          </div>
          :
          <button className="cursor-pointer absolute top-0 right-0" onClick={()=>{setEditGoal(true)}}>
            <Image src='/icons/edit.svg' alt='edit' height={30} width={30} />
          </button>}
        </>
      }

        </div>

      <div className=" bg-pri_bg_card rounded-xl row-auto">
        <Tab
            Tabs={[
                {
                    title:"Completed Papers",
                    titleIcon: "/icons/completed.svg",
                    data: completedTableData,
                    setData: setCompletedTableData,
                    sectionType: "Completed",
                },
                {
                    title:"Bookmarks",
                    titleIcon: "/icons/bookmarked.svg",
                    data: bookmarkTableData,
                    setData: setBookmarkTableData,
                    sectionType: "Bookmarks",
                    
                },
            ]}
            isOwnUser= {isOwnUser}
            userID = {userID}
        />
      </div>


    </div>
  )
}

export default UserProfile