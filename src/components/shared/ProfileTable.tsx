"use client"

import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Table Dependencies
import { DataTable } from "@/components/shared/DataTable";
import { getProfileCompletedColumns, getProfileBookmarkedColumns } from "@/utils/tablecolumns";
import { Switch } from "@/components/ui/switch"

// Server Actions
import { updateStatusStudyResource, updateBookmarkStudyResource } from '@/lib/actions/useractivity.actions';


type ProfilePageTableProps = {
    tableData : ISummarisedPracticePaper[];
    setTableData : React.Dispatch<React.SetStateAction<ISummarisedPracticePaper[]>>;
    userID : string;
    sectionType : "Bookmarks" | "Completed";
    isOwnUser: boolean; // if this is false, we do not need to display the bookmark / status icons
}


const ProfilePageTable = ( {tableData, setTableData, userID, sectionType, isOwnUser} : ProfilePageTableProps ) => {
    
    const [toggleEdit, setToggleEdit] = useState(false);
    const [toHideColumns, setToHideColumns] = useState(["subject", "totMarks"]);
    const { toast } = useToast();
    
    const onToggleStatus = async (studyResourceID: string, userID : string|null, date: Date, newStatus : boolean) => {

        // Only signed in users are allowed - This should not happen
        if (!userID) {
            toast({
                title: "Oh No!",
                description: "Failed to remove, please try again later!",
            })
            return
        }

        try {
            const response = await updateStatusStudyResource({ userID, studyResourceID, date, newStatus });

            if (!response) {
                toast({
                    title: "Oh No!",
                    description: "Failed to remove, please try again later!",
                })
            }

            // If the update is successful, remove the object with the particular studyResourceID
            setTableData((prevData) =>
                prevData.filter(item => "_id" in item && item._id !== studyResourceID)
            );

            
        } 
        catch (error) {
            toast({
                title: "Oh No!",
                description: "Failed to remove, please try again later!",
            })
        }
    };

    const onToggleBookmark = async (studyResourceID: string, userID : string|null, newBookmark : boolean) => {

        // Only signed in users are allowed 
        if (!userID) {
            toast({
                title: "Oh No!",
                description: "Failed to remove bookmark, please try again later!",
            })
            return;
        }

        try {
        const response = await updateBookmarkStudyResource({ userID, studyResourceID, newBookmark });

        if (!response) {
            toast({
                title: "Oh No!",
                description: "Failed to remove bookmark, please try again later!",
            })
            return;
        }

        // If the update is successful, remove the object with the particular studyResourceID
        setTableData((prevData) =>
            prevData.filter(item => "_id" in item && item._id !== studyResourceID)
        );       

        } 
        catch (error) {
            toast({
                title: "Oh No!",
                description: "Failed to remove bookmark, please try again later!",
            })
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

    }, [toggleEdit])
        
  return (

      <div className="w-full px-2">
        
        {tableData?.length > 0?
            <div className="w-full flex_col_center">
                {/* <p className="italic text-center">{tableData.length}</p> */}
                {isOwnUser &&
                <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                    <div className="flex justify-center items-center gap-2">
                        <p className="text-pri_navy_darker text-md italic">Edit Mode</p>
                        
                        <Switch
                            checked={toggleEdit}
                            onCheckedChange={()=>{
                                setToggleEdit((prev)=>!prev);
                            }}
                        />                        
                    </div>
                    {sectionType==="Completed" && <p className="text-slate-400 text-md">Your scores are not visible to others</p>}

                </div>}
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
                    tableStyles="w-full"
                    selectBoxStyles="w-[180px] bg-pri_mint_dark text-pri_navy_darker ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    selectContentStyles="w-[240px] bg-pri_bg_card2"
                    searchFilterStyles="h-10 w-full rounded-md px-4 py-2 bg-pri_mint_dark text-pri_navy_darker text-sm ring-offset-background placeholder:text-pri_navy_darker focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    headerRowStyles="bg-pri_mint_dark"
                    headerCellStyles="flex justify-center items-center text-pri_navy_darker text-base font-bold"
                    dataRowStyles="transition ease-in-out duration-200 hover:bg-pri_bg_card2"
                    dataCellStyles="align-middle text-center"
                    nextButtonStyles="text-pri_navy_darker bg-pri_mint_dark hover:bg-emerald-400 rounded-lg shadow-lg px-4 py-2 cursor-pointer transition ease-in-out duration-200"
                    showLegend={false}
                />
            </div>
            :
            // Render a CTA image
            <div className="py-4 flex_col_center gap-4">
                <p className="text-slate-700 text-lg md:text-xl">You have no {sectionType==="Bookmarks" ? "bookmarks" : "completed papers"}!</p>
            </div>
        }

    </div>

      
  )
}

export default ProfilePageTable