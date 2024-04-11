import { Schema, model, models, Document } from 'mongoose';

interface UserActivityDocument extends Document {
  userObjectId: Schema.Types.ObjectId; // Reference to User
  type: 'Yearly' | 'Topical' | 'Revision';
  likesArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has liked
  bookmarkedArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has bookmarked
  completedArray: { resourceObjectId: Schema.Types.ObjectId, score: number, date: Date }[]; // Array of completed items with scores
}

const CompletedItemSchema = new Schema({
  resourceObjectId: { type: Schema.Types.ObjectId, ref: 'StudyResources', required: true },
  score: { type: Number, required: true },
  date: { type: Date, required: true },
});

const UserActivitySchema = new Schema<UserActivityDocument>({
  userObjectId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  type: { type: String, required: true, enum: ['Yearly', 'Topical', 'Revision'] }, // this is the discriminator from studyresources
  likesArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
  bookmarkedArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
  completedArray: [CompletedItemSchema],
});

const UserActivity = models?.UserActivity || model<UserActivityDocument>('UserActivity', UserActivitySchema);

export {UserActivity};