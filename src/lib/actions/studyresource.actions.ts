"use server";

import { revalidatePath } from "next/cache";
import { StudyResource, TopicalStudyResource, YearlyStudyResource } from "../database/models/studyresource.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";


/*
Create Function:
  This function determines the type of study resource to
  create based on the type field in the data object.
  It creates a new resource using the appropriate model
  (StudyResource, TopicalStudyResource, or YearlyStudyResource).
*/
export async function createStudyResource(data : StudyResourceData) {

  console.log("Inside createStudyResource with data:");
  console.log(data)


  try {
    await connectToDatabase();

    let newResource;
    if (data.type === 'TopicalStudyResource') {
      newResource = await TopicalStudyResource.create(data);
    } else if (data.type === 'YearlyStudyResource') {
      newResource = await YearlyStudyResource.create(data);
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
export async function getStudyResources({ level, assessment }: GetStudyResourcesParams) {
  try {
    await connectToDatabase();

    // Define query with a type that includes both level and an optional assessment
    let query: GetStudyResourcesParams = { level };

    // If assessment is provided, add it to the query
    if (assessment) {
      query.assessment = assessment;
    }

    const resources = await StudyResource.find(query);

    return resources.map(resource => JSON.parse(JSON.stringify(resource)));
  }
  catch (error) {
    handleError(error);
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
