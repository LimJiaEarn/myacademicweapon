"use client"

import Image from 'next/image';
import { Suspense, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname  } from 'next/navigation'

// Table Dependencies
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/DataTable";
import { getYearlyColumns, getTopicalColumns} from "@/components/shared/DataTableColumn";

// Server Actions
import { updateStatusStudyResource, getStatusStudyResource, updateBookmarkStudyResource, getBookmarksStudyResource  } from '@/lib/actions/useractivity.actions';
import { getStudyResources } from '@/lib/actions/studyresource.actions';



// searchParams guide referenced: https://www.youtube.com/watch?v=ukpgxEemXsk&t=6s

function capitalize(str : string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


const StudyResourcePage = ( {searchParams} : {searchParams : { [key:string]:string}} ) => {

  // Get the userID
  const { user } = useUser();

  let userID = (user?.publicMetadata.userId as string ) || null;

  const pathname = usePathname();

  // Get the encoded data from url
  const resourceLevel = capitalize(pathname.split('/').pop() as string);
  const resourceSubject = searchParams.subject;
  const resourceType = searchParams.resourceType?.split(' ')[0];

  // Sets the column of the table to be displayed
  // 2 main types - Yearly & Topical
  const [tableColumns, setTableColumns] = useState<ColumnDef<StudyResourceInterface>[]>([]);

  // The data to populate the table
  const [tableData, settableData] = useState<StudyResourceInterface[]>([]);

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
      settableData((prevData) =>
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
      settableData((prevData) =>
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


  useEffect( ()=>{

    const fetchData = async () => {

      try {

        setTableColumns(resourceType === 'Yearly' ? getYearlyColumns(onToggleStatus, onToggleBookmark, userID) : getTopicalColumns(onToggleStatus, onToggleBookmark, userID));

          // Call a server action to get data to populate table
          let data : StudyResourceInterface[] | undefined = await getStudyResources({ type: (resourceType as 'Yearly' | 'Topical'), level: (resourceLevel as "Primary" | "Secondary" | "JC"), subject:  resourceSubject});

          // Next we update the status and bookmarks column based on past user interactions
          // If user is signed in, fetch the list of completed resources and update the status
          if (userID) {

              const completedResourceIDs : string[] = await getStatusStudyResource({userID: userID as string, resourceType: (resourceType as 'Yearly' | 'Topical')});

              // Update the status field based on completedResourceIDs
              data = data?.map((item : StudyResourceInterface) => ({
                ...item,
                status: completedResourceIDs.includes(item._id),
              }));

              const bookmarkedResourceIDs : string[] = await getBookmarksStudyResource({userID: userID as string, resourceType: (resourceType as 'Yearly' | 'Topical')});
              // Update the status field based on completedResourceIDs
              data = data?.map((item : StudyResourceInterface) => ({
                ...item,
                bookmarked: bookmarkedResourceIDs.includes(item._id),
              }));
          }

          // If user is not signed in, set all statuses to false
          else {
              data = data?.map((item : StudyResourceInterface) => ({
                ...item,
                status: false,
                bookmarked: false,
              }));
          }


        
          if (data) settableData(data); 

        }
        catch (error) {
          console.error('Error fetching data:', error);
      }
    };

      if (resourceType=="Yearly" || resourceType=="Topical")
        fetchData();

  }, [resourceSubject, resourceType]);

        
  return (

      <div className="min-h-screen w-full">
      {resourceLevel && resourceSubject && resourceType?

        <div className="w-full px-2 md:px-6 flex_col_center">
          {/* https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#what-is-streaming for loading skeleton while Data Table loads */}
          <Suspense fallback={<p>Loading your resources...</p>}>
            <DataTable columns={tableColumns} data={tableData}/>
          </Suspense>
          

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