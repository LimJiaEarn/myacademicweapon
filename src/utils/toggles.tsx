import { incrementStudyResourceClicks } from '@/lib/actions/studyresource.actions';



export const handleOpenStudyResourceLink = async (resourceId : string, resourceUrl : string)=> {

    try {
        const parsed = new URL(resourceUrl);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return;
    } catch { return; }

    window.open(resourceUrl, '_blank', 'noopener,noreferrer');

    const result = await incrementStudyResourceClicks(resourceId);
}