"use client"

import Image from 'next/image';
import SummarySection from '@/components/shared/SummarySection';
import SubjectsContentNav from '@/components/shared/SubjectsContentNav';
import { useState, useEffect } from 'react';


// Dependencies for Table
import { secondaryContent, TopicalStudyResource, YearlyStudyResource, YearlyStudyResourceData, TopicalStudyResourceData } from '../../../../constants';
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable";

const SecondaryResourcesLayout = () => {

  // The Main Subject student has chosen
  const [subjectSelection, setsubjectSelection] = useState("");

  // The Resource Selected
  // Formated by [Main Subject _ <Topical/Yearly> _ <Prelim/TYS> Papers ]
  const [resourceSelection, setresourceSelection] = useState("");

  // Sets which column a student wants to filter by
  const [filterColumn, setfilterColumn] = useState("status");

  // Sets the column of the table to be displayed
  // 2 main types - Yearly & Topical
  const [tableColumns, settableColumns] = useState<ColumnDef<YearlyStudyResource | TopicalStudyResource>[]>([]);

  // The data to populate the table
  const [tableData, settableData] = useState<YearlyStudyResource[] | TopicalStudyResource[]>([]);


  useEffect(() => {
      
      
    const resourcesDecoded : string[] = resourceSelection?.split('_');

    const resourceSubject : string = resourcesDecoded[0]; // Extract Subject
    const resourceType1 : string =  resourcesDecoded[1]?.split(' ')[0]; // Extract Topical / Yearly
    const resourceType2 : string =  resourcesDecoded[1]?.split(' ')[1]; // Extract TYS / Prelim

    /*
      TODO: GET DATA FROM SERVER

        1) We should get the columns for diff type of resourceSelection - Yearly / Topical [The togglesorting etc, we might need to just use hardcoded versions of cols]
        2) The data should be straightforward, just settableData
    
      */

      // Yearly layout
      if (resourceType1==="Yearly"){
        settableColumns(
          [
            {
              accessorKey: "year",
              header: ({ column }) => {
                return (
                  <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Year
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                )
              }
            },
            {
              accessorKey: "schoolName",
              header: ({ column }) => {
                return (
                  <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    School
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                )
              },
            },
            {
              accessorKey: 'status', // Accessor matches the key from your data
              header: 'Status',
              cell: info => {
                const status = info.getValue() as "Completed" | "Incomplete";
                const buttonClass = status === 'Completed' ? 'bg-green-300' : 'bg-red-300'; // Green for "Completed", red for "Incomplete"
                return (
                  <button className={`${buttonClass} text-white px-4 py-2 rounded-full`}>
                    {status}
                  </button>
                );
              },
            },
          ]
          );   
          settableData(YearlyStudyResourceData);
      }
      // Topical Layout
      else{
        settableColumns(
          [
            {
              accessorKey: "topicName",
              header: ({ column }) => {
                return (
                  <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Topic
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                )
              },
            },
            {
              accessorKey: 'status', // Accessor matches the key from your data
              header: 'Status',
              cell: info => {
                const status = info.getValue() as "Completed" | "Incomplete";
                const buttonClass = status === 'Completed' ? 'bg-green-300' : 'bg-red-300'; // Green for "Completed", red for "Incomplete"
                return (
                  <button className={`${buttonClass} text-white px-4 py-2 rounded-full`}>
                    {status}
                  </button>
                );
              },
            },
          ]
          );   
          settableData(TopicalStudyResourceData);
      }


  }, [resourceSelection]);


  return (

      <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center">
        
        <SummarySection subjectSelection={subjectSelection}/>

        <SubjectsContentNav
          contents={secondaryContent}
          subjectSelection={subjectSelection}
          onSelectionClick={setsubjectSelection}
          setsubjectContent={setresourceSelection}
        />

        {subjectSelection ?
          <div className="flex_col_center">

            <p className="text-center">Filter By:</p>
            
            <div className="flex_center gap-2">
              <button className="px-2 md:px-4 py-2 rounded-xl bg-slate-300 hover:bg-slate-200" onClick={() => setfilterColumn("status")}>
                Status
              </button>

              <button className="px-2 md:px-4 py-2 rounded-xl bg-slate-300 hover:bg-slate-200" onClick={() => setfilterColumn("schoolName")}>
                School
              </button>
            </div>

            <DataTable columns={tableColumns} data={tableData} filterColumn={filterColumn}/>

          </div>
        :
          <div className="text-slate-400 py-4 flex_col_center gap-2">
            
            <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/>
            
            Select a subject to begin!
          </div>
        }

        

      

      </div>


    
  );
}

export default SecondaryResourcesLayout;
