"use server";

import { StudyResource } from "../database/models/studyresource.model";
import { UserResourceInteractions } from "../database/models/resourceinteraction.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import mongoose from 'mongoose';

export async function updateStatusStudyResource(updateData: updateStatusStudyResourceParams) {
    try {
        await connectToDatabase();

        const { userID, resourceID, status } = updateData;
        const resourceObjectId = new mongoose.Types.ObjectId(resourceID);

        // Determine the resource type based on the resourceID
        // This part might need to be adjusted based on how you determine whether a resource is 'YearlyStudyResource' or 'TopicalStudyResource'
        const resourceType = await determineResourceType(resourceID);

        // Check if there's an existing UserResourceInteractions document
        const userResourceInteraction = await UserResourceInteractions.findOne({ 
            userID, 
            resourceType 
        });

        if (userResourceInteraction) {

            // If the document exists, update the completedArray based on the status
            if (status) {
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
                await UserResourceInteractions.create({
                    userId: userID,
                    resourceType,
                    likesArray: [],
                    completedArray: [resourceObjectId],
                });
            }
        }
            
    } catch (error) {
        handleError(error);
    }
}

async function determineResourceType(resourceID: string): Promise<'YearlyStudyResource' | 'TopicalStudyResource' | ''> {
    try {

        // convert to MongoDB ID type
        const resourceObjectId = new mongoose.Types.ObjectId(resourceID);
        const resource = await StudyResource.findById(resourceObjectId);
    
        if (!resource) {
            throw new Error(`Resource with ID ${resourceID} not found`);
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
    
        // Find the UserResourceInteractions document for the specified user and resource type
        const userResourceInteraction = await UserResourceInteractions.findOne({
            userID,
            resourceType
        });
        
        // Handle case where there is no document found for the user and resource type
        // This could mean the user has not completed any resources of this type
        if (!userResourceInteraction) {    
            return [];
        }
    
        // Convert the ObjectId array to a string array
        const completedResourceIDs = userResourceInteraction.completedArray.map((id: mongoose.Types.ObjectId)=> id.toString());

        return completedResourceIDs;
    }
    catch (error) {
        handleError(error);
        return []; // Return an empty array or suitable error response
    }
  }
