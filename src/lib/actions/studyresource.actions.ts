"use server";

import { unstable_cache, updateTag } from "next/cache";
import { StudyResource, Notes, TopicalPracticePaper, YearlyPracticePaper } from "@/lib/database/models/studyresource.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "../utils";
import mongoose from 'mongoose';
import { requireAuth } from "@/lib/authGuard";

/*
https://mongoosejs.com/docs/queries.html - Query Functions/Syntax

*/

/*
Create Function:
  This function determines the type of study resource to
  create based on the type field in the data object.
  It creates a new resource using the appropriate model
  (StudyResource, TopicalPracticePaper, or YearlyPracticePaper).
*/
export async function createPracticePaper(data : CreatePracticePaperInterface) {

  try {

    await requireAuth();
    await connectToDatabase();

    let newResource;
    if (data.type === 'Topical') {
      newResource = await TopicalPracticePaper.create(data);
    } else if (data.type === 'Yearly') {
      newResource = await YearlyPracticePaper.create(data);
    } else {
      newResource = await StudyResource.create(data);
    }

    updateTag("study-resources");

    return JSON.parse(JSON.stringify(newResource));
  } catch (error) {
    handleError(error);
  }

}

export async function createNote(data : CreateStudyNotesInterface) {

  try {

    await requireAuth();
    await connectToDatabase();

    const newResource = await Notes.create(data);

    updateTag("study-resources");

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
    let resources: any[];

    if (type === 'Yearly') {
      resources = await StudyResource.find(query).sort({ year: -1, schoolName: 1 }).lean();
    }
    else if (type==="Topical") {
      resources = await StudyResource.find(query).sort({ topicName: 1, practice: 1 }).lean();
    }
    else if (type === "Notes") {
      resources = await StudyResource.find(query).sort({ title: 1, note: 1 }).lean();
    }
    else{
      resources = await StudyResource.find(query).lean();
    }

    return JSON.parse(JSON.stringify(resources));
  }
  catch (error) {
    handleError(error);
  }
}

/*
  Cached read of the (effectively static) resource catalogue. Keyed per
  level/subject/type; invalidated by the create/update/delete actions below
  via the "study-resources" tag, with a 1h revalidate as a safety net.
*/
export async function getCachedStudyResources(params: GetStudyResourcesParams) {
  return unstable_cache(
    () => getStudyResources(params),
    ["study-resources", params.level, params.subject, params.type],
    { revalidate: 3600, tags: ["study-resources"] }
  )();
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
  They find a resource by its ID and then update or delete it, respectively,
  then expire the cached catalogue via updateTag("study-resources").
*/
export async function updateStudyResource(resourceId : string, updateData : UpdateStudyResourceParams) {
  try {
    await requireAuth();
    await connectToDatabase();

    const updatedResource = await StudyResource.findByIdAndUpdate(resourceId, updateData, { new: true });

    if (!updatedResource) throw new Error("StudyResource update failed");

    updateTag("study-resources");

    return JSON.parse(JSON.stringify(updatedResource));
  } catch (error) {
    handleError(error);
  }
}

export async function incrementStudyResourceClicks(resourceId : string) {
  try {
    await connectToDatabase();

    const resource = await StudyResource.findByIdAndUpdate(
      resourceId,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    return JSON.parse(JSON.stringify(resource));

  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteStudyResource(resourceId : string) {
  try {
    await requireAuth();
    await connectToDatabase();

    const deletedResource = await StudyResource.findByIdAndDelete(resourceId);
    if (!deletedResource) throw new Error("StudyResource not found");

    updateTag("study-resources");

    return JSON.parse(JSON.stringify(deletedResource));
  } catch (error) {
    handleError(error);
  }
}
