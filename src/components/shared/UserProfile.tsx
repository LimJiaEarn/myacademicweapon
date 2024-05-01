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
    const [goal2, setGoal2] = useState<number | null>(currentUserProfileObject.goal);
    const [editGoal, setEditGoal] = useState<boolean>(false);
    
    const updateGoal = async () => {
      
      setGoal(goal2 ? goal2 : 0);
      try{
        await updateUserByUserID(currentUserProfileObject._id, {...currentUserProfileObject, goal: goal2 ? goal2 : 0});
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
    const percentShade = goal===0 ? 0 : Number(Math.min(100, (completed/goal) * 100).toFixed(1)); 
    const data : number[] = [percentShade, 100 - Number(percentShade)];
    const colors =  ['hsl(49.3, 99%, 55%)', 'hsla(49.3, 99%, 55%, 0.1)'];
    const radius = 70;
    const hole = 62;

    const completedRecords: Record<string, number> = {};

    completedTableData?.forEach((paper) => {
      completedRecords[paper.subject] = (completedRecords[paper.subject] || 0) + 1;
    });

    const bookmarkedRecords: Record<string, number> = {};

    bookmarkTableData?.forEach((paper) => {
      bookmarkedRecords[paper.subject] = (bookmarkedRecords[paper.subject] || 0) + 1;
    });


    return (
    <div className="grid row-auto gap-4">

      <div className="grid grid-rows-auto lg:grid-cols-2 gap-4 w-full">

      <div className="bg-pri_bg_card rounded-xl col-span-1 row-span-1 flex flex-col justify-start content-evenly gap-2 md:gap-4 p-2 md:p-4 relative">
            <h1 className="font-bold text-pri_navy_main text-center text-lg md:text-xl mb-2">Goal Tracker</h1>
            
            {isOwnUser && <div className="absolute top-2 right-2">
                {editGoal ?
                <div className="flex_center gap-2">
                  <button className="cursor-pointer hover:bg-red-600 bg-red-500 rounded-lg p-1" onClick={()=>{setGoal2(goal); setEditGoal(false)}}>
                    <Image src='/icons/cancelW.svg' alt='save' height={22} width={22} />
                  </button>
                  <button className="cursor-pointer hover:bg-blue-600 bg-blue-500 rounded-lg p-1" onClick={updateGoal}>
                    <Image src='/icons/saveW.svg' alt='save' height={22} width={22} />
                  </button>
                </div>
                :
                <button className="cursor-pointer hover:scale-105" onClick={()=>{setEditGoal(true)}}>
                  <Image src='/icons/edit.svg' alt='edit' height={30} width={30} />
                </button>}
              </div>
            }
              
            <div className="gap-4 md:gap-8 flex-grow flex flex-row justify-evenly items-center">

              <div className="relative flex items-center justify-center">
                
                <Pie
                    data={goal > 0 ? data : [0, 100]}
                    colors={colors}
                    radius={radius}
                    hole={hole}
                    strokeWidth={1}
                />
                <div className="absolute flex flex-col items-center justify-center inset-0">
                    {percentShade===100 ?
                     <p className="text-center font-bold gold_grad_text_2 text-3xl">Goal<br/>Hit!</p>
                    :
                      <p className="text-center font-bold text-pri_navy_light text-2xl">{`${goal > 0 ? percentShade+"%" : '-'}`}</p>}
                </div>
    
              
              </div>

              <div className="h-full flex flex-col justify-start items-center gap-2">
              
                  <div className="flex_col_center gap-1">
                    <h2 className="font-semibold text-md text-pri_navy_main">{isOwnUser && "Your "} Goal:</h2>
                    {editGoal ?

                    <input
                      className="bg-pri_bg_card2 rounded-xl px-1 max-w-[100px] font-semibold text-3xl text-pri_navy_lighter text-center focus:outline-none ring-offset-background focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onChange={(e) => {
                        if (e.target.value === "" || /^[0-9]+$/.test(e.target.value)) {
                          setGoal2(Number(e.target.value));
                        }
                      }}
                      value={goal2 ? goal2 : 0}
                    />
                    :
                    <p className="font-semibold text-3xl text-pri_navy_lighter">{goal}</p>}
                  </div>

                  <div className="flex_col_center gap-1">
                    <h2 className="font-semibold text-md text-pri_navy_main">{isOwnUser && "Your "} Progress</h2>
                    <p className="font-semibold text-3xl text-pri_navy_lighter">{completed}</p>
                  </div>
              
              </div>


            </div>
        </div>
        
        <div className="bg-pri_bg_card rounded-xl col-span-1 row-span-1 flex flex-col justify-start items-center p-2 md:p-4">
            <h1 className="font-bold text-pri_navy_main text-center text-lg md:text-xl mb-4">{isOwnUser && "Your "}Completed Practices</h1>
            
            {Object.keys(completedRecords).length === 0 ?
                <p className="w-full text-center italic text-pri_navy_main">0 completed papers found</p>
                :
                <ul className="w-4/5 px-4 lg:px-10 text-sm md:text-md md:text-md text-pri_navy_main max-w-[240]">
                {Object.entries(completedRecords).map(([subject, completions], index)=>{
                    return(
                        <li key={`${subject}_${completions}_${index}`} className="flex my-2">
                            <p className="font-semibold">{subject}</p>
                            <p className="font-bold ml-auto">{completions} <span className="italic font-normal">completed</span></p>
                        </li>
                    )
                })}

            </ul>}
        </div>

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