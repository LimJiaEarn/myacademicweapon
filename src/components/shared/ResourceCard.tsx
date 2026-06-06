"use client";

import { FileText, Lightbulb, Video } from "lucide-react";

import { handleOpenStudyResourceLink } from "@/utils/toggles";
import ResourceActions, {
  ToggleStatusFunction,
  ToggleBookmarkFunction,
} from "@/components/shared/ResourceActions";

interface ResourceCardProps {
  resource: any; // the table row's original data
  resourceType: string; // "Notes" | "Topical" | "Yearly"
  userID: string | null;
  onToggleStatus: ToggleStatusFunction;
  onToggleBookmark: ToggleBookmarkFunction;
}

const openExternal = (url?: string) => {
  if (!url) return;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
  } catch {
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

const ResourceCard = ({
  resource,
  resourceType,
  userID,
  onToggleStatus,
  onToggleBookmark,
}: ResourceCardProps) => {
  const isNotes = resourceType === "Notes";

  const title = resource.resource as string;
  const topicNames = (resource.topicNames as string) || "";
  const totMarks = resource.totMarks as number | undefined;
  const workingSolution = resource.workingSolution as string | undefined;
  const videoSolution = resource.videoSolution as string | undefined;
  const completed = resource.status as boolean;

  const linkBtn =
    "inline-flex items-center gap-2 min-h-[38px] px-3 py-2 rounded-lg border text-sm font-bold transition ease-in-out duration-150";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-4 md:p-5 shadow-sm transition ease-in-out duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:border-pri_mint_light
        ${completed ? "border-pri_bg_card2 bg-gradient-to-t from-pri_bg_card to-white" : "border-pri_bg_card2 bg-white"}`}
    >
      {completed && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-pri_mint_main" aria-hidden />
      )}

      {/* Header: title + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => handleOpenStudyResourceLink(resource._id, resource.url)}
            className="text-left text-[15px] md:text-[17px] font-bold leading-snug text-pri_navy_darker hover:text-pri_mint_darker hover:underline cursor-pointer"
          >
            {title}
          </button>
          {isNotes && topicNames.length > 0 && (
            <p className="mt-1 text-[13px] italic text-pri_navy_light">Topics: {topicNames}</p>
          )}
        </div>

        <ResourceActions
          resource={resource}
          userID={userID}
          onToggleStatus={onToggleStatus}
          onToggleBookmark={onToggleBookmark}
          showStatus={!isNotes}
        />
      </div>

      {/* Meta pills */}
      {!isNotes && totMarks && totMarks > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-pri_bg_card2 bg-pri_bg_card px-2.5 py-1 text-[11.5px] font-bold text-pri_navy_dark">
            {totMarks} marks
          </span>
        </div>
      )}

      {/* Action buttons: Paper / Solutions / Video */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleOpenStudyResourceLink(resource._id, resource.url)}
          className={`${linkBtn} bg-pri_mint_main border-pri_mint_main text-white hover:bg-pri_mint_dark`}
        >
          <FileText className="h-[15px] w-[15px]" />
          {isNotes ? "Open Notes" : "Paper"}
        </button>

        {workingSolution && (
          <button
            type="button"
            onClick={() => openExternal(workingSolution)}
            className={`${linkBtn} bg-white border-pri_bg_card2 text-pri_navy_dark hover:bg-pri_bg_card`}
          >
            <Lightbulb className="h-[15px] w-[15px] text-pri_mint_darker" />
            Solutions
          </button>
        )}

        {videoSolution && (
          <button
            type="button"
            onClick={() => openExternal(videoSolution)}
            className={`${linkBtn} bg-white border-pri_bg_card2 text-pri_navy_dark hover:bg-pri_bg_card`}
          >
            <Video className="h-[15px] w-[15px] text-pri_mint_darker" />
            Video
          </button>
        )}
      </div>
    </article>
  );
};

export default ResourceCard;
