import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  clerkUserId: string; // Clerk's unique identifier for the user
  // Add any other application-specific fields here
  completedTopicals: [Schema.Types.ObjectId]; // References to completed topical papers
  completedYearlys: [Schema.Types.ObjectId]; // References to completed yearly papers
}

const UserSchema: Schema = new Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true
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
  completedTopicals: [{ type: Schema.Types.ObjectId, ref: 'TopicalStudyResource' }],
  completedYearlys: [{ type: Schema.Types.ObjectId, ref: 'YearlyStudyResource' }],
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;