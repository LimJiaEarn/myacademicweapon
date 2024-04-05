"use client"

import { useState, useEffect } from 'react';

// Table Dependencies
import { DataTable } from "@/components/shared/DataTable";
import { getProfileCompletedColumns, getProfileBookmarkedColumns } from "@/utils/tablecolumns";

// Server Actions
import { updateStatusStudyResource, updateBookmarkStudyResource } from '@/lib/actions/useractivity.actions';


type ProfilePageTableProps = {
    data : ISummarisedPracticePaper[];
    userID : string;
    sectionType : "Bookmarks" | "Completed";
    isOwnUser: boolean; // if this is false, we do not need to display the bookmark / status icons
    user_name: string;
}


const ProfilePageTable = ( {data, userID, sectionType, isOwnUser, user_name} : ProfilePageTableProps ) => {
    

    const [tableData, setTableData] = useState(data);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [toHideColumns, setToHideColumns] = useState(["subject", "totMarks"]);

    
    const onToggleStatus = async (studyResourceID: string, userID : string|null, newStatus : boolean) => {

        // Only signed in users are allowed 
        if (!userID) {
            // TODO: nicer prompt to ask user to sign in
            alert("You need to sign in to use this feature!");
            return;
        }

        try {
        const response = await updateStatusStudyResource({ userID, studyResourceID, newStatus  });

        if (!response) {
            // TODO: NICER ALERTS
            alert('Failed to update status, try again later!');
            return;
        }

        // If the update is successful, remove the object with the particular studyResourceID
        setTableData((prevData) =>
            prevData.filter(item => "_id" in item && item._id !== studyResourceID)
        );


        } 
        catch (error) {
            alert('Failed to update status, try again later!');
        return;
        }
    };

    const onToggleBookmark = async (studyResourceID: string, userID : string|null, newBookmark : boolean) => {

        // Only signed in users are allowed 
        if (!userID) {
        // TODO: nicer prompt to ask user to sign in
            alert("You need to sign in to use this feature!");
            return;
        }

        try {
        const response = await updateBookmarkStudyResource({ userID, studyResourceID, newBookmark });

        if (!response) {
            // TODO: NICER ALERTS
            alert('Failed to update bookmark, try again later!');
            return;
        }

        // If the update is successful, remove the object with the particular studyResourceID
        setTableData((prevData) =>
            prevData.filter(item => "_id" in item && item._id !== studyResourceID)
        );       

        } 
        catch (error) {
            alert('Failed to update bookmark, try again later!');
        return;
        }
    };

    const columns = sectionType==="Bookmarks" ?  getProfileBookmarkedColumns(onToggleBookmark, userID, isOwnUser) : getProfileCompletedColumns(onToggleStatus, userID, isOwnUser);
    
    useEffect(()=>{
        if (toggleEdit){
            setToHideColumns(["subject"]);
        }
        else{
            setToHideColumns(["subject", "totMarks"]);
        }

        console.log("toHide: ", toHideColumns);
    }, [toggleEdit])
        
  return (

      <div className="w-4/5 mt-6 md:mt-10">

        <div className="flex justify-center items-center gap-4">
            <h2 className="font-bold text-center leading-relaxed text-text_gray text-2xl lg:text-3xl">{isOwnUser ? "Your " : user_name+"'s "}{sectionType==="Bookmarks" ? 'Bookmarks' : "Completed Papers"}</h2>
            {isOwnUser && 
            <button
                className="bg-teal-500 text-white rounded-lg px-2 py-1"
                onClick={()=>{
                    setToggleEdit((prev)=>!prev);
                }}    
            >
                {`${toggleEdit ? "Editing" : "Edit"}`}
            </button>}

        </div>
        

      {tableData.length > 0?
        <>
            {/* <p className="italic text-center">{tableData.length}</p> */}
            <DataTable
                columns={columns}
                toHideColumns = {toHideColumns}
                data={tableData}
                selectorFilters={[
                    {
                        id: "subject",
                        placeholder:"Filter Subject",
                        options: Array.from(new Set(tableData?.map(item => (item as any)["subject"]))),
                    },
                    ]}
                searchFilter="title"
                searchPlaceholder={`Search ${sectionType==="Bookmarks" ? 'Bookmarks' : "Completed Papers"} ...`}
                tableStyles="bg-teal-50 border-4 border-slate-100"
                selectBoxStyles="w-[180px] bg-emerald-500 text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                selectContentStyles="w-[240px] bg-teal-100"
                searchFilterStyles="h-10 w-full rounded-md px-4 py-2 bg-emerald-500 text-white text-sm ring-offset-background placeholder:text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                headerRowStyles="bg-emerald-500"
                headerCellStyles="flex justify-center items-center text-white text-md font-medium"
                dataRowStyles="transition ease-in-out duration-200 hover:bg-emerald-100"
                dataCellStyles="align-middle text-center"
                nextButtonStyles="text-white bg-emerald-500 hover:bg-emerald-400 rounded-lg px-4 py-2 cursor-pointer transition ease-in-out duration-200"
            />
        </>
        :
        // Render a CTA image
        <div className="py-4 flex_col_center gap-4">
          {/* <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/> */}
          <p className="text-slate-400 text-lg">You have no {sectionType==="Bookmarks" ? "bookmarks" : "completed papers"}!</p>
        </div>
      }
    </div>

      
  )
}

export default ProfilePageTable