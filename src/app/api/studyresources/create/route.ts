import { createStudyResource } from '@/lib/actions/studyresource.actions';

// Named export for handling POST requests
export async function POST(req: Request, res: Response) {

    try {
        // Parse the JSON body
        const data: StudyResourceInterface = await req.json();

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
