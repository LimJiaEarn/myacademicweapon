import { Document, Model, model, models, Schema } from "mongoose";

interface StudyResourceDocument extends Document {
  level: string; // "Primary" | "Secondary" | "JC"
  subject: string;
  desc?: string;
  url: string;
  likes: number;
  contributor?: string;
  contributorUrl?: string;
  type: string;
  clicks: number;
}

interface NotesDocument extends StudyResourceDocument {
  topicNames: string[];
}

interface TopicalPracticePaperDocument extends StudyResourceDocument {
  totMarks?: number;
  workingSolution?: string;
  videoSolution?: string;
  topicName: string;
  practice: number; // Can have multiple docs for same topic, hence we use a `practice` to track similar topic but diff worksheets
}

// This is for revision sets which usually consists of multiple topics
interface RevisionPracticePaperDocument extends StudyResourceDocument {
  totMarks?: number;
  workingSolution?: string;
  videoSolution?: string;
  topicNames: string[];
  practice: number;
}

interface YearlyPracticePaperDocument extends StudyResourceDocument {
  totMarks?: number;
  workingSolution?: string;
  videoSolution?: string;
  year: number;
  schoolName: string;
  assessment: string; // MYE | EOY | Prelims
  paper: number; // if 0 means single paper (eg promos)
}

const StudyResourceSchema = new Schema<StudyResourceDocument>({
  level: { type: String, required: true },
  subject: { type: String, required: true },
  desc: { type: String},
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  contributor : { type : String },
  contributorUrl : { type : String },
  clicks: { type: Number, default: 0 }
}, { discriminatorKey: 'type' });


// Export this initialized model
const StudyResource: Model<StudyResourceDocument> = models.studyresources || model<StudyResourceDocument>('studyresources', StudyResourceSchema);

const NotesSchema =  new Schema<NotesDocument>({
  topicNames: [{type: String, required: true}]
})

const TopicalPracticePaperSchema = new Schema<TopicalPracticePaperDocument>({
  totMarks: { type: Number, required: false },
  workingSolution: { type: String, required: false },
  videoSolution: { type: String, required: false },
  topicName: { type: String, required: true },
  practice: { type: Number, required: true },
});

const RevisionPracticePaperSchema = new Schema<RevisionPracticePaperDocument>({
  totMarks: { type: Number, required: false },
  workingSolution: { type: String, required: false },
  videoSolution: { type: String, required: false },
  topicNames: [{type: String, required: true}],
  practice: { type: Number, required: true },
})


const YearlyPracticePaperSchema = new Schema<YearlyPracticePaperDocument>({
  totMarks: { type: Number, required: false },
  workingSolution: { type: String, required: false },
  videoSolution: { type: String, required: false },
  year: { type: Number, required: true },
  schoolName: { type: String, required: true },
  assessment: { type: String, required: true },
  paper: {type: Number, required: true}
});


// Use discriminators for sub-types
const Notes: Model<NotesDocument> = StudyResource.discriminators?.Notes || StudyResource.discriminator<NotesDocument>('Notes', NotesSchema);
const TopicalPracticePaper: Model<TopicalPracticePaperDocument> = StudyResource.discriminators?.Topical || StudyResource.discriminator<TopicalPracticePaperDocument>('Topical', TopicalPracticePaperSchema);
const RevisionPracticePaper: Model<RevisionPracticePaperDocument> = StudyResource.discriminators?.Revision || StudyResource.discriminator<RevisionPracticePaperDocument>('Revision',RevisionPracticePaperSchema);
const YearlyPracticePaper: Model<YearlyPracticePaperDocument> = StudyResource.discriminators?.Yearly || StudyResource.discriminator<YearlyPracticePaperDocument>('Yearly', YearlyPracticePaperSchema);

export { StudyResource, Notes, TopicalPracticePaper, RevisionPracticePaper, YearlyPracticePaper };

