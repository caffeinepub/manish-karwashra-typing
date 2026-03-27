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

type QStatus =
  | "not-visited"
  | "not-answered"
  | "answered"
  | "marked"
  | "answered-marked";

export default function NTAMCQInterface({
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

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const getStatus = (i: number): QStatus => {
    const isAnswered = answers[i] !== undefined;
    const isMarked = marked.has(i);
    if (isAnswered && isMarked) return "answered-marked";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    if (visited.has(i)) return "not-answered";
    return "not-visited";
  };

  const statusColors: Record<QStatus, string> = {
    "not-visited": "bg-gray-300 text-gray-700",
    "not-answered": "bg-red-500 text-white",
    answered: "bg-green-500 text-white",
    marked: "bg-purple-600 text-white",
    "answered-marked": "bg-blue-500 text-white",
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
  const answered = Object.keys(answers).length;

  if (submitted) {
    const score = questions.reduce(
      (acc, q2, i) => (answers[i] === Number(q2.correctAnswer) ? acc + 1 : acc),
      0,
    );
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#f3e5f5" }}
      >
        <div
          className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full"
          data-ocid="nta.success_state"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎓</div>
            <h2 className="text-2xl font-bold" style={{ color: "#4a0080" }}>
              Test Submitted
            </h2>
            <p className="text-gray-500">{examConfig.fullName}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="bg-red-50 rounded p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {questions.length - score}
              </div>
              <div className="text-xs text-gray-500">Wrong</div>
            </div>
            <div
              className="rounded p-4 text-center"
              style={{ background: "#f3e5f5" }}
            >
              <div className="text-2xl font-bold" style={{ color: "#4a0080" }}>
                {Math.round((score / questions.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full text-white"
            style={{ background: "#4a0080" }}
            data-ocid="nta.primary_button"
          >
            Attempt Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "system-ui, sans-serif", background: "#f5f5f5" }}
    >
      {/* NTA Header */}
      <div style={{ background: "#4a0080" }} className="text-white">
        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="text-yellow-300 font-black text-xl tracking-widest">
              NTA
            </div>
            <div className="text-purple-300 text-xs">|</div>
            <div className="text-sm font-medium">{examConfig.fullName}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-yellow-300 overflow-hidden bg-purple-700 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold">{candidateName}</div>
                <div className="text-purple-300">Roll: {rollNo}</div>
              </div>
            </div>
            <div
              className="bg-red-700 text-white px-3 py-1.5 rounded font-mono font-bold text-lg flex items-center gap-1.5"
              data-ocid="nta.panel"
            >
              <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto border-t border-purple-600">
          {examConfig.sections.map((sec, i) => (
            <button
              key={sec.name}
              type="button"
              onClick={() => setActiveSection(i)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${
                activeSection === i
                  ? "bg-yellow-400 text-purple-900 font-bold"
                  : "text-purple-200 hover:bg-purple-700"
              }`}
              data-ocid="nta.tab"
            >
              {sec.nameHi || sec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-gray-800 text-gray-300 px-4 py-1.5 flex items-center gap-4 text-xs">
        <Monitor className="h-3 w-3" />
        <span>
          Node: C001 |{" "}
          {mode === "mock"
            ? "Mock Test"
            : mode === "live"
              ? "Live Test"
              : "Practice"}
        </span>
        <span className="ml-auto font-medium">
          Q {current + 1} / {questions.length}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-4">
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold" style={{ color: "#4a0080" }}>
                  प्रश्न / Question {current + 1}
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                    +{examConfig.negativeMarking > 0 ? "1" : "1"}
                  </span>
                  {examConfig.negativeMarking > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold">
                      −{examConfig.negativeMarking}
                    </span>
                  )}
                </div>
              </div>

              {/* Hindi Question */}
              {qParts.hi && (
                <div
                  className="mb-3 p-3 rounded"
                  style={{ background: "#f3e5f5" }}
                >
                  <p
                    className="text-base text-gray-800 leading-relaxed"
                    style={{ fontFamily: "system-ui" }}
                  >
                    {qParts.hi}
                  </p>
                </div>
              )}

              {/* English Translation */}
              {qParts.en && (
                <div
                  className="border-l-4 pl-3 py-1"
                  style={{ borderColor: "#4a0080" }}
                >
                  <p className="text-base text-gray-700 leading-relaxed">
                    {qParts.en}
                  </p>
                </div>
              )}

              {/* Options */}
              <div className="mt-5 space-y-3">
                {options.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswer(i + 1)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      answers[current] === i + 1
                        ? "border-purple-600 text-white"
                        : "border-gray-200 hover:border-purple-300 bg-white text-gray-800 hover:bg-purple-50"
                    }`}
                    style={
                      answers[current] === i + 1
                        ? { background: "#4a0080" }
                        : {}
                    }
                    data-ocid="nta.radio"
                  >
                    <span
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        answers[current] === i + 1
                          ? "border-white bg-white text-purple-800"
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
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              className="h-9 text-sm"
              data-ocid="nta.secondary_button"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              onClick={handleMark}
              className="h-9 text-xs bg-purple-600 hover:bg-purple-700 text-white"
              data-ocid="nta.toggle"
            >
              <Flag className="h-3.5 w-3.5 mr-1" /> Mark & Next
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="h-9 text-xs"
              data-ocid="nta.secondary_button"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear
            </Button>
            <Button
              onClick={() => goTo(Math.min(questions.length - 1, current + 1))}
              className="h-9 text-sm text-white ml-auto"
              style={{ background: "#4a0080" }}
              data-ocid="nta.primary_button"
            >
              Save & Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="w-60 flex-shrink-0 border-l border-gray-200 flex flex-col bg-white overflow-y-auto">
          <div
            className="p-3 border-b text-center"
            style={{ background: "#f3e5f5" }}
          >
            <div className="w-12 h-14 bg-purple-100 rounded mx-auto mb-2 flex items-center justify-center">
              <User className="h-7 w-7 text-purple-400" />
            </div>
            <div className="text-xs font-semibold" style={{ color: "#4a0080" }}>
              {candidateName}
            </div>
            <div className="text-xs text-gray-500">Roll: {rollNo}</div>
          </div>

          {/* Legend */}
          <div className="p-3 border-b">
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Legend:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {(
                [
                  ["not-visited", "Not Visited"],
                  ["not-answered", "Not Answered"],
                  ["answered", "Answered"],
                  ["marked", "Marked"],
                  ["answered-marked", "Ans+Marked"],
                ] as [QStatus, string][]
              ).map(([status, label]) => (
                <div key={status} className="flex items-center gap-1">
                  <span
                    className={`w-4 h-4 rounded-sm text-xs flex items-center justify-center ${statusColors[status]}`}
                  />
                  <span className="text-gray-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="p-3 border-b grid grid-cols-2 gap-2 text-center">
            <div className="bg-green-50 rounded p-2">
              <div className="font-bold text-green-600">{answered}</div>
              <div className="text-xs text-gray-500">Answered</div>
            </div>
            <div className="bg-red-50 rounded p-2">
              <div className="font-bold text-red-500">
                {questions.length - answered}
              </div>
              <div className="text-xs text-gray-500">Unanswered</div>
            </div>
          </div>

          {/* Palette */}
          <div className="p-3 flex-1">
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={String(q.id)}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                    i === current ? "ring-2 ring-yellow-400" : ""
                  } ${statusColors[getStatus(i)]}`}
                  data-ocid={`nta.item.${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t">
            <Button
              onClick={() => setShowConfirm(true)}
              className="w-full text-white text-sm"
              style={{ background: "#4a0080" }}
              data-ocid="nta.open_modal_button"
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent data-ocid="nta.dialog">
          <DialogHeader>
            <DialogTitle>Submit Test? / परीक्षा सबमिट करें?</DialogTitle>
            <DialogDescription>
              Answered: {answered} | Unanswered: {questions.length - answered}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              data-ocid="nta.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="text-white"
              style={{ background: "#4a0080" }}
              data-ocid="nta.confirm_button"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
