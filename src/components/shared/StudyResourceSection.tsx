"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from '@/components/ui/progress';

// Table Dependencies
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { getNotesColumns, getYearlyColumns, getTopicalColumns} from "@/utils/tablecolumns";

// Server Actions
import { updateStatusStudyResource, updateBookmarkStudyResource, getUserActivities } from '@/lib/actions/useractivity.actions';
import { getStudyResources } from '@/lib/actions/studyresource.actions';

// Toast Messages
import {completedToasts, incompleteToasts, bookmarkToasts, unbookmarkToasts } from '../../../constants';

interface StudyResourceSectionProps {
  userID : string | null;
  userName : string | null;
  resourceLevel : string;
  resourceSubject : string;
  resourceType : string;
  searchParams : { [key:string]:string}
}


function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

const StudyResourceSection = ({userID, userName, resourceLevel, resourceSubject, resourceType, searchParams } : StudyResourceSectionProps) => {

    const { toast } = useToast();

    // Sets the column of the table to be displayed
    // 2 main types - Yearly & Topical
    const [tableColumns, setTableColumns] = useState<ColumnDef<StudyResourceInterface>[]>([]);

    // The data to populate the table
    const [tableData, setTableData] = useState<StudyResourceInterface[]>([]);

    const [isLoadingData, setIsLoadingData] = useState(false);

    const [completedResources, setCompletedResources] = useState<number>(0);

    useEffect(()=>{

        const fetchData = async () => {

          if (!resourceType || !resourceSubject) return;
    
          setIsLoadingData(true);
        
          try {
    
            if (resourceType==="Yearly"){
              setTableColumns(getYearlyColumns(onToggleStatus, onToggleBookmark, userID));
            }
            else if (resourceType==="Topical"){
              setTableColumns(getTopicalColumns(onToggleStatus, onToggleBookmark, userID));
            }
            else{
              setTableColumns(getNotesColumns(onToggleBookmark, userID))
            }
    
            // Call a server action to get data to populate the table
            let data: StudyResourceInterface[] | undefined = await getStudyResources({
              type: resourceType as "Notes" | "Topical" | "Yearly",
              level: resourceLevel as "Primary" | "Secondary" | "JC",
              subject: resourceSubject,
            });
        
            if (userID) {
              const [bookmarkedResourceIDs, completedResourceObject] = await getUserActivities({ userID, resourceType: resourceType as 'Notes' | 'Yearly' | 'Topical' })
            
              const completedResourceIDs = completedResourceObject.map((item: any) => item.resourceObjectId );
              
              // Filter the completedResourceIDs to include only those that exist in the current data set
              const relevantCompletedResourceIDs = completedResourceIDs.filter((id: string) => data?.some(item => item._id === id));

              setCompletedResources(relevantCompletedResourceIDs.length);
    
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
                resource: item.paper === 0 ? `${item.year} ${item.assessment} ${item.schoolName}` :
                          `${item.year} ${item.assessment} ${item.schoolName} P${item.paper}`
              }))
            }
            else if (resourceType==="Topical"){
              data = (data as TopicalPracticePaper[])?.map(item=> ({
                ...item,
                resource : item.topicName + " Practice " + item.practice
              }))
            }
            else if (resourceType==="Notes"){
              data = (data as StudyNotesInterface[])?.map(item=> ({
                ...item,
                resource : item.topicNames.join(", ")
              }))
            }
            // For other future types eg Revision (not implemented)
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
          });
          setCompletedResources((prev)=>prev+1);
        }
        else{
          toast({
            title: incompleteToasts[toastIndex].title,
            description: incompleteToasts[toastIndex].desc,
          });
          setCompletedResources((prev)=>prev-1);

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
      <section className="flex flex-col items-center mb-4 p-4 min-h-screen w-full py-2 md:py-4">
          {resourceLevel && resourceSubject && resourceType?

            <div className="w-full px-2 md:px-6 flex_col_center">

              {isLoadingData ?
                <p className="w-full text-center">Loading {resourceSubject} {resourceType==="Notes" ? 'Notes' : resourceType + " Practice Papers"}...</p>
                :
                <div className="flex_col_center gap-4 w-full"> 
                    { userID && <div className="px-4 py-2 flex_col_center gap-2 w-full max-w-[800px]">
                        <p className="text-sm text-pri_navy_main">You have completed {completedResources}/{tableData.length} {resourceSubject} Practices!</p>
                        <Progress value={(completedResources / tableData.length)*100} className="w-full "/>
                    </div>}
                    <DataTable
                      columns={tableColumns}
                      toHideColumns = {resourceType==="Notes" ? [] : ["bookmark", "status", "year", "assessment", "topicName"]}
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
                      searchFilterStyles="bg-pri_mint_main hover:bg-pri_mint_dark h-10 w-full rounded-md px-4 py-2 text-white placeholder:text-white focus:outline-none ring-offset-background focus:ring-2 focus:ring-pri_mint_light focus:ring-offset-2"
                      tableStyles="bg-pri_bg_card"
                      selectBoxStyles="w-[200px] bg-pri_mint_main hover:bg-pri_mint_dark text-white ring-offset-background focus:outline-none ring-offset-background focus:ring-2 focus:ring-pri_mint_light focus:ring-offset-2"
                      headerRowStyles="bg-pri_mint_dark"
                      headerCellStyles="flex_center text-pri_navy_dark text-lg font-bold"
                      dataRowStyles="transition ease-in-out delay-125 hover:bg-pri_bg_card2"
                      nextButtonStyles="text-white bg-pri_bg_card3 hover:bg-pri_mint_light rounded-lg shadow-lg w-8 h-8 cursor-pointer transition ease-in-out duration-200"
                      displayGuide={true}
                      userName={userName}
                      maxRows={15}
                    />
                </div>
              }
              

            </div>
          :
            // Render a CTA image
            <div className="py-4 flex_col_center gap-4">
              <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/>
              <p className="text-slate-400 text-lg capitalize">Select Content To Begin!</p>
            </div>
          }
      </section>
    )
}

export default StudyResourceSection
