// Study Resource Navbar

declare type StudyResourceNav = {
  [key: string]: StudyResourceNavItem[];
}

declare type StudyResourceNavItem = {
  id: string;
  title: string;
  resources: string[]
}

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
  level: "Primary" | "Secondary" | "JC";
  subject: string;
  desc?: string;
  url: string;
  likes: number;
  contributor?: string // Person who created/contributed the resource
}

interface StudyNotesInterface extends StudyResourceInterface {
  topicName : string;
}

interface PracticePaperInterface extends StudyResourceInterface {
  status: boolean;
  type: "Topical" | "Yearly";
  workingSolution?:string; // link to working solutions 
  videoSolution?:string; // link to solution recording 
}

interface TopicalPracticPaper extends PracticePaperInterface {
  topicName: string;
}

interface YearlyPracticePaper extends PracticePaperInterface {
  assessment: string;
  year: number;
  schoolName: string;
  paper: number;
}

// Union type for StudyResource function parameters
declare type StudyResourceInterface = BaseStudyResource | TopicalPracticPaper | YearlyPracticePaper;

declare type GetStudyResourcesParams = {
  type: "Topical" | "Yearly";
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
  resourceType: "Topical" | "Yearly";
}

declare type updateStatusStudyResourceParams = {
  userID: string;
  studyResourceID: string;
  newStatus: boolean;
}

declare type ResourceContributionParams = {
  level: "Primary" | "Secondary" | "JC";
  type: "Notes/Summaries" | "Yearly Practice Papers" | "Topical Practice Papers" | "Others";
  subject: string;
  url: string;
  desc?: string;
  userID?: string;
}


// FORM FIELD

type FormFieldConfig = {
  id: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'file'; 
  title: string;
  desc?: string;
  styles?:string;
  placeholder?: string;
  options?: string[]; // Only used for 'select' type
  compulsory: boolean; // if it must be filled before form submission
};