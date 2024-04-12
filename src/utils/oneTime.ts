"use server"

// This code was used to add totMarks to current data in MongoDB

import { connectToDatabase } from "@/lib/database/mongoose";
import { TopicalPracticePaper, YearlyPracticePaper } from "@/lib/database/models/studyresource.model";


export async function addPracticeNo() {
  try {
    // Connect to your database
    await connectToDatabase();

    // Update 'Yearly' study resources for 'Secondary' level to set 'totMarks' to 90
    await TopicalPracticePaper.updateMany(
      { level: 'Secondary', type: 'Topical' },
      { $set: { practice: 1 } }
    );

    // Update 'Yearly' study resources for 'JC' level to set 'totMarks' to 100
    await TopicalPracticePaper.updateMany(
      { level: 'JC', type: 'Topical' },
      { $set: { practice: 1 } }
    );

    console.log('Update complete.');
  } catch (error) {
    console.error('Error updating documents:', error);
  }
}

