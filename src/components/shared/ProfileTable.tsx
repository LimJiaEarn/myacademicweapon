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

      <div className="w-4/5">

        <div className="flex_center gap-4">
            <h2 className="text-xl font-bold text-center">{isOwnUser ? "" : user_name+"'s"} {sectionType}</h2>
            {isOwnUser && 
            <button
                onClick={()=>{
                    setToggleEdit((prev)=>!prev);
                }}    
            >
                {`${toggleEdit ? "Editting" : "Edit"}`}
            </button>}

        </div>
        

      {tableData.length > 0?
        <>
            <p className="italic text-center">{tableData.length}</p>
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
                tableStyles="bg-green-100 rounded-lg"
                headerRowStyles="bg-emerald-300 rounded-t-lg"
                headerCellStyles="flex_center text-black text-md font-semibold"
                dataRowStyles="transition ease-in-out delay-125 hover:bg-green-200"
                dataCellStyles="align-middle text-center"
                nextButtonStyles="bg-green-300 rounded-full px-4 cursor-pointer"
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