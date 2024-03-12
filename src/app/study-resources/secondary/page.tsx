"use client"

import Image from 'next/image';
import SummarySection from '@/components/shared/SummarySection';
import SubjectsContentNav from '@/components/shared/SubjectsContentNav';
import { useState, useEffect } from 'react';


// Dependencies for Table
import { secondaryContentNav } from '../../../../constants';
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/DataTable";
import { getYearlyColumns, getTopicalColumns } from "@/components/shared/DataTableColumn";


// Temporary test data
import { YearlyStudyResourceData, TopicalStudyResourceData } from '../../../../constants';


const SecondaryResourcesPage = () => {

  // The Main Subject student has chosen
  const [subjectSelection, setsubjectSelection] = useState<string>("");

  // The Resource Selected
  // Formated by [Main Subject _ <Topical/Yearly> _ <Prelim/TYS> Papers ]
  const [resourceSelection, setresourceSelection] = useState<string>("");

  // Sets the column of the table to be displayed
  // 2 main types - Yearly & Topical
  const [tableColumns, settableColumns] = useState<ColumnDef<StudyResourceInterface>[]>([]);

  // The data to populate the table
  const [tableData, settableData] = useState<StudyResourceInterface[]>([]);
  
  const onToggleStatus = (rowId: string) => {
    
    settableData((prevData: StudyResourceInterface[]) =>
      prevData.map(item => {
        if (item._id === rowId) {
          return { ...item, status: !item.status };
        }
        return item;
      })
    );
      
  };

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
        
        settableColumns(getYearlyColumns(onToggleStatus));

        // `YearlyStudyResourceData` to get from APi
        settableData(YearlyStudyResourceData);
      }
      // Topical Layout
      else{

        settableColumns(getTopicalColumns(onToggleStatus));

        // `TopicalStudyResourceData` to get from APi
        settableData(TopicalStudyResourceData);
      }


  }, [resourceSelection]);


  return (

      <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center">
        
        <SummarySection subjectSelection={subjectSelection}/>

        <SubjectsContentNav
          contents={secondaryContentNav}
          subjectSelection={subjectSelection}
          onSelectionClick={setsubjectSelection}
          setsubjectContent={setresourceSelection}
        />

        {subjectSelection ?
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


    
  );
}

export default SecondaryResourcesPage;
