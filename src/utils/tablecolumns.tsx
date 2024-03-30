// tableColumns.ts
import { CellContext, ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Tag from '@/components/shared/Tag';
import Image from "next/image";


// Define a type for your toggle status function
type ToggleStatusFunction = (studyResourceID: string, userID: string|null, newStatus: boolean) => void;
type ToggleBookmarkFunction = (studyResourceID: string, userID: string|null, newBookmark: boolean) => void;


// Type guard functions
function isTopicalPracticePaper(item: any): item is TopicalPracticePaper {
    return 'topicName' in item && 'status' in item && 'type' in item;
  }
  
function isYearlyPracticePaper(item: any): item is YearlyPracticePaper {
return 'assessment' in item && 'year' in item && 'schoolName' in item && 'paper' in item && 'status' in item && 'type' in item;
}


// Utility Cell Components
const actionsCell = (info: CellContext<any, any>, onToggleBookmark: ToggleBookmarkFunction, onToggleStatus: ToggleStatusFunction, userID: string|null) => {
    const studyResourceID = info.row.original._id; // Access the id of the row
    
    const bookmarked = info.row.original.bookmark as boolean; 
    const status = info.row.original.status as boolean; 
    return(
    <div className="w-full flex_center gap-4 md:gap-8">
        <div className="tooltip" data-tooltip={`${bookmarked ? 'un-bookmark' : 'bookmark'}`}>
            <Image
                src={`${bookmarked ? '/icons/bookmarked.svg' : '/icons/bookmark.svg'}`}
                alt="bookmark"
                height={30}
                width={30}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    e.preventDefault();
                    onToggleBookmark(studyResourceID, userID, !bookmarked); 
                }}
                className="hover:cursor-pointer"
                
            />
        </div>
        
        <label className="inline-block relative cursor-pointer">
            <input
                type="checkbox"
                checked={status}
                onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleStatus(studyResourceID, userID, !status);
                }}
                className="opacity-0 absolute w-full h-full left-0 top-0 z-10 cursor-pointer"
            />
            <span className={`block w-6 h-6 rounded-md border-2 ${status ? 'bg-green-600 border-lime-200' : 'bg-gray-100 border-gray-300'}`}></span>
            {status && (
                <svg className="absolute top-1 left-1 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* SVG path for checkmark */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </label>


    </div>
    )


}

// Commented out for faster load since these cells are hidden
const bookmarkCell = (info: CellContext<any, any>, onToggleBookmark: ToggleBookmarkFunction, userID: string|null) => {
    const studyResourceID = info.row.original._id; // Access the id of the row
    const bookmarked = info.getValue() as boolean; // This is your boolean status
    return (
    <div className="w-full flex justify-center" >
        {/* <div className="tooltip" data-tooltip={`${bookmarked ? 'un-bookmark' : 'bookmark'}`}>
            <Image
                src={`${bookmarked ? '/icons/bookmarked.svg' : '/icons/bookmark.svg'}`}
                alt={`${bookmarked ? 'bookmarked' : 'bookmark'}`}
                height={30}
                width={30}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    e.preventDefault();
                    onToggleBookmark(studyResourceID, userID, !bookmarked); 
                }}
                className="hover:cursor-pointer"
                
            />
        </div> */}

        
    </div>
    );
}

// Commented out for faster load since these cells are hidden
const statusCell = (info: CellContext<any, any>, onToggleStatus: ToggleStatusFunction, userID: string|null) => {
    const studyResourceID = info.row.original._id; // Access the id of the row
    const status = info.getValue() as boolean; // This is your boolean status
    return (
    <div className="w-full flex justify-center">
        {/* <input
            type="checkbox"
            checked={status} // Checkbox is checked if status is true (Completed)
            onChange={(e) => {
                e.stopPropagation(); // Prevent row click event
                e.preventDefault();
                onToggleStatus(studyResourceID, userID, !status); 
            }}
            className="checkbox w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500  focus:ring-2"
        /> */}
    </div>
    );
}

const headerCell = (column : Column<any, any>, headerTitle : string, withSort : boolean) => {
    return (
        <div className="flex_center">
            <p>{headerTitle}</p>
            {withSort &&
                <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            }   
        </div>
    )
}



export const getYearlyColumns = (onToggleStatus: ToggleStatusFunction, onToggleBookmark: ToggleBookmarkFunction, userID: string|null): ColumnDef<StudyResourceInterface>[] =>
[
    // Quick Actions - bookmark & status
    {
        accessorKey: 'type', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Actions", false),
        cell: info => actionsCell(info, onToggleBookmark, onToggleStatus, userID),
    },
    // Bookmark
    {
        accessorKey: 'bookmark', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Bookmarks", false),
        cell: info => bookmarkCell(info, onToggleBookmark, userID),
    },
    // Status
    {
        accessorKey: 'status', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Status", false),
        cell: info => statusCell(info, onToggleStatus, userID),
    },
    // Year
    {
        accessorKey: "year",
        header: ({ column }) => headerCell(column, "Year", true),
    },
    // Assessment
    {
        accessorKey: "assessment",
        header: ({ column }) => headerCell(column, "Assessment", true),
        cell: info => {

            const paper = "P" + (info.row.original as YearlyPracticePaper).paper || "";

            return (
            <div>
                <p>{info.getValue() as string} {paper}</p>
            </div>
            );
        },
    },
    // Yearly: .year + .assessment + .schoolName + .paper
    {
        accessorKey: "resource",
        header: ({ column }) => headerCell(column, "Resource", true),
        cell: info => {
            let videoSolution = null;
            let workingSolution = null;
            if (isYearlyPracticePaper(info.row.original)) {
                workingSolution = info.row.original.workingSolution;
                videoSolution = info.row.original.videoSolution;
            }
            return (
            <div className="flex_center">
                {
                    'resource' in info.row.original &&
                    <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in" onClick={() => {window.open(info.row.original.url, '_blank');}}>{info.row.original.resource as string}</p>
                }
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!" onClickUrl={workingSolution}/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!" onClickUrl={videoSolution}/>
                }
                
            </div>
            );
        },
    },
    // // likes
    // {
    //     accessorKey: "likes",
    //     header: ({ column }) => headerCell(column, "Likes", true),
    //     cell: info => likesCell(info, ()=>alert("TODO: Likes Feature"))
    // },
];

export const getTopicalColumns = (onToggleStatus: ToggleStatusFunction, onToggleBookmark: ToggleBookmarkFunction, userID: string|null): ColumnDef<StudyResourceInterface>[] => [
    // Quick Actions - bookmark & status
    {
        accessorKey: 'type', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Actions", false),
        cell: info => actionsCell(info, onToggleBookmark, onToggleStatus, userID),
    },
    
    // Bookmark
    {
        accessorKey: 'bookmark', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Bookmarks", false),
        cell: info => bookmarkCell(info, onToggleBookmark, userID),
    },
    // Status
    {
        accessorKey: 'status', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Status", false),
        cell: info => statusCell(info, onToggleStatus, userID),
    },
    // Topical: topicName
    {
        accessorKey: "resource",
        header: ({ column }) => headerCell(column, "Resource", true),
        cell: info => {

            let videoSolution = null;
            let workingSolution = null;
            if (isTopicalPracticePaper(info.row.original)) {
                workingSolution = info.row.original.workingSolution;
                videoSolution = info.row.original.videoSolution;
            }
            return (
            <div className="flex_center">
                {
                    'resource' in info.row.original &&
                    <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in" onClick={() => {window.open(info.row.original.url, '_blank');}}>{info.row.original.resource as string}</p>
                }
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!" onClickUrl={workingSolution}/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!" onClickUrl={videoSolution}/>
                }
                
            </div>
            );
        },
    },
    // // likes
    // {
    //     accessorKey: "likes",
    //     header: ({ column }) => headerCell(column, "Likes", true),
    //     cell: info => likesCell(info, ()=>alert("TODO: Likes Feature"))
    // },
];


export const getProfileCompletedColumns = (onToggleStatus: ToggleStatusFunction, userID: string|null, isOwnUser: boolean): ColumnDef<StudyResourceInterface>[] => [
    // Resource
    {
        accessorKey: "title",
        header: ({ column }) => headerCell(column, "Resource", true),
        cell: info => {

            let workingSolution  = null;
            let videoSolution = null;

            if ('workingSolution' in info.row.original){
                workingSolution = info.row.original.workingSolution as string;
            }
            if ('videoSolution' in info.row.original){
                videoSolution = info.row.original.videoSolution as string;
            }
            return (
            <div className="flex_center">

                <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in" onClick={() => {window.open(info.row.original.url, '_blank');}}>{info.getValue() as string}</p>
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!" onClickUrl={workingSolution}/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!" onClickUrl={videoSolution}/>
                }
                
            </div>
            );
        },
    },
    // Edit
    ...(isOwnUser ? [{
        accessorKey: 'resource', // This should match the key in your data for the status
        header: ({ column }: { column: Column<any, any> }) => headerCell(column, "Edit", false),
        cell: (info: CellContext<any, any>) => {
            const studyResourceID = info.row.original._id; // Access the id of the row
            return (
            <div className="w-full flex justify-center" >
                <div className="tooltip" data-tooltip="remove">
                    <Image
                        src='/icons/remove.svg'
                        alt='remove'
                        height={25}
                        width={25}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            e.preventDefault();
                            onToggleStatus(studyResourceID, userID, false); 
                        }}
                        className="hover:cursor-pointer"
                        
                    />
                </div>
        
                
            </div>
            );
        },
    }] : []),
];

export const getProfileBookmarkedColumns = (onToggleBookmark: ToggleBookmarkFunction, userID: string|null, isOwnUser: boolean): ColumnDef<StudyResourceInterface>[] => [
    // Resource
    {
        accessorKey: "title",
        header: ({ column }) => headerCell(column, "Resource", true),
        cell: info => {

            let workingSolution  = null;
            let videoSolution = null;

            if ('workingSolution' in info.row.original){
                workingSolution = info.row.original.workingSolution as string;
            }
            if ('videoSolution' in info.row.original){
                videoSolution = info.row.original.videoSolution as string;
            }
            return (
            <div className="flex_center">

                <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in" onClick={() => {window.open(info.row.original.url, '_blank');}}>{info.getValue() as string}</p>
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!" onClickUrl={workingSolution}/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!" onClickUrl={videoSolution}/>
                }
                
            </div>
            );
        },
    },
    // Edit
    ...(isOwnUser ? [{
        accessorKey: 'resource', // This should match the key in your data for the status
        header: ({ column }: { column: Column<any, any> }) => headerCell(column, "Edit", false),
        cell: (info: CellContext<any, any>) => {
            const studyResourceID = info.row.original._id; // Access the id of the row
            return (
            <div className="w-full flex justify-center" >
                <div className="tooltip" data-tooltip="remove">
                    <Image
                        src='/icons/remove.svg'
                        alt='remove'
                        height={25}
                        width={25}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            e.preventDefault();
                            onToggleBookmark(studyResourceID, userID, false); 
                        }}
                        className="hover:cursor-pointer"
                        
                    />
                </div>
        
                
            </div>
            );
        },
    }] : []),
];