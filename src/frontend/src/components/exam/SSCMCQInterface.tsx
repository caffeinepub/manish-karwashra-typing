import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Monitor,
  RotateCcw,
  Save,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MCQQuestion } from "../../backend";
import type { ExamConfig } from "../../data/examConfig";
import Certificate from "../Certificate";

interface Props {
  examConfig: ExamConfig;
  questions: MCQQuestion[];
  mode: "practice" | "mock" | "live";
  candidateName?: string;
  rollNo?: string;
  onComplete?: (result: {
    score: number;
    total: number;
    answers: Record<number, number>;
  }) => void;
}

type QStatus =
  | "not-visited"
  | "not-answered"
  | "answered"
  | "marked"
  | "answered-marked";

export default function SSCMCQInterface({
  examConfig,
  questions,
  mode: _mode,
  candidateName = "Candidate",
  rollNo = "2024001",
  onComplete,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [lang, setLang] = useState("English");
  const [timeLeft, setTimeLeft] = useState(examConfig.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-submit when all questions are answered
  useEffect(() => {
    if (
      !submitted &&
      Object.keys(answers).length === questions.length &&
      questions.length > 0
    ) {
      const timer = setTimeout(() => handleSubmit(), 800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, submitted, questions.length]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const getStatus = (i: number): QStatus => {
    const isAnswered = answers[i] !== undefined;
    const isMarked = marked.has(i);
    const isVisited = visited.has(i);
    if (isAnswered && isMarked) return "answered-marked";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    if (isVisited) return "not-answered";
    return "not-visited";
  };

  const statusColors: Record<QStatus, string> = {
    "not-visited": "bg-gray-400 text-white",
    "not-answered": "bg-red-500 text-white",
    answered: "bg-green-500 text-white",
    marked: "bg-purple-600 text-white",
    "answered-marked": "bg-teal-500 text-white",
  };

  const goTo = (i: number) => {
    setCurrent(i);
    setVisited((v) => new Set(v).add(i));
  };

  const handleAnswer = (opt: number) =>
    setAnswers((prev) => ({ ...prev, [current]: opt }));
  const handleClear = () =>
    setAnswers((prev) => {
      const n = { ...prev };
      delete n[current];
      return n;
    });
  const handleMark = () => {
    setMarked((prev) => {
      const n = new Set(prev);
      n.has(current) ? n.delete(current) : n.add(current);
      return n;
    });
    if (current < questions.length - 1) goTo(current + 1);
  };
  const handleSaveNext = () => {
    if (current < questions.length - 1) goTo(current + 1);
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const score = questions.reduce(
      (acc, q, i) => (answers[i] === Number(q.correctAnswer) ? acc + 1 : acc),
      0,
    );
    setSubmitted(true);
    setShowConfirm(false);
    onComplete?.({ score, total: questions.length, answers });
  };

  const answered = Object.keys(answers).length;
  const notAnswered = visited.size - answered;
  const notVisited = questions.length - visited.size;

  // Split question text into Hindi and English
  const getQuestionParts = (text: string) => {
    const parts = text.split("\n");
    return { hi: parts[0] || text, en: parts[1] || "" };
  };

  const q = questions[current];
  const qParts = getQuestionParts(q.questionText);
  const options = [q.option1, q.option2, q.option3, q.option4];

  if (submitted) {
    const score = questions.reduce(
      (acc, q2, i) => (answers[i] === Number(q2.correctAnswer) ? acc + 1 : acc),
      0,
    );
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full"
          data-ocid="ssc.success_state"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">📋</div>
            <h2 className="text-2xl font-bold text-[#1a237e]">
              Exam Submitted / परीक्षा सबमिट हुई
            </h2>
            <p className="text-gray-500">{examConfig.fullName}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-500">Correct / सही</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {questions.length - score}
              </div>
              <div className="text-sm text-gray-500">Wrong / गलत</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Score / स्कोर</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-amber-50 rounded-lg p-3 mb-4">
            <strong>Negative Marking:</strong>{" "}
            {examConfig.negativeMarking > 0
              ? `−${examConfig.negativeMarking} per wrong answer`
              : "None"}{" "}
            &nbsp;|&nbsp;
            <strong>Net Score:</strong>{" "}
            {(
              score -
              (questions.length - score - (questions.length - answered)) *
                examConfig.negativeMarking
            ).toFixed(2)}
          </div>
          {Math.round((score / questions.length) * 100) >= 60 && (
            <div className="text-center mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
              <div className="text-green-700 font-semibold text-sm">
                🎓 Congratulations! You have qualified this test.
              </div>
              <div className="text-green-600 text-xs mt-1">
                Minimum qualifying score: 60%
              </div>
            </div>
          )}

          {/* Answer Key / उत्तर कुंजी */}
          <div className="mb-5">
            <h3 className="font-bold text-[#1a237e] mb-2 text-sm">
              📋 Answer Key / उत्तर कुंजी
            </h3>
            <div
              className="border rounded-lg overflow-y-auto"
              style={{ maxHeight: 360 }}
            >
              {questions.map((q2, i) => {
                // key fixed
                const userAns = answers[i];
                const correctAns = Number(q2.correctAnswer);
                const isCorrect = userAns === correctAns;
                const options = [
                  q2.option1,
                  q2.option2,
                  q2.option3,
                  q2.option4,
                ];
                return (
                  <div
                    key={q2.questionText.slice(0, 30)}
                    className={`p-3 border-b text-xs ${isCorrect ? "bg-green-50" : userAns !== undefined ? "bg-red-50" : "bg-gray-50"}`}
                  >
                    <div className="font-semibold text-gray-700 mb-1">
                      Q{i + 1}: {q2.questionText.slice(0, 90)}
                      {q2.questionText.length > 90 ? "..." : ""}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}
                      >
                        आपका उत्तर:{" "}
                        {userAns !== undefined
                          ? options[userAns]
                          : "Not Answered"}
                      </span>
                      {!isCorrect && (
                        <span className="text-green-700 font-medium">
                          ✅ सही उत्तर: {options[correctAns]}
                        </span>
                      )}
                      {isCorrect && (
                        <span className="text-green-600">✅ सही!</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3">
            {Math.round((score / questions.length) * 100) >= 60 && (
              <Button
                onClick={() => setShowCertificate(true)}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                data-ocid="ssc.primary_button"
              >
                🎓 Get Certificate
              </Button>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-[#1a237e] text-white"
              data-ocid="ssc.primary_button"
            >
              Try Again / फिर से प्रयास करें
            </Button>
          </div>
          {showCertificate && (
            <Certificate
              type="mcq"
              candidateName="Candidate"
              examName={examConfig.fullName || examConfig.name}
              score={score}
              totalQuestions={questions.length}
              onClose={() => setShowCertificate(false)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Top Header Bar */}
      <div style={{ background: "#1a237e" }} className="text-white">
        <div className="flex items-center justify-between px-3 py-2 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="font-bold text-lg tracking-wide">SSC CBT</div>
            <div className="text-blue-300 text-xs hidden sm:block">|</div>
            <div className="text-sm hidden sm:block">{examConfig.fullName}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <Monitor className="h-3.5 w-3.5" />
              <span>System Node No: C001</span>
            </div>
            <div
              className="bg-red-600 text-white px-3 py-1 rounded font-mono font-bold text-lg flex items-center gap-1.5"
              data-ocid="ssc.panel"
            >
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold">{candidateName}</div>
              <div className="text-blue-300">Roll No: {rollNo}</div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto border-t border-blue-700">
          {examConfig.sections.map((sec, i) => (
            <button
              key={sec.name}
              type="button"
              onClick={() => setActiveSection(i)}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeSection === i
                  ? "border-yellow-400 text-yellow-300 bg-blue-800"
                  : "border-transparent text-blue-200 hover:text-white hover:bg-blue-800"
              }`}
              data-ocid="ssc.tab"
            >
              {sec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-1.5 flex items-center justify-between">
        <div className="text-xs text-gray-600">
          Question <strong>{current + 1}</strong> of{" "}
          <strong>{questions.length}</strong> &nbsp;|&nbsp;
          <span className="text-green-700 font-medium">
            Marks: +{examConfig.negativeMarking > 0 ? "2" : "1"}
          </span>{" "}
          &nbsp;
          <span className="text-red-600 font-medium">
            Negative: −{examConfig.negativeMarking}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">View in:</span>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="h-7 text-xs w-32" data-ocid="ssc.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">हिंदी</SelectItem>
              <SelectItem value="Bilingual">Bilingual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question Panel (70%) */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4 flex-1">
            <div className="bg-white border border-gray-300 rounded p-4 min-h-full">
              <div className="text-sm font-semibold text-gray-500 mb-3">
                Question No. {current + 1}
              </div>

              {/* Bilingual Question */}
              <div className="mb-5">
                {(lang === "Hindi" || lang === "Bilingual") && qParts.hi && (
                  <p
                    className="text-base text-gray-800 mb-2"
                    style={{ fontFamily: "system-ui" }}
                  >
                    {qParts.hi}
                  </p>
                )}
                {lang !== "Hindi" && qParts.en && (
                  <p className="text-base text-gray-800 font-medium">
                    {qParts.en}
                  </p>
                )}
                {!qParts.en && lang !== "Hindi" && (
                  <p className="text-base text-gray-800 font-medium">
                    {qParts.hi}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswer(i + 1)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded border-2 transition-colors text-sm ${
                      answers[current] === i + 1
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-gray-300 hover:border-blue-400 bg-white text-gray-800"
                    }`}
                    data-ocid="ssc.radio"
                  >
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        answers[current] === i + 1
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-400 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-100 border-t border-gray-300 px-4 py-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              className="text-xs h-8"
              data-ocid="ssc.secondary_button"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button
              onClick={handleMark}
              className="text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white"
              data-ocid="ssc.toggle"
            >
              <Flag className="h-3.5 w-3.5 mr-1" /> Mark for Review & Next
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="text-xs h-8"
              data-ocid="ssc.secondary_button"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear Response
            </Button>
            <Button
              onClick={handleSaveNext}
              className="text-xs h-8 bg-blue-800 hover:bg-blue-900 text-white ml-auto"
              data-ocid="ssc.primary_button"
            >
              <Save className="h-3.5 w-3.5 mr-1" /> Save & Next{" "}
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Right: Question Palette (30%) */}
        <div className="w-64 flex-shrink-0 border-l border-gray-300 flex flex-col bg-gray-50 overflow-y-auto">
          {/* Candidate Info */}
          <div className="bg-white border-b border-gray-300 p-3 text-center">
            <div className="w-12 h-14 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
              <User className="h-7 w-7 text-gray-400" />
            </div>
            <div className="text-xs font-semibold text-gray-800">
              {candidateName}
            </div>
            <div className="text-xs text-gray-500">Roll No: {rollNo}</div>
          </div>

          {/* Legend */}
          <div className="p-3 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Legend:
            </div>
            <div className="space-y-1.5">
              {(
                [
                  ["not-visited", "Not Visited"],
                  ["not-answered", "Not Answered"],
                  ["answered", "Answered"],
                  ["marked", "Marked for Review"],
                  ["answered-marked", "Ans & Marked"],
                ] as [QStatus, string][]
              ).map(([status, label]) => (
                <div key={status} className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${statusColors[status]}`}
                  >
                    1
                  </span>
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="p-3 border-b border-gray-200 grid grid-cols-3 gap-1 text-center">
            <div>
              <div className="text-base font-bold text-green-600">
                {answered}
              </div>
              <div className="text-xs text-gray-500">Answered</div>
            </div>
            <div>
              <div className="text-base font-bold text-red-500">
                {notAnswered}
              </div>
              <div className="text-xs text-gray-500">Not Ans</div>
            </div>
            <div>
              <div className="text-base font-bold text-gray-400">
                {notVisited}
              </div>
              <div className="text-xs text-gray-500">Not Visit</div>
            </div>
          </div>

          {/* Question Palette */}
          <div className="p-3 flex-1">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Question Palette:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, i) => {
                const status = getStatus(i);
                return (
                  <button
                    key={String(q.id)}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                      i === current
                        ? "ring-2 ring-yellow-400 ring-offset-1"
                        : ""
                    } ${statusColors[status]}`}
                    data-ocid={`ssc.item.${i + 1}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-3 border-t border-gray-300">
            <Button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
              data-ocid="ssc.open_modal_button"
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent data-ocid="ssc.dialog">
          <DialogHeader>
            <DialogTitle>Submit Examination?</DialogTitle>
            <DialogDescription>
              Once submitted, you cannot change your answers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 rounded p-3 text-center">
              <div className="text-xl font-bold text-green-600">{answered}</div>
              <div className="text-gray-600">Answered</div>
            </div>
            <div className="bg-red-50 rounded p-3 text-center">
              <div className="text-xl font-bold text-red-500">
                {questions.length - answered}
              </div>
              <div className="text-gray-600">Not Answered</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              data-ocid="ssc.cancel_button"
            >
              Cancel / रद्द
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-ocid="ssc.confirm_button"
            >
              Submit / सबमिट
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
