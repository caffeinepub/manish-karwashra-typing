export type ExamType =
  | "ssc"
  | "railway"
  | "nta"
  | "banking"
  | "state"
  | "generic";
export type ExamMode = "typing" | "mcq" | "both";

export interface ExamSection {
  name: string;
  nameHi: string;
  questions: number;
  duration: number; // minutes
}

export interface ExamConfig {
  id: string;
  name: string;
  fullName: string;
  nameHi: string;
  examType: ExamType;
  mode: ExamMode;
  totalQuestions: number;
  duration: number; // minutes
  negativeMarking: number;
  languages: string[];
  typingSpeed?: { english?: number; hindi?: number };
  sections: ExamSection[];
  badge: string;
  headerColor: string;
}

export const EXAM_CONFIGS: Record<string, ExamConfig> = {
  "ssc-cgl": {
    id: "ssc-cgl",
    name: "SSC CGL",
    fullName: "SSC Combined Graduate Level",
    nameHi: "एसएससी सीजीएल",
    examType: "ssc",
    mode: "both",
    totalQuestions: 100,
    duration: 60,
    negativeMarking: 0.5,
    languages: ["English", "Hindi"],
    typingSpeed: { english: 35, hindi: 30 },
    sections: [
      {
        name: "General Intelligence & Reasoning",
        nameHi: "सामान्य बुद्धि और तर्कशक्ति",
        questions: 25,
        duration: 15,
      },
      {
        name: "General Awareness",
        nameHi: "सामान्य जागरूकता",
        questions: 25,
        duration: 15,
      },
      {
        name: "Quantitative Aptitude",
        nameHi: "मात्रात्मक योग्यता",
        questions: 25,
        duration: 15,
      },
      {
        name: "English Comprehension",
        nameHi: "अंग्रेजी",
        questions: 25,
        duration: 15,
      },
    ],
    badge: "SSC",
    headerColor: "#1a237e",
  },
  "ssc-chsl": {
    id: "ssc-chsl",
    name: "SSC CHSL",
    fullName: "SSC Combined Higher Secondary Level",
    nameHi: "एसएससी सीएचएसएल",
    examType: "ssc",
    mode: "both",
    totalQuestions: 100,
    duration: 60,
    negativeMarking: 0.5,
    languages: ["English", "Hindi"],
    typingSpeed: { english: 35, hindi: 30 },
    sections: [
      {
        name: "General Intelligence",
        nameHi: "सामान्य बुद्धि",
        questions: 25,
        duration: 15,
      },
      {
        name: "General Awareness",
        nameHi: "सामान्य जागरूकता",
        questions: 25,
        duration: 15,
      },
      {
        name: "Quantitative Aptitude (Basic)",
        nameHi: "मात्रात्मक योग्यता",
        questions: 25,
        duration: 15,
      },
      {
        name: "English Language",
        nameHi: "अंग्रेजी भाषा",
        questions: 25,
        duration: 15,
      },
    ],
    badge: "SSC",
    headerColor: "#1a237e",
  },
  "ssc-mts": {
    id: "ssc-mts",
    name: "SSC MTS",
    fullName: "SSC Multi-Tasking Staff",
    nameHi: "एसएससी एमटीएस",
    examType: "ssc",
    mode: "mcq",
    totalQuestions: 90,
    duration: 90,
    negativeMarking: 1.0,
    languages: ["English", "Hindi", "Regional"],
    sections: [
      {
        name: "Numerical & Mathematical Ability",
        nameHi: "संख्यात्मक योग्यता",
        questions: 20,
        duration: 20,
      },
      {
        name: "Reasoning Ability & Problem Solving",
        nameHi: "तर्क क्षमता",
        questions: 20,
        duration: 20,
      },
      {
        name: "General Awareness",
        nameHi: "सामान्य जागरूकता",
        questions: 25,
        duration: 25,
      },
      {
        name: "English Language & Comprehension",
        nameHi: "अंग्रेजी",
        questions: 25,
        duration: 25,
      },
    ],
    badge: "SSC",
    headerColor: "#1a237e",
  },
  "delhi-police-hcm": {
    id: "delhi-police-hcm",
    name: "Delhi Police HCM",
    fullName: "Delhi Police Head Constable Ministerial",
    nameHi: "दिल्ली पुलिस एचसीएम",
    examType: "ssc",
    mode: "both",
    totalQuestions: 100,
    duration: 90,
    negativeMarking: 0.5,
    languages: ["English", "Hindi"],
    typingSpeed: { english: 30, hindi: 25 },
    sections: [
      {
        name: "General Knowledge",
        nameHi: "सामान्य ज्ञान",
        questions: 50,
        duration: 45,
      },
      { name: "Reasoning", nameHi: "तर्कशक्ति", questions: 25, duration: 22 },
      {
        name: "Numerical Ability",
        nameHi: "संख्यात्मक योग्यता",
        questions: 25,
        duration: 23,
      },
    ],
    badge: "STATE",
    headerColor: "#006064",
  },
  "railway-ntpc": {
    id: "railway-ntpc",
    name: "Railway NTPC",
    fullName: "RRB Non-Technical Popular Categories CBT-1",
    nameHi: "रेलवे एनटीपीसी",
    examType: "railway",
    mode: "both",
    totalQuestions: 100,
    duration: 90,
    negativeMarking: 0.33,
    languages: ["English", "Hindi", "Regional"],
    typingSpeed: { english: 30, hindi: 25 },
    sections: [
      { name: "Mathematics", nameHi: "गणित", questions: 30, duration: 27 },
      {
        name: "General Intelligence & Reasoning",
        nameHi: "सामान्य बुद्धि",
        questions: 30,
        duration: 27,
      },
      {
        name: "General Awareness",
        nameHi: "सामान्य जागरूकता",
        questions: 40,
        duration: 36,
      },
    ],
    badge: "RAILWAY",
    headerColor: "#E65100",
  },
  dsssb: {
    id: "dsssb",
    name: "DSSSB",
    fullName: "Delhi Subordinate Services Selection Board Clerk",
    nameHi: "डीएसएसएसबी",
    examType: "ssc",
    mode: "both",
    totalQuestions: 200,
    duration: 120,
    negativeMarking: 0.25,
    languages: ["English", "Hindi"],
    typingSpeed: { english: 35, hindi: 30 },
    sections: [
      {
        name: "General Awareness",
        nameHi: "सामान्य जागरूकता",
        questions: 50,
        duration: 30,
      },
      {
        name: "General Intelligence & Reasoning",
        nameHi: "तर्कशक्ति",
        questions: 50,
        duration: 30,
      },
      {
        name: "Arithmetical & Numerical Ability",
        nameHi: "संख्यात्मक योग्यता",
        questions: 50,
        duration: 30,
      },
      {
        name: "Hindi & English",
        nameHi: "हिंदी व अंग्रेजी",
        questions: 50,
        duration: 30,
      },
    ],
    badge: "STATE",
    headerColor: "#006064",
  },
  hartron: {
    id: "hartron",
    name: "Hartron DEO",
    fullName: "Hartron Data Entry Operator",
    nameHi: "हार्ट्रॉन डीईओ",
    examType: "state",
    mode: "both",
    totalQuestions: 30,
    duration: 30,
    negativeMarking: 0,
    languages: ["English"],
    typingSpeed: { english: 30 },
    sections: [
      {
        name: "Computer & IT Knowledge",
        nameHi: "कंप्यूटर ज्ञान",
        questions: 30,
        duration: 30,
      },
    ],
    badge: "STATE",
    headerColor: "#006064",
  },
  hssc: {
    id: "hssc",
    name: "HSSC Clerk",
    fullName: "Haryana Staff Selection Commission Clerk",
    nameHi: "एचएसएससी क्लर्क",
    examType: "state",
    mode: "both",
    totalQuestions: 100,
    duration: 90,
    negativeMarking: 0.25,
    languages: ["English", "Hindi"],
    typingSpeed: { english: 30, hindi: 25 },
    sections: [
      {
        name: "General Studies",
        nameHi: "सामान्य अध्ययन",
        questions: 25,
        duration: 22,
      },
      {
        name: "General Science",
        nameHi: "सामान्य विज्ञान",
        questions: 25,
        duration: 22,
      },
      { name: "Mathematics", nameHi: "गणित", questions: 25, duration: 23 },
      {
        name: "Haryana GK",
        nameHi: "हरियाणा सामान्य ज्ञान",
        questions: 25,
        duration: 23,
      },
    ],
    badge: "HARYANA",
    headerColor: "#1b5e20",
  },
  banking: {
    id: "banking",
    name: "Banking",
    fullName: "Banking Prelims (IBPS/SBI)",
    nameHi: "बैंकिंग प्रीलिम्स",
    examType: "banking",
    mode: "mcq",
    totalQuestions: 100,
    duration: 60,
    negativeMarking: 0.25,
    languages: ["English", "Hindi"],
    sections: [
      {
        name: "English Language",
        nameHi: "अंग्रेजी",
        questions: 30,
        duration: 20,
      },
      {
        name: "Quantitative Aptitude",
        nameHi: "मात्रात्मक योग्यता",
        questions: 35,
        duration: 20,
      },
      {
        name: "Reasoning Ability",
        nameHi: "तर्कशक्ति",
        questions: 35,
        duration: 20,
      },
    ],
    badge: "BANKING",
    headerColor: "#0d47a1",
  },
  pcs: {
    id: "pcs",
    name: "PCS",
    fullName: "Provincial Civil Service Prelims",
    nameHi: "पीसीएस प्रीलिम्स",
    examType: "state",
    mode: "mcq",
    totalQuestions: 150,
    duration: 120,
    negativeMarking: 0.33,
    languages: ["English", "Hindi"],
    sections: [
      {
        name: "General Studies Paper I",
        nameHi: "सामान्य अध्ययन I",
        questions: 150,
        duration: 120,
      },
    ],
    badge: "STATE",
    headerColor: "#004d40",
  },
  ctet: {
    id: "ctet",
    name: "CTET",
    fullName: "Central Teacher Eligibility Test",
    nameHi: "सीटेट",
    examType: "nta",
    mode: "mcq",
    totalQuestions: 150,
    duration: 150,
    negativeMarking: 0,
    languages: ["English", "Hindi"],
    sections: [
      {
        name: "Child Development & Pedagogy",
        nameHi: "बाल विकास और शिक्षाशास्त्र",
        questions: 30,
        duration: 30,
      },
      {
        name: "Language I (Hindi)",
        nameHi: "भाषा I (हिंदी)",
        questions: 30,
        duration: 30,
      },
      {
        name: "Language II (English)",
        nameHi: "भाषा II (अंग्रेजी)",
        questions: 30,
        duration: 30,
      },
      { name: "Mathematics", nameHi: "गणित", questions: 30, duration: 30 },
      {
        name: "Environmental Studies",
        nameHi: "पर्यावरण अध्ययन",
        questions: 30,
        duration: 30,
      },
    ],
    badge: "NTA",
    headerColor: "#4a0080",
  },
};

export function getExamConfig(slugOrName: string): ExamConfig {
  // Direct match
  if (EXAM_CONFIGS[slugOrName]) return EXAM_CONFIGS[slugOrName];
  // Try normalizing
  const normalized = slugOrName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (EXAM_CONFIGS[normalized]) return EXAM_CONFIGS[normalized];
  // Fuzzy match
  const keys = Object.keys(EXAM_CONFIGS);
  const match = keys.find(
    (k) => normalized.includes(k) || k.includes(normalized),
  );
  if (match) return EXAM_CONFIGS[match];
  // Default
  return EXAM_CONFIGS["ssc-cgl"];
}
