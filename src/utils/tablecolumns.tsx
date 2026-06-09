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
    if (!withSort) {
        return (
            <div className="flex items-center justify-start">
                <span>{headerTitle}</span>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-start">
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-pri_mint_darker"
            >
                <span>{headerTitle}</span>
                <ArrowUpDown className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
            </button>
        </div>
    )
}

// Shared rich "resource" cell: bold link title + optional marks pill + solution/video tags.
const ResourceTitleCell = ({
    id,
    url,
    title,
    totMarks,
    workingSolution,
    videoSolution,
    subtitle,
}: {
    id: string;
    url: string;
    title: string;
    totMarks?: number;
    workingSolution?: string | null;
    videoSolution?: string | null;
    subtitle?: string | null;
}) => {
    const hasMeta = (totMarks && totMarks > 0) || workingSolution || videoSolution;
    return (
        <div className="flex flex-col items-start gap-1.5 text-left" key={id + "_resource"}>
            <button
                type="button"
                onClick={() => handleOpenStudyResourceLink(id, url)}
                className="text-left text-[15px] font-semibold leading-snug text-ink transition-colors hover:text-pri_mint_darker hover:underline cursor-pointer"
            >
                {title}
            </button>
            {subtitle && (
                <p className="text-xs italic text-pri_navy_light">{subtitle}</p>
            )}
            {hasMeta && (
                <div className="flex flex-wrap items-center gap-1.5">
                    {totMarks && totMarks > 0 && (
                        <span className="rounded-md border border-hairline bg-canvas px-2 py-0.5 font-mono text-[11px] font-semibold text-pri_navy_main tnum">
                            {totMarks} marks
                        </span>
                    )}
                    {workingSolution && (
                        <Tag icon="/icons/solutionsIcon.svg" tooltip="solutions!" onClickUrl={workingSolution} />
                    )}
                    {videoSolution && (
                        <Tag icon="/icons/videoIcon.svg" tooltip="video solutions!" onClickUrl={videoSolution} />
                    )}
                </div>
            )}
        </div>
    );
};

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
                    <div className="flex items-center justify-start">
                        <button
                            type="button"
                            title={bookmarked ? "Remove bookmark" : "Bookmark"}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                e.preventDefault();
                                onToggleBookmark(studyResourceID, userID, !bookmarked);
                            }}
                            className={`w-10 h-10 rounded-xl border flex_center transition ease-in-out duration-150 hover:-translate-y-0.5 ${
                                bookmarked
                                    ? "bg-pri_gold_main/20 border-pri_gold_main"
                                    : "bg-white border-hairline hover:border-pri_gold_main hover:bg-pri_gold_main/5"
                            }`}
                        >
                            <Image
                                src={`${bookmarked ? '/icons/bookmarked.svg' : '/icons/bookmark.svg'}`}
                                alt="bookmark"
                                height={20}
                                width={20}
                            />
                        </button>
                    </div>)
            },
        },
        // Notes: topicNames.join(", ")
        {
            accessorKey: "resource",
            header: ({ column }) => headerCell(column, "Notes", true),
            cell: info => {
                const row = info.row.original as any;
                const topicNames = ('topicNames' in row && (row.topicNames as string).length > 0)
                    ? `Topics: ${row.topicNames as string}`
                    : null;
                return (
                    <ResourceTitleCell
                        id={row._id}
                        url={row.url}
                        title={row.resource as string}
                        subtitle={topicNames}
                    />
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
            const row = info.row.original as any;
            let videoSolution = null;
            let workingSolution = null;
            if (isYearlyPracticePaper(row)) {
                workingSolution = row.workingSolution;
                videoSolution = row.videoSolution;
            }
            return (
                <ResourceTitleCell
                    id={row._id}
                    url={row.url}
                    title={row.resource as string}
                    totMarks={row.totMarks as number | undefined}
                    workingSolution={workingSolution}
                    videoSolution={videoSolution}
                />
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
            const row = info.row.original as any;
            let videoSolution = null;
            let workingSolution = null;
            if (isTopicalPracticePaper(row)) {
                workingSolution = row.workingSolution;
                videoSolution = row.videoSolution;
            }
            return (
                <ResourceTitleCell
                    id={row._id}
                    url={row.url}
                    title={row.resource as string}
                    totMarks={row.totMarks as number | undefined}
                    workingSolution={workingSolution}
                    videoSolution={videoSolution}
                />
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

            const row = info.row.original as any;
            let workingSolution  = null;
            let videoSolution = null;
            let date = null;

            if ('workingSolution' in row){
                workingSolution = row.workingSolution as string;
            }
            if ('videoSolution' in row){
                videoSolution = row.videoSolution as string;
            }
            if ('date' in row){
                const currDate = row.date as Date;
                date = ("0" + currDate.getDate()).slice(-2) + "/" + ("0"+(currDate.getMonth()+1)).slice(-2) + "/" + ("0" + currDate.getFullYear()).slice(-2);
            }
            return (
            <div className="flex flex-col items-start gap-1 text-left" key={row._id+"_assessmentC"}>
                <div className="flex flex-wrap items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => {handleOpenStudyResourceLink(row._id, row.url)}}
                        className="text-left text-[15px] font-semibold leading-snug text-ink transition-colors hover:text-pri_mint_darker hover:underline cursor-pointer"
                    >
                        {info.getValue() as string}
                    </button>
                    {
                        workingSolution &&
                        <Tag icon="/icons/solutionsIcon.svg" tooltip="solutions!" onClickUrl={workingSolution}/>
                    }
                    {
                        videoSolution &&
                        <Tag icon="/icons/videoIcon.svg" tooltip="video solutions!" onClickUrl={videoSolution}/>
                    }
                </div>
                <p className="font-mono text-[11px] uppercase tracking-wide text-pri_navy_light">completed {date}</p>
            </div>
            );
        },
    },
    // Score
    ...(isOwnUser ? [{
        accessorKey: "scorePercent",
        header: ({ column }: { column: Column<any, any> }) => headerCell(column, "Score (%)", true),
        cell: (info: CellContext<any, any>) => {

            if (info.getValue()<0) return <span className="text-pri_navy_light">—</span>;

            const score = Number(info.getValue()) * 100;
            return (
                <span
                    key={info.row.original._id+"_scoreC"}
                    className="inline-flex items-center rounded-lg bg-pri_mint_main/10 px-2.5 py-1 font-mono text-sm font-bold text-pri_mint_darker tnum"
                >
                    {score.toFixed(1)}%
                </span>
            );
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
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            title="Remove"
                            className="tooltip flex_center h-9 w-9 rounded-lg border border-hairline bg-white text-pri_navy_light transition hover:border-pri_red_main hover:text-pri_red_main hover:bg-pri_red_main/5"
                            data-tooltip="remove"
                        >
                            <Image src='/icons/remove.svg' alt='remove' height={18} width={18} />
                        </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px] rounded-2xl border-hairline">
                        <DialogHeader>
                            <DialogTitle className="font-display text-xl font-extrabold text-ink">Remove this paper?</DialogTitle>
                            <DialogDescription className="text-ink_soft">
                                Your logged progress for it can't be restored.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-2">
                            <DialogClose asChild>
                                <div className="flex w-full items-center justify-end gap-2">
                                    <button className="rounded-xl border border-hairline bg-white px-4 py-2.5 text-sm font-semibold text-pri_navy_main transition hover:bg-canvas">
                                        Cancel
                                    </button>
                                    <button className="rounded-xl bg-pri_red_main px-4 py-2.5 text-sm font-bold text-white transition hover:bg-pri_red_dark" onClick={()=>onToggleStatus(studyResourceID, userID, date, false)}>
                                        Remove
                                    </button>
                                </div>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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

            const row = info.row.original as any;
            let workingSolution  = null;
            let videoSolution = null;

            if ('workingSolution' in row){
                workingSolution = row.workingSolution as string;
            }
            if ('videoSolution' in row){
                videoSolution = row.videoSolution as string;
            }
            return (
                <ResourceTitleCell
                    id={row._id}
                    url={row.url}
                    title={info.getValue() as string}
                    workingSolution={workingSolution}
                    videoSolution={videoSolution}
                />
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
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            title="Remove bookmark"
                            className="tooltip flex_center h-9 w-9 rounded-lg border border-hairline bg-white text-pri_navy_light transition hover:border-pri_red_main hover:text-pri_red_main hover:bg-pri_red_main/5"
                            data-tooltip="remove"
                        >
                            <Image src='/icons/remove.svg' alt='remove' height={18} width={18} />
                        </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px] rounded-2xl border-hairline">
                        <DialogHeader>
                            <DialogTitle className="font-display text-xl font-extrabold text-ink">Remove bookmark?</DialogTitle>
                            <DialogDescription className="text-ink_soft">
                                You can always add it back from Study Resources.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-2">
                            <DialogClose asChild>
                                <div className="flex w-full items-center justify-end gap-2">
                                    <button className="rounded-xl border border-hairline bg-white px-4 py-2.5 text-sm font-semibold text-pri_navy_main transition hover:bg-canvas">
                                        Cancel
                                    </button>
                                    <button className="rounded-xl bg-pri_red_main px-4 py-2.5 text-sm font-bold text-white transition hover:bg-pri_red_dark" onClick={()=>onToggleBookmark(studyResourceID, userID, false)}>
                                        Remove
                                    </button>
                                </div>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            );
        },
    }] : []),
];