"use client";

import { useState } from "react";
import Image from "next/image";
import { CircleCheck, Check, Copy } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export type ToggleStatusFunction = (
  studyResourceID: string,
  userID: string | null,
  date: Date,
  newStatus: boolean,
  score?: number | null
) => void;

export type ToggleBookmarkFunction = (
  studyResourceID: string,
  userID: string | null,
  newBookmark: boolean
) => void;

interface ResourceActionsProps {
  resource: any; // the table row's original data
  userID: string | null;
  onToggleStatus: ToggleStatusFunction;
  onToggleBookmark: ToggleBookmarkFunction;
  /** Notes have no completion tracking — render bookmark only */
  showStatus?: boolean;
}

const ICON_BTN =
  "w-10 h-10 rounded-xl border flex_center transition ease-in-out duration-150 hover:-translate-y-0.5";

/**
 * The bookmark + completion controls for a study resource, shared by the
 * resource cards. Marking a paper complete opens a dialog to optionally log a score.
 */
const ResourceActions = ({
  resource,
  userID,
  onToggleStatus,
  onToggleBookmark,
  showStatus = true,
}: ResourceActionsProps) => {
  const studyResourceID = resource._id as string;
  const url = resource.url as string;
  const bookmarked = resource.bookmark as boolean;
  const status = resource.status as boolean;
  const totMarks = resource.totMarks as number | undefined;

  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const date = new Date();

  const handleCopy = () => {
    const inputBox = document.createElement("input");
    document.body.appendChild(inputBox);
    inputBox.value = url;
    inputBox.select();
    document.execCommand("copy");
    document.body.removeChild(inputBox);
    setCopied(true);
  };

  return (
    <div className="flex items-center gap-2" key={studyResourceID + "_actions"}>
      {/* Bookmark */}
      <button
        type="button"
        title={bookmarked ? "Remove bookmark" : "Bookmark"}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onToggleBookmark(studyResourceID, userID, !bookmarked);
        }}
        className={`${ICON_BTN} ${
          bookmarked
            ? "bg-pri_gold_main/20 border-pri_gold_main"
            : "bg-white border-hairline hover:border-pri_gold_main hover:bg-pri_gold_main/5"
        }`}
      >
        <Image
          src={bookmarked ? "/icons/bookmarked.svg" : "/icons/bookmark.svg"}
          alt="bookmark"
          height={20}
          width={20}
        />
      </button>

      {/* Completion */}
      {showStatus &&
        (status ? (
          <button
            type="button"
            title="Mark as incomplete"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleStatus(studyResourceID, userID, date, false);
            }}
            className={`${ICON_BTN} bg-pri_mint_main border-pri_mint_main text-white shadow-mint`}
          >
            <CircleCheck className="h-5 w-5" strokeWidth={2.5} />
          </button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                title="Mark as complete"
                className={`${ICON_BTN} bg-white border-hairline text-pri_navy_light hover:border-pri_mint_main hover:text-pri_mint_darker hover:bg-pri_mint_main/5`}
              >
                <CircleCheck className="h-5 w-5" strokeWidth={2} />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[440px] rounded-2xl border-hairline">
              <DialogHeader>
                <DialogDescription asChild>
                  <div>
                    <p className="font-display text-2xl font-extrabold text-ink">
                      Mark complete
                    </p>
                    <p className="mt-1 text-sm text-ink_soft">
                      Log your score to track progress — optional, and only you
                      can see it.
                    </p>

                    {/* Score input */}
                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-hairline bg-canvas p-3">
                      <span className="text-sm font-semibold text-pri_navy_main">
                        Your score
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="0"
                          className="h-10 w-20 rounded-lg border border-hairline bg-white text-center font-mono text-lg font-bold text-ink tnum ring-offset-background focus:outline-none focus:ring-2 focus:ring-pri_mint_main/40 focus:border-pri_mint_main"
                          onChange={(e) => setScore(e.target.valueAsNumber)}
                        />
                        <span className="font-mono text-lg font-bold text-pri_navy_light">
                          {totMarks && totMarks > 0 ? `/ ${totMarks}` : "%"}
                        </span>
                      </div>
                    </div>

                    {/* Share */}
                    <p className="mt-5 text-sm font-semibold text-pri_navy_main">
                      Share with your friends
                    </p>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-hairline bg-canvas p-1.5">
                      <input
                        defaultValue={url}
                        readOnly
                        className="h-9 min-w-0 flex-1 truncate rounded-lg bg-transparent px-2 text-sm text-pri_navy_light focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-hairline px-3 py-2 text-sm font-semibold text-pri_navy_main transition hover:border-pri_mint_main hover:text-pri_mint_darker"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-pri_mint_main" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2 sm:gap-2">
                <DialogClose asChild>
                  <div className="flex w-full items-center justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-hairline bg-white px-4 py-2.5 text-sm font-semibold text-pri_navy_main transition hover:bg-canvas"
                      onClick={() =>
                        onToggleStatus(studyResourceID, userID, date, true)
                      }
                    >
                      Save without marks
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-pri_mint_main px-4 py-2.5 text-sm font-bold text-white shadow-mint transition hover:bg-pri_mint_dark disabled:opacity-40 disabled:shadow-none"
                      disabled={!score}
                      onClick={() =>
                        onToggleStatus(studyResourceID, userID, date, true, score)
                      }
                    >
                      Save my marks
                    </button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
    </div>
  );
};

export default ResourceActions;
