"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import mongoose from "mongoose";

// Tutorial at: https://www.youtube.com/watch?v=Ahwoks_dawU&t=5978s

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  }
  catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserByClerkId(cuserId: string) {
  try {
    await connectToDatabase();


    const user = await User.findOne({ clerkId: cuserId });


    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  }
  catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserByUsername(username: string) {
  try {
    await connectToDatabase();


    const user = await User.findOne({ username : username });


    if (!user){
      // throw new Error("Invalid Username");
      return null;
    }

    return JSON.parse(JSON.stringify(user));
  }
  catch (error) {
    handleError(error);
    return null;
  }
}

// UPDATE - Called via Clerk's webhook
export async function updateUserByClerkId(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  }
  catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUserByUserID(userID: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(userID, user, {
      new: true,
    });


    return JSON.parse(JSON.stringify(updatedUser));
  }
  catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  }
  catch (error) {
    handleError(error);
  }
}
