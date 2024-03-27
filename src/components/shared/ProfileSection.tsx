
type ProfileSectionProps = {
    resourceObjects
}

import { getStatusStudyResource, getBookmarksStudyResource } from '@/lib/actions/useractivity.actions';
import { getStudyResourceByID } from '@/lib/actions/studyresource.actions';

const ProfileSection = async ({resourceObjects} : ProfileSectionProps) => {


    return (
        <div className="flex_col_center gap-2">

            {resourceObjects &&
            resourceObjects.map((resourceObject, index) => 
                <div key={"resouce_"+index} className="italic">
                    {resourceObject && resourceObject.title}
                </div>
                
                )}

        </div>
    )
}

export default ProfileSection