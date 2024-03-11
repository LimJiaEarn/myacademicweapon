
// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};
  
declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== RESOURCE PARAMS
interface BaseStudyResource {
  status: boolean;
  url: string;
  level: "Primary" | "Secondary" | "JC";
  type?: string; // Optional field to determine the specific model to create
}

interface TopicalStudyResourceData extends BaseStudyResource {
  topicName: string;
  assessment: "Prelims" | "TYS" | "MYE";
}

interface YearlyStudyResourceData extends BaseStudyResource {
  year: number;
  schoolName: string;
  assessment: "Prelims" | "TYS" | "MYE";
}

// Union type for StudyResource function parameters
declare type StudyResourceData = BaseStudyResource | TopicalStudyResourceData | YearlyStudyResourceData;

declare type GetStudyResourcesParams = {
  level: "Primary" | "Secondary" | "JC";
  assessment?: "Prelims" | "TYS" | "MYE";
};

declare type UpdateStudyResourceParams = {
  status?: boolean;
  url?: string;
  level?: "Primary" | "Secondary" | "JC";
  topicName?: string; // For TopicalStudyResource
  assessment?: "Prelims" | "TYS" | "MYE";
  year?: number; // For YearlyStudyResource
  schoolName?: string; // For YearlyStudyResource
  // Add any other fields that might be updated
};