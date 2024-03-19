
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
  status?: boolean;
  level: "Primary" | "Secondary" | "JC";
  subject: string;
  desc?: string;
  url: string;
  likes: number;
  type?: string; // Optional field to determine the specific model to create in MongoDB
  workingSolution?:string; // link to working solutions if applicable
  videoSolution?:string; // link to solution recording if applicable
  creditor?: string // Person who created/contributed the resource
}

interface TopicalStudyResource extends StudyResourceInterface {
  topicName: string;
}

interface YearlyStudyResource extends StudyResourceInterface {
  assessment: string;
  year: number;
  schoolName: string;
  paper: number;
}

// Union type for StudyResource function parameters
declare type StudyResourceInterface = BaseStudyResource | TopicalStudyResource | YearlyStudyResource;

declare type GetStudyResourcesParams = {
  type: "TopicalStudyResource" | "YearlyStudyResource";
  level: "Primary" | "Secondary" | "JC";
  subject: string;
};

declare type UpdateStudyResourceParams = {
  url?: string;
  level?: "Primary" | "Secondary" | "JC";
  topicName?: string; // For TopicalStudyResource
  assessment?: string;
  year?: number; // For YearlyStudyResource
  schoolName?: string; // For YearlyStudyResource
  likes?: number;
};

declare type getStatusStudyResourceParams = {
  userID: string;
  resourceType: "TopicalStudyResource" | "YearlyStudyResource";
}

declare type updateStatusStudyResourceParams = {
  userID: string;
  resourceID: string;
  status: boolean;
}