"use server"

// This code was used to add totMarks to current data in MongoDB

import { connectToDatabase } from "@/lib/database/mongoose";
import { YearlyPracticePaper } from "@/lib/database/models/studyresource.model";


export async function updateTotMarks() {
  try {
    // Connect to your database
    await connectToDatabase();

    // Update 'Yearly' study resources for 'Secondary' level to set 'totMarks' to 90
    await YearlyPracticePaper.updateMany(
      { level: 'Secondary', type: 'Yearly' },
      { $set: { totMarks: 90 } }
    );

    // Update 'Yearly' study resources for 'JC' level to set 'totMarks' to 100
    await YearlyPracticePaper.updateMany(
      { level: 'JC', type: 'Yearly' },
      { $set: { totMarks: 100 } }
    );

    console.log('Update complete.');
  } catch (error) {
    console.error('Error updating documents:', error);
  }
}

