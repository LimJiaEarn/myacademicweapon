// import { getStudyResources } from '@/lib/actions/studyresource.actions';

// // In /app/api/studyresources/get/route.ts
// export async function POST(req: Request, res: Response) {
//     console.log("Inside POST handler function for fetching study resources");

//     try {
//         const { type, level, subject }: GetStudyResourcesParams = await req.json();
//         console.log("Request Params:", { type, level, subject }); // Log the incoming parameters

//         const resources = await getStudyResources({ type, level, subject });
//         console.log("Fetched Resources:", resources); // Log the fetched resources

//         return new Response(JSON.stringify(resources), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     } catch (error: any) {
//         console.error("Error fetching resources:", error); // Log detailed error
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 500,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }
// }
