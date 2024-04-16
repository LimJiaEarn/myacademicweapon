"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Table Dependencies
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { getYearlyColumns, getTopicalColumns} from "@/utils/tablecolumns";

// Server Actions
import { updateStatusStudyResource, getStatusStudyResource, updateBookmarkStudyResource, getBookmarksStudyResource  } from '@/lib/actions/useractivity.actions';
import { getStudyResources } from '@/lib/actions/studyresource.actions';

// Toast Messages
import {completedToasts, incompleteToasts, bookmarkToasts, unbookmarkToasts } from '../../../constants';

interface StudyResourceSectionProps {
  userID : string | null;
  resourceLevel : string;
  resourceSubject : string;
  resourceType : string;
}


function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

const StudyResourceSection = ({userID, resourceLevel, resourceSubject, resourceType } : StudyResourceSectionProps) => {

    const { toast } = useToast();

    // Sets the column of the table to be displayed
    // 2 main types - Yearly & Topical
    const [tableColumns, setTableColumns] = useState<ColumnDef<StudyResourceInterface>[]>([]);

    // The data to populate the table
    const [tableData, setTableData] = useState<StudyResourceInterface[]>([]);

    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(()=>{

        const fetchData = async () => {

          if (!resourceType || !resourceSubject) return;
    
          setIsLoadingData(true);
        
          try {
    
            const columns = resourceType === 'Yearly' ? getYearlyColumns(onToggleStatus, onToggleBookmark, userID) : getTopicalColumns(onToggleStatus, onToggleBookmark, userID);
            setTableColumns(columns);
    
            // Call a server action to get data to populate the table
            let data: StudyResourceInterface[] | undefined = await getStudyResources({
              type: resourceType as 'Yearly' | 'Topical',
              level: resourceLevel as "Primary" | "Secondary" | "JC",
              subject: resourceSubject,
            });
        
            if (userID) {
              // concurrently fetch the status and bookmark information
              const [completedResourceObject, bookmarkedResourceIDs] = await Promise.all([
                getStatusStudyResource({ userID, resourceType: resourceType as 'Yearly' | 'Topical' }),
                getBookmarksStudyResource({ userID, resourceType: resourceType as 'Yearly' | 'Topical' }),
              ]);
              
            
              const completedResourceIDs = completedResourceObject.map((item: any) => item.resourceObjectId );
    
              // Update the data with status and bookmarked fields
              data = data?.map(item => ({
                ...item,
                status: completedResourceIDs.includes(item._id),
                bookmark: bookmarkedResourceIDs.includes(item._id),
              }));
    
            }
            
            else {
              // If user is not signed in, set all statuses and bookmarked fields to false
              data = data?.map(item => ({
                ...item,
                status: false,
                bookmark: false,
              }));
            }
    
            // Summarise the data into `resource` for the table
            // Yearly: .year + .assessment + .schoolName + .paper
            // Topical: topicName
    
            if (resourceType==="Yearly"){
              data = (data as YearlyPracticePaper[])?.map(item=> ({
                ...item,
                resource : item.year + " " + item.assessment + " " + item.schoolName + " P" + item.paper
              }))
            }
            else if (resourceType==="Topical"){
              data = (data as TopicalPracticePaper[])?.map(item=> ({
                ...item,
                resource : item.topicName + " Practice " + item.practice
              }))
            }
            // For other future types eg Notes/Summaries
            else{
              console.log("Other types");
            }
    
    
        
            if (data) setTableData(data);
            else setTableData([]); // no resources in database
    
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          finally {
            setIsLoadingData(false);
          }
        }

        fetchData();
    }, [resourceType, resourceSubject])



    // This sets the status of the study resource selected by user
    const onToggleStatus = async (studyResourceID: string, userID : string|null, date : Date, newStatus : boolean, score? : number|null) => {

      // Only signed in users are allowed 
      if (!userID) {
        toast({
          title: "Oops! You are not signed in",
          description: "Sign in/up to use this feature!",
        })
        return;
      }


      try {
        const response = await updateStatusStudyResource({ userID, studyResourceID, resourceType, newStatus, date, score: score ?? -1  });

        if (!response) {
          toast({
            title: "Oh No!",
            description: "Failed to update status, please try again later!",
          })
          return;
        }

        // If the update is successful, toggle the status in the UI
        setTableData((prevData) =>
          prevData.map(item => {
            if (item._id === studyResourceID) {
              return { ...item, status: newStatus } as PracticePaperInterface;
            }
            return item;
          })
        );
        const toastIndex = getRandomInt(0, 3);
        
        if (newStatus){
          toast({
            title: completedToasts[toastIndex].title,
            description: completedToasts[toastIndex].desc,
          })
        }
        else{
          toast({
            title: incompleteToasts[toastIndex].title,
            description: incompleteToasts[toastIndex].desc,
          })
        }
        

      } 
      catch (error) {
        toast({
          title: "Oh No!",
          description: "Failed to update status, please try again later!",
        })
        return;
      }
    };

    const onToggleBookmark = async (studyResourceID: string, userID : string|null, newBookmark : boolean) => {
      // Only signed in users are allowed 
      if (!userID) {
        toast({
          title: "Oops! You are not signed in",
          description: "Sign in/up to use this feature!",
        })
        return;
      }

      try {
        const response = await updateBookmarkStudyResource({ userID, studyResourceID, newBookmark });

        if (!response) {
          toast({
            description: 'Failed to update bookmark, try again later!',
          })
          return;
        }

        // If the update is successful, toggle the status in the UI
        setTableData((prevData) =>
          prevData.map(item => {
            if (item._id === studyResourceID) {
              return { ...item, bookmark: newBookmark } as PracticePaperInterface;
            }
            return item;
          })
        );
        
        const toastIndex = getRandomInt(0, 3);
        if (newBookmark){
          toast({
            title: bookmarkToasts[toastIndex].title,
            description: bookmarkToasts[toastIndex].desc,
          })
        }
        else{
          toast({
            title: unbookmarkToasts[toastIndex].title,
            description: unbookmarkToasts[toastIndex].desc,
          })
        }

      } 
      catch (error) {
        toast({
          title: "Oh No!",
          description: "Failed to update bookmark, please try again later!",
        })
        return;
      }
    };


    return (
      <section className="flex flex-col items-center mb-4 p-4 bg-slate-100 rounded-lg shadow-md">
        <div className="min-h-screen w-full py-2 md:py-4">
        {resourceLevel && resourceSubject && resourceType?

          <div className="w-full px-2 md:px-6 flex_col_center">

            {isLoadingData ?
              <p className="w-full text-center">Loading {resourceSubject} {resourceType} Practice Papers...</p>
              :
              <DataTable
                columns={tableColumns}
                toHideColumns = {["bookmark", "status", "year", "assessment", "topicName"]}
                data={tableData}
                showStatusFilter = {true}
                showBookmarkFilter = {true}
                selectorFilters={ resourceType==="Yearly" ?
                  [
                  {
                    id: "assessment",
                    placeholder:"Filter Assessment",
                    options: Array.from(new Set(tableData?.map(item => (item as any)["assessment"]))),
                  },
                ]
                :
                [
                  {
                    id: "topicName",
                    placeholder:"Filter Topics",
                    options: Array.from(new Set(tableData?.map(item => (item as any)["topicName"]))),
                  },
                ]
              }
                searchFilter="resource"
                searchPlaceholder="Search Resources ..."
                tableStyles="bg-pri_bg_color"
                selectBoxStyles="w-[200px] bg-slate-200 text-pri_navy_dark ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                headerRowStyles="bg-slate-300"
                headerCellStyles="flex_center text-pri_navy_dark text-lg font-bold"
                dataRowStyles="transition ease-in-out delay-125 hover:bg-slate-200"
                nextButtonStyles="text-white bg-slate-400 hover:bg-slate-500 rounded-lg px-4 py-2 cursor-pointer transition ease-in-out duration-200"
              />
            }
            

          </div>
        :
          // Render a CTA image
          <div className="py-4 flex_col_center gap-4">
            <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/>
            <p className="text-slate-400 text-lg capitalize">Select Content To Begin!</p>
          </div>
        }
      </div>
      </section>
    )
}

export default StudyResourceSection
