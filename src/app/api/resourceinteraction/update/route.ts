import { NextApiRequest, NextApiResponse } from 'next';
import { updateStatusStudyResource } from '@/lib/actions/resourceinteraction.actions'; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Type the entire req.body and then destructure
            const { userID, resourceID, status }: updateStatusStudyResourceParams = req.body;

            // Call the updateStatusStudyResource function with the extracted data
            await updateStatusStudyResource({ userID, resourceID, status });

            // Send a success response
            res.status(200).json({ message: 'Resource status updated successfully' });
        } catch (error) {
            console.error('Failed to update resource status:', error);
            res.status(500).json({ error: 'Failed to update resource status' });
        }
    } else {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
