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
    assessment: { type: String, required: true },
    url: { type: String, required: true },
    likes: { type: Number, default: 0 },
    avgStars: { type: Number, default: 0 }, 
    starred: { type: Number, default: 0 }, 
  }, { discriminatorKey: 'type' });

  StudyResource = mongoose.models.StudyResource || mongoose.model('StudyResource', StudyResourceSchema);

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
curl -X POST http://localhost:3000/api/studyresources -H

"Content-Type: application/json"

-d "{\"status\": true, \"url\": \"https://example.com/resource\", \"level\": \"Secondary\", \"topicName\": \"Mathematics\", \"assessment\": \"TYS\"}"

*/