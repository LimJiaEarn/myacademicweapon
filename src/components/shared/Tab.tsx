"use client"

import Image from 'next/image';
import { useState } from 'react';
import ProfilePageTable from "@/components/shared/ProfileTable";

type Tab = {
    title:string;
    titleIcon:string;
    data : ISummarisedPracticePaper[];
    setData : React.Dispatch<React.SetStateAction<ISummarisedPracticePaper[]>>;
    sectionType : "Bookmarks" | "Completed";
}


const Tab = ({Tabs, isOwnUser, userID} : {Tabs: Tab[], isOwnUser: boolean, userID: string}) => {
    
    const [tabSelection, setTabSelection] = useState(0); // 0-Complete, 1-Bookmark

  
    return (
    <div className="w-full grid grid-rows-auto">

        {/* Tab Selector */}
        <div className="row-span-1 grid grid-cols-2 w-full bg-pri_mint_main min-h-12 md:min-h-14 rounded-t-xl">
            {Tabs.map((currTab : Tab, index) => {
            return(
                <div
                    key={`${currTab.title}_${index}`}
                    className={`m-1 rounded-xl flex_center gap-2 cursor-pointer col-span-1 ${tabSelection===index ? 'bg-pri_mint_lighter' : ''}`}
                    onClick={()=>{
                        setTabSelection(index);
                        // setTableData(currTab.data);
                        // setTableDataSetter(currTab.setData);
                    }}
                >
                    <Image src={currTab.titleIcon} alt="" height={22} width={22}/>
                    <p className="font-semibold text-pri_navy_main text-md md:text-lg">{currTab.title}</p>
                </div>
            )})}
        </div>
        
        {/* Table */}
        <div className="mt-4">
            <ProfilePageTable
                tableData={tabSelection===0 ? Tabs[0].data : Tabs[1].data}
                setTableData={tabSelection===0 ? Tabs[0].setData : Tabs[1].setData}
                userID={userID} sectionType={tabSelection===0 ? Tabs[0].sectionType : Tabs[1].sectionType}
                isOwnUser={isOwnUser}
            />
        </div>

    </div>
  )
}

export default Tab