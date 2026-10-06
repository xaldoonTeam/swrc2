import { assetUrl } from "../Api/client";

export type LandingStat = { number: string; label: string };
export type LandingPartner = { name: string; logo: string };
export type LandingAlumni = {
  name: string;
  title: string;
  story: string;
  quote: string;
  image: string;
  achievement: string;
  location: string;
  color: string;
};
export type LandingMetric = { value: string; label: string };

export type LandingContent = {
  hero: {
    headline: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
    imageAlt: string;
    stats: LandingStat[];
  };
  welcome: {
    titleLine1: string;
    titleHighlight: string;
    paragraph: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    imageMain: string;
    imageMainAlt: string;
    imageOverlay: string;
    imageOverlayAlt: string;
  };
  programs: {
    eyebrow: string;
    heading: string;
    ctaText: string;
    ctaLink: string;
  };
  partners: {
    heading: string;
    description: string;
    items: LandingPartner[];
  };
  alumni: {
    badge: string;
    headingPrefix: string;
    headingHighlight: string;
    description: string;
    storyLabel: string;
    roleLabel: string;
    ctaText: string;
    ctaLink: string;
    stories: LandingAlumni[];
    stats: LandingMetric[];
  };
};

export const ALUMNI_COLOR_OPTIONS = [
  { value: "from-indigo-500 to-purple-600", label: "Indigo" },
  { value: "from-blue-500 to-cyan-500", label: "Blue" },
  { value: "from-amber-500 to-orange-500", label: "Amber" },
  { value: "from-emerald-500 to-teal-500", label: "Green" },
  { value: "from-rose-500 to-pink-500", label: "Rose" },
  { value: "from-orange-500 to-red-500", label: "Orange" },
];

export const EMPTY_ALUMNI: LandingAlumni = {
  name: "",
  title: "SWRC Graduate",
  story: "",
  quote: "",
  image: "",
  achievement: "",
  location: "",
  color: "from-orange-500 to-red-500",
};

export const LANDING_DEFAULTS: LandingContent = {
  hero: {
    headline: "Equipping Women with Skills, Knowledge, and the Power to Lead.",
    ctaText: "View all Programs",
    ctaLink: "/programs",
    backgroundImage: "/im.jpg",
    imageAlt: "Women workplace background",
    stats: [
      { number: "6k", label: "participants served" },
      { number: "1,321", label: "volunteer hours" },
      { number: "5+", label: "years of experience" },
    ],
  },
  welcome: {
    titleLine1: "Somaliland",
    titleHighlight: "Women's Resource Centre !",
    paragraph:
      "Empowering young women with the skills, knowledge, and leadership to build careers, claim their rights, and create resilient communities.",
    features: [
      "Skills for Employment",
      "Mentorship & Leadership Development",
      "Women’s Rights & GBV Prevention",
      "Climate Action & Community Resilience",
    ],
    ctaText: "Read more",
    ctaLink: "/about",
    imageMain: "/welcome.jpg",
    imageMainAlt: "Women training group",
    imageOverlay: "/dumar.jpg",
    imageOverlayAlt: "Woman smiling",
  },
  programs: {
    eyebrow: "Our Programs",
    heading: "Equipping women for success",
    ctaText: "View All Programs",
    ctaLink: "/programs",
  },
  partners: {
    heading: "Our Partners",
    description:
      "We collaborate with government institutions, NGOs, and international organizations to expand opportunities for women.",
    items: [
      { name: "Government", logo: "/somaliland.png" },
      { name: "OXFAM", logo: "https://www.google.com/s2/favicons?domain=oxfam.org&sz=128" },
      { name: "ActionAid", logo: "https://www.google.com/s2/favicons?domain=actionaid.org&sz=128" },
      { name: "Plan International", logo: "https://www.google.com/s2/favicons?domain=plan-international.org&sz=128" },
      { name: "Hargeisa CC", logo: "/xarunta.jpeg" },
      { name: "HAVOYOCO", logo: "/hav.jpeg" },
      { name: "NAFIS Network", logo: "/nafis.jpeg" },
    ],
  },
  alumni: {
    badge: "Alumni Stories",
    headingPrefix: "Meet Our",
    headingHighlight: "Alumni",
    description: "Real stories from graduates who transformed their lives through our programs",
    storyLabel: "Alumni Story",
    roleLabel: "Current Role",
    ctaText: "Read full story",
    ctaLink: "/stories",
    stories: [
      {
        name: "Hanna",
        title: "SWRC Graduate",
        story:
          "Hanna participated in multiple trainings, gaining skills that strengthened her confidence, leadership, and career direction.",
        quote:
          "The SWRC programs didnt just train me — they transformed my confidence and opened new opportunities for my future.",
        image: "hanna.jpg",
        achievement: "Project Officer",
        location: "Baadi goob ORG",
        color: "from-indigo-500 to-purple-600",
      },
      {
        name: "Muna",
        title: "SWRC Graduate",
        story:
          "From learning basic coding to landing a software engineering role, Ahmed's journey shows the power of dedication and the right support system.",
        quote: "I went from never writing a line of code to building production applications in less than a year.",
        image: "muna.JPG",
        achievement: "Software Engineer",
        location: "hargiesa, Somaliland",
        color: "from-blue-500 to-cyan-500",
      },
      {
        name: "Nasra",
        title: "SWRC Graduate",
        story:
          "Through mentorship and training, Nasra gained essential skills, secured an internship, and is now working as an SGBV Counselor.",
        quote: "SWRC did not just train me — it connected me to real opportunities that led to my career.",
        image: "nasra.JPG",
        achievement: "Project Officer",
        location: "WAAPO ORG",
        color: "from-amber-500 to-orange-500",
      },
      {
        name: "hodo Hassan",
        title: "SWRC Graduate",
        story:
          "After military service, Carlos found new purpose in cybersecurity, protecting the digital frontier with the same dedication he served with.",
        quote: "The skills are different, but the mission—protecting others—remains the same.",
        image: "hodo.JPG",
        achievement: "Bussiness owner",
        location: "hargiesa, Somaliland",
        color: "from-emerald-500 to-teal-500",
      },
      {
        name: "Nasra",
        title: "SWRC Graduate",
        story:
          "Through mentorship and training, Nasra gained essential skills, secured an internship, and is now working as an SGBV Counselor.",
        quote: "",
        image: "nasra.JPG",
        achievement: "Bussines owner",
        location: "hargiesa, Somaliland",
        color: "from-amber-500 to-orange-500",
      },
      {
        name: "MAWAHIB",
        title: "SWRC Graduate",
        story:
          "Through the program, Mawahib gained essential skills, built confidence, and is now ready to pursue new opportunities and make a positive impact.",
        quote: "The SWRC Employability Skills Training transformed my confidence and prepared me for real opportunities.",
        image: "mawahin.JPG",
        achievement: "works at Minister of Labour Social Affairs",
        location: "hargiesa, Somaliland",
        color: "from-blue-500 to-cyan-500",
      },
    ],
    stats: [
      { value: "20+", label: "Alumni" },
      { value: "55%", label: "Employment Rate" },
      { value: "10+", label: "Partner Companies" },
    ],
  },
};

export function mergeLanding(value: unknown): LandingContent {
  const src = value && typeof value === "object" ? (value as Partial<LandingContent>) : {};
  return {
    hero: {
      ...LANDING_DEFAULTS.hero,
      ...src.hero,
      stats: src.hero?.stats ?? LANDING_DEFAULTS.hero.stats,
    },
    welcome: {
      ...LANDING_DEFAULTS.welcome,
      ...src.welcome,
      features: src.welcome?.features ?? LANDING_DEFAULTS.welcome.features,
    },
    programs: { ...LANDING_DEFAULTS.programs, ...src.programs },
    partners: {
      ...LANDING_DEFAULTS.partners,
      ...src.partners,
      items: src.partners?.items ?? LANDING_DEFAULTS.partners.items,
    },
    alumni: {
      ...LANDING_DEFAULTS.alumni,
      ...src.alumni,
      stories: src.alumni?.stories ?? LANDING_DEFAULTS.alumni.stories,
      stats: src.alumni?.stats ?? LANDING_DEFAULTS.alumni.stats,
    },
  };
}

/** Public-folder paths stay on the site. Uploaded files are served by the API. */
export function landingImage(path: string): string {
  const value = path.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads")) return assetUrl(value);
  return value.startsWith("/") ? value : `/${value}`;
}
