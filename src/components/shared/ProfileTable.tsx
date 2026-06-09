"use client"

import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Table Dependencies
import { DataTable } from "@/components/shared/DataTable";
import { getProfileCompletedColumns, getProfileBookmarkedColumns } from "@/utils/tablecolumns";
import { Switch } from "@/components/ui/switch"

// Server Actions
import { updateStatusStudyResource, updateBookmarkStudyResource } from '@/lib/actions/useractivity.actions';

import Link from 'next/link';
import { Inbox } from 'lucide-react';

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

      <div className="w-full">

        {tableData?.length > 0?
            <div className="w-full">
                {isOwnUser &&
                <div className="mb-3 flex flex-col items-center justify-center gap-1.5 md:flex-row md:gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-pri_navy_main">Edit mode</span>
                        <Switch
                            checked={toggleEdit}
                            onCheckedChange={()=>{
                                setToggleEdit((prev)=>!prev);
                            }}
                        />
                    </div>
                    {sectionType==="Completed" && <span className="text-xs text-pri_navy_light">Your scores are private — only you can see them.</span>}

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
                    searchPlaceholder={`Search ${sectionType==="Bookmarks" ? 'bookmarks' : "completed papers"}…`}
                    tableStyles="w-full"
                    tableWrapperClassName="overflow-x-auto"
                    headerCellStyles="flex items-center justify-start text-ink text-[12px] font-bold uppercase tracking-[0.14em]"
                    dataCellStyles="align-middle"
                    displayGuide={false}
                    maxRows={8}
                />
            </div>
            :
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-white px-6 py-10 text-center">
                <div className="flex_center h-14 w-14 rounded-2xl bg-pri_mint_main/10 text-pri_mint_darker">
                    <Inbox className="h-7 w-7" />
                </div>
                <p className="font-display text-lg font-extrabold text-ink">
                    No {sectionType==="Bookmarks" ? "bookmarks" : "completed papers"} yet
                </p>
                <p className="text-sm text-ink_soft">
                    Get started in the{" "}
                    <Link className="font-semibold text-pri_mint_darker underline" href="/study-resources">
                        Study Resources
                    </Link>{" "}
                    collection.
                </p>
            </div>
        }

    </div>


  )
}

export default ProfilePageTable