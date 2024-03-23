import { Schema, model, models, Document } from 'mongoose';

interface UserActivityDocument extends Document {
  userObjectId: Schema.Types.ObjectId; // Reference to User
  resourceType: 'Yearly' | 'Topical';
  likesArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has liked
  completedArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has marked as completed
}

const UserActivitySchema = new Schema<UserActivityDocument>({
  userObjectId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  resourceType: { type: String, required: true, enum: ['Yearly', 'Topical'] },
  likesArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
  completedArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
});

const UserActivity = models?.UserActivity || model<UserActivityDocument>('UserActivity', UserActivitySchema);

export {UserActivity};