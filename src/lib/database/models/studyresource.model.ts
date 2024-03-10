import mongoose, { Schema, Document, Model } from 'mongoose';

interface StudyResourceBase extends Document {
  status: boolean;
  url: string;
}

interface TopicalStudyResource extends StudyResourceBase {
  topicName: string;
}

interface YearlyStudyResource extends StudyResourceBase {
  year: number;
  schoolName: string;
}

const StudyResourceSchema: Schema = new Schema({
  status: { type: Boolean, required: true },
  url: { type: String, required: true },
}, { discriminatorKey: 'type' });

const StudyResource: Model<StudyResourceBase> = mongoose.model<StudyResourceBase>('StudyResource', StudyResourceSchema);

const TopicalStudyResource = StudyResource.discriminator<TopicalStudyResource>('TopicalStudyResource', new Schema({
  topicName: { type: String, required: true },
}));

const YearlyStudyResource = StudyResource.discriminator<YearlyStudyResource>('YearlyStudyResource', new Schema({
  year: { type: Number, required: true },
  schoolName: { type: String, required: true },
}));

export { StudyResource, TopicalStudyResource, YearlyStudyResource };