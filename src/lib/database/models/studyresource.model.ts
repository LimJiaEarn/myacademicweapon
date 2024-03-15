import mongoose, { Schema } from "mongoose";

import { Document, Model } from "mongoose";

interface StudyResourceDocument extends Document {
  status: boolean;
  level: string; // "Primary" | "Secondary" | "JC"
  assessment: string; // MYE | EOY | Prelims
  url: string;
  likes: number;
  avgStars: number; // track average stars
  starred: number; // track count students giving stars
}

interface TopicalStudyResourceDocument extends StudyResourceDocument {
  topicName: string;
}

interface YearlyStudyResourceDocument extends StudyResourceDocument {
  year: number;
  schoolName: string;
}

// Initialize models and discriminators once and cache them
let StudyResource: Model<StudyResourceDocument>, 
    TopicalStudyResource: Model<TopicalStudyResourceDocument>, 
    YearlyStudyResource: Model<YearlyStudyResourceDocument>;

function initializeModels() {
  if (StudyResource) {
    return { StudyResource, TopicalStudyResource, YearlyStudyResource };
  }

  const StudyResourceSchema = new Schema({
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

  StudyResource = mongoose.models.StudyResource || mongoose.model('StudyResources', StudyResourceSchema);

  const TopicalStudyResourceSchema = new Schema({
    topicName: { type: String, required: true },
  });

  const YearlyStudyResourceSchema = new Schema({
    year: { type: Number, required: true },
    schoolName: { type: String, required: true },
    assessment: { type: String, required: true },
  });

  // Use mongoose.model.discriminators to check for existing discriminators, else we create a new one
  TopicalStudyResource = StudyResource.discriminators?.TopicalStudyResource ||
    StudyResource.discriminator('TopicalStudyResource', TopicalStudyResourceSchema);

  YearlyStudyResource = StudyResource.discriminators?.YearlyStudyResource ||
    StudyResource.discriminator('YearlyStudyResource', YearlyStudyResourceSchema);

  return { StudyResource, TopicalStudyResource, YearlyStudyResource };
}

const { StudyResource: ExportedStudyResource, TopicalStudyResource: ExportedTopicalStudyResource, YearlyStudyResource: ExportedYearlyStudyResource } = initializeModels();

export { ExportedStudyResource as StudyResource, ExportedTopicalStudyResource as TopicalStudyResource, ExportedYearlyStudyResource as YearlyStudyResource };

/*

YEARLY:
curl -XPOST -H "Content-type: application/json" -d "[{\"type\":\"YearlyStudyResource\",\"status\":true,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":2,\"avgStars\":4.5,\"userStarred\":2,\"assessment\":\"MYE\",\"year\":2024,\"schoolName\":\"Woodlands Ring Sec\",\"workingSolution\":\"https://www.svgrepo.com\",\"videoSolution\":\"https://www.youtube.com\"},{\"type\":\"YearlyStudyResource\",\"status\":true,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":1,\"avgStars\":3,\"userStarred\":1,\"assessment\":\"Prelims\",\"year\":2023,\"schoolName\":\"Woodlands Ring Sec\",\"workingSolution\":\"https://www.svgrepo.com\"},{\"type\":\"YearlyStudyResource\",\"status\":false,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"assessment\":\"Prelims\",\"year\":2023,\"schoolName\":\"Riverside Sec\"}]" "http://localhost:3000/api/studyresources"

TOPICAL:

curl -XPOST -H "Content-type: application/json" -d "[{\"type\":\"TopicalStudyResource\",\"status\":true,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":1,\"avgStars\":5,\"userStarred\":1,\"topicName\":\"Graphs\"},{\"type\":\"TopicalStudyResource\",\"status\":true,\"level\":\"Secondary\",\"subject\":\"E Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"topicName\":\"Differentiation\",\"workingSolution\":\"https://www.svgrepo.com\",\"videoSolution\":\"https://www.youtube.com\"},{\"type\":\"TopicalStudyResource\",\"status\":true,\"level\":\"Secondary\",\"subject\":\"A Math\",\"url\":\"https://www.google.com\",\"likes\":0,\"avgStars\":0,\"userStarred\":0,\"topicName\":\"Integration\"}]" "http://localhost:3000/api/studyresources"


*/