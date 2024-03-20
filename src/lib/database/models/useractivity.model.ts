import { Schema, model, models, Document } from 'mongoose';

interface UserActivityDocument extends Document {
  userID: Schema.Types.ObjectId; // Reference to User
  resourceType: 'YearlyStudyResource' | 'TopicalStudyResource';
  likesArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has liked
  completedArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has marked as completed
}

const UserActivitySchema = new Schema<UserActivityDocument>({
  userID: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  resourceType: { type: String, required: true, enum: ['YearlyStudyResource', 'TopicalStudyResource'] },
  likesArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
  completedArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
});

const UserActivity = models?.UserActivity || model<UserActivityDocument>('UserActivity', UserActivitySchema);

export {UserActivity};