import { Document, Model, model, models, Schema } from "mongoose";

interface StudyResourceDocument extends Document {
  level: string; // "Primary" | "Secondary" | "JC"
  subject: string;
  desc?: string;
  url: string;
  likes: number;
  workingSolution?: string;
  videoSolution?: string;
  contributor?: string;
  contributorUrl?: string;
  type: string;
}

interface TopicalPracticePaperDocument extends StudyResourceDocument {
  topicName: string;
}

interface YearlyPracticePaperDocument extends StudyResourceDocument {
  year: number;
  schoolName: string;
  assessment: string; // MYE | EOY | Prelims
  paper: number;
}

const StudyResourceSchema = new Schema<StudyResourceDocument>({
  level: { type: String, required: true },
  subject: { type: String, required: true },
  desc: { type: String},
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  workingSolution: { type: String, required: false },
  videoSolution: { type: String, required: false },
  contributor : { type : String },
  contributorUrl : { type : String },
}, { discriminatorKey: 'type' });


// Export this initialized model
const StudyResource: Model<StudyResourceDocument> = models.StudyResources || model<StudyResourceDocument>('StudyResources', StudyResourceSchema);

const TopicalPracticePaperSchema = new Schema<TopicalPracticePaperDocument>({
  topicName: { type: String, required: true },
});

const YearlyPracticePaperSchema = new Schema<YearlyPracticePaperDocument>({
  year: { type: Number, required: true },
  schoolName: { type: String, required: true },
  assessment: { type: String, required: true },
  paper: {type: Number, required: true}
});

// Use discriminators for sub-types
const TopicalPracticePaper: Model<TopicalPracticePaperDocument> = StudyResource.discriminators?.TopicalPracticePaper || StudyResource.discriminator<TopicalPracticePaperDocument>('Topical', TopicalPracticePaperSchema);
const YearlyPracticePaper: Model<YearlyPracticePaperDocument> = StudyResource.discriminators?.YearlyPracticePaper || StudyResource.discriminator<YearlyPracticePaperDocument>('Yearly', YearlyPracticePaperSchema);

export { StudyResource, TopicalPracticePaper, YearlyPracticePaper };

