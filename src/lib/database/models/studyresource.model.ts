import mongoose, { Document, Model, Schema } from "mongoose";

interface StudyResourceDocument extends Document {
  status: boolean;
  level: string; // "Primary" | "Secondary" | "JC"
  subject: string;
  assessment: string; // MYE | EOY | Prelims
  url: string;
  likes: number;
  avgStars: number; // track average stars
  userStarred: number; // track count students giving stars
  workingSolution?: string;
  videoSolution?: string;
  creditor?: string;
}

interface TopicalStudyResourceDocument extends StudyResourceDocument {
  topicName: string;
}

interface YearlyStudyResourceDocument extends StudyResourceDocument {
  year: number;
  schoolName: string;
  paper: number;
}

const StudyResourceSchema = new Schema<StudyResourceDocument>({
  status: { type: Boolean, required: true },
  level: { type: String, required: true },
  subject: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  avgStars: { type: Number, default: 0 },
  userStarred: { type: Number, default: 0 },
  workingSolution: { type: String, required: false },
  videoSolution: { type: String, required: false }
}, { discriminatorKey: 'type' });

// Define the Interface Model 
const StudyResource: Model<StudyResourceDocument> = mongoose.models.StudyResource || mongoose.model<StudyResourceDocument>('StudyResource', StudyResourceSchema, 'studyresources');

const TopicalStudyResourceSchema = new Schema<TopicalStudyResourceDocument>({
  topicName: { type: String, required: true },
});

const YearlyStudyResourceSchema = new Schema<YearlyStudyResourceDocument>({
  year: { type: Number, required: true },
  schoolName: { type: String, required: true },
  assessment: { type: String, required: true },
  paper: {type: Number, required: true}
});

// Use discriminators for sub-types
const TopicalStudyResource: Model<TopicalStudyResourceDocument> = StudyResource.discriminators?.TopicalStudyResource || StudyResource.discriminator<TopicalStudyResourceDocument>('TopicalStudyResource', TopicalStudyResourceSchema);
const YearlyStudyResource: Model<YearlyStudyResourceDocument> = StudyResource.discriminators?.YearlyStudyResource || StudyResource.discriminator<YearlyStudyResourceDocument>('YearlyStudyResource', YearlyStudyResourceSchema);

export { StudyResource, TopicalStudyResource, YearlyStudyResource };

/*

YEARLY:
curl -XPOST -H "Content-type: application/json" -d "[{\"type\":\"YearlyStudyResource\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":2,\"avgStars\":4.5,\"userStarred\":2,\"assessment\":\"MYE\",\"year\":2024,\"schoolName\":\"Woodlands Ring Sec\",\"workingSolution\":\"https://www.svgrepo.com\",\"videoSolution\":\"https://www.youtube.com\"},{\"type\":\"YearlyStudyResource\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":1,\"avgStars\":3,\"userStarred\":1,\"assessment\":\"Prelims\",\"year\":2023,\"schoolName\":\"Woodlands Ring Sec\",\"workingSolution\":\"https://www.svgrepo.com\"},{\"type\":\"YearlyStudyResource\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"assessment\":\"Prelims\",\"year\":2023,\"schoolName\":\"Riverside Sec\"}]" "http://localhost:3000/api/studyresources/create"

TOPICAL:

curl -XPOST -H "Content-type: application/json" -d "[{\"type\":\"TopicalStudyResource\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":1,\"avgStars\":5,\"userStarred\":1,\"topicName\":\"Indices\"},{\"type\":\"TopicalStudyResource\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"topicName\":\"Statistics\",\"workingSolution\":\"https://www.svgrepo.com\",\"videoSolution\":\"https://www.youtube.com\"},{\"type\":\"TopicalStudyResource\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"topicName\":\"Binomial Theorem\"}]" "http://localhost:3000/api/studyresources/create"


*/