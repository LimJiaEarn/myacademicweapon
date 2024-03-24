import mongoose, { Schema, Document, model, models } from "mongoose";

// Define an interface for the User model
interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string; // Optional since it's not required
  lastName?: string;  // Optional since it's not required
  planId: number;
}

// Define the User schema
const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  planId: {
    type: Number,
    default: 1,
  },
});

// Model definition with a conditional check to avoid recompilation errors
const User = models.User as mongoose.Model<IUser> || model<IUser>('User', UserSchema);

export default User;
