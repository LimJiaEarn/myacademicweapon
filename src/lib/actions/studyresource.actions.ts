"use server";

import { revalidatePath } from "next/cache";
import { StudyResource, TopicalPracticePaper, YearlyPracticePaper } from "@/lib/database/models/studyresource.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "../utils";
import mongoose from 'mongoose';


/*
Create Function:
  This function determines the type of study resource to
  create based on the type field in the data object.
  It creates a new resource using the appropriate model
  (StudyResource, TopicalPracticePaper, or YearlyPracticePaper).
*/
export async function createPracticePaper(data : CreatePracticePaperInterface) {

  try {

    await connectToDatabase();

    let newResource;
    if (data.type === 'Topical') {
      newResource = await TopicalPracticePaper.create(data);
    } else if (data.type === 'Yearly') {
      newResource = await YearlyPracticePaper.create(data);
    } else {
      newResource = await StudyResource.create(data);
    }

    return JSON.parse(JSON.stringify(newResource));
  } catch (error) {
    handleError(error);
  }

}

/*
  Read Function with Filters:
  The getStudyResources function allows you to filter study resources
  by level and assessment.
  This function assumes that all resources,
  including those created with the base StudyResource model
  might have an assessment field.
*/
export async function getStudyResources({ type, level, subject }: GetStudyResourcesParams) {
  try {

    await connectToDatabase();

    // Define query with a type that includes both level and an optional assessment
    let query: GetStudyResourcesParams = { type, level, subject };
    const resources = await StudyResource.find(query);

    return resources.map(resource => JSON.parse(JSON.stringify(resource)));
  }
  catch (error) {
    handleError(error);
  }
}

export async function getStudyResourceByID(resourceId : string) {
  try {

    await connectToDatabase();

    const resourceObjectId = new mongoose.Types.ObjectId(resourceId);

    const resource = await StudyResource.findById(resourceObjectId);


    if (!resource){
      return null;
    }

    return resource;


  }
  catch (error) {
    console.log(error);
    return null;
  }
}

/*
  Update and Delete Functions:
  These functions are straightforward.
  They find a resource by its ID and then update or delete it, respectively
  The deleteStudyResource function also calls revalidatePath to trigger
  revalidation of the list of resources on the frontend,
  assuming you're using Next.js ISR (Incremental Static Regeneration)
  or a similar strategy for data fetching and rendering.
*/
export async function updateStudyResource(resourceId : string, updateData : UpdateStudyResourceParams) {
  try {
    await connectToDatabase();

    const updatedResource = await StudyResource.findByIdAndUpdate(resourceId, updateData, { new: true });
    
    if (!updatedResource) throw new Error("StudyResource update failed");

    return JSON.parse(JSON.stringify(updatedResource));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteStudyResource(resourceId : string) {
  try {
    await connectToDatabase();

    const deletedResource = await StudyResource.findByIdAndDelete(resourceId);
    if (!deletedResource) throw new Error("StudyResource not found");

    revalidatePath("/resources");

    return JSON.parse(JSON.stringify(deletedResource));
  } catch (error) {
    handleError(error);
  }
}
