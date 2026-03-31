"use server";
import { auth } from '@clerk/nextjs/server';
import User from './database/models/user.model';
import { connectToDatabase } from './database/mongoose';

// Verifies the Clerk-authenticated caller owns the given MongoDB userID.
// Throws "Unauthorized" if not signed in, "Forbidden" if signed in as a different user.
export async function verifyOwnership(userID: string): Promise<void> {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");
    await connectToDatabase();
    const caller = await User.findOne({ clerkId }).select('_id').lean() as { _id: any } | null;
    if (!caller || caller._id.toString() !== userID) throw new Error("Forbidden");
}

// Verifies the caller is signed in (for admin-only operations with no user-ownership concept).
export async function requireAuth(): Promise<void> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
}