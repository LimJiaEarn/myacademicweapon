import { incrementStudyResourceClicks } from '@/lib/actions/studyresource.actions';



export const handleOpenStudyResourceLink = (resourceId : string, resourceUrl : string)=> {

    try {
        const parsed = new URL(resourceUrl);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return;
    } catch { return; }

    window.open(resourceUrl, '_blank', 'noopener,noreferrer');

    // Fire-and-forget analytics — never block or fail the open
    void incrementStudyResourceClicks(resourceId).catch(() => {});
}