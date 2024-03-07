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
      "Notes/Summaries",
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
      "Notes/Summaries",
      "Topical TYS Papers",
      "Topical Prelim Papers",
      "Yearly TYS Papers",
      "Yearly Prelim Papers",
    ]
  }
]


const resourcesDetails = {
  "E Math": [
    { id: "e-math-paper-1", name: "E Math Paper 1", url: "/resources/e-math-paper-1.pdf" },
    { id: "e-math-paper-2", name: "E Math Paper 2", url: "/resources/e-math-paper-2.pdf" },
    // More E Math resources...
  ],
  "A Math": [
    { id: "a-math-paper-1", name: "A Math Paper 1", url: "/resources/a-math-paper-1.pdf" },
    { id: "a-math-paper-2", name: "A Math Paper 2", url: "/resources/a-math-paper-2.pdf" },
    // More A Math resources...
  ],
  // More subjects...
};