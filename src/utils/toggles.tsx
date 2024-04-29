import { incrementStudyResourceClicks } from '@/lib/actions/studyresource.actions';



export const handleOpenStudyResourceLink = async (resourceId : string, resourceUrl : string)=> {

    window.open(resourceUrl, '_blank');

    const result = await incrementStudyResourceClicks(resourceId);
}