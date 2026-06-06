"use client";

import { useState } from "react";
import Image from "next/image";
import { CircleCheck } from "lucide-react";

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
  "w-10 h-10 rounded-xl border flex_center transition ease-in-out duration-150 hover:scale-[1.04]";

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
            ? "bg-pri_gold_light/20 border-pri_gold_light"
            : "bg-white border-pri_bg_card2 hover:bg-pri_bg_card"
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
            className={`${ICON_BTN} bg-pri_mint_main border-pri_mint_main text-white`}
          >
            <CircleCheck className="h-5 w-5" strokeWidth={2.5} />
          </button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                title="Mark as complete"
                className={`${ICON_BTN} bg-white border-pri_bg_card2 text-pri_navy_light hover:bg-pri_bg_card hover:text-pri_mint_darker`}
              >
                <CircleCheck className="h-5 w-5" strokeWidth={2} />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogDescription asChild>
                  <div>
                    <p className="font-semibold text-black text-lg">Track your score?</p>
                    <div className="grid gap-2 py-4">
                      <div className="grid grid-cols-4 items-center gap-1 h-10">
                        <p className="text-right col-start-1 col-span-1">Your Score:</p>
                        <div className="col-start-2 col-span-2 flex justify-start items-center gap-2">
                          <input
                            type="number"
                            className="bg-slate-100 h-8 ml-4 rounded-lg w-[50px] ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onChange={(e) => setScore(e.target.valueAsNumber)}
                          />
                          {totMarks && totMarks > 0 ? (
                            <p className="text-xl">/ {totMarks}</p>
                          ) : (
                            <p className="text-xl">%</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="font-semibold text-black text-lg">Share with your friends!</p>
                    <div className="w-4/5 flex_center gap-2 sm:gap-4 py-4">
                      <input
                        defaultValue={url}
                        readOnly
                        className="mx-2 h-4 underline text-blue-600 border-1 border-slate-200 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                      <button
                        onClick={handleCopy}
                        className="flex_center gap-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <p className="italic text-black text-sm">{copied ? "Copied" : "Copy"}</p>
                        <Image
                          src={copied ? "/icons/copied.svg" : "/icons/copy.svg"}
                          alt="icon"
                          height={20}
                          width={20}
                        />
                      </button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <div className="flex justify-evenly items-center gap-2">
                    <button
                      className="bg-green-200 rounded-lg px-2 py-1"
                      onClick={() => onToggleStatus(studyResourceID, userID, date, true)}
                    >
                      Save w/o marks!
                    </button>
                    <button
                      className="bg-emerald-300 rounded-lg px-2 py-1"
                      disabled={!score}
                      onClick={() => onToggleStatus(studyResourceID, userID, date, true, score)}
                    >
                      Save my marks!
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
