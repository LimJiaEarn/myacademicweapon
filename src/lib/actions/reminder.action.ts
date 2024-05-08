"use server"

import { Reminder } from "@/lib/database/models/reminder.model";
import { connectToDatabase } from "../database/mongoose";
import mongoose from 'mongoose';


// CREATE & UPDATE & DELETE
export async function updateRemindersByUserId({userId, remindersArrayNew} : {userId: string, remindersArrayNew: ReminderItem[]}): Promise<boolean>{

    try{
        
        await connectToDatabase();

        const userObjectId = new mongoose.Types.ObjectId(userId);

        let UserRemindersObject = await Reminder.findOne({ userObjectId: userObjectId });;
        
        // new reminder document needs to be created
        if (!UserRemindersObject){
            
            await Reminder.create({
                userObjectId: userObjectId,
                remindersArray: remindersArrayNew
            }) 

        }

        // update existing document
        else{

            await Reminder.findOneAndUpdate(
                { userObjectId: userObjectId },
                { $set: { remindersArray: remindersArrayNew } }
            );
        }


        return true;
    }
    catch(error){
        console.log(error);
        return false;
    }
}

export async function getRemindersByUserId({userId} : {userId: string}): Promise<ReminderItem[]>{

    try{

        await connectToDatabase();

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const UserReminders = await Reminder.findOne({ userObjectId: userObjectId });

        // return UserReminders.remindersArray;
        return JSON.parse(JSON.stringify(UserReminders.remindersArray));

    }
    catch(error){
        return [];
    }

}

