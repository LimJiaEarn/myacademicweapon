"use client"

import Tab from "@/components/shared/Tab";
import { useState } from 'react';

interface UserProfileProps {
  isOwnUser : boolean;
  userID : string;
  simplifiedCompletedResourceObjects : ISummarisedPracticePaper[];
  simplifiedBookmarkedResourceObjects : ISummarisedPracticePaper[];
}


const UserProfile = ({isOwnUser, userID, simplifiedCompletedResourceObjects, simplifiedBookmarkedResourceObjects} : UserProfileProps) => {
    
    // Set it as states so we can sync the data changes to other cards
    const [completedTableData, setCompletedTableData] = useState<ISummarisedPracticePaper[]>(simplifiedCompletedResourceObjects);
    const [bookmarkTableData, setBookmarkTableData] = useState<ISummarisedPracticePaper[]>(simplifiedBookmarkedResourceObjects);


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

      <div className="bg-pri_bg_card rounded-xl px-2 py-2 md:px-4 grid grid-rows-auto lg:grid-cols-2 gap-2 w-full">
        
        <div className="col-span-1 row-span-1">
            <h2 className="w-full px-2 text-md md:text-lg font-bold md:text-md text-pri_navy_darker text-center mb-2">{isOwnUser && "Your "}Completed Practices</h2>
            
            {Object.keys(completedRecords).length === 0 ?
                <p className="w-full text-center italic text-pri_navy_main">0 completed papers found</p>
                :
                <ul className="w-full px-4 lg:px-10 text-sm md:text-md md:text-md text-pri_navy_main">
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

        <div className="col-span-1 row-span-1">
            <h2 className="w-full px-2 text-md md:text-lg font-bold md:text-md text-pri_navy_darker text-center mb-2">{isOwnUser && "Your "}Bookmarks</h2>
            
            {Object.keys(bookmarkedRecords).length === 0 ?
                <p className="w-full text-center italic text-pri_navy_main">0 bookmarks found</p>
                :
                <ul className="w-full px-4 lg:px-10 text-sm md:text-md md:text-md text-pri_navy_main">
                {Object.entries(bookmarkedRecords).map(([subject, bookmarked])=>{
                    return(
                        <li key={`${subject}_${bookmarked}`} className="flex my-1">
                            <p className="font-semibold">{subject}</p>
                            <p className="font-bold ml-auto">{bookmarked} <span className="italic font-normal">bookmarked</span></p>
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