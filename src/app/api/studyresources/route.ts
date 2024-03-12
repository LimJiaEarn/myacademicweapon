// NOT SURE WHY THIS DOES NOT WORK

// import { NextApiRequest, NextApiResponse } from 'next';
// import { createStudyResource } from '@/lib/actions/studyresource.actions';

// // Named export for handling POST requests
// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     console.log("Inside POST handler function of study resource create");

//     try {
        
//         const data: StudyResourceData = req.body; // Ensure StudyResourceData type is correctly imported
        
//         console.log(typeof(req.body));
        
        
//         const newResource = await createStudyResource(data);
//         res.status(201).json(newResource);
//     } catch (error: any) { // Consider using a more specific error type if available
//         console.error(error); // Log the error for debugging
//         res.status(500).json({ error: error.message });
//     }
// }


import { createStudyResource } from '@/lib/actions/studyresource.actions';


/* CURL command to test
curl -XPOST -H "Content-type: application/json" -d "{\"status\": true, \"url\": \"https://example.com/resource\", \"level\": \"Secondary\", \"topicName\": \"Mathematics\", \"assessment\": \"TYS\"}" "http://localhost:3000/api/studyresources"
*/

// Named export for handling POST requests
export async function POST(req: Request, res: Response) {
    console.log("Inside POST handler function of study resource create");

    try {
        // Parse the JSON body
        const data: StudyResourceInterface = await req.json();
        console.log(typeof(data), data);

        const newResource = await createStudyResource(data);

        // Construct a new Response object with a 201 status code
        return new Response(JSON.stringify(newResource), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        console.error(error); // Log the error for debugging

        // Construct a new Response object for the error case
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
