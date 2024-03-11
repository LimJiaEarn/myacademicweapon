import mongoose, { Schema } from "mongoose";

// Initialize models and discriminators once and cache them
let StudyResource, TopicalStudyResource, YearlyStudyResource;

function initializeModels() {
  if (StudyResource) {
    return { StudyResource, TopicalStudyResource, YearlyStudyResource };
  }

  const StudyResourceSchema = new Schema({
    status: { type: Boolean, required: true },
    url: { type: String, required: true },
    level: { type: String, required: true },
  }, { discriminatorKey: 'type' });

  StudyResource = mongoose.models.StudyResource || mongoose.model('StudyResource', StudyResourceSchema);

  const TopicalStudyResourceSchema = new Schema({
    topicName: { type: String, required: true },
    assessment: { type: String, required: true },
  });

  const YearlyStudyResourceSchema = new Schema({
    year: { type: Number, required: true },
    schoolName: { type: String, required: true },
    assessment: { type: String, required: true },
  });

  // Use mongoose.model.discriminators to check for existing discriminators
  TopicalStudyResource = StudyResource.discriminators?.TopicalStudyResource ||
    StudyResource.discriminator('TopicalStudyResource', TopicalStudyResourceSchema);

  YearlyStudyResource = StudyResource.discriminators?.YearlyStudyResource ||
    StudyResource.discriminator('YearlyStudyResource', YearlyStudyResourceSchema);

  return { StudyResource, TopicalStudyResource, YearlyStudyResource };
}

const { StudyResource: ExportedStudyResource, TopicalStudyResource: ExportedTopicalStudyResource, YearlyStudyResource: ExportedYearlyStudyResource } = initializeModels();

export { ExportedStudyResource as StudyResource, ExportedTopicalStudyResource as TopicalStudyResource, ExportedYearlyStudyResource as YearlyStudyResource };
