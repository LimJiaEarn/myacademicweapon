"use client"

import Tab from "@/components/shared/Tab";


interface UserProfileProps {
  isOwnUser : boolean;
  userID : string;
  username : string;
  simplifiedCompletedResourceObjects : ISummarisedPracticePaper[];
  simplifiedBookmarkedResourceObjects : ISummarisedPracticePaper[];
}


const UserProfile = ({isOwnUser, userID, username, simplifiedCompletedResourceObjects, simplifiedBookmarkedResourceObjects} : UserProfileProps) => {
    // Get unique subjects
    const userAttemptedSubjects : Record<string, number> = {};
    simplifiedCompletedResourceObjects.forEach((curr : ISummarisedPracticePaper)=>{
      userAttemptedSubjects[curr.subject] = (userAttemptedSubjects[curr.subject] || 0) + 1;
    });
  
  
    return (
    <div className="grid row-auto gap-2">

      <div className="bg-pri_bg_card rounded-xl px-2 py-2 md:px-4 flex_col_center w-full">
            <h2 className="w-full px-2 text-md md:text-lg font-bold md:text-md text-pri_navy_dark text-start mb-2">{isOwnUser && "Your "}Completed Practices</h2>
            
            {Object.keys(userAttemptedSubjects).length === 0 ?
                <p className="w-full text-center italic text-pri_navy_main">0 completed papers found</p>
                :
                <ul className="w-full px-2 text-sm md:text-md md:text-md text-pri_navy_main">
                {Object.entries(userAttemptedSubjects).map(([subject, completions])=>{
                    return(
                        <li key={`${subject}_${completions}`} className="flex my-1">
                            <p className="font-semibold">{subject}</p>
                            <p className="font-bold ml-auto">{completions} <span className="italic font-normal">completed</span></p>
                        </li>
                    )
                })}

            </ul>}

        </div>

      <div className=" bg-pri_bg_card rounded-xl row-auto">
        <Tab
            Tabs={[
                {
                    title:"Completed Papers",
                    titleIcon: "/icons/completed.svg",
                    data: simplifiedCompletedResourceObjects,
                    sectionType: "Completed",
                },
                {
                    title:"Bookmarks",
                    titleIcon: "/icons/bookmarked.svg",
                    data: simplifiedBookmarkedResourceObjects,
                    sectionType: "Bookmarks",
                    
                },
            ]}
            isOwnUser= {isOwnUser}
            userID = {userID}
            username={username}
        />
      </div>


    </div>
  )
}

export default UserProfile