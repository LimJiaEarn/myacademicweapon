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
const bookmarkCell = (info: CellContext<any, any>, onToggleBookmark: ToggleBookmarkFunction, userID: string|null) => {
    const studyResourceID = info.row.original._id; // Access the id of the row
    const bookmarked = info.getValue() as boolean; // This is your boolean status
    return (
    <div className="w-full flex justify-center" >
        <div className="tooltip" data-tooltip={`${bookmarked ? 'un-bookmark' : 'bookmark'}`}>
            <Image
                src={`${bookmarked ? '/icons/bookmarked.svg' : '/icons/bookmark.svg'}`}
                alt={`${bookmarked ? 'bookmarked' : 'bookmark'}`}
                height={25}
                width={25}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    e.preventDefault();
                    onToggleBookmark(studyResourceID, userID, !bookmarked); 
                }}
                className="hover:cursor-pointer"
                
            />
        </div>

        
    </div>
    );
}

/*
D:\myacademicweapon\public\images
*/
const statusCell = (info: CellContext<any, any>, onToggleStatus: ToggleStatusFunction, userID: string|null) => {
    const studyResourceID = info.row.original._id; // Access the id of the row
    const status = info.getValue() as boolean; // This is your boolean status
    const buttonClass = status ? 'bg-green-300' : 'bg-red-300'; // Class based on the status
    return (
    <div className="w-full flex justify-center">
        <input
            type="checkbox"
            checked={status} // Checkbox is checked if status is true (Completed)
            onChange={(e) => {
                e.stopPropagation(); // Prevent row click event
                e.preventDefault();
                onToggleStatus(studyResourceID, userID, !status); 
            }}
            className="mr-2"
        />
        <span  className={`${buttonClass} text-white px-1 py-1 rounded-full text-xs`}>{status ? 'Completed' : 'Incomplete'}</span>
    </div>
    );
}

const likesCell = (info: CellContext<any, any>, onToggleStatus: ToggleStatusFunction) => {
    const rowId = info.row.original._id; // Access the id of the row
    const likes = info.getValue() as number; // This is your boolean status
    return (
    <div className="w-full flex justify-center" >
        {likes}
        <button className="relative bottom-[0.48]">
            <Image 
                src="/icons/likeIcon.svg"
                alt="likeIcon"
                height={14}
                width={14}
            />
        </button>
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
    // Bookmark
    {
        accessorKey: 'bookmark', // This should match the key in your data for the status
        header: 'Bookmarks',
        cell: info => bookmarkCell(info, onToggleBookmark, userID),
    },
    // Status
    {
        accessorKey: 'status', // This should match the key in your data for the status
        header: 'Status',
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
    },
    // schoolName
    {
        accessorKey: "schoolName",
        header: ({ column }) => headerCell(column, "School", true),
        cell: info => {
            let videoSolution = null;
            let workingSolution = null;
            if (isYearlyPracticePaper(info.row.original)) {
                workingSolution = info.row.original.workingSolution;
                videoSolution = info.row.original.videoSolution;
            }
            return (
            <div
                className="flex_center gap-2"
                onClick={() => {window.open(info.row.original.url, '_blank');}}
            >

                <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in">{info.getValue() as string}</p>
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!"/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!"/>
                }
                
            </div>
            );
        },
    },
    // likes
    {
        accessorKey: "likes",
        header: ({ column }) => headerCell(column, "Likes", true),
        cell: info => likesCell(info, ()=>alert("TODO: Likes Feature"))
    },
];

export const getTopicalColumns = (onToggleStatus: ToggleStatusFunction, onToggleBookmark: ToggleBookmarkFunction, userID: string|null): ColumnDef<StudyResourceInterface>[] => [
    // Bookmark
    {
        accessorKey: 'bookmark', // This should match the key in your data for the status
        header: 'Bookmarks',
        cell: info => bookmarkCell(info, onToggleBookmark, userID),
    },
    // Status
    {
        accessorKey: 'status', // This should match the key in your data for the status
        header: 'Status',
        cell: info => statusCell(info, onToggleStatus, userID),
    },
    // topicName
    {
        accessorKey: "topicName",
        header: ({ column }) => headerCell(column, "Topic Name", true),
        cell: info => {

            let videoSolution = null;
            let workingSolution = null;
            if (isTopicalPracticePaper(info.row.original)) {
                workingSolution = info.row.original.workingSolution;
                videoSolution = info.row.original.videoSolution;
            }
            return (
                <div
                className="flex_center"
                onClick={() => {window.open(info.row.original.url, '_blank');}}
            >

                <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in">{info.getValue() as string}</p>
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!"/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!"/>
                }
                
            </div>
            );
        },
    },
    // likes
    {
        accessorKey: "likes",
        header: ({ column }) => headerCell(column, "Likes", true),
        cell: info => likesCell(info, ()=>alert("TODO: Likes Feature"))
    },
];
