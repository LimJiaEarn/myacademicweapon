"use client"

import Image from 'next/image';
import { useState } from 'react';
import ProfilePageTable from "@/components/shared/ProfileTable";

type Tab = {
    title:string;
    titleIcon:string;
    data : ISummarisedPracticePaper[];
    sectionType : "Bookmarks" | "Completed";
}


const Tab = ({Tabs, isOwnUser, userID, username} : {Tabs: Tab[], isOwnUser: boolean, userID: string, username:string}) => {
    
    const [tabSelection, setTabSelection] = useState(Tabs[0].sectionType);
    
    const [tableData, setTableData] = useState<ISummarisedPracticePaper[]>(Tabs[0].data);
    
  
    return (
    <div className="w-full grid grid-rows-auto">

        {/* Tab Selector */}
        <div className="row-span-1 grid grid-cols-2 w-full bg-pri_mint_main min-h-12 md:min-h-14 rounded-t-xl">
            {Tabs.map((currTab : Tab, index) => {
            return(
                <div
                    key={`${currTab.title}_${index}`}
                    className={`m-1 rounded-xl flex_center gap-2 md:gap-4 cursor-pointer col-span-1 ${tabSelection===currTab.sectionType ? 'bg-pri_mint_lighter' : ''}`}
                    onClick={()=>{
                        setTabSelection(currTab.sectionType);
                        setTableData(currTab.data);
                    }}
                >
                    <Image src={currTab.titleIcon} alt="" height={22} width={22}/>
                    <p className="font-semibold text-pri_navy_main text-md md:text-lg">{currTab.title}</p>
                </div>
            )})}
        </div>
        
        {/* Table */}
        <div className="mt-4">
            <ProfilePageTable data={tableData} userID={userID} sectionType={tabSelection} isOwnUser={isOwnUser}/>
        </div>

    </div>
  )
}

export default Tab