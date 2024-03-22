" use server"

import { ResourceContribution } from "@/lib/database/models/resourcecontribution.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import mongoose from 'mongoose';


export async function createResourceContribution(data : ResourceContributionParams) {
    
    try{

        await connectToDatabase();

        const {level, type, subject, url, desc } = data;
        const userObjectId = data.userID ? new mongoose.Types.ObjectId(data.userID) : null;

        if (userObjectId){
            await ResourceContribution.create({
                level,
                type,
                subject,
                url,
                desc,
                userObjectId
            });
        }
        else{
            await ResourceContribution.create({
                level,
                type,
                subject,
                url,
                desc,
            });
        }

    }
    catch (error){
        console.log(error);
    }

}