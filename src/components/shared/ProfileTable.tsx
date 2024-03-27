"use client"

// import Image from 'next/image';
import { useState } from 'react';

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
}


const ProfilePageTable = ( {data, userID, sectionType, isOwnUser} : ProfilePageTableProps ) => {

    const [tableData, setTableData] = useState(data);

    // This sets the status of the study resource selected by user
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

        // If the update is successful, toggle the status in the UI
        setTableData((prevData) =>
            prevData.map(item => {
            if ("_id" in item && item._id === studyResourceID) {
                return { ...item, status: newStatus };
            }
            return item;
            })
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

        // If the update is successful, toggle the status in the UI
        setTableData((prevData) =>
            prevData.map(item => {
            if ("_id" in item && item._id === studyResourceID) {
                return { ...item, bookmark: newBookmark };
            }
            return item;
            })
        );

        } 
        catch (error) {
            alert('Failed to update bookmark, try again later!');
        return;
        }
    };

    const columns = sectionType==="Bookmarks" ?  getProfileBookmarkedColumns(onToggleBookmark, userID, isOwnUser) : getProfileCompletedColumns(onToggleStatus, userID, isOwnUser);
      
        
  return (

      <div className="w-3/5">
      {tableData?
            <DataTable columns={columns} data={tableData} searchFilter="title"/>
        :
        // Render a CTA image
        <div className="py-4 flex_col_center gap-4">
          {/* <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/> */}
          <p className="text-slate-400 text-lg capitalize">No Data Found!</p>
        </div>
      }
    </div>

      
  )
}

export default ProfilePageTable