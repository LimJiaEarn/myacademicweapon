"use client"

import Tab from "@/components/shared/Tab";
import { useState } from 'react';
import Pie from '@/components/shared/Piechart';
import { updateUserByUserID } from '@/lib/actions/user.actions';
import { useToast } from '../ui/use-toast';
import { CircleCheckBig, Bookmark, Target, Layers, Check, X, Pencil } from "lucide-react";

interface UserProfileProps {
  currentUserProfileObject: UserObject;
  isOwnUser : boolean;
  userID : string;
  simplifiedCompletedResourceObjects : ISummarisedPracticePaper[];
  simplifiedBookmarkedResourceObjects : ISummarisedPracticePaper[];
}


const UserProfile = ({currentUserProfileObject, isOwnUser, userID, simplifiedCompletedResourceObjects, simplifiedBookmarkedResourceObjects} : UserProfileProps) => {
    
    // Set it as states so we can sync the data changes to other cards
    const [completedTableData, setCompletedTableData] = useState<ISummarisedPracticePaper[]>(simplifiedCompletedResourceObjects);
    const [bookmarkTableData, setBookmarkTableData] = useState<ISummarisedPracticePaper[]>(simplifiedBookmarkedResourceObjects);
    const { toast } = useToast();

    const [goal, setGoal] = useState<number>(currentUserProfileObject.goal);
    const [goal2, setGoal2] = useState<number | null>(currentUserProfileObject.goal);
    const [editGoal, setEditGoal] = useState<boolean>(false);
    
    const updateGoal = async () => {
      
      setGoal(goal2 ? goal2 : 0);
      try{
        await updateUserByUserID(currentUserProfileObject._id, {...currentUserProfileObject, goal: goal2 ? goal2 : 0});
        toast({
            description:"Goal Updated!"
        })
    }
    catch (error){
        toast({
            description:"Encountered error in updating goal. Try again later!"
        })
    }
      
      setEditGoal(false)
    }


    const completed = completedTableData.length;
    const bookmarks = bookmarkTableData.length;
    const percentShade = goal===0 ? 0 : Number(Math.min(100, (completed/goal) * 100).toFixed(1));
    const data : number[] = [percentShade, 100 - Number(percentShade)];
    // Mint progress ring; gold celebration when the goal is reached.
    const ringColors = percentShade === 100
      ? ['hsl(49.3, 99%, 55%)', 'hsla(49.3, 99%, 55%, 0.12)']
      : ['hsl(177.4, 76.9%, 42%)', 'hsla(177.4, 76.9%, 42%, 0.12)'];
    const radius = 70;
    const hole = 62;

    const completedRecords: Record<string, number> = {};

    completedTableData?.forEach((paper) => {
      completedRecords[paper.subject] = (completedRecords[paper.subject] || 0) + 1;
    });

    const subjectCount = Object.keys(completedRecords).length;
    const maxCompleted = Math.max(1, ...Object.values(completedRecords));

    const statTiles = [
      { label: "Completed", value: String(completed), Icon: CircleCheckBig, bg: "bg-pri_mint_main/10", fg: "text-pri_mint_darker" },
      { label: "Bookmarks", value: String(bookmarks), Icon: Bookmark, bg: "bg-pri_gold_main/20", fg: "text-yellow-600" },
      { label: "Goal", value: goal > 0 ? `${percentShade}%` : "—", Icon: Target, bg: "bg-pri_navy_main/10", fg: "text-pri_navy_main" },
      { label: "Subjects", value: String(subjectCount), Icon: Layers, bg: "bg-pri_mint_main/10", fg: "text-pri_mint_darker" },
    ];


    return (
    <div className="grid gap-4 md:gap-5">

      {/* ── Stat row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {statTiles.map(({ label, value, Icon, bg, fg }, i) => (
          <div
            key={label}
            className="aw-card flex items-center gap-3 p-4 md:p-5 reveal"
            style={{ ["--d" as any]: `${i * 70}ms` }}
          >
            <div className={`flex_center h-11 w-11 shrink-0 rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${fg}`} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-2xl md:text-3xl font-bold leading-none text-ink tnum">
                {value}
              </p>
              <p className="mt-1.5 eyebrow text-pri_navy_light">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Goal ring + subject breakdown ────────────────────────── */}
      <div className="grid gap-4 md:gap-5 lg:grid-cols-2">

        {/* Goal Tracker */}
        <div className="aw-card relative p-5 md:p-6 reveal" style={{ ["--d" as any]: "120ms" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-ink">Goal Tracker</h2>
              {isOwnUser && (editGoal ?
                <div className="flex items-center gap-2">
                  <button
                    className="flex_center h-8 w-8 rounded-lg border border-hairline bg-white text-pri_red_main transition hover:bg-pri_red_main/5"
                    onClick={()=>{setGoal2(goal); setEditGoal(false)}}
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    className="flex_center h-8 w-8 rounded-lg bg-pri_mint_main text-white shadow-mint transition hover:bg-pri_mint_dark"
                    onClick={updateGoal}
                    title="Save"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
                :
                <button
                  className="flex_center h-9 w-9 rounded-lg border border-hairline bg-white text-pri_navy_main transition hover:border-pri_mint_main hover:text-pri_mint_darker"
                  onClick={()=>{setEditGoal(true)}}
                  title="Edit goal"
                >
                  <Pencil className="h-4 w-4" />
                </button>)
              }
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 md:gap-8">
              <div className="relative flex items-center justify-center">
                <Pie
                    data={goal > 0 ? data : [0, 100]}
                    colors={ringColors}
                    radius={radius}
                    hole={hole}
                    strokeWidth={1}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {percentShade===100 ?
                     <p className="text-center font-display font-extrabold gold_grad_text_2 text-2xl leading-tight">Goal<br/>Hit!</p>
                    :
                      <p className="text-center font-mono font-bold text-ink text-3xl tnum">{`${goal > 0 ? percentShade+"%" : '—'}`}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                  <div>
                    <p className="eyebrow text-pri_navy_light">{isOwnUser && "Your "}Goal</p>
                    {editGoal ?
                    <input
                      className="mt-1 w-[110px] rounded-lg border border-hairline bg-white px-2 py-1 text-center font-mono text-2xl font-bold text-ink tnum focus:outline-none focus:ring-2 focus:ring-pri_mint_main/40 focus:border-pri_mint_main"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onChange={(e) => {
                        if (e.target.value === "" || /^[0-9]+$/.test(e.target.value)) {
                          setGoal2(Number(e.target.value));
                        }
                      }}
                      value={goal2 ? goal2 : 0}
                    />
                    :
                    <p className="mt-1 font-mono text-3xl font-bold text-ink tnum">{goal}</p>}
                  </div>

                  <div>
                    <p className="eyebrow text-pri_navy_light">{isOwnUser && "Your "}Progress</p>
                    <p className="mt-1 font-mono text-3xl font-bold text-pri_mint_darker tnum">{completed}</p>
                  </div>
              </div>
            </div>
        </div>

        {/* Completed practices by subject */}
        <div className="aw-card p-5 md:p-6 reveal" style={{ ["--d" as any]: "180ms" }}>
            <h2 className="font-display text-lg font-extrabold text-ink mb-4">{isOwnUser && "Your "}Completed Practices</h2>

            {subjectCount === 0 ?
                <div className="flex flex-col items-center justify-center gap-1 py-8 text-center">
                  <p className="text-sm italic text-ink_soft">No completed papers yet</p>
                  <p className="text-xs text-pri_navy_light">Mark papers done to see your breakdown here.</p>
                </div>
                :
                <ul className="flex flex-col gap-3.5">
                {Object.entries(completedRecords).map(([subject, completions], index)=>{
                    const pct = (completions / maxCompleted) * 100;
                    return(
                        <li key={`${subject}_${completions}_${index}`}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold text-ink">{subject}</span>
                              <span className="font-mono text-pri_navy_light tnum">{completions}</span>
                            </div>
                            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-pri_mint_main/10">
                              <div className="h-full rounded-full bg-pri_mint_main" style={{ width: `${pct}%` }} />
                            </div>
                        </li>
                    )
                })}
            </ul>}
        </div>

      </div>

      {/* ── Tabbed ledger ────────────────────────────────────────── */}
      <div className="aw-card overflow-hidden reveal" style={{ ["--d" as any]: "240ms" }}>
        <Tab
            Tabs={[
                {
                    title:"Completed Papers",
                    titleIcon: "/icons/completed.svg",
                    data: completedTableData,
                    setData: setCompletedTableData,
                    sectionType: "Completed",
                },
                {
                    title:"Bookmarks",
                    titleIcon: "/icons/bookmarked.svg",
                    data: bookmarkTableData,
                    setData: setBookmarkTableData,
                    sectionType: "Bookmarks",
                },
            ]}
            isOwnUser= {isOwnUser}
            userID = {userID}
        />
      </div>

    </div>
  )
}

export default UserProfile