"use client"

import Image from 'next/image';
import SummarySection from '@/components/shared/SummarySection';
import SubjectsContentNav from '@/components/shared/SubjectsContentNav';
import { secondaryContent } from '../../../../constants';
import { useEffect, useState } from 'react';

import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"


const SecondaryResourcesPage = () => {

  const [subjectSelection, setsubjectSelection] = useState("");

  const [subjectContent, setsubjectContent] = useState("");

  const [filterColumn, setfilterColumn] = useState("email");

  // TODO:
  // Logic to retrieve past user progress and load it into Summary Section

  // TODO:
  // Logic to retrieve the respective resource content based on user selection

  const data : Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "success",
      email: "a@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "pending",
      email: "b@example.com",
    },
  ]

  useEffect(() => {

    const tmp : string[] = subjectContent.split('_');



  }, [subjectContent]);

  return (

      <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center">
        
        <SummarySection subjectSelection={subjectSelection}/>

        <SubjectsContentNav
          contents={secondaryContent}
          subjectSelection={subjectSelection}
          onSelectionClick={setsubjectSelection}
          setsubjectContent={setsubjectContent}
        />

        <div className="flex gap-2">

          {subjectSelection ?
          <div>
            <p className="text-center">Displaying {subjectContent}</p>

            <p className="text-center">Filter By:</p>
            
            <div className="flex_center gap-2">
              <button className="px-2 md:px-4 py-2 rounded-xl bg-slate-300 hover:bg-slate-200" onClick={() => setfilterColumn("status")}>
                Status
              </button>

              <button className="px-2 md:px-4 py-2 rounded-xl bg-slate-300 hover:bg-slate-200" onClick={() => setfilterColumn("email")}>
                Email
              </button>
            </div>

            <DataTable columns={columns} data={data} filterColumn={filterColumn}/>

          </div>
          :
          <div className="text-slate-400 py-4 flex_col_center gap-2">
            
            <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/>
            
            Select a subject to begin!
          </div>
          }

        
      </div>

      

      </div>


    
  );
}

export default SecondaryResourcesPage;
