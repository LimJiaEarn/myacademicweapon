// "use server"

// // This code was used to add totMarks to current data in MongoDB

// import { connectToDatabase } from "@/lib/database/mongoose";
// import { StudyResource, TopicalPracticePaper, YearlyPracticePaper } from "@/lib/database/models/studyresource.model";


// export async function addPracticeNo() {
//   try {
//     // Connect to your database
//     await connectToDatabase();

//     await TopicalPracticePaper.updateMany(
//       { level: 'Secondary', type: 'Topical' },
//       { $set: { practice: 1 } }
//     );

//     await TopicalPracticePaper.updateMany(
//       { level: 'JC', type: 'Topical' },
//       { $set: { practice: 1 } }
//     );


//     console.log('Update complete.');
//   } catch (error) {
//     console.error('Error updating documents:', error);
//   }
// }

// export async function addClicksAttribute() {
//   try {
//     // Connect to your database
//     await connectToDatabase();

//     // Update all documents in the StudyResource collection
//     const result = await StudyResource.updateMany(
//       { clicks: { $exists: false } }, // Filter to update only documents without the 'clicks' field
//       { $set: { clicks: 0 } } // Set 'clicks' to 0 where it does not exist
//     );

//   } catch (error) {
//     console.error('Error updating documents:', error);
//   }
// }

