"use client";

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
import { BookOpen } from "lucide-react";

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
    <section className="w-full">
      {resourceLevel && resourceSubject && resourceType ? (
        <div className="mx-auto w-full max-w-[1500px] px-2 md:px-6">
          {/* Editorial epigraph */}
          <figure className="mx-auto mb-5 max-w-[760px] text-center reveal" style={{ ["--d" as any]: "60ms" }}>
            <blockquote className="font-display text-base md:text-lg italic leading-relaxed text-ink_soft">
              &ldquo;{quotes[randomQuoteIndex].quote}&rdquo;
            </blockquote>
            {"writer" in quotes[randomQuoteIndex] && (
              <figcaption className="mt-2 eyebrow text-pri_mint_darker">
                — {quotes[randomQuoteIndex].writer}
              </figcaption>
            )}
          </figure>

          <div className="reveal" style={{ ["--d" as any]: "120ms" }}>
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
              searchPlaceholder="Search resources…"
              headerCellStyles="flex items-center justify-start text-ink text-[12px] font-bold uppercase tracking-[0.14em]"
              dataCellStyles="align-middle"
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
        // Render a CTA when no subject / type chosen yet
        <div className="mx-auto mt-6 flex max-w-[560px] flex-col items-center gap-4 rounded-2xl border border-hairline bg-white px-6 py-12 text-center shadow-card">
          <div className="flex_center h-16 w-16 rounded-2xl bg-pri_mint_main/10 text-pri_mint_darker">
            <BookOpen className="h-8 w-8" />
          </div>
          <p className="font-display text-2xl font-extrabold text-ink">
            Pick a subject to begin
          </p>
          <p className="max-w-sm text-sm text-ink_soft">
            Choose a <span className="font-semibold text-pri_navy_main">subject</span> and{" "}
            <span className="font-semibold text-pri_navy_main">paper type</span> above to
            browse practice papers, notes and video walkthroughs.
          </p>
        </div>
      )}
    </section>
  );
};

export default StudyResourceSection;
