import type { MCQQuestion } from "../backend";
import { BANKING_FULL } from "./questions/banking";
import { COMPUTER_FULL } from "./questions/computer";
import { CTET_FULL } from "./questions/ctet";
import { HARYANA_FULL } from "./questions/haryana";
import { RAILWAY_FULL } from "./questions/railway";
import { SSC_FULL } from "./questions/ssc";

let _id = 1;
const mkQ = (
  examCategory: string,
  questionText: string,
  questionHi: string,
  o1: string,
  o2: string,
  o3: string,
  o4: string,
  correct: number,
  language = "Bilingual",
): MCQQuestion => ({
  id: BigInt(_id++),
  examCategory,
  language,
  questionText: `${questionHi}\n${questionText}`,
  option1: o1,
  option2: o2,
  option3: o3,
  option4: o4,
  correctAnswer: BigInt(correct),
});

// Legacy small sets (kept for backward compatibility)
export const SSC_QUESTIONS: MCQQuestion[] = SSC_FULL;
export const RAILWAY_QUESTIONS: MCQQuestion[] = RAILWAY_FULL;
export const NTA_CTET_QUESTIONS: MCQQuestion[] = CTET_FULL;
export const BANKING_QUESTIONS: MCQQuestion[] = BANKING_FULL;
export const COMPUTER_QUESTIONS: MCQQuestion[] = COMPUTER_FULL;
export const HARYANA_QUESTIONS: MCQQuestion[] = HARYANA_FULL;

export const ALL_QUESTIONS: MCQQuestion[] = [
  ...SSC_FULL,
  ...RAILWAY_FULL,
  ...CTET_FULL,
  ...BANKING_FULL,
  ...COMPUTER_FULL,
  ...HARYANA_FULL,
];

export const GENERAL_QUESTIONS: MCQQuestion[] = [
  ...SSC_FULL.slice(0, 8),
  ...RAILWAY_FULL.slice(0, 5),
  ...BANKING_FULL.slice(0, 5),
  ...COMPUTER_FULL.slice(0, 5),
  ...HARYANA_FULL.slice(0, 7),
];

// Utility: shuffle an array using Fisher-Yates
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Get custom questions from admin panel (localStorage)
function getAdminQuestions(): MCQQuestion[] {
  try {
    const stored = localStorage.getItem("admin_mcq_questions");
    if (!stored) return [];
    const parsed = JSON.parse(stored) as MCQQuestion[];
    return parsed.map((q) => ({
      ...q,
      id: BigInt(q.id as unknown as string),
      correctAnswer: BigInt(q.correctAnswer as unknown as string),
    }));
  } catch {
    return [];
  }
}

export function getQuestionsForExam(examId: string): MCQQuestion[] {
  const adminQs = getAdminQuestions().filter(
    (q) =>
      !q.examCategory || q.examCategory === examId || q.examCategory === "all",
  );

  let pool: MCQQuestion[];

  if (examId.includes("railway") || examId.includes("ntpc")) {
    pool = [...RAILWAY_FULL, ...SSC_FULL.slice(20, 40)];
  } else if (
    examId.includes("ctet") ||
    examId.includes("nta") ||
    examId.includes("teaching")
  ) {
    pool = CTET_FULL;
  } else if (
    examId.includes("banking") ||
    examId.includes("ibps") ||
    examId.includes("sbi")
  ) {
    pool = [...BANKING_FULL, ...SSC_FULL.slice(20, 35)];
  } else if (examId.includes("hssc") || examId.includes("haryana")) {
    pool = [...HARYANA_FULL, ...SSC_FULL.slice(0, 20)];
  } else if (
    examId.includes("hartron") ||
    examId.includes("deo") ||
    examId.includes("computer")
  ) {
    pool = COMPUTER_FULL;
  } else if (examId.includes("dsssb") || examId.includes("delhi")) {
    pool = [...SSC_FULL, ...COMPUTER_FULL.slice(0, 20)];
  } else {
    // SSC CGL, CHSL, MTS and generic
    pool = SSC_FULL;
  }

  // Mix in admin questions
  pool = [...adminQs, ...pool];

  // Return shuffled pool (unlimited - fresh questions each time)
  return shuffle(pool);
}

// Export question counts for Admin Panel
export function getQuestionStats() {
  return {
    SSC: SSC_FULL.length,
    Railway: RAILWAY_FULL.length,
    Banking: BANKING_FULL.length,
    CTET: CTET_FULL.length,
    Computer: COMPUTER_FULL.length,
    HaryanaGK: HARYANA_FULL.length,
    Total: ALL_QUESTIONS.length,
    Admin: getAdminQuestions().length,
  };
}

// For legacy usage
const _mkQ = mkQ;
export { _mkQ as mkQ };
