import { Schema, model, models, Document } from 'mongoose';

interface ResourceContributionDocument extends Document {
    level: "Primary" | "Secondary" | "JC";
    type: "Notes/Summaries" | "Yearly Practice Papers" | "Topical Practice Papers" | "Others";
    subject: string; // no constraint set on this as we do not know what user will type
    url: string;
    desc: string;
    userObjectId?: Schema.Types.ObjectId // set to optional as un-signed in users can contribute too
}

const ResourceContributionSchema = new Schema<ResourceContributionDocument>({
    level: {type: String, required: true, enum: ["Primary" , "Secondary" , "JC"]},
    type: {type: String, required: true, enum: ["Notes/Summaries", "Yearly Practice Papers", "Topical Practice Papers", "Others"]},
    subject: {type: String, required: true},
    url: {type: String, required: true},
    desc: {type: String, required: true},
    userObjectId: {type: Schema.Types.ObjectId},
})

const ResourceContribution = models?.ResourceContribution || model<ResourceContributionDocument>('ResourceContribution', ResourceContributionSchema);

export {ResourceContribution};