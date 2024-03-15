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



export const studyResourcesNav = [
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


export const secondaryContentNav = [
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


// Test Data
export const TopicalStudyResourceData : TopicalStudyResource[] = [
  {
    _id : "123",
    status: true,
    level: "Secondary",
    subject: "E Math",
    url: "https://www.google.com",
    likes: 1,
    avgStars: 5,
    userStarred: 1,
    topicName: "Algebra",
  },
  {
    _id : "124",
    status: true,
    level: "Secondary",
    subject: "A Math",
    url: "https://www.google.com",
    likes: 0,
    avgStars: 0,
    userStarred: 0,
    topicName: "Factor Theorem",
    workingSolution: "https://www.svgrepo.com",
    videoSolution: "https://www.youtube.com",
  },
  {
    _id : "125",
    status: true,
    level: "Secondary",
    subject: "A Math",
    url: "https://www.google.com",
    likes: 0,
    avgStars: 0,
    userStarred: 0,
    topicName: "Partial Fractions",
  },
]

// Test Data
export const YearlyStudyResourceData : YearlyStudyResource[] = [
  {
    _id : "145",
    status: true,
    level: "Secondary",
    subject: "E Math",
    url: "https://www.google.com",
    likes: 2,
    avgStars: 4.5,
    userStarred: 2,
    assessment: "MYE",
    year: 2024,
    schoolName: "Woodlands Ring Sec",
    workingSolution: "https://www.svgrepo.com",
    videoSolution: "https://www.youtube.com",
  },
  {
    _id : "146",
    status: true,
    level: "Secondary",
    subject: "A Math",
    url: "https://www.google.com",
    likes: 1,
    avgStars: 3,
    userStarred: 1,
    assessment: "Prelims",
    year: 2023,
    schoolName: "Woodlands Ring Sec", 
    workingSolution: "https://www.svgrepo.com",
  },
  {
    _id : "147",
    status: false,
    level: "Secondary",
    subject: "A Math",
    url: "https://www.google.com",
    likes: 0,
    avgStars: 0,
    userStarred: 0,
    assessment: "Prelims",
    year: 2023,
    schoolName: "Riverside Sec", 
  },  
]

// Hero Section Images
// Hero Section Images
export const heroImages = [
  {
    title: "heroImg1",
    thumbnail: "/images/heroImg1.png",
  },
  {
    title: "heroImg2",
    thumbnail: "/images/heroImg2.png",
  },
  {
    title: "heroImg3",
    thumbnail: "/images/heroImg3.png",
  },
  {
    title: "heroImg4",
    thumbnail: "/images/heroImg4.png",
  },
  {
    title: "heroImg5",
    thumbnail: "/images/heroImg5.png",
  },
  {
    title: "heroImg6",
    thumbnail: "/images/heroImg6.png",
  },
  {
    title: "heroImg7",
    thumbnail: "/images/heroImg7.png",
  },
  {
    title: "heroImg8",
    thumbnail: "/images/heroImg8.png",
  },
  {
    title: "heroImg9",
    thumbnail: "/images/heroImg9.png",
  },
  {
    title: "heroImg10",
    thumbnail: "/images/heroImg10.png",
  },
  {
    title: "heroImg11",
    thumbnail: "/images/heroImg11.png",
  },
  {
    title: "heroImg12",
    thumbnail: "/images/heroImg12.png",
  },
  {
    title: "heroImg13",
    thumbnail: "/images/heroImg13.png",
  },
  {
    title: "heroImg14",
    thumbnail: "/images/heroImg14.png",
  },
  {
    title: "heroImg15",
    thumbnail: "/images/heroImg15.png",
  },
  {
    title: "heroImg16",
    thumbnail: "/images/heroImg16.png",
  },
  {
    title: "heroImg17",
    thumbnail: "/images/heroImg17.png",
  },
  {
    title: "heroImg18",
    thumbnail: "/images/heroImg18.png",
  },
  {
    title: "heroImg19",
    thumbnail: "/images/heroImg19.png",
  },
  {
    title: "heroImg20",
    thumbnail: "/images/heroImg20.jpg",
  },
  {
    title: "heroImg21",
    thumbnail: "/images/heroImg21.png",
  },
  {
    title: "heroImg22",
    thumbnail: "/images/heroImg22.png",
  },
  {
    title: "heroImg23",
    thumbnail: "/images/heroImg23.png",
  },
  {
    title: "heroImg24",
    thumbnail: "/images/heroImg24.png",
  },
];
