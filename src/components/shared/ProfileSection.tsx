
type ProfileSectionProps = {
    muserID: string;
    retrieveType: string;
}

import { getStatusStudyResource, getBookmarksStudyResource } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';

const ProfileSection = async ({muserID, retrieveType} : ProfileSectionProps) => {

    let topicalArray : string[] = [];
    let yearlyArray : string[] = [];

    // fetch respective user data
    if (retrieveType=="status"){
        topicalArray = await getStatusStudyResource({userID: muserID, resourceType:"Topical"}) || [];
        yearlyArray = await getStatusStudyResource({userID: muserID, resourceType:"Yearly"}) || [];
    }
    else if (retrieveType=="bookmark"){
        topicalArray = await getBookmarksStudyResource({userID: muserID, resourceType:"Topical"}) || [];
        yearlyArray = await getBookmarksStudyResource({userID: muserID, resourceType:"Yearly"}) || [];
    }


    // fetch resource data
    const resourceIDs : string[] = [...topicalArray, ...yearlyArray];

    const resourceObjectPromises = resourceIDs.map(async (resourceId) => {
        return getStudyResourceByID(resourceId);
    });

    const resourceObjects = await Promise.all(resourceObjectPromises);

    return (
        <div className="flex_col_center gap-2">

            {resourceObjects &&
            resourceObjects.map((resourceObject) => 
                <div>
                    {resourceObject && resourceObject._id}
                </div>
                
                )}

        </div>
    )
}

export default ProfileSection