export const navLinks = [
  {
    id:"navLink1",
    label: "Home",
    route: "/",
    icon: "/icons/home.svg",
  },
  {
    id:"navLink2",
    label: "Study Resources",
    route: "/study-resources",
    icon: "/icons/study-resources.svg",
  }
];

export const testimonials = [
  {
    id:"testimonial1",
    testimonial: "Test1",
    name: "",
  },
  {
    id:"testimonial2",
    testimonial: "Test2",
    name: "",
  }
]


export const studyResources = [
  {
    id:"studyResources1",
    label: "Primary",
    route: "", // Coming Soon
    title: "Primary Pupils' Pavilion",
    desc: "Tailored to ignite curiosity and build a solid foundation, these resources mark your first step on the grand ladder of learning. Embark on an educational adventure that makes every lesson a discovery!",
    image: "/images/pri-section.webp"
  },
  {
    id:"studyResources2",
    label: "Secondary",
    route: "/study-resources/secondary",
    title: "Secondary Scholars Sanctum",
    desc: "Arm yourself with our arsenal of detailed study materials as you navigate the twisting corridors of higher learning. Light your path to academic valor and victory!",
    image: "/images/sec-section.webp"
  },
  {
    id:"studyResources3",
    label: "JC",
    route: "", // Coming Soon
    title: "Tertiary Titans Tower",
    desc: "Stocked with rigorous exam sets and elite resources, this domain is for the persistent and ambitious. Sharpen your intellect and prepare for the ultimate triumph in the scholarly arena!",
    image: "/images/jc-section.webp"
  }
];


export const secondaryContent = [
  {
    id:"secondaryResources1",
    title: "E Math",
    resources: [
      "Topical TYS Papers",
      "Topical Prelim Papers",
      "Yearly TYS Papers",
      "Yearly Prelim Papers",
    ]
  },
  {
    id:"secondaryResources2",
    title: "A Math",
    resources: [
      "Topical TYS Papers",
      "Topical Prelim Papers",
      "Yearly TYS Papers",
      "Yearly Prelim Papers",
    ]
  }
]

// Define an interface for the shared properties
export interface StudyResource {
  _id: string;
  status: boolean;
  url: string;
}

// Define separate interfaces for Topical and Yearly resources
export interface TopicalStudyResource extends StudyResource {
  topicName: string;
}

export interface YearlyStudyResource extends StudyResource {
  year: number;
  schoolName: string;
}

// Test Data
export const TopicalStudyResourceData : TopicalStudyResource[] = [
  {
    _id : "123",
    topicName: "Algebra",
    status: true,
    url: "https://www.google.com"
  },
  {
    _id : "124",
    topicName: "Coordinate Geometry",
    status: false,
    url: "https://www.google.com"
  },
  {
    _id : "125",
    topicName: "Factor theorem",
    status: false,
    url: "https://www.google.com"
  },
]

// Test Data
export const YearlyStudyResourceData : YearlyStudyResource[] = [
  {
    _id : "145",
    year: 2021,
    status: true,
    schoolName: "Anderson Sec",
    url: "https://www.google.com"
  },
  {
    _id : "146",
    year: 2022,
    status: true,
    schoolName: "Nan Chiau High",
    url: "https://www.google.com"
  },
  {
    _id : "147",
    year: 2023,
    status: false,
    schoolName: "Woodlands Sec",
    url: "https://www.google.com"
  },  
]