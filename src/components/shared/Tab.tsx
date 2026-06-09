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
    <div className="w-full">

        {/* Segmented tab selector */}
        <div className="border-b border-hairline p-3 md:p-4">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
                {Tabs.map((currTab : Tab, index) => {
                return(
                    <button
                        type="button"
                        key={`${currTab.title}_${index}`}
                        className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm md:text-base font-bold transition ease-in-out duration-150 ${
                            tabSelection===index
                                ? 'bg-white text-ink shadow-sm'
                                : 'text-pri_navy_light hover:text-ink'
                        }`}
                        onClick={()=>{
                            setTabSelection(index);
                        }}
                    >
                        <Image src={currTab.titleIcon} alt="" height={18} width={18} className={tabSelection===index ? '' : 'opacity-60'}/>
                        {currTab.title}
                    </button>
                )})}
            </div>
        </div>

        {/* Table */}
        <div className="p-2 md:p-4">
            <ProfilePageTable
                tableData={tabSelection===0 ? Tabs[0].data : Tabs[1].data}
                setTableData={tabSelection===0 ? Tabs[0].setData : Tabs[1].setData}
                userID={userID}
                sectionType={tabSelection===0 ? Tabs[0].sectionType : Tabs[1].sectionType}
                isOwnUser={isOwnUser}
            />
        </div>

    </div>
  )
}

export default Tab