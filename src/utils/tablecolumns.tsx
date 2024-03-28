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

        
    </div>
    );
}

/*
D:\myacademicweapon\public\images
*/
const statusCell = (info: CellContext<any, any>, onToggleStatus: ToggleStatusFunction, userID: string|null) => {
    const studyResourceID = info.row.original._id; // Access the id of the row
    const status = info.getValue() as boolean; // This is your boolean status
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
            className="checkbox w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500  focus:ring-2"
        />
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
        header: ({ column }) => headerCell(column, "Bookmarks", false),
        cell: info => bookmarkCell(info, onToggleBookmark, userID),
    },
    // // Status
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
            <div className="flex flex-row gap-2 items-center">

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
    // // likes
    // {
    //     accessorKey: "likes",
    //     header: ({ column }) => headerCell(column, "Likes", true),
    //     cell: info => likesCell(info, ()=>alert("TODO: Likes Feature"))
    // },
];

export const getTopicalColumns = (onToggleStatus: ToggleStatusFunction, onToggleBookmark: ToggleBookmarkFunction, userID: string|null): ColumnDef<StudyResourceInterface>[] => [
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
        accessorKey: 'bookmark', // This should match the key in your data for the status
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
        accessorKey: 'bookmark', // This should match the key in your data for the status
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