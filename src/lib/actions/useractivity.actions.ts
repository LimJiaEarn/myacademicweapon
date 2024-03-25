"use server";

import { StudyResource } from "../database/models/studyresource.model";
import { UserActivity } from "../database/models/useractivity.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import mongoose from 'mongoose';

// Utility function
async function determineResourceType(resourceID: string): Promise<'Yearly' | 'Topical' | ''> {
    try {

        // convert to MongoDB ID type
        const resourceObjectId = new mongoose.Types.ObjectId(resourceID);
        const resource = await StudyResource.findById(resourceObjectId);
    
        if (!resource) {
            return ''
            // throw new Error(`Resource with ID ${resourceID} not found`);
        }

        if (resource.type === 'Topical')
            return 'Topical';
        else
            return 'Yearly';
        
        }
    catch (error) {
        console.log(error);
        return '';
    }
}

// Status CRU operatons
export async function updateStatusStudyResource(updateData: updateStatusStudyResourceParams) {
    try {
        await connectToDatabase();

        const { userID, studyResourceID, newStatus } = updateData;

        
        const userObjectId = new mongoose.Types.ObjectId(userID);
        const resourceObjectId = new mongoose.Types.ObjectId(studyResourceID);

        // Determine the resource type based on the resourceID
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
            if (newStatus) {
                // If the document does not exist and status is true, create a new document
                await UserActivity.create({
                    userObjectId: userObjectId,
                    resourceType,
                    likesArray: [],
                    bookmarkedArray: [],
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

// Bookmark CRU operatons
export async function updateBookmarkStudyResource(updateData: updateBookmarkStudyResourceParams) {
    try {
        await connectToDatabase();

        const { userID, studyResourceID, newBookmark } = updateData;

        
        const userObjectId = new mongoose.Types.ObjectId(userID);
        const resourceObjectId = new mongoose.Types.ObjectId(studyResourceID);

        // Determine the resource type based on the resourceID
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

            // If the document exists, update the bookmarkedArrayArray based on the status
            if (newBookmark) {
                // Add resourceID to bookmarkedArrayArray if it's not already there
                if (!userResourceInteraction.bookmarkedArray.includes(resourceObjectId)) {
                    userResourceInteraction.bookmarkedArray.push(resourceObjectId);
                }
            }
            else {
                // Remove resourceID from bookmarkedArrayArray if unbookmark
                userResourceInteraction.bookmarkedArray = userResourceInteraction.bookmarkedArray.filter((id: mongoose.Types.ObjectId) => !id.equals(resourceObjectId));
            }
            await userResourceInteraction.save();
        }
        else{
            if (newBookmark) {
                // If the document does not exist and status is true, create a new document
                await UserActivity.create({
                    userObjectId: userObjectId,
                    resourceType,
                    likesArray: [],
                    bookmarkedArray: [resourceObjectId],
                    completedArray: [],
                });
            }
        }

        return true;
            
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getBookmarksStudyResource(params: getBookmarkStudyResourceParams) {
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
        const bookmarkedResourceIDs : string[] = userResourceInteraction.bookmarkedArray.map((id: mongoose.Types.ObjectId)=> id.toString());

        return bookmarkedResourceIDs;
    }
    catch (error) {
        handleError(error);
        return []; // Return an empty array or suitable error response
    }
}
