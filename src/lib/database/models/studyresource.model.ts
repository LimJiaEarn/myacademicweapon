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
  contributor : { type : String}
}, { discriminatorKey: 'type' });


// Export this initialized model
const StudyResource: Model<StudyResourceDocument> = models.StudyResource || model<StudyResourceDocument>('StudyResources', StudyResourceSchema);

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

/*

YEARLY:
curl -XPOST -H "Content-type: application/json" -d "[{\"type\":\"YearlyPracticePaper\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":2,\"avgStars\":4.5,\"userStarred\":2,\"assessment\":\"MYE\",\"year\":2024,\"schoolName\":\"Woodlands Ring Sec\",\"workingSolution\":\"https://www.svgrepo.com\",\"videoSolution\":\"https://www.youtube.com\"},{\"type\":\"YearlyPracticePaper\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":1,\"avgStars\":3,\"userStarred\":1,\"assessment\":\"Prelims\",\"year\":2023,\"schoolName\":\"Woodlands Ring Sec\",\"workingSolution\":\"https://www.svgrepo.com\"},{\"type\":\"YearlyPracticePaper\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"assessment\":\"Prelims\",\"year\":2023,\"schoolName\":\"Riverside Sec\"}]" "http://localhost:3000/api/studyresources/create"

TOPICAL:

curl -XPOST -H "Content-type: application/json" -d "[{\"type\":\"TopicalPracticePaper\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":1,\"avgStars\":5,\"userStarred\":1,\"topicName\":\"Indices\"},{\"type\":\"TopicalPracticePaper\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"topicName\":\"Statistics\",\"workingSolution\":\"https://www.svgrepo.com\",\"videoSolution\":\"https://www.youtube.com\"},{\"type\":\"TopicalPracticePaper\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"topicName\":\"Binomial Theorem\"}]" "http://localhost:3000/api/studyresources/create"


*/