"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

// Table Dependencies
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import ResourceCard from "@/components/shared/ResourceCard";
import {
  getNotesColumns,
  getYearlyColumns,
  getTopicalColumns,
} from "@/utils/tablecolumns";

// Server Actions
import {
  updateStatusStudyResource,
  updateBookmarkStudyResource,
} from "@/lib/actions/useractivity.actions";

// Toast Messages
import {
  completedToasts,
  incompleteToasts,
  bookmarkToasts,
  unbookmarkToasts,
} from "../../../constants";
import { quotes } from "../../../constants/quotes";
import { Loader2 } from "lucide-react";

interface StudyResourceSectionProps {
  userID: string | null;
  userName: string | null;
  resourceLevel: string;
  resourceSubject: string;
  resourceType: string;
  searchParams: { [key: string]: string };
  initialTableData: StudyResourceInterface[];
}

function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

function getSelectorFilters(
  resourceType: string,
  tableData: StudyResourceInterface[]
): SelectorFieldConfig[] {
  switch (resourceType) {
    case "Yearly":
      return [
        {
          id: "assessment",
          placeholder: "Filter Assessment",
          options: Array.from(
            new Set(tableData?.map((item) => (item as any)["assessment"]))
          ),
        },
      ];
    case "Topical":
      return [
        {
          id: "topicName",
          placeholder: "Filter Topics",
          options: Array.from(
            new Set(tableData?.map((item) => (item as any)["topicName"]))
          ),
        },
      ];

    default:
      return [];
  }
}

const StudyResourceSection = ({
  userID,
  userName,
  resourceLevel,
  resourceSubject,
  resourceType,
  searchParams,
  initialTableData,
}: StudyResourceSectionProps) => {
  const { toast } = useToast();

  // The data to populate the table
  const [tableData, setTableData] =
    useState<StudyResourceInterface[]>(initialTableData);

  const [randomQuoteIndex, setRandomQuoteIndex] = useState(0);

  useEffect(() => {
    setRandomQuoteIndex(getRandomInt(0, quotes.length - 1));
  }, []);

  // This sets the status of the study resource selected by user
  const onToggleStatus = async (
    studyResourceID: string,
    userID: string | null,
    date: Date,
    newStatus: boolean,
    score?: number | null
  ) => {
    // Only signed in users are allowed
    if (!userID) {
      toast({
        title: "Oops! You are not signed in",
        description: "Sign in/up to use this feature!",
      });
      return;
    }

    try {
      const response = await updateStatusStudyResource({
        userID,
        studyResourceID,
        resourceType,
        newStatus,
        date,
        score: score ?? -1,
      });

      if (!response) {
        toast({
          title: "Oh No!",
          description: "Failed to update status, please try again later!",
        });
        return;
      }

      // If the update is successful, toggle the status in the UI
      setTableData((prevData) =>
        prevData.map((item) => {
          if (item._id === studyResourceID) {
            return { ...item, status: newStatus } as PracticePaperInterface;
          }
          return item;
        })
      );
      const toastIndex = getRandomInt(0, 3);

      if (newStatus) {
        toast({
          title: completedToasts[toastIndex].title,
          description: completedToasts[toastIndex].desc,
        });
      } else {
        toast({
          title: incompleteToasts[toastIndex].title,
          description: incompleteToasts[toastIndex].desc,
        });
      }
    } catch (error) {
      toast({
        title: "Oh No!",
        description: "Failed to update status, please try again later!",
      });
      return;
    }
  };

  const onToggleBookmark = async (
    studyResourceID: string,
    userID: string | null,
    newBookmark: boolean
  ) => {
    // Only signed in users are allowed
    if (!userID) {
      toast({
        title: "Oops! You are not signed in",
        description: "Sign in/up to use this feature!",
      });
      return;
    }

    try {
      const response = await updateBookmarkStudyResource({
        userID,
        studyResourceID,
        newBookmark,
      });

      if (!response) {
        toast({
          description: "Failed to update bookmark, try again later!",
        });
        return;
      }

      // If the update is successful, toggle the status in the UI
      setTableData((prevData) =>
        prevData.map((item) => {
          if (item._id === studyResourceID) {
            return { ...item, bookmark: newBookmark } as PracticePaperInterface;
          }
          return item;
        })
      );

      const toastIndex = getRandomInt(0, 3);
      if (newBookmark) {
        toast({
          title: bookmarkToasts[toastIndex].title,
          description: bookmarkToasts[toastIndex].desc,
        });
      } else {
        toast({
          title: unbookmarkToasts[toastIndex].title,
          description: unbookmarkToasts[toastIndex].desc,
        });
      }
    } catch (error) {
      toast({
        title: "Oh No!",
        description: "Failed to update bookmark, please try again later!",
      });
      return;
    }
  };

  // Computed synchronously so the columns exist on first render — the DataTable
  // reads them immediately (e.g. to restore an `?assessment=` filter from the URL).
  const tableColumns = useMemo<ColumnDef<StudyResourceInterface>[]>(() => {
    if (resourceType === "Yearly") {
      return getYearlyColumns(onToggleStatus, onToggleBookmark, userID);
    } else if (resourceType === "Topical") {
      return getTopicalColumns(onToggleStatus, onToggleBookmark, userID);
    }
    return getNotesColumns(onToggleBookmark, userID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceType, userID]);

  return (
    <section className="flex flex-col items-center mb-4 p-4 min-h-screen w-full py-2 md:py-4">
      {resourceLevel && resourceSubject && resourceType ? (
        <div className="w-full px-2 md:px-6 flex_col_center">
          <div className="flex_col_center gap-4 w-full">
            <div className="bg-pri_bg_card p-4 rounded-lg shadow-dropdown text-center mb-2 px-4 max-w-[900px] flex_col_center gap-2 text-pri_navy_main text-sm">
              <p>{quotes[randomQuoteIndex].quote}</p>
              {"writer" in quotes[randomQuoteIndex] && (
                <p className="font-semibold">
                  - {quotes[randomQuoteIndex].writer}
                </p>
              )}
            </div>

            <DataTable
              columns={tableColumns}
              toHideColumns={
                resourceType === "Notes"
                  ? []
                  : ["bookmark", "status", "year", "assessment", "topicName"]
              }
              data={tableData}
              showStatusFilter={resourceType === "Notes" ? false : true}
              showBookmarkFilter={true}
              selectorFilters={getSelectorFilters(resourceType, tableData)}
              searchFilter="resource"
              searchPlaceholder="Search Resources ..."
              searchFilterStyles="bg-pri_mint_main hover:bg-pri_mint_dark h-10 w-full rounded-md px-4 py-2 text-white placeholder:text-white focus:outline-none ring-offset-background focus:ring-2 focus:ring-pri_mint_light focus:ring-offset-2"
              tableStyles="bg-pri_bg_card"
              selectBoxStyles="w-[200px] bg-pri_mint_main hover:bg-pri_mint_dark text-white ring-offset-background focus:outline-none ring-offset-background focus:ring-2 focus:ring-pri_mint_light focus:ring-offset-2"
              headerRowStyles="bg-pri_mint_dark"
              headerCellStyles="flex_center text-pri_navy_dark text-lg font-bold"
              dataRowStyles="transition ease-in-out delay-125 hover:bg-pri_bg_card2"
              displayGuide={false}
              userName={userName}
              maxRows={16}
              renderCard={(row) => (
                <ResourceCard
                  resource={row.original}
                  resourceType={resourceType}
                  userID={userID}
                  onToggleStatus={onToggleStatus}
                  onToggleBookmark={onToggleBookmark}
                />
              )}
            />
          </div>
        </div>
      ) : (
        // Render a CTA image
        <div className="py-4 flex_col_center gap-4">
          <Image
            className="rounded-full opacity-20"
            src="/images/pickContentCTA.webp"
            alt="icon"
            height={300}
            width={300}
          />
          <p className="text-slate-400 text-lg capitalize">
            Select Content To Begin!
          </p>
        </div>
      )}
    </section>
  );
};

export default StudyResourceSection;
