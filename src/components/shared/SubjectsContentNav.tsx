"use client"

import { useState } from 'react';
import Link from 'next/link';

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
        <div className="w-[250px] bg-purple-100 rounded-xl px-4 py-2 flex_center gap-2 font-bold shadow-lg">

            {contents.map((content) => (
                <div key={content.id}
                    className="relative group"
                    onMouseEnter={() => setcurrentHover(content.title)}
                    onMouseLeave={() => setcurrentHover(null)}
                >
                    <div className={`${content.title === subjectSelection ? 'text-purple-800' : ''} p-2 rounded-md hover:bg-purple-200 cursor-pointer`}>
                        {content.title}
                    </div>

                    <div className={`${content.title === currentHover ? 'absolute top-10 ml-2 w-48 py-2 rounded-md bg-purple-50 shadow' : 'hidden'} transition-all duration-300 ease-in-out z-10`}>

                        {content.resources.map((resource, i) => {
                            

                            return (
                            <button
                                key={`${content.id}-${resource}-${i}`}
                                onClick={() => {onSelectionClick(content.title); setsubjectContent(`${content.title}_${resource}`);}}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-200 hover:text-purple-800 rounded-md transition-colors duration-150 ease-in-out"
                            >
                                {resource}
                            </button>
                        )})}

                    </div>
                </div>
            ))}
        </div>

  )
}

export default SubjectsContentNav