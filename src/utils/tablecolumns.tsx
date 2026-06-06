// tableColumns.ts
import { CellContext, ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Tag from '@/components/shared/Tag';
import Image from "next/image";

// Dialog
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { handleOpenStudyResourceLink } from '@/utils/toggles';
import ResourceActions from '@/components/shared/ResourceActions';


// Define a type for your toggle status function
type ToggleStatusFunction = (studyResourceID: string, userID: string|null, date : Date, newStatus: boolean, score? : number|null) => void;
type ToggleBookmarkFunction = (studyResourceID: string, userID: string|null, newBookmark: boolean) => void;


// Type guard functions
function isTopicalPracticePaper(item: any): item is TopicalPracticePaper {
    return 'topicName' in item && 'status' in item && 'type' in item;
  }
  
function isYearlyPracticePaper(item: any): item is YearlyPracticePaper {
    return 'assessment' in item && 'year' in item && 'schoolName' in item && 'paper' in item && 'status' in item && 'type' in item;
}



// Utility Cell Components
// Thin wrapper around the shared <ResourceActions/> so the bookmark + completion
// (and score-logging dialog) live in a single place.
const actionsCell = (info: CellContext<any, any>, onToggleBookmark: ToggleBookmarkFunction, onToggleStatus: ToggleStatusFunction, userID: string|null) => (
    <ResourceActions
        resource={info.row.original}
        userID={userID}
        onToggleStatus={onToggleStatus}
        onToggleBookmark={onToggleBookmark}
    />
);


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

export const getNotesColumns = (onToggleBookmark: ToggleBookmarkFunction, userID: string|null): ColumnDef<StudyResourceInterface>[] =>
    [
        // Bookmark
        {
            accessorKey: 'bookmark', // This should match the key in your data for the status
            header: ({ column }) => headerCell(column, "Bookmarks", false),
            cell: (info : CellContext<any, any>) => {
                const studyResourceID = info.row.original._id;
                const bookmarked = info.row.original.bookmark as boolean; 
                return(
                    <div className="flex_center">
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
                            className="hover:cursor-pointer hover:rotate-6 hover:scale-[1.30]"
                            
                        />
                    </div>)
            },
        },
        // Notes: topicNames.join(", ")
        {
            accessorKey: "resource",
            header: ({ column }) => headerCell(column, "Notes", true),
            cell: info => {
                return (
                <div className="grid grid-cols-3" key={info.row.original._id+"_resource"}>
                    <div className="col-start-1 col-span-3 sm:col-start-2 sm:col-span-2 flex flex-col items-start justify-center">
    
                    {
                        'resource' in info.row.original &&
                        <p className="hover:text-blue-600 hover:scale-[1.01] underline text-base text-pri_navy_dark text-left cursor-pointer transition-colors duration-100 ease-in" onClick={() => {handleOpenStudyResourceLink(info.row.original._id, info.row.original.url)}}>{info.row.original.resource as string}</p>
                    }
                    {
                        'topicNames' in info.row.original && (info.row.original.topicNames as string).length > 0 &&
                        <p className="text-sm text-pri_navy_main text-left italic">Topics: {info.row.original.topicNames as string}</p>
                    }
                    </div>
                    
                </div>
                );
            },
        },
    ];


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
        cell: ({ row }) => row.getValue("bookmark"),
    },
    // Status
    {
        accessorKey: 'status', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Status", false),
        cell: ({ row }) => row.getValue("status"),
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
            <div key={info.row.original._id+"_assessment"}>
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
            <div className="grid grid-cols-3" key={info.row.original._id+"_resource"}>
                <div className="col-start-1 col-span-3 sm:col-start-2 sm:col-span-2 flex justify-start items-center">

                {
                    'resource' in info.row.original &&
                    <p className="hover:text-blue-600 hover:scale-[1.01] underline text-base text-pri_navy_dark text-left cursor-pointer transition-colors duration-100 ease-in" onClick={() => {handleOpenStudyResourceLink(info.row.original._id, info.row.original.url)}}>{info.row.original.resource as string}</p>
                }
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="solutions!" onClickUrl={workingSolution}/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="video solutions!" onClickUrl={videoSolution}/>
                }
                </div>
                
            </div>
            );
        },
    },
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
        cell: ({ row }) => row.getValue("bookmark"),
    },
    // Status
    {
        accessorKey: 'status', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Status", false),
        cell: ({ row }) => row.getValue("status"),
    },
    // topicName
    {
        accessorKey: 'topicName', // This should match the key in your data for the status
        header: ({ column }) => headerCell(column, "Topic", false),
        cell: ({ row }) => row.getValue("topicName"),
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
            <div className="grid grid-cols-3" key={info.row.original._id+"_resource"}>
                <div className="col-start-1 col-span-3 sm:col-start-2 sm:col-span-2 flex justify-start items-center">

                {
                    'resource' in info.row.original &&
                    <p className="hover:text-blue-600 hover:scale-[1.01] underline text-base text-pri_navy_dark text-left cursor-pointer transition-colors duration-100 ease-in" onClick={() => {handleOpenStudyResourceLink(info.row.original._id, info.row.original.url)}}>{info.row.original.resource as string}</p>
                }
                {
                    workingSolution &&
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="solutions!" onClickUrl={workingSolution}/>
                }
                {
                    videoSolution &&
                    <Tag icon="/icons/videoIcon.svg" tooltip="video solutions!" onClickUrl={videoSolution}/>
                }
                </div>
                
            </div>
            );
        },
    },

];


export const getProfileCompletedColumns = (onToggleStatus: ToggleStatusFunction, userID: string|null, isOwnUser: boolean): ColumnDef<StudyResourceInterface>[] => [
    // Subject
    {
        accessorKey: "subject",
        header: ({ column }) => headerCell(column, "Subject", true),
        cell: info => {info.getValue() as string},
    },
    // Resource
    {
        accessorKey: "title",
        header: ({ column }) => headerCell(column, "Completed Practices", true),
        cell: info => {

            let workingSolution  = null;
            let videoSolution = null;
            let date = null;

            if ('workingSolution' in info.row.original){
                workingSolution = info.row.original.workingSolution as string;
            }
            if ('videoSolution' in info.row.original){
                videoSolution = info.row.original.videoSolution as string;
            }
            if ('date' in info.row.original){
                const currDate = info.row.original.date as Date;
                date = ("0" + currDate.getDate()).slice(-2) + "/" + ("0"+(currDate.getMonth()+1)).slice(-2) + "/" + ("0" + currDate.getFullYear()).slice(-2);
            }
            return (
            <div className="grid grid-rows-2 grid-cols-3 gap-1" key={info.row.original._id+"_assessmentC"}>
                <div className="row-span-1 col-start-1 col-span-3 sm:col-start-2 sm:col-span-2 flex justify-start items-center">
                    <p className="hover:text-blue-600 underline cursor-pointer text-pri_navy_darker text-left text-sm md:text-base transition-colors duration-100 ease-in" onClick={() => {handleOpenStudyResourceLink(info.row.original._id, info.row.original.url)}}>{info.getValue() as string}</p>
                    {
                        workingSolution &&
                        <Tag icon="/icons/solutionsIcon.svg" tooltip="solutions!" onClickUrl={workingSolution}/>
                    }
                    {
                        videoSolution &&
                        <Tag icon="/icons/videoIcon.svg" tooltip="video solutions!" onClickUrl={videoSolution}/>
                    }
                    
                </div>
                <div className="row-span-1 col-start-1 col-span-3 sm:col-start-2 sm:col-span-2 italic text-pri_navy_dark text-left">{`(completed ${date})`}</div>
            </div>
            );
        },
    },
    // Score
    ...(isOwnUser ? [{
        accessorKey: "scorePercent",
        header: ({ column }: { column: Column<any, any> }) => headerCell(column, "Score (%)", true),
        cell: (info: CellContext<any, any>) => {
            
            if (info.getValue()<0) return "-";

            const score = Number(info.getValue()) * 100;
            return <p className="font-medium text-pri_navy_main text-sm md:text-base" key={info.row.original._id+"_scoreC"}>{score.toFixed(1)+"%"}</p> // round to 1dp
        },
    }] : []),
    // Edit
    ...(isOwnUser ? [{
        accessorKey: 'totMarks', // This should match the key in your data for the status
        header: ({ column }: { column: Column<any, any> }) => headerCell(column, "Edit", false),
        cell: (info: CellContext<any, any>) => {
            const studyResourceID = info.row.original._id; // Access the id of the row
            const date = new Date();
            return (
            <div className="w-full flex justify-center" key={studyResourceID+"_editC"}>
                <div className="tooltip" data-tooltip="remove">

                <Dialog>
                    <DialogTrigger asChild>
                        <div>
                        <Image
                            src='/icons/remove.svg'
                            alt='remove'
                            height={25}
                            width={25}
                            className="hover:cursor-pointer"
                        />
                        </div>
                        
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">

                        <DialogHeader>
                            <DialogTitle>Confirm remove?</DialogTitle>
                            <DialogDescription>
                                <p>Progress cannot be restored!</p>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <div className="flex_center gap-2">
                                    <button className="text-red-900 bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg" onClick={()=>onToggleStatus(studyResourceID, userID, date, false)}>
                                        Confirm
                                    </button>
                                </div>
                            </DialogClose>
                        </DialogFooter>

                    </DialogContent>

                </Dialog>
                </div>
        
                
            </div>
            );
        },
    }] : []),
];

export const getProfileBookmarkedColumns = (onToggleBookmark: ToggleBookmarkFunction, userID: string|null, isOwnUser: boolean): ColumnDef<StudyResourceInterface>[] => [
    // Subject
    {
        accessorKey: "subject",
        header: ({ column }) => headerCell(column, "Subject", true),
        cell: info => {info.getValue() as string},
    },
    {
        accessorKey: "title",
        header: ({ column }) => headerCell(column, "Bookmarks", true),
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
            <div className="grid grid-cols-3" key={info.row.original._id+"_resourceB"}>
                <div className="col-start-1 col-span-3 sm:col-start-2 sm:col-span-2 flex justify-start items-center">
                    <p className="hover:text-blue-600 underline cursor-pointer text-pri_navy_main text-left text-sm md:text-base transition-colors duration-100 ease-in" onClick={() => {handleOpenStudyResourceLink(info.row.original._id, info.row.original.url)}}>{info.getValue() as string}</p>
                    {
                        workingSolution &&
                        <Tag icon="/icons/solutionsIcon.svg" tooltip="solutions!" onClickUrl={workingSolution}/>
                    }
                    {
                        videoSolution &&
                        <Tag icon="/icons/videoIcon.svg" tooltip="video solutions!" onClickUrl={videoSolution}/>
                    }
                    
                </div>
            </div>
            );
        },
    },
    // Edit
    ...(isOwnUser ? [{
        accessorKey: 'totMarks', // This should match the key in your data for the status
        header: ({ column }: { column: Column<any, any> }) => headerCell(column, "Edit", false),
        cell: (info: CellContext<any, any>) => {
            const studyResourceID = info.row.original._id; // Access the id of the row
            return (
            <div className="w-full flex justify-center" key={studyResourceID+"_editB"}>
                <div className="tooltip" data-tooltip="remove">
                <Dialog>
                    <DialogTrigger asChild>
                        <div>
                        <Image
                            src='/icons/remove.svg'
                            alt='remove'
                            height={25}
                            width={25}
                            className="hover:cursor-pointer"
                        />
                        </div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">

                        <DialogHeader>
                            <DialogTitle>Confirm remove?</DialogTitle>
                            <DialogDescription>
                                <p>You can still add it back in Study Resources!</p>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <div className="flex_center gap-2">
                                    <button className="text-red-900 bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg" onClick={()=>onToggleBookmark(studyResourceID, userID, false)}>
                                        Confirm
                                    </button>
                                </div>
                            </DialogClose>
                        </DialogFooter>

                    </DialogContent>

                </Dialog>
                    
                </div>
        
                
            </div>
            );
        },
    }] : []),
];