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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Monitor,
  RotateCcw,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MCQQuestion } from "../../backend";
import type { ExamConfig } from "../../data/examConfig";

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

type QStatus = "not-visited" | "not-answered" | "answered" | "marked";

export default function TCSMCQInterface({
  examConfig,
  questions,
  mode,
  candidateName = "Candidate",
  rollNo = "2024001",
  onComplete,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(examConfig.duration * 60);
  const [submitted, setSubmitted] = useState(false);
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

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const getStatus = (i: number): QStatus => {
    if (answers[i] !== undefined) return "answered";
    if (marked.has(i)) return "marked";
    if (visited.has(i)) return "not-answered";
    return "not-visited";
  };

  const statusStyle: Record<QStatus, string> = {
    "not-visited": "bg-gray-200 text-gray-700",
    "not-answered": "bg-red-100 text-red-700 border border-red-300",
    answered: "bg-green-500 text-white",
    marked: "bg-purple-500 text-white",
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
  const handleMark = () =>
    setMarked((prev) => {
      const n = new Set(prev);
      n.has(current) ? n.delete(current) : n.add(current);
      return n;
    });

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

  const getQuestionParts = (text: string) => {
    const parts = text.split("\n");
    return { hi: parts[0] || text, en: parts[1] || "" };
  };

  const q = questions[current];
  const qParts = getQuestionParts(q.questionText);
  const options = [q.option1, q.option2, q.option3, q.option4];
  const sectionAttempts = examConfig.sections.map((_sec, si) => {
    const perSec = Math.floor(questions.length / examConfig.sections.length);
    const start = si * perSec;
    const end = start + perSec;
    return Object.keys(answers).filter(
      (k) => Number(k) >= start && Number(k) < end,
    ).length;
  });

  if (submitted) {
    const score = questions.reduce(
      (acc, q2, i) => (answers[i] === Number(q2.correctAnswer) ? acc + 1 : acc),
      0,
    );
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full"
          data-ocid="tcs.success_state"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🚂</div>
            <h2 className="text-2xl font-bold" style={{ color: "#E65100" }}>
              Test Submitted
            </h2>
            <p className="text-gray-500">{examConfig.fullName}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {questions.length - score}
              </div>
              <div className="text-xs text-gray-500">Wrong</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full text-white"
            style={{ background: "#E65100" }}
            data-ocid="tcs.primary_button"
          >
            Attempt Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* TCS Ion Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #E65100 0%, #FF8C00 100%)",
        }}
        className="text-white"
      >
        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-white text-orange-600 font-black px-2 py-0.5 rounded text-sm">
              TCS
            </div>
            <div className="font-bold text-lg">iON</div>
            <div className="text-orange-200 text-xs hidden sm:block">|</div>
            <div className="text-sm font-medium hidden sm:block">
              {examConfig.fullName}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold">{candidateName}</div>
                <div className="text-orange-200">Reg: {rollNo}</div>
              </div>
            </div>
            <div
              className="bg-white text-red-600 px-3 py-1.5 rounded-md font-mono font-bold text-lg flex items-center gap-1.5"
              data-ocid="tcs.panel"
            >
              <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto border-t border-orange-400">
          {examConfig.sections.map((sec, i) => (
            <button
              key={sec.name}
              type="button"
              onClick={() => setActiveSection(i)}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === i
                  ? "bg-white text-orange-700 font-bold"
                  : "text-orange-100 hover:bg-orange-600"
              }`}
              data-ocid="tcs.tab"
            >
              {sec.name}
              <span
                className={`ml-1.5 text-xs ${
                  activeSection === i ? "text-orange-500" : "text-orange-300"
                }`}
              >
                ({sectionAttempts[i]}/{sec.questions})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* System Node Bar */}
      <div className="bg-gray-800 text-gray-300 px-4 py-1 flex items-center gap-4 text-xs">
        <Monitor className="h-3 w-3" />
        <span>System Node: C001</span>
        <span>|</span>
        <span>
          Mode:{" "}
          {mode === "mock"
            ? "Mock Test"
            : mode === "live"
              ? "Live Test"
              : "Practice"}
        </span>
        <span className="ml-auto">
          Question {current + 1} of {questions.length}
        </span>
      </div>

      <div className="flex flex-1">
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow p-5">
              {/* Marks info */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-700">
                  Q.{current + 1}
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    +1 Mark
                  </span>
                  {examConfig.negativeMarking > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      −{examConfig.negativeMarking}
                    </span>
                  )}
                </div>
              </div>

              {/* Bilingual Question */}
              {qParts.hi && (
                <p className="text-base text-gray-800 mb-2 leading-relaxed">
                  {qParts.hi}
                </p>
              )}
              {qParts.en && (
                <>
                  <hr className="my-2 border-gray-200" />
                  <p className="text-base text-gray-700 leading-relaxed">
                    {qParts.en}
                  </p>
                </>
              )}

              {/* Options */}
              <div className="mt-5 space-y-3">
                {options.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswer(i + 1)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border-2 transition-colors text-sm ${
                      answers[current] === i + 1
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300 bg-white"
                    }`}
                    data-ocid="tcs.radio"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                        answers[current] === i + 1
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-400 text-gray-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-gray-800">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              className="h-9 text-sm"
              data-ocid="tcs.secondary_button"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleMark}
                variant="outline"
                className={`h-9 text-xs border-purple-300 text-purple-700 hover:bg-purple-50 ${marked.has(current) ? "bg-purple-100" : ""}`}
                data-ocid="tcs.toggle"
              >
                <Flag className="h-3.5 w-3.5 mr-1" />{" "}
                {marked.has(current) ? "Unmark" : "Mark for Review"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="h-9 text-xs"
                data-ocid="tcs.secondary_button"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            </div>
            <Button
              onClick={() => goTo(Math.min(questions.length - 1, current + 1))}
              className="h-9 text-sm text-white"
              style={{ background: "#E65100" }}
              data-ocid="tcs.primary_button"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-56 flex-shrink-0 border-l border-gray-200 flex flex-col bg-white overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Section Summary
            </div>
            {examConfig.sections.map((sec, i) => (
              <div
                key={sec.name}
                className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-600 truncate">
                  {sec.name.split(" ")[0]}
                </span>
                <span className="font-bold" style={{ color: "#E65100" }}>
                  {sectionAttempts[i]}/{sec.questions}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 flex-1">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Question Grid
            </div>
            <div className="grid grid-cols-5 gap-1">
              {questions.map((q, i) => (
                <button
                  key={String(q.id)}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`w-8 h-7 rounded text-xs font-bold transition-all ${
                    i === current ? "ring-2 ring-orange-400" : ""
                  } ${statusStyle[getStatus(i)]}`}
                  data-ocid={`tcs.item.${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200">
            <div className="text-xs space-y-1 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-green-500 inline-block" />
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-red-100 border border-red-300 inline-block" />
                <span className="text-gray-600">Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-purple-500 inline-block" />
                <span className="text-gray-600">Marked</span>
              </div>
            </div>
            <Button
              onClick={() => setShowConfirm(true)}
              className="w-full text-white text-sm"
              style={{ background: "#E65100" }}
              data-ocid="tcs.open_modal_button"
            >
              <BookOpen className="h-4 w-4 mr-1" /> Submit
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent data-ocid="tcs.dialog">
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
            <DialogDescription>
              You have answered {Object.keys(answers).length} out of{" "}
              {questions.length} questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              data-ocid="tcs.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="text-white"
              style={{ background: "#E65100" }}
              data-ocid="tcs.confirm_button"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
