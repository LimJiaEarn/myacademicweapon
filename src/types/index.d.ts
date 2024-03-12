
// USER PARAMS
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


// RESOURCE PARAMS

interface StudyResourceInterface {
  _id: string; // MongoDB ID
  status: boolean;
  level: "Primary" | "Secondary" | "JC";
  subject: string;
  url: string;
  likes: number;
  avgStars: number;
  userStarred: number;
  type?: string; // Optional field to determine the specific model to create in MongoDB
  workingSolution?:string;
  videoSolution?:string;
}

interface TopicalStudyResource extends StudyResourceInterface {
  topicName: string;
}

interface YearlyStudyResource extends StudyResourceInterface {
  assessment: string;
  year: number;
  schoolName: string;
}

// Union type for StudyResource function parameters
declare type StudyResourceInterface = BaseStudyResource | TopicalStudyResource | YearlyStudyResource;

declare type GetStudyResourcesParams = {
  level: "Primary" | "Secondary" | "JC";
  assessment?: string;
};

declare type UpdateStudyResourceParams = {
  status?: boolean;
  url?: string;
  level?: "Primary" | "Secondary" | "JC";
  topicName?: string; // For TopicalStudyResource
  assessment?: string;
  year?: number; // For YearlyStudyResource
  schoolName?: string; // For YearlyStudyResource
};