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
    "inline-flex items-center justify-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl border text-sm font-bold transition ease-in-out duration-150";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-4 shadow-card transition ease-in-out duration-150 active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-card_hover
        ${completed ? "border-pri_mint_main/30 bg-gradient-to-br from-pri_mint_main/[0.06] to-white" : "border-hairline bg-white"}`}
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
            className="block text-left text-[16px] font-extrabold leading-snug text-ink hover:text-pri_mint_darker hover:underline cursor-pointer"
          >
            {title}
          </button>
          {isNotes && topicNames.length > 0 && (
            <p className="mt-1.5 text-[13px] italic text-pri_navy_light">Topics: {topicNames}</p>
          )}
          {!isNotes && totMarks && totMarks > 0 && (
            <span className="mt-2.5 flex w-fit items-center rounded-md border border-hairline bg-canvas px-2 py-0.5 font-mono text-[11px] font-semibold text-pri_navy_main tnum">
              {totMarks} marks
            </span>
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

      {/* Action buttons: Paper / Solutions / Video */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleOpenStudyResourceLink(resource._id, resource.url)}
          className={`${linkBtn} ${workingSolution || videoSolution ? "" : "col-span-2"} bg-pri_mint_main border-pri_mint_main text-white shadow-mint hover:bg-pri_mint_dark`}
        >
          <FileText className="h-4 w-4" />
          {isNotes ? "Open Notes" : "Open Paper"}
        </button>

        {workingSolution && (
          <button
            type="button"
            onClick={() => openExternal(workingSolution)}
            className={`${linkBtn} bg-white border-hairline text-pri_navy_main hover:border-pri_mint_main hover:text-pri_mint_darker`}
          >
            <Lightbulb className="h-4 w-4 text-pri_mint_darker" />
            Solutions
          </button>
        )}

        {videoSolution && (
          <button
            type="button"
            onClick={() => openExternal(videoSolution)}
            className={`${linkBtn} bg-white border-hairline text-pri_navy_main hover:border-pri_mint_main hover:text-pri_mint_darker`}
          >
            <Video className="h-4 w-4 text-pri_mint_darker" />
            Video
          </button>
        )}
      </div>
    </article>
  );
};

export default ResourceCard;
