// sample-data.js
// -----------------------------------------------------------------------
// Used only while supabase-config.js still has a placeholder anon key.
// Lets the whole site be previewed instantly, with realistic content,
// before any Supabase project is wired up. Once real keys are added,
// isConfigured flips to true and database.js stops importing this
// file's data.
// -----------------------------------------------------------------------

export const sampleAbout = {
  name: "Aditya Rane",
  title: "Embedded Systems & IoT Engineer",
  photoUrl: "assets/images/placeholder-profile.jpg",
  introduction:
    "I design and build connected hardware — from microcontroller firmware to cloud-linked IoT systems — turning circuits and code into products that work in the real world.",
  education: [
    { degree: "B.Tech, Electronics & Telecommunication", school: "College of Engineering Pune", year: "2022 – 2026" },
    { degree: "Higher Secondary (Science)", school: "Vidya Pratishthan's Junior College", year: "2020 – 2022" },
  ],
  careerObjective:
    "To build reliable, low-power embedded and IoT systems, and grow into a role designing hardware-software products end to end.",
  internshipSummary:
    "Interned with two hardware-focused teams, building firmware for sensor nodes and contributing to a production IoT gateway.",
  achievements: [
    "Winner, National IoT Hackathon 2025",
    "Published a paper on low-power sensor networks at a student IEEE conference",
  ],
};

export const sampleResume = { url: "" }; // empty until a real PDF is uploaded

export const sampleSettings = {
  siteTitle: "Aditya Rane",
  logoInitials: "AR",
  social: { github: "https://github.com", linkedin: "https://linkedin.com", email: "you@example.com" },
};

export const sampleProjects = [
  {
    id: "smart-irrigation",
    name: "Smart Irrigation Controller",
    category: "IoT",
    shortDescription: "Soil-moisture-driven irrigation with a solar-powered ESP32 node and a web dashboard.",
    fullDescription:
      "A solar-powered field node reads soil moisture and temperature, decides when to open a valve, and reports status to a Firebase-backed dashboard. Designed for low power draw so it runs for weeks on a small solar panel and battery.",
    thumbnail: "assets/images/placeholder-project.jpg",
    banner: "assets/images/placeholder-project.jpg",
    gallery: ["assets/images/placeholder-project.jpg", "assets/images/placeholder-project.jpg"],
    videos: [],
    documentationUrl: "",
    hardware: ["ESP32", "Soil Moisture Sensor", "Solar Panel", "Relay Module", "18650 Battery"],
    software: ["Arduino IDE", "Firebase Console"],
    technologies: ["ESP32", "Firebase", "C++"],
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    featured: true,
    published: true,
  },
  {
    id: "home-automation-hub",
    name: "Voice-Controlled Home Automation Hub",
    category: "Embedded Systems",
    shortDescription: "STM32-based hub controlling lights and appliances over Wi-Fi and voice commands.",
    fullDescription:
      "A central hub built on STM32 that bridges Wi-Fi voice commands to relay-controlled appliances, with a fallback physical switch panel and OTA firmware updates.",
    thumbnail: "assets/images/placeholder-project.jpg",
    banner: "assets/images/placeholder-project.jpg",
    gallery: ["assets/images/placeholder-project.jpg"],
    videos: [],
    documentationUrl: "",
    hardware: ["STM32", "Relay Modules", "ESP8266 Wi-Fi Module"],
    software: ["STM32CubeIDE", "Google Assistant SDK"],
    technologies: ["STM32", "C", "Wi-Fi"],
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    featured: true,
    published: true,
  },
  {
    id: "campus-hackathon-tracker",
    name: "Hackathon Team Tracker",
    category: "Web Development",
    shortDescription: "A lightweight web app for tracking hackathon team check-ins and judging scores.",
    fullDescription:
      "Built during a 24-hour hackathon: a simple, fast web app for organizers to check teams in, assign judges, and tally scores live, backed entirely by Firestore.",
    thumbnail: "assets/images/placeholder-project.jpg",
    banner: "assets/images/placeholder-project.jpg",
    gallery: ["assets/images/placeholder-project.jpg"],
    videos: [],
    documentationUrl: "",
    hardware: [],
    software: ["Firebase Console", "VS Code"],
    technologies: ["HTML", "CSS", "JavaScript", "Firebase"],
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    featured: true,
    published: true,
  },
  {
    id: "line-follower-bot",
    name: "PID Line-Follower Robot",
    category: "College Project",
    shortDescription: "A PID-tuned line-following robot built for a college robotics competition.",
    fullDescription:
      "An Arduino-based line follower using an IR sensor array and a tuned PID control loop for smooth, fast cornering — placed 2nd in the college robotics competition.",
    thumbnail: "assets/images/placeholder-project.jpg",
    banner: "assets/images/placeholder-project.jpg",
    gallery: ["assets/images/placeholder-project.jpg"],
    videos: [],
    documentationUrl: "",
    hardware: ["Arduino Uno", "IR Sensor Array", "DC Motors", "L298N Driver"],
    software: ["Arduino IDE"],
    technologies: ["Arduino", "C++"],
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    featured: false,
    published: true,
  },
];

export const sampleExperience = {
  internship: [
    {
      id: "int-1",
      company: "GreenGrid Energy Systems",
      role: "Embedded Systems Intern",
      duration: "May 2025 – Jul 2025",
      description: "Wrote firmware for solar charge-controller sensor nodes and helped bring a field-test batch to production.",
      certificateUrl: "",
    },
  ],
  certification: [
    {
      id: "cert-1",
      title: "Embedded Systems with ARM Cortex-M",
      organization: "Coursera",
      date: new Date("2025-11-01"),
      image: "assets/images/placeholder-cert.jpg",
      verifyUrl: "",
    },
    {
      id: "cert-2",
      title: "IoT Fundamentals & Protocols",
      organization: "NPTEL",
      date: new Date("2025-06-01"),
      image: "assets/images/placeholder-cert.jpg",
      verifyUrl: "",
    },
  ],
  achievement: [
    {
      id: "ach-1",
      competition: "National IoT Hackathon 2025",
      rank: "1st Place",
      description: "Built a real-time air-quality monitoring network with the smart irrigation project's core stack.",
      photos: [],
    },
  ],
};

export const sampleSkills = {
  "Programming Languages": [
    { id: "s1", name: "C / C++", icon: "fa-solid fa-code", percentage: 90, category: "Programming Languages" },
    { id: "s2", name: "Python", icon: "fa-brands fa-python", percentage: 80, category: "Programming Languages" },
    { id: "s3", name: "JavaScript", icon: "fa-brands fa-js", percentage: 70, category: "Programming Languages" },
  ],
  Microcontrollers: [
    { id: "s4", name: "ESP32 / ESP8266", icon: "fa-solid fa-microchip", percentage: 88, category: "Microcontrollers" },
    { id: "s5", name: "STM32", icon: "fa-solid fa-microchip", percentage: 75, category: "Microcontrollers" },
    { id: "s6", name: "Arduino", icon: "fa-solid fa-microchip", percentage: 92, category: "Microcontrollers" },
  ],
  "IoT Platforms": [
    { id: "s7", name: "Firebase", icon: "fa-solid fa-cloud", percentage: 85, category: "IoT Platforms" },
    { id: "s8", name: "AWS IoT Core", icon: "fa-brands fa-aws", percentage: 60, category: "IoT Platforms" },
  ],
  "Communication Protocols": [
    { id: "s9", name: "MQTT", icon: "fa-solid fa-tower-broadcast", percentage: 82, category: "Communication Protocols" },
    { id: "s10", name: "I2C / SPI / UART", icon: "fa-solid fa-tower-broadcast", percentage: 88, category: "Communication Protocols" },
  ],
  "Software Tools": [
    { id: "s11", name: "STM32CubeIDE", icon: "fa-solid fa-toolbox", percentage: 78, category: "Software Tools" },
    { id: "s12", name: "KiCad", icon: "fa-solid fa-toolbox", percentage: 70, category: "Software Tools" },
  ],
  "Soft Skills": [
    { id: "s13", name: "Team Leadership", icon: "fa-solid fa-people-group", percentage: 85, category: "Soft Skills" },
    { id: "s14", name: "Technical Writing", icon: "fa-solid fa-pen", percentage: 80, category: "Soft Skills" },
  ],
};
