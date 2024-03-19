import mongoose, { Schema, model, models, Document } from 'mongoose';

interface UserResourceInteractionsDocument extends Document {
  userID: Schema.Types.ObjectId; // Reference to User
  resourceType: 'YearlyStudyResource' | 'TopicalStudyResource';
  likesArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has liked
  completedArray: Schema.Types.ObjectId[]; // Array of StudyResource IDs the user has marked as completed
}

const UserResourceInteractionsSchema = new Schema<UserResourceInteractionsDocument>({
  userID: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  resourceType: { type: String, required: true, enum: ['YearlyStudyResource', 'TopicalStudyResource'] },
  likesArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
  completedArray: [{ type: Schema.Types.ObjectId, ref: 'StudyResources' }],
});

const UserResourceInteractions = models.UserResourceInteractions || model<UserResourceInteractionsDocument>('UserResourceInteractions', UserResourceInteractionsSchema);

export {UserResourceInteractions};