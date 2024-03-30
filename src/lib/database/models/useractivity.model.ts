import { Schema, model, models, Document } from 'mongoose';

interface UserActivityDocument extends Document {
  userObjectId: Schema.Types.ObjectId; // Reference to User
  resourceType: 'Yearly' | 'Topical';
  likesArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has liked
  bookmarkedArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has bookmarked
  completedArray: { resourceObjectId: Schema.Types.ObjectId, score: number }[]; // Array of completed items with scores
}

const CompletedItemSchema = new Schema({
  resourceObjectId: { type: Schema.Types.ObjectId, ref: 'StudyResources', required: true },
  score: { type: Number, required: true }
});

const UserActivitySchema = new Schema<UserActivityDocument>({
  userObjectId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  resourceType: { type: String, required: true, enum: ['Yearly', 'Topical', 'Revision'] },
  likesArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
  bookmarkedArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
  completedArray: [CompletedItemSchema],
});

const UserActivity = models?.UserActivity || model<UserActivityDocument>('UserActivity', UserActivitySchema);

export {UserActivity};