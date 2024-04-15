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
  },
  {
    id:"navLink3",
    label: "Contribute",
    route: "/contribute",
    icon: "/icons/contribute.svg",
  }
];


export const studyResourcesNav = [
  {
    id:"studyResources3",
    label: "JC",
    route: "/study-resources/JC",
    title: "Tertiary Titans Tower",
    descShort: "For JC Students",
    desc: "Stocked with rigorous exam sets and elite resources, this domain is for the persistent and ambitious. Sharpen your intellect and prepare for the ultimate triumph in the scholarly arena!",
    image: "/images/jc-section.webp"
  },
  {
    id:"studyResources2",
    label: "Secondary",
    route: "/study-resources/secondary",
    title: "Secondary Scholars Sanctum",
    descShort: "For Secondary Students",
    desc: "Arm yourself with our arsenal of detailed study materials as you navigate the twisting corridors of higher learning. Light your path to academic valor and victory!",
    image: "/images/sec-section.webp"
  },
  {
    id:"studyResources1",
    label: "Primary",
    route: "", // Coming Soon
    title: "Primary Pupils' Pavilion",
    descShort: "For Primary Students",
    desc: "Tailored to ignite curiosity and build a solid foundation, these resources mark your first step on the grand ladder of learning. Embark on an educational adventure that makes every lesson a discovery!",
    image: "/images/pri-section.webp"
  },
];


export const StudyResourceNavItems : StudyResourceNav = {
  "secondary":
  [    
    // {
    //   id:"secondaryResources1",
    //   title: "English",
    //   resources: [
    //     "Topical Practice Papers",
    //     "Yearly Practice Papers",
    //   ]
    // },
    {
      id:"secondaryResources2",
      title: "E Math",
      resources: [
        "Topical Practice Papers",
        "Yearly Practice Papers",
      ]
    },
    {
      id:"secondaryResources3",
      title: "A Math",
      resources: [
        "Topical Practice Papers",
        "Yearly Practice Papers",
      ]
    },
    // {
    //   id:"secondaryResources4",
    //   title: "Pure Chemistry",
    //   resources: [
    //     "Topical Practice Papers",
    //     "Yearly Practice Papers",
    //   ]
    // },
    // {
    //   id:"secondaryResources5",
    //   title: "Combined Chemistry",
    //   resources: [
    //     "Topical Practice Papers",
    //     "Yearly Practice Papers",
    //   ]
    // },
    // {
    //   id:"secondaryResources6",
    //   title: "Pure Physics",
    //   resources: [
    //     "Topical Practice Papers",
    //     "Yearly Practice Papers",
    //   ]
    // },
    // {
    //   id:"secondaryResources7",
    //   title: "Combined Physics",
    //   resources: [
    //     "Topical Practice Papers",
    //     "Yearly Practice Papers",
    //   ]
    // },
  ],
  "JC":
  [    
    // {
    //   id:"jcResources1",
    //   title: "H1 General Paper",
    //   resources: [
    //     "Topical Practice Papers",
    //     "Yearly Practice Papers",
    //   ]
    // },
    // {
    //   id:"jcResources2",
    //   title: "H2 Chem",
    //   resources: [
    //     "Topical Practice Papers",
    //     "Yearly Practice Papers",
    //   ]
    // },
    {
      id:"jcResources3",
      title: "H2 Math",
      resources: [
        "Topical Practice Papers",
        "Yearly Practice Papers",
      ]
    }
  ]
}


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
    thumbnail: "/images/heroImg18.jpg",
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
    thumbnail: "/images/heroImg23.jpg",
  },
  {
    title: "heroImg24",
    thumbnail: "/images/heroImg24.png",
  },
];


export const contributionFormDetails : FormFieldConfig[] = [
  {
    id:"resourceLevel",
    type:"select",
    title:"Choose Level",
    placeholder:"eg: Secondary",
    options:["Primary", "Secondary", "JC"],
    compulsory: true,
  },
  {
    id:"resourceType",
    type:"select",
    title:"Choose Resource Type",
    placeholder:"eg: Topical Practice",
    options:["Notes/Summaries", "Yearly Practice Papers", "Topical Practice Papers", "Others"],
    compulsory: true,
  },
  {
    id:"resourceSubject",
    type:"text",
    title:"Subject",
    placeholder:"eg: Chinese",
    compulsory: true,
  },
  {
    id:"totMarks",
    type:"number",
    title:"Total Marks",
    placeholder:"eg: 100",
    compulsory: false,
  },
  {
    id:"resourceUrl",
    type:"text",
    styles: "h-[35px]",
    title:"URL",
    placeholder:"drive.com/lovelyresource",
    compulsory: true,
  },
  {
    id:"resourceDesc",
    type:"textarea",
    styles:"h-[80px]",
    title:"Description",
    placeholder:"",
    compulsory: false,
  },
]

export const completedToasts = [
  {
    title: "Marked as completed!",
    desc: "Yay! The best never rest, on to the next test!",
  },
  {
    title: "Marked as completed!",
    desc: "Great hustle! On to the next puzzle!",
  },
  {
    title: "Marked as completed!",
    desc: "Cheers! Moving on with no fears!",
  },
  {
    title: "Marked as completed!",
    desc: "Kudos! On to the next test, no less!",
  },
]

export const incompleteToasts = [
  {
    title: "Marked as unattempted!",
    desc: "Every master was once a beginner. Keep pushing!",
  },
  {
    title: "Marked as unattempted!",
    desc: "Setbacks are setups for comebacks. Ready for yours?",
  },
  {
    title: "Marked as unattempted!",
    desc: "Stay strong! The challenge is tough, but so are you!",
  },
  {
    title: "Marked as unattempted!",
    desc: "Feeling defeated? You're just getting heated!",
  },
]

export const bookmarkToasts = [
  {
    title: "Challenge Bookmarked!",
    desc: "Is this the start of your victory story?!",
  },
  {
    title: "Quest Bookmarked!",
    desc: "In your sights, victory's chartered!",
  },
  {
    title: "Summit Bookmarked!",
    desc: "You've set your sights; Now ignite your lights!",
  },
  {
    title: "Objective Bookmarked!",
    desc: "Success is yours, near or far!",
  },
]

export const unbookmarkToasts = [
  {
    title: "Bookmark removed!",
    desc: "Adjusting your aim? Remember to stay focused at your goal!",
  },
  {
    title: "Bookmark removed!",
    desc: "Dreams adapt as we grow. Dare to dream new dreams!",
  },
  {
    title: "Bookmark removed!",
    desc: "Carving new courses? Carve yours with determination!",
  },
  {
    title: "Bookmark removed!",
    desc: "Chapters end but the story goes on. What will your next chapter hold?",
  },
]