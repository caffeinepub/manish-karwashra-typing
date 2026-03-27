export interface ExamResult {
  id: string;
  examName: string;
  examType: "typing" | "mcq";
  wpm?: number;
  accuracy?: number;
  score?: number;
  correct?: number;
  total?: number;
  passed: boolean;
  date: string;
  duration?: number;
}

const KEY = "exam_results";

export function saveExamResult(result: Omit<ExamResult, "id" | "date">) {
  const results = getExamResults();
  const newResult: ExamResult = {
    ...result,
    id: Math.random().toString(36).slice(2),
    date: new Date().toISOString(),
  };
  results.unshift(newResult);
  localStorage.setItem(KEY, JSON.stringify(results.slice(0, 200)));
}

export function getExamResults(): ExamResult[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearExamResults() {
  localStorage.removeItem(KEY);
}
