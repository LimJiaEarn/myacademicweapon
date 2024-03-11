import { NextApiRequest, NextApiResponse } from 'next';
import { createStudyResource } from '@/lib/actions/studyresource.actions';

// Named export for handling POST requests
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("Inside POST handler function of study resource create");

    try {
        const data: StudyResourceData = req.body; // Ensure StudyResourceData type is correctly imported
        const newResource = await createStudyResource(data);
        res.status(201).json(newResource);
    } catch (error: any) { // Consider using a more specific error type if available
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
}
