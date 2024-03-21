
// Import your server-side functionality
import { updateStatusStudyResource } from '@/lib/actions/useractivity.actions';

// Define the default exported function for handling requests
export async function POST(req: Request, res: Response) {

    try {
        // Type the entire req.body and then destructure
        const data: updateStatusStudyResourceParams = await req.json();
        const { userID, studyResourceID, status } = data;

        // Call the server-side function with the extracted data
        await updateStatusStudyResource({ userID, studyResourceID, status });

        // Send a success response
        return new Response(JSON.stringify("Success"), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error : any) {
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
