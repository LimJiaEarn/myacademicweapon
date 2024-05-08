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
declare type UserObject = {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  bio: string;
  firstName: string;
  lastName: string;
  planId: number;
  photo: string;
  school: string; 
  level:string; 
  joinDate: Date;
  goal: number;
}

declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
  joinDate: Date;
};
  
declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
  bio?: string;
  school?: string;
  level?: string;
  goal?: number;
};


// RESOURCE PARAMS

interface StudyResourceInterface {
  _id: string; // MongoDB ID
  level: "Primary" | "Secondary" | "JC";
  subject: string;
  desc?: string;
  url: string;
  // likes: number;
  contributor?: string // Person/Organisation who created/contributed the resource
  contributorUrl?: string // relevant links to this person/organisation 
}

interface StudyNotesInterface extends StudyResourceInterface {
  topicNames : string[];
}

interface PracticePaperInterface extends StudyResourceInterface {
  status: boolean;
  bookmark: boolean;
  type: "Topical" | "Yearly";
  totMarks?: number;
  score?:number;
  date?:Date;
  workingSolution?:string; // link to working solutions 
  videoSolution?:string; // link to solution recording 
}

interface RevisionPracticePaper extends PracticePaperInterface {
  topicNames: string[];
}

interface TopicalPracticePaper extends PracticePaperInterface {
  topicName: string;
  practice: number;
}

interface YearlyPracticePaper extends PracticePaperInterface {
  assessment: string;
  year: number;
  schoolName: string;
  paper: number;
}

interface ISummarisedPracticePaper extends StudyResourceInterface {
  title: string;
}

// Union type for StudyResource function parameters
declare type StudyResourceInterface = BaseStudyResource | TopicalPracticePaper | RevisionPracticePaper | YearlyPracticePaper;

interface CreateStudyResourcesParams  {
  level: "Primary" | "Secondary" | "JC";
  subject: string;
  desc?: string;
  url: string;
  likes: number;
  contributor?: object;
  contributorUrl?: string;
}

interface CreatePracticePaperInterface extends CreateStudyResourcesParams {
  status: boolean;
  type: "Topical" | "Yearly";
  totMarks?: number;
  workingSolution?:string; // link to working solutions 
  videoSolution?:string; // link to solution recording 
}

interface CreateRevisionPracticePaperParams extends CreatePracticePaperInterface {
  topicNames: string[];
  practice: number;
}

interface CreateTopicalPracticePaperParams extends CreatePracticePaperInterface {
  topicName: string;
  practice: number;
}

interface CreateYearlyPracticePaperParams extends CreatePracticePaperInterface {
  assessment: string;
  year: number;
  schoolName: string;
  paper: number;
}

declare type GetStudyResourcesParams = {
  type: "Topical" | "Yearly";
  level: "Primary" | "Secondary" | "JC";
  subject: string;
};

declare type completedStudyResourceItem = {
  resourceObjectId: string;
  score: number;
  date: Date;
}

declare type UpdateStudyResourceParams = {
  url?: string;
  level?: "Primary" | "Secondary" | "JC";
  topicName?: string; // For Topical
  assessment?: string;
  year?: number; // For Yearly
  schoolName?: string; // For Yearly
  likes?: number;
  totMarks?: number;
};

declare type getStatusStudyResourceParams = {
  userID: string;
  resourceType: "Topical" | "Yearly";
}

declare type updateStatusStudyResourceParams = {
  userID: string;
  studyResourceID: string;
  resourceType?: string;
  newStatus: boolean;
  date: Date;
  score?: number; // optional if user wants to record their marks too, else it is marked as -1
}

declare type getBookmarkStudyResourceParams = {
  userID: string;
  resourceType: "Topical" | "Yearly";
}

declare type updateBookmarkStudyResourceParams = {
  userID: string;
  studyResourceID: string;
  newBookmark: boolean; 
}

declare type ResourceContributionParams = {
  level: "Primary" | "Secondary" | "JC";
  type: "Notes/Summaries" | "Yearly Practice Papers" | "Topical Practice Papers" | "Revision Set/Practice Papers" |"Others";
  subject: string;
  totMarks?: string;
  url: string;
  desc?: string;
  userID?: string;
}


// FORM FIELD

type FormFieldConfig = {
  id: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'file' | 'number'; 
  title: string;
  desc?: string;
  styles?:string;
  placeholder?: string;
  options?: string[]; // Only used for 'select' type
  compulsory: boolean; // if it must be filled before form submission
};


// FILTER FIELD

type SelectorFieldConfig = {
  id: string; // this is the column id
  placeholder: string;
  options: string[];
}

// Reminders

interface ReminderDocument extends Document {
  userObjectId: Schema.Types.ObjectId;
  remindersArray: Array<{reminder: string, setDate: Date, dueDate: Date}>;
}

interface ReminderItem {
  reminder: string,
  setDate: Date,
  dueDate: Date,
}