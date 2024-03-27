"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname  } from 'next/navigation'

// Table Dependencies
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/DataTable";
import { getYearlyColumns, getTopicalColumns} from "@/utils/tablecolumns";

// Server Actions
import { updateStatusStudyResource, getStatusStudyResource, updateBookmarkStudyResource, getBookmarksStudyResource  } from '@/lib/actions/useractivity.actions';
import { getStudyResources } from '@/lib/actions/studyresource.actions';



// searchParams guide referenced: https://www.youtube.com/watch?v=ukpgxEemXsk&t=6s

function capitalize(str : string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


const StudyResourcePage = ( {searchParams} : {searchParams : { [key:string]:string}} ) => {

  const pathname = usePathname();
  const { user } = useUser();

  // Get the encoded data from url
  const resourceLevel = capitalize(pathname.split('/').pop() as string);
  const resourceSubject = searchParams.subject;
  const resourceType = searchParams.resourceType?.split(' ')[0];

  // utlity states
  const [userID, setUserID] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);


  // Sets the column of the table to be displayed
  // 2 main types - Yearly & Topical
  const [tableColumns, setTableColumns] = useState<ColumnDef<StudyResourceInterface>[]>([]);

  // The data to populate the table
  const [tableData, setTableData] = useState<StudyResourceInterface[]>([]);

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
          if (item._id === studyResourceID) {
            return { ...item, status: newStatus } as PracticePaperInterface;
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
          if (item._id === studyResourceID) {
            return { ...item, bookmark: newBookmark } as PracticePaperInterface;
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

  useEffect(() => {

    const userId = typeof user?.publicMetadata.userId === 'string' ? user.publicMetadata.userId : null;
    setUserID(userId);
  }, [user]); 

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
        const [completedResourceIDs, bookmarkedResourceIDs] = await Promise.all([
          getStatusStudyResource({ userID, resourceType: resourceType as 'Yearly' | 'Topical' }),
          getBookmarksStudyResource({ userID, resourceType: resourceType as 'Yearly' | 'Topical' }),
        ]);
  
        // Update the data with status and bookmarked fields
        data = data?.map(item => ({
          ...item,
          status: completedResourceIDs.includes(item._id),
          bookmarked: bookmarkedResourceIDs.includes(item._id),
        }));
      }
      
      else {
        // If user is not signed in, set all statuses and bookmarked fields to false
        data = data?.map(item => ({
          ...item,
          status: false,
          bookmarked: false,
        }));
      }
  
      if (data) setTableData(data);
      else setTableData([]);


    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resourceType, resourceSubject, resourceLevel, userID]);
  

        
  return (

      <div className="min-h-screen w-full">
      {resourceLevel && resourceSubject && resourceType?

        <div className="w-full px-2 md:px-6 flex_col_center">
          {/* https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#what-is-streaming for loading skeleton while Data Table loads */}

          {isLoadingData ? <p className="w-full text-center">Loading {resourceSubject} {resourceType} Practice Papers...</p> :
            <DataTable columns={tableColumns} data={tableData} searchFilter={resourceType==="Yearly" ? 'schoolName' : 'topicName'}/>
          }
          

        </div>
      :
        // Render a CTA image
        <div className="py-4 flex_col_center gap-4">
          <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/>
          <p className="text-slate-400 text-lg capitalize">Select A Subject To Begin!</p>
        </div>
      }
    </div>

      
  )
}

export default StudyResourcePage