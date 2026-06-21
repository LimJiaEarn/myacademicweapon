import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import {
  getUserByUsername,
  getUserByClerkId,
} from "@/lib/actions/user.actions";
import { getFormattedProfileData } from "@/lib/services/profile.service";
import LinkButton from "@/components/shared/LinkButton";
import Image from "next/image";
import UserAbout from "@/components/shared/UserAbout";
import UserProfile from "@/components/shared/UserProfile";
import { Metadata } from "next";
import Reminders from "@/components/shared/Reminders";
import { CalendarDays, Quote } from "lucide-react";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await currentUser();
  const { username } = await params;
  const currentUserProfileObject: UserObject = await getUserByUsername(
    username
  );
  if (!currentUserProfileObject) {
    return {
      title: "Invalid User",
      robots: { index: false },
    };
  }
  const currentSignedInUserObject: UserObject = user
    ? await getUserByClerkId(user.id)
    : null;
  const isOwnUser: boolean =
    currentSignedInUserObject &&
    currentSignedInUserObject._id === currentUserProfileObject._id;

  return {
    title: `${
      isOwnUser
        ? "Your Profile"
        : currentUserProfileObject?.firstName + "'s Profile"
    }`,
    robots: { index: false },
  };
}

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const user = await currentUser();

  const currentUserProfileObject: UserObject = await getUserByUsername(
    username
  );
  if (!currentUserProfileObject) throw new Error("Invalid User");

  const currentSignedInUserObject: UserObject = user
    ? await getUserByClerkId(user.id)
    : null;
  const userID: string = currentUserProfileObject._id as string; // this is the mongoDB id
  const isOwnUser: boolean =
    currentSignedInUserObject &&
    currentSignedInUserObject._id === currentUserProfileObject._id;

  const formattedJoinDate = new Date(
    currentUserProfileObject.joinDate
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Get user data
  const {
    simplifiedCompletedResourceObjects,
    simplifiedBookmarkedResourceObjects,
  } = await getFormattedProfileData(currentUserProfileObject._id as string);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-2 md:px-4 py-2">

      {/* ── Hero identity band ─────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl bg-pri_navy_darker text-white shadow-hero reveal">
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-pri_mint_main/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-12 bottom-[-7rem] h-72 w-72 rounded-full bg-pri_gold_main/20 blur-3xl" aria-hidden />

        <div className="relative flex flex-col gap-5 p-6 md:p-8 sm:flex-row sm:items-center">
          {/* Avatar with gradient ring */}
          <div className="shrink-0">
            <div className="rounded-2xl bg-gradient-to-br from-pri_gold_main to-pri_mint_main p-[3px] shadow-lg">
              <Image
                src={currentUserProfileObject?.photo || "/images/placeholderDP.webp"}
                alt="profile pic"
                height={112}
                width={112}
                className="block rounded-[14px]"
              />
            </div>
          </div>

          {/* Identity */}
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-pri_mint_lighter">
              {isOwnUser ? "Your profile" : "Profile"}
            </p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              {currentUserProfileObject?.firstName} {currentUserProfileObject?.lastName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {currentUserProfileObject?.level && (
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                  {currentUserProfileObject.level}
                </span>
              )}
              {currentUserProfileObject?.school && (
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                  {currentUserProfileObject.school}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-white/60">
                <CalendarDays className="h-4 w-4" /> joined {formattedJoinDate}
              </span>
            </div>
          </div>

          {/* Actions */}
          {isOwnUser && (
            <div className="flex flex-row gap-2 sm:flex-col lg:flex-row">
              <LinkButton
                buttonMsg="Edit Account"
                buttonMsgClass="text-white text-sm font-bold"
                buttonColorClass="bg-pri_mint_main hover:bg-pri_mint_dark px-4 py-2 shadow-mint"
                linksTo={`/profile/${username}/edit`}
              />

              <SignOutButton>
                <LinkButton
                  buttonMsg="Sign Out"
                  buttonMsgClass="text-white text-sm font-bold"
                  buttonColorClass="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2"
                  linksTo={`/`}
                />
              </SignOutButton>
            </div>
          )}
        </div>
      </header>

      {/* ── Body: sidebar + main ───────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5 lg:flex-row">

        {/* Sidebar */}
        <aside className="flex w-full flex-col gap-4 md:gap-5 lg:max-w-[340px]">
          <div className="aw-card p-5 reveal" style={{ ["--d" as any]: "80ms" }}>
            <UserAbout
              isOwnUser={isOwnUser}
              username={username}
              currentUserProfileObject={currentUserProfileObject}
            />
          </div>

          {isOwnUser && (
            <div className="aw-card p-5 reveal" style={{ ["--d" as any]: "140ms" }}>
              <Reminders userId={userID} />
            </div>
          )}

          <div className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-pri_mint_main/[0.07] to-white p-5 shadow-card reveal" style={{ ["--d" as any]: "200ms" }}>
            <Quote className="absolute -right-1 -top-1 h-12 w-12 text-pri_mint_main/15" aria-hidden />
            <p className="relative font-display text-lg font-bold leading-snug text-ink">
              Don&apos;t count the days;
              <br /> make the days count.
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <UserProfile
            currentUserProfileObject={currentUserProfileObject}
            isOwnUser={isOwnUser}
            userID={userID}
            simplifiedCompletedResourceObjects={
              simplifiedCompletedResourceObjects
            }
            simplifiedBookmarkedResourceObjects={
              simplifiedBookmarkedResourceObjects
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
