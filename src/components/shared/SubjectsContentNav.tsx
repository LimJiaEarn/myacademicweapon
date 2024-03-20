"use client"

import { useState } from 'react';
import Link from "next/link";

interface subjectsContent {
    id: string;
    title: string;
    resources: string[];
}
  
interface SubjectsContentNavProps {
    contents: subjectsContent[];
    subjectSelection: string;
    onSelectionClick: (selectedSubject : string) => void;
    setsubjectContent: (selectedContent : string) => void;
}

const SubjectsContentNav = ({contents, subjectSelection, onSelectionClick, setsubjectContent} : SubjectsContentNavProps) => {
  
    const [currentHover, setcurrentHover] = useState<string | null>(null);

    return (
        <div className="bg-light_gray rounded-md px-4 py-2 mx-4 my-4 md:mx-8 md:my-8 flex_center gap-2 font-bold shadow-md">
        {contents.map((content) => (
            <div key={content.id}
                className="relative group"
                onMouseEnter={() => setcurrentHover(content.title)}
                onMouseLeave={() => setcurrentHover(null)}
            >
            <div className={`${content.title === subjectSelection ? 'text-info_blue' : 'text-dark-gray'} hover:text-dark_info_blue p-2 rounded-md cursor-pointer transition-hover text-center`}>
                {content.title}
            </div>

            <div className={`${content.title === currentHover ? 'absolute top-10 ml-2 w-[250px] py-2 bg-light_gray rounded-md dropdown-bg shadow-dropdown' : 'hidden'} transition-all duration-100 ease-in-out z-10`}>

                {content.resources.map((resource, i) => {
                return (
                <Link
                    key={`${content.id}-${resource}-${i}`}
                    href={`?${new URLSearchParams({
                        subject:content.title,
                        resourceType:resource
                    })}`}
                    onClick={() => {onSelectionClick(content.title); setsubjectContent(`${content.title}_${resource}`);}}
                    className="block w-full text-left px-4 py-2 text-sm hover:text-dark_info_blue rounded-md transition-colors duration-150 ease-in-out"
                >
                    {resource}
                </Link>
                )})}
            </div>
            </div>
        ))}
        </div>


  )
}

export default SubjectsContentNav