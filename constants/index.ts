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

export const footerLinks = [
  {
    id:"footerLink1",
    label: "About Us",
    route: "/",
    icon: "/icons/home.svg",
  },
  {
    id:"footerLink2",
    label: "Contact",
    route: "/",
    icon: "/icons/home.svg",
  },
  {
    id:"footerLink3",
    label: "Feedback",
    route: "/",
    icon: "/icons/home.svg",
  },
]

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
export const heroImages = [
  {
    title: "Chem",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg1.jpg",
  },
  {
    title: "Phy",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg2.jpg",
  },
  {
    title: "Chem",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg3.png",
  },
 
  {
    title: "Math",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg4.jpg",
  },
  {
    title: "Math",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg5.png",
  },
  {
    title: "Phy",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg6.png",
  },
 
  {
    title: "Phy",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg7.jpg",
  },
  {
    title: "Math",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg8.webp",
  },
  {
    title: "Math",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg9.png",
  },
  {
    title: "Math",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg10.jpg",
  },
  {
    title: "Math",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg11.jpg",
  },
 
  {
    title: "Math",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg12.png",
  },
  {
    title: "Chem",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg13.png",
  },
  {
    title: "Chem",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg14.webp",
  },
  {
    title: "Phy",
    link: "/images/pickContentCTA.webp",
    thumbnail:
      "/images/heroImg15.jpg",
  },
];