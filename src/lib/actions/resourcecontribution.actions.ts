" use server"

import { ResourceContribution } from "@/lib/database/models/resourcecontribution.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import mongoose from 'mongoose';


export async function createResourceContribution(data: ResourceContributionParams) {
    try {
        await connectToDatabase();

        const { level, type, subject, url, desc } = data;
        const userObjectId = data.userID ? new mongoose.Types.ObjectId(data.userID) : null;

        const baseData = {
            level,
            type,
            subject,
            url,
            ...(desc && { desc }), // Only include 'desc' if it's truthy
        };

        // Add userObjectId if it exists
        const resourceData = userObjectId ? { ...baseData, userObjectId } : baseData;

        await ResourceContribution.create(resourceData);
    } catch (error) {
        console.log(error);
    }
}