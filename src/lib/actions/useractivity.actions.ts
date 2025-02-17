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

        const { userID, resourceType, studyResourceID, newStatus, score, date } = updateData;
        
        const userObjectId = new mongoose.Types.ObjectId(userID);
        const resourceObjectId = new mongoose.Types.ObjectId(studyResourceID);
        
        let type : string;

        // Determine the resource type based on the resourceID
        if (!resourceType)
            type = await determineResourceType(studyResourceID);
        else
            type = resourceType

        if (type === '') {
            return false;
        }
        
        // Check if there's an existing UserActivity document
        let userResourceInteraction = await UserActivity.findOne({ userObjectId, type });

        if (userResourceInteraction) {
            // Find the index of the resource in the completedArray
            const resourceIndex = userResourceInteraction.completedArray.findIndex((item: any) => item.resourceObjectId.equals(resourceObjectId));

            if (newStatus) {
                // If marking as complete and the resource is not already in the completedArray
                if (resourceIndex === -1) {
                    userResourceInteraction.completedArray.push({ resourceObjectId, score: score ?? -1, date });
                } else {
                    // If the resource is already in the array, update the score
                    userResourceInteraction.completedArray[resourceIndex].score = score ?? -1;
                    userResourceInteraction.completedArray[resourceIndex].date = date;
                }
            } else {
                // If marking as incomplete, remove the resource from the completedArray
                if (resourceIndex !== -1) {
                    userResourceInteraction.completedArray.splice(resourceIndex, 1);
                }
            }
            await userResourceInteraction.save();
        } else {
            if (newStatus) {
                // If the document does not exist and status is true, create a new document with the resource in the completedArray
                await UserActivity.create({
                    userObjectId: userObjectId,
                    type: resourceType,
                    likesArray: [],
                    bookmarkedArray: [],
                    completedArray: [{ resourceObjectId, score: score ?? -1, date }],
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
            type : resourceType,
        });
        
        // Handle case where there is no document found for the user and resource type
        // This could mean the user has not completed any resources of this type
        if (!userResourceInteraction) {    
            return [];
        }

        // Convert the ObjectId array to a string array
        const completedResources = userResourceInteraction.completedArray.map((item: any) => ({
            resourceObjectId: item.resourceObjectId.toString(), // Convert ObjectId to String
            score: item.score // Keep the score as is
        }));

        return completedResources;
    }
    catch (error) {
        handleError(error);
        return []; // Return an empty array or suitable error response
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
            type: resourceType
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
            type: resourceType 
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
                    type: resourceType,
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

export async function getUserActivities(params: getStatusStudyResourceParams) {
    try {
        await connectToDatabase();

        const { userID, resourceType } = params;
        const userObjectId = new mongoose.Types.ObjectId(userID);

        // Find the UserActivity document for the specified user and resource type
        const userResourceInteraction = await UserActivity.findOne({
            userObjectId,
            type : resourceType,
        });
        
        // Handle case where there is no document found for the user and resource type
        // This could mean the user has not completed any resources of this type
        if (!userResourceInteraction) {    
            return [[], []];
        }

        // Convert the ObjectId array to a string array
        const completedResources = userResourceInteraction.completedArray.map((item: any) => ({
            resourceObjectId: item.resourceObjectId.toString(), // Convert ObjectId to String
            score: item.score // Keep the score as is
        }));

        // Convert the ObjectId array to a string array
        const bookmarkedResourceIDs : string[] = userResourceInteraction.bookmarkedArray.map((id: mongoose.Types.ObjectId)=> id.toString());

        return [bookmarkedResourceIDs, completedResources];

        ;
    }
    catch (error) {
        handleError(error);
        return [[], []];; // Return an empty array or suitable error response
    }
}

export async function getPopulatedUserActivities(params: getBookmarkStudyResourceParams) {
    try {
        await connectToDatabase();

        const { userID, resourceType } = params;
        const userObjectId = new mongoose.Types.ObjectId(userID);

        // Find the UserActivity document for the specified user and resource type
        const userResourceInteraction = await UserActivity.findOne({
            userObjectId,
            type: resourceType
        })
        .populate({ 
            path: 'bookmarkedArray', // Populate all documents referenced in the bookmarkedArray
            model: 'studyresources' // Ensure this matches the name used when registering your StudyResource model
        })
        .populate({ 
            path: 'completedArray.resourceObjectId', // Populate all documents referenced in the completedArray
            model: 'studyresources' // Ensure this matches the name used when registering your StudyResource model
        });

        // Handle case where there is no document found for the user and resource type
        if (!userResourceInteraction) {
            return { completed: [], bookmarked: [] }; // Return empty arrays for both properties
        }

        // Mapping completed items to include the resource details
        const completedResourceItems = userResourceInteraction.completedArray.map((item : any) => ({
            resourceObjectId: item.resourceObjectId._id.toString(),
            score: item.score,
            date: item.date,
            resourceDetails: item.resourceObjectId // This now includes all the populated fields from StudyResource
        }));

        // Mapping bookmarked items to include the resource details
        const bookmarkedResourceIDs = userResourceInteraction.bookmarkedArray.map((doc : any) => ({
            resourceObjectId: doc._id.toString(),
            resourceDetails: doc // This includes all the populated fields from StudyResource
        }));

        return { completed: completedResourceItems, bookmarked: bookmarkedResourceIDs };
    }
    catch (error) {
        handleError(error);
        return { completed: [], bookmarked: [] }; 
    }
}


