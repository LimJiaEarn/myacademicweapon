"use server";

import { StudyResource } from "../database/models/studyresource.model";
import { UserActivity } from "../database/models/useractivity.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import mongoose from 'mongoose';

export async function updateStatusStudyResource(updateData: updateStatusStudyResourceParams) {
    try {
        await connectToDatabase();

        const { userID, studyResourceID, newStatus } = updateData;
        
        const userObjectId = new mongoose.Types.ObjectId(userID);
        const resourceObjectId = new mongoose.Types.ObjectId(studyResourceID);

        // Determine the resource type based on the resourceID
        // This part might need to be adjusted based on how you determine whether a resource is 'YearlyStudyResource' or 'TopicalStudyResource'
        const resourceType = await determineResourceType(studyResourceID);

        if (resourceType==''){
            return false;
        }
        
        // Check if there's an existing UserActivity document
        const userResourceInteraction = await UserActivity.findOne({ 
            userObjectId, 
            resourceType 
        });

        if (userResourceInteraction) {

            // If the document exists, update the completedArray based on the status
            if (newStatus) {
                // Add resourceID to completedArray if it's not already there
                if (!userResourceInteraction.completedArray.includes(resourceObjectId)) {
                    userResourceInteraction.completedArray.push(resourceObjectId);
                }
            }
            else {
                // Remove resourceID from completedArray if the status is set to incomplete
                userResourceInteraction.completedArray = userResourceInteraction.completedArray.filter((id: mongoose.Types.ObjectId) => !id.equals(resourceObjectId));
            }
            await userResourceInteraction.save();
        }
        else{
            if (status) {
                // If the document does not exist and status is true, create a new document
                await UserActivity.create({
                    userObjectId: userObjectId,
                    resourceType,
                    likesArray: [],
                    completedArray: [resourceObjectId],
                });
            }
        }

        return true;
            
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function determineResourceType(resourceID: string): Promise<'YearlyStudyResource' | 'TopicalStudyResource' | ''> {
    try {

        // convert to MongoDB ID type
        const resourceObjectId = new mongoose.Types.ObjectId(resourceID);
        const resource = await StudyResource.findById(resourceObjectId);
    
        if (!resource) {
            return ''
            // throw new Error(`Resource with ID ${resourceID} not found`);
        }

        if (resource.type === 'TopicalStudyResource')
            return 'TopicalStudyResource';
        else
            return 'YearlyStudyResource';
        
        }
    catch (error) {
        console.log(error);
        return '';
    }
}


  export async function getStatusStudyResource(params: getStatusStudyResourceParams) {
    try {
        await connectToDatabase();
    
        const { userID, resourceType } = params;
        const userObjectId = new mongoose.Types.ObjectId(userID);

        // Find the UserActivity document for the specified user and resource type
        const userResourceInteraction = await UserActivity.findOne({
            userObjectId,
            resourceType
        });
        
        // Handle case where there is no document found for the user and resource type
        // This could mean the user has not completed any resources of this type
        if (!userResourceInteraction) {    
            return [];
        }
    
        // Convert the ObjectId array to a string array
        const completedResourceIDs : string[] = userResourceInteraction.completedArray.map((id: mongoose.Types.ObjectId)=> id.toString());

        return completedResourceIDs;
    }
    catch (error) {
        handleError(error);
        return []; // Return an empty array or suitable error response
    }
  }
