// tableColumns.ts
import { CellContext, ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Tag from '@/components/shared/Tag';
import Image from "next/image";


// Define a type for your toggle status function
type ToggleStatusFunction = (studyResourceID: string, userID: string|null, newStatus: boolean) => void;

// Utility Cell Components

const statusCell = (info: CellContext<StudyResourceInterface, any>, onToggleStatus: ToggleStatusFunction, userID: string|null) => {
    const studyResourceID = info.row.original._id; // Access the id of the row
    const status = info.getValue() as boolean; // This is your boolean status
    const buttonClass = status ? 'bg-green-300' : 'bg-red-300'; // Class based on the status
    return (
    <div className="w-[80px] flex_center">
        <input
            type="checkbox"
            checked={status} // Checkbox is checked if status is true (Completed)
            onChange={(e) => {
                e.stopPropagation(); // Prevent row click event
                onToggleStatus(studyResourceID, userID, !status); 
            }}
            className="mr-2"
        />
        <span  className={`${buttonClass} text-white px-1 py-1 rounded-full text-xs`}>{status ? 'Completed' : 'Incomplete'}</span>
    </div>
    );
}

const likesCell = (info: CellContext<StudyResourceInterface, unknown>, onToggleStatus: ToggleStatusFunction) => {
    const rowId = info.row.original._id; // Access the id of the row
    const likes = info.getValue() as number; // This is your boolean status
    return (
    <div className="w-[80px] flex_center" >
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



export const getYearlyColumns = (onToggleStatus: ToggleStatusFunction, userID: string|null): ColumnDef<StudyResourceInterface>[] =>
[
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

            return (
            <div
                className="flex_center"
                onClick={() => {window.open(info.row.original.url, '_blank');}}
            >

                <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in">{info.getValue() as string}</p>
                {
                    info.row.original.workingSolution ?
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!"/> : <></>
                }
                {
                    info.row.original.videoSolution ?
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!"/> : <></>
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

export const getTopicalColumns = (onToggleStatus: ToggleStatusFunction, userID: string|null): ColumnDef<StudyResourceInterface>[] => [
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
            return (
                <div
                className="flex_center"
                onClick={() => {window.open(info.row.original.url, '_blank');}}
            >

                <p className="hover:text-blue-600 underline cursor-pointer transition-colors duration-100 ease-in">{info.getValue() as string}</p>
                {
                    info.row.original.workingSolution ?
                    <Tag icon="/icons/solutionsIcon.svg" tooltip="with solutions!"/> : <></>
                }
                {
                    info.row.original.videoSolution ?
                    <Tag icon="/icons/videoIcon.svg" tooltip="with video solutions!"/> : <></>
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
