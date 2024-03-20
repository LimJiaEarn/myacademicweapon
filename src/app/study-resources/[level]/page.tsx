"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation'


// Table Dependencies
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/DataTable";
import { getYearlyColumns, getTopicalColumns } from "@/components/shared/DataTableColumn";

// searchParams guide referenced: https://www.youtube.com/watch?v=ukpgxEemXsk&t=6s

const StudyResourcePage = ( {searchParams} : {searchParams : { [key:string]:string}} ) => {

    // Get the userID
    const { user } = useUser();
    const userID = user?.publicMetadata?.userId ?? null;

    const pathname = usePathname();

    // Get the encoded data from url
    const resourceLevel = pathname.split('/').pop();
    const resourceSubject = searchParams.subject;
    const resourceType = searchParams.resourceType?.split(' ')[0];

      // Sets the column of the table to be displayed
  // 2 main types - Yearly & Topical
  const [tableColumns, settableColumns] = useState<ColumnDef<StudyResourceInterface>[]>([]);

  // The data to populate the table
  const [tableData, settableData] = useState<StudyResourceInterface[]>([]);

  // This sets the status of the study resource selected by user
  const onToggleStatus = async (rowId: string) => {

    // Only signed in users are allowed 
    if (!userID) {
      alert("User is not signed in.");
      return;
    }
  
    // Find the resource in tableData to toggle its status
    const resource = tableData.find(item => item._id === rowId);

    if (!resource) {
      console.error('Resource not found');
      return;
    }
  
    try {
      // Call the API to update the status in the backend
      const response = await fetch('/api/resourceinteractions/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID,
          resourceID: rowId,
          status: !resource.status, // send the opposite of current status
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update resource status');
      }
  
      // If the update is successful, toggle the status in the UI
      settableData((prevData) =>
        prevData.map(item => {
          if (item._id === rowId) {
            return { ...item, status: !item.status };
          }
          return item;
        })
      );
  
    } catch (error) {
      console.error('Error updating resource status:', error);
    }
  };

  useEffect(() => {



    const fetchData = async () => {
      try {
        settableColumns(resourceType === 'Yearly' ? getYearlyColumns(onToggleStatus) : getTopicalColumns(onToggleStatus));

        const response = await fetch('/api/studyresources/get', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: resourceType+"StudyResource", level: resourceLevel, subject:  resourceSubject}), 
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        let data = await response.json(); // only missing status column which we will update below


       // If user is signed in, fetch the list of completed resources and update the status
        if (userID) {
            const completedResponse = await fetch('/api/resourceinteractions/getStatus', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userID, resourceType: resourceType + "StudyResource" }),
            });

            if (completedResponse.ok) {
              const completedResourceIDs = await completedResponse.json();

              // Update the status field based on completedResourceIDs
              data = data.map((item : StudyResourceInterface) => ({
                ...item,
                status: completedResourceIDs.includes(item._id),
              }));
            }
        }
        else {
            // If user is not signed in, set all statuses to false
            data = data.map((item : StudyResourceInterface) => ({
              ...item,
              status: false,
            }));
        }
  
        settableData(data); 

        console.log("Set table data and columns");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, [resourceSubject, resourceType]);
        
    return (

        <div className="min-h-screen w-full">
        {resourceLevel && resourceSubject && resourceType?
          <div className="w-full px-2 md:px-6 flex_col_center">
            
            <DataTable columns={tableColumns} data={tableData}/>
            

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