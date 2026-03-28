import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Keyboard,
  Monitor,
  User,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BoldText, { stripBold } from "../components/BoldText";
import CharHighlight from "../components/CharHighlight";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TypingControlPanel from "../components/TypingControlPanel";
import UserIdentityHeader from "../components/UserIdentityHeader";
import NTAMCQInterface from "../components/exam/NTAMCQInterface";
import SSCMCQInterface from "../components/exam/SSCMCQInterface";
import TCSMCQInterface from "../components/exam/TCSMCQInterface";
import { getExamConfig } from "../data/examConfig";
import { getQuestionsForExam } from "../data/mcqQuestions";
import { paragraphs as allParagraphs } from "../data/paragraphs";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePassagesByExam, useSaveTypingResult } from "../hooks/useQueries";

const EXAMS = [
  "SSC CGL",
  "SSC CHSL",
  "Delhi Police HCM",
  "Railway NTPC",
  "DSSSB",
  "Banking",
  "PCS",
  "SSC MTS",
];

const DURATIONS: Record<string, number> = {
  "SSC CGL": 10 * 60,
  "SSC CHSL": 10 * 60,
  "Delhi Police HCM": 10 * 60,
  "Railway NTPC": 10 * 60,
  DSSSB: 15 * 60,
  Banking: 10 * 60,
  PCS: 30 * 60,
  "SSC MTS": 10 * 60,
};

const PRACTICE_PASSAGE =
  "The quick brown fox jumps over the lazy dog. Government job aspirants must practice typing every day. Speed and accuracy are both equally important for clearing the typing test.";

const INSTRUCTIONS_EN = [
  "The duration of the typing test is 10 minutes.",
  "The passage must be typed exactly as shown.",
  "Negative marking: 0.5 marks deducted per error.",
  "Backspace is NOT allowed in the actual exam.",
  "Minimum required speed: 35 WPM for English, 30 WPM for Hindi.",
  "Do not leave your seat during the examination.",
  "Any malpractice will result in immediate disqualification.",
  "The exam will auto-submit when time expires.",
];

const INSTRUCTIONS_HI = [
  "टाइपिंग परीक्षा की अवधि 10 मिनट है।",
  "पैसेज को बिल्कुल वैसे ही टाइप करना है जैसा दिखाया गया है।",
  "नकारात्मक अंकन: प्रत्येक गलती पर 0.5 अंक काटे जाएंगे।",
  "वास्तविक परीक्षा में Backspace की अनुमति नहीं है।",
  "न्यूनतम आवश्यक गति: अंग्रेजी के लिए 35 WPM, हिंदी के लिए 30 WPM।",
  "परीक्षा के दौरान अपनी सीट न छोड़ें।",
  "किसी भी कदाचार पर तत्काल अयोग्यता होगी।",
  "समय समाप्त होने पर परीक्षा स्वतः सबमिट हो जाएगी।",
];

type Phase =
  | "select"
  | "login"
  | "instructions"
  | "practice"
  | "exam"
  | "result";

const slugToExam: Record<string, string> = {
  "ssc-cgl": "SSC CGL",
  "ssc-chsl": "SSC CHSL",
  "ssc-mts": "SSC MTS",
  "delhi-police-hcm": "Delhi Police HCM",
  "railway-ntpc": "Railway NTPC",
  "ntpc-graduate": "Railway NTPC",
  "ntpc-undergraduate": "Railway NTPC",
  dsssb: "DSSSB",
  hssc: "SSC CGL",
  banking: "Banking",
  pcs: "PCS",
  ctet: "SSC CGL",
  "state-level": "SSC CGL",
  hartron: "SSC CGL",
  deo: "SSC CGL",
  "all-exam": "SSC CGL",
  clerk: "DSSSB",
  teaching: "SSC CGL",
};

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── STEP PROGRESS BAR ───────────────────────────────────────────────────────
const STEPS = [
  { label: "Registration", labelHi: "रजिस्ट्रेशन" },
  { label: "Instructions", labelHi: "निर्देश" },
  { label: "Practice", labelHi: "अभ्यास" },
  { label: "Exam", labelHi: "परीक्षा" },
];

function phaseToStep(phase: Phase): number {
  switch (phase) {
    case "login":
      return 1;
    case "instructions":
      return 2;
    case "practice":
      return 3;
    case "exam":
      return 4;
    default:
      return 0;
  }
}

function StepProgressBar({ phase }: { phase: Phase }) {
  const currentStep = phaseToStep(phase);
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-0 h-1 bg-orange-500 z-0 transition-all duration-500"
            style={{
              width: `${Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 100)}%`,
            }}
          />
          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div key={step.label} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg scale-110"
                        : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNum}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-semibold ${
                      isActive
                        ? "text-orange-600"
                        : isCompleted
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-xs ${
                      isActive
                        ? "text-orange-500"
                        : isCompleted
                          ? "text-green-500"
                          : "text-gray-300"
                    }`}
                  >
                    {step.labelHi}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sub-component for MCQ practice session (avoids hook-in-conditional issue)
function MCQPracticeSession({
  exam,
  practiceElapsed,
  examSlug,
  phase,
  onStart,
  formatTime,
}: {
  exam: string;
  practiceElapsed: number;
  examSlug: string;
  phase: Phase;
  onStart: () => void;
  formatTime: (s: number) => string;
}) {
  const sampleQ = getQuestionsForExam(examSlug)[0];
  const [selectedOpt, setSelectedOpt] = React.useState<number | null>(null);
  const [answered, setAnswered] = React.useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-green-700 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Monitor className="h-4 w-4" /> System Node No: C001
        </div>
        <div className="text-sm font-semibold">PRACTICE SESSION — {exam}</div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>Practice: {formatTime(practiceElapsed)}</span>
        </div>
      </div>
      <StepProgressBar phase={phase} />
      <main className="flex-1 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold text-green-800 mb-1">
              Practice Session
            </h2>
            <p className="text-sm text-green-700">
              Try a sample MCQ question. This does not count toward your exam
              score.
            </p>
          </div>
          {sampleQ ? (
            <div className="bg-white rounded-xl shadow p-5 mb-4">
              <p className="text-sm text-gray-500 mb-2">Sample Question:</p>
              <p className="font-semibold text-gray-800 mb-4">
                {sampleQ.questionText}
              </p>
              {(() => {
                const opts = [
                  sampleQ.option1,
                  sampleQ.option2,
                  sampleQ.option3,
                  sampleQ.option4,
                ];
                const correctIdx = Number(sampleQ.correctAnswer) - 1;
                return (
                  <div className="space-y-2">
                    {opts.map((opt, idx) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => {
                          setSelectedOpt(idx);
                          setAnswered(true);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg border transition-all ${
                          answered
                            ? idx === correctIdx
                              ? "border-green-500 bg-green-50 text-green-800"
                              : idx === selectedOpt
                                ? "border-red-500 bg-red-50 text-red-800"
                                : "border-gray-200 text-gray-600"
                            : selectedOpt === idx
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </button>
                    ))}
                    {answered && (
                      <p
                        className={`mt-3 text-sm font-medium ${selectedOpt === correctIdx ? "text-green-600" : "text-red-600"}`}
                      >
                        {selectedOpt === correctIdx
                          ? "✓ Correct!"
                          : `✗ Wrong. Correct: ${opts[correctIdx]}`}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-5 mb-4 text-center text-gray-500">
              You are ready to start the exam.
            </div>
          )}
          <Button
            onClick={onStart}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Proceed to Exam <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function MockTest() {
  const params = useParams({ strict: false });
  const examSlugParam = (params as Record<string, string>)?.examSlug;
  const mockNumber = Number.parseInt((params as any)?.mockNumber || "0");

  const [exam, setExam] = useState(
    examSlugParam ? slugToExam[examSlugParam] || "SSC CGL" : "SSC CGL",
  );
  const [phase, setPhase] = useState<Phase>(
    examSlugParam || mockNumber > 0 ? "login" : "select",
  );
  const [paraIndex, setParaIndex] = useState(0);

  // Login / registration state
  const [candidateName, setCandidateName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [category, setCategory] = useState("");
  const [loginError, setLoginError] = useState("");

  // Random session ID
  const [rollNo] = useState(
    () => `CAND${Math.floor(100000 + Math.random() * 900000)}`,
  );

  // Instructions state
  const [instrLang, setInstrLang] = useState<"en" | "hi">("en");
  const [paperLang, setPaperLang] = useState("English");
  const [keyboardLayout, setKeyboardLayout] = useState("Remington");
  const [declared, setDeclared] = useState(false);

  // Practice state
  const [practiceTyped, setPracticeTyped] = useState("");
  const [practiceStart, setPracticeStart] = useState<number | null>(null);
  const [practiceElapsed, setPracticeElapsed] = useState(0);
  const practiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Control panel state
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [textSize, setTextSize] = useState<"small" | "large">("small");
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [backspaceAllowed, setBackspaceAllowed] = useState(false);

  // Exam state
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const passageDivRef = useRef<HTMLDivElement>(null);

  // Derive examSlug: prefer param directly so getExamConfig finds ntpc-graduate etc.
  const examSlug =
    examSlugParam ||
    exam
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const { data: passages } = usePassagesByExam(examSlug);
  const { mutate: saveResult } = useSaveTypingResult();
  const { identity } = useInternetIdentity();

  const duration = selectedMinutes * 60;

  const langParas = allParagraphs.filter((p) => p.language === paperLang);
  const builtInPara =
    langParas[paraIndex % (langParas.length || 1)] || allParagraphs[0];
  const passage =
    passages && passages.length > 0
      ? stripBold(passages[paraIndex % passages.length].content)
      : stripBold(builtInPara.text);
  const passageChars = passage.split("");
  const textSizeClass = textSize === "large" ? "text-lg" : "text-sm";

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const computeWpm = useCallback((t: string, st: number | null) => {
    if (!st || t.length === 0) return 0;
    const elapsed = (Date.now() - st) / 1000 / 60;
    return Math.round(t.trim().split(/\s+/).length / Math.max(elapsed, 0.01));
  }, []);

  const computeAccuracy = useCallback((t: string, p: string) => {
    if (t.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === p[i]) correct++;
    }
    return Math.round((correct / t.length) * 100);
  }, []);

  const wpm = computeWpm(typed, startTime);
  const accuracy = computeAccuracy(typed, passage);
  const practiceWpm = computeWpm(practiceTyped, practiceStart);
  const practiceAccuracy = computeAccuracy(practiceTyped, PRACTICE_PASSAGE);

  useEffect(() => {
    if (!autoScroll || !passageDivRef.current) return;
    const spans = passageDivRef.current.querySelectorAll("span");
    const curSpan = spans[typed.length];
    if (curSpan)
      curSpan.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [typed, autoScroll]);

  useEffect(() => {
    if (phase === "practice" && practiceStart) {
      practiceTimerRef.current = setInterval(() => {
        setPracticeElapsed(Math.floor((Date.now() - practiceStart) / 1000));
      }, 1000);
    }
    return () => {
      if (practiceTimerRef.current) clearInterval(practiceTimerRef.current);
    };
  }, [phase, practiceStart]);

  useEffect(() => {
    if (examStarted && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setFinished(true);
            setPhase("result");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, finished]);

  useEffect(() => {
    if (typed.length >= passage.length && examStarted && !finished) {
      clearInterval(timerRef.current!);
      setFinished(true);
      setPhase("result");
    }
  }, [typed, passage, examStarted, finished]);

  const handleStartExam = () => {
    setTyped("");
    setTimeLeft(duration);
    setExamStarted(false);
    setFinished(false);
    setStartTime(null);
    setPhase("exam");
  };

  const handleExamInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    if (!examStarted) {
      setExamStarted(true);
      setStartTime(Date.now());
    }
    setTyped(e.target.value);
  };

  const handleExamKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace" && !backspaceAllowed) e.preventDefault();
  };

  const handleStopExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
    setPhase("result");
  };

  const handleSubmitExam = () => handleStopExam();

  const handleSaveResult = () => {
    saveResult(
      {
        wpm: BigInt(wpm),
        accuracy: BigInt(accuracy),
        duration: BigInt(duration - timeLeft),
        isPractice: false,
        userId: identity?.getPrincipal().toString() || "anonymous",
        examCategory: examSlug,
        timestamp: BigInt(Date.now()),
        passageId: BigInt(0),
        attemptNumber: BigInt(1),
      },
      { onSuccess: () => toast.success("Result saved!") },
    );
  };

  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const passageWords = passage.trim().split(/\s+/).filter(Boolean);
  const correctWords = typedWords.filter(
    (w, i) => w === passageWords[i],
  ).length;
  const totalWords = typedWords.length;
  const wrongWords = totalWords - correctWords;

  // ─── PHASE: SELECT ───────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">
              {mockNumber > 0 ? `Mock Test #${mockNumber}` : "Mock Test"}
            </h1>
            <div className="bg-white rounded-xl shadow p-8 border-2 border-[#DAA520]">
              <h2 className="text-lg font-semibold mb-6">
                Select Exam to Begin
              </h2>
              <div className="max-w-sm mb-6">
                <Label htmlFor="mock-exam-select" className="mb-2 block">
                  Select Exam
                </Label>
                <Select value={exam} onValueChange={setExam}>
                  <SelectTrigger
                    id="mock-exam-select"
                    className="border-[#DAA520]"
                    data-ocid="mock.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAMS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-amber-50 border border-[#DAA520] rounded-lg p-4 mb-6 space-y-1">
                <p className="text-sm font-semibold text-amber-800">
                  Exam Details:
                </p>
                <p className="text-sm text-amber-700">
                  Duration: {formatTime(DURATIONS[exam] || 600)}
                </p>
                <p className="text-sm text-amber-700">
                  Full exam simulation with login, instructions &amp; practice
                </p>
                <p className="text-sm text-amber-700">
                  Backspace restricted in exam mode
                </p>
              </div>
              <Button
                onClick={() => setPhase("login")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-base font-bold"
                data-ocid="mock.primary_button"
              >
                Start Exam <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── PHASE: LOGIN ────────────────────────────────────────────────────────────
  if (phase === "login") {
    const examCfgForDisplay = getExamConfig(examSlug);
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Nav bar */}
        <div className="bg-[#0d1b4b] text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Monitor className="h-4 w-4" /> System Node No: C001
          </div>
          <div className="text-sm font-semibold tracking-wide">
            CANDIDATE REGISTRATION — {examCfgForDisplay.name}
          </div>
          <div className="text-xs text-blue-200">Mock #{mockNumber || 1}</div>
        </div>

        {/* Step Progress Bar */}
        <StepProgressBar phase={phase} />

        <main className="flex-1 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Card header */}
              <div className="bg-gradient-to-r from-[#0d1b4b] to-[#1a3a8f] px-6 py-5 text-white">
                <h2 className="text-lg font-bold">Candidate Registration</h2>
                <p className="text-blue-200 text-sm">अभ्यर्थी पंजीकरण</p>
                {mockNumber > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs">
                    <span>Mock #{mockNumber}</span>
                    <span>·</span>
                    <span>{examCfgForDisplay.fullName}</span>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="px-6 py-6 space-y-4">
                <div>
                  <Label
                    htmlFor="roll-number"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Roll Number / अनुक्रमांक{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="roll-number"
                    placeholder="Enter Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="border-gray-300 focus:border-orange-500"
                    data-ocid="mock.input"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="candidate-name"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Candidate Name / अभ्यर्थी का नाम{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="candidate-name"
                    placeholder="Enter Full Name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="border-gray-300 focus:border-orange-500"
                    data-ocid="mock.input"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="category-select"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Category / श्रेणी <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      id="category-select"
                      className="border-gray-300"
                      data-ocid="mock.select"
                    >
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General / सामान्य</SelectItem>
                      <SelectItem value="OBC">OBC / अन्य पिछड़ा वर्ग</SelectItem>
                      <SelectItem value="SC">SC / अनुसूचित जाति</SelectItem>
                      <SelectItem value="ST">ST / अनुसूचित जनजाति</SelectItem>
                      <SelectItem value="EWS">
                        EWS / आर्थिक रूप से कमजोर
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loginError && (
                  <div
                    className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700"
                    data-ocid="mock.error_state"
                  >
                    {loginError}
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (!rollNumber.trim()) {
                      setLoginError("Please enter your Roll Number.");
                      return;
                    }
                    if (!candidateName.trim()) {
                      setLoginError("Please enter your Name.");
                      return;
                    }
                    if (!category) {
                      setLoginError("Please select your Category.");
                      return;
                    }
                    setLoginError("");
                    setPhase("instructions");
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  data-ocid="mock.primary_button"
                >
                  Proceed to Instructions{" "}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-center text-xs text-gray-400">
                  Session ID: {rollNo}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── PHASE: INSTRUCTIONS ─────────────────────────────────────────────────────
  if (phase === "instructions") {
    const instructions = instrLang === "en" ? INSTRUCTIONS_EN : INSTRUCTIONS_HI;
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="bg-[#0d1b4b] text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Monitor className="h-4 w-4" /> System Node No: C001
          </div>
          <div className="text-sm font-semibold">
            GENERAL INSTRUCTIONS — {exam}
          </div>
          <div className="text-xs text-blue-200">Mock #{mockNumber || 1}</div>
        </div>

        {/* Step Progress Bar */}
        <StepProgressBar phase={phase} />

        <main className="flex-1 py-6 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Candidate info strip */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 flex flex-wrap gap-4 text-sm">
              <span className="text-blue-800">
                <strong>Roll No:</strong> {rollNumber || rollNo}
              </span>
              <span className="text-blue-800">
                <strong>Name:</strong> {candidateName || "Candidate"}
              </span>
              <span className="text-blue-800">
                <strong>Category:</strong> {category || "General"}
              </span>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#0d1b4b]">
                  General Instructions / सामान्य निर्देश
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInstrLang("en")}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      instrLang === "en"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    data-ocid="mock.toggle"
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstrLang("hi")}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      instrLang === "hi"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    data-ocid="mock.toggle"
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
                <ol className="space-y-2">
                  {instructions.map((instr, i) => (
                    <li
                      key={instr}
                      className="flex gap-3 text-sm text-amber-900"
                    >
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{instr}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <Label className="mb-1 block text-sm">
                    Question Paper Language
                  </Label>
                  <Select value={paperLang} onValueChange={setPaperLang}>
                    <SelectTrigger data-ocid="mock.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">हिंदी / Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block text-sm">Keyboard Layout</Label>
                  <Select
                    value={keyboardLayout}
                    onValueChange={setKeyboardLayout}
                  >
                    <SelectTrigger data-ocid="mock.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remington">Remington</SelectItem>
                      <SelectItem value="Phonetic">Phonetic</SelectItem>
                      <SelectItem value="Inscript">Inscript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div
                className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6"
                data-ocid="mock.panel"
              >
                <Checkbox
                  id="declaration"
                  checked={declared}
                  onCheckedChange={(v) => setDeclared(!!v)}
                  className="mt-0.5"
                  data-ocid="mock.checkbox"
                />
                <Label
                  htmlFor="declaration"
                  className="text-sm text-blue-900 cursor-pointer leading-relaxed"
                >
                  I have read and understood all the instructions.
                  <br />
                  <span className="text-blue-700">
                    मैंने सभी निर्देश पढ़ और समझ लिए हैं।
                  </span>
                </Label>
              </div>

              <Button
                onClick={() => {
                  setPracticeTyped("");
                  setPracticeStart(null);
                  setPracticeElapsed(0);
                  setPhase("practice");
                }}
                disabled={!declared}
                className={`w-full py-4 text-base font-bold rounded-xl shadow-md transition-all ${
                  declared
                    ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                data-ocid="mock.primary_button"
              >
                {declared ? <CheckCircle className="mr-2 h-5 w-5" /> : null}
                Proceed to Practice Session →
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── PHASE: PRACTICE ─────────────────────────────────────────────────────────
  if (phase === "practice") {
    const practiceExamCfg = getExamConfig(examSlug);
    const isMCQExam =
      practiceExamCfg.mode === "mcq" || practiceExamCfg.mode === "both";
    const practiceChars = PRACTICE_PASSAGE.split("");

    // For MCQ exams, show MCQ-style practice instead of typing practice
    if (isMCQExam) {
      return (
        <MCQPracticeSession
          exam={exam}
          practiceElapsed={practiceElapsed}
          examSlug={examSlug}
          phase={phase}
          onStart={handleStartExam}
          formatTime={formatTime}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="bg-green-700 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Monitor className="h-4 w-4" /> System Node No: C001
          </div>
          <div className="text-sm font-semibold">PRACTICE SESSION — {exam}</div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Practice: {formatTime(practiceElapsed)}</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <StepProgressBar phase={phase} />

        <main className="flex-1 py-6 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold text-green-800 mb-1">
                Practice Session
              </h2>
              <p className="text-sm text-green-700">
                Get familiar with keyboard and posture. This does not count
                toward your exam.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 text-center shadow">
                <div className="text-2xl font-bold text-blue-600">
                  {practiceWpm}
                </div>
                <div className="text-xs text-gray-500">WPM</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow">
                <div className="text-2xl font-bold text-green-600">
                  {practiceAccuracy}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow">
                <div className="text-2xl font-bold text-gray-600">
                  {formatTime(practiceElapsed)}
                </div>
                <div className="text-xs text-gray-500">Elapsed</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-5 mb-4 font-mono text-base leading-8 select-none">
              <CharHighlight chars={practiceChars} typed={practiceTyped} />
            </div>

            <textarea
              value={practiceTyped}
              onChange={(e) => {
                if (!practiceStart) setPracticeStart(Date.now());
                setPracticeTyped(e.target.value);
              }}
              placeholder="Start typing the practice passage above..."
              className="w-full h-28 p-4 border-2 border-green-200 rounded-xl focus:border-green-500 outline-none font-mono text-base resize-none bg-white shadow mb-4"
              data-ocid="mock.editor"
            />

            <Button
              onClick={handleStartExam}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              data-ocid="mock.primary_button"
            >
              Start Main Exam <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ─── PHASE: EXAM ─────────────────────────────────────────────────────────────
  if (phase === "exam") {
    const examCfg = getExamConfig(examSlug);
    const mcqQuestions =
      mockNumber > 0
        ? seededShuffle(getQuestionsForExam(examSlug), mockNumber)
        : getQuestionsForExam(examSlug);

    if (examCfg.mode === "mcq" || examCfg.mode === "both") {
      if (examCfg.examType === "nta") {
        return (
          <NTAMCQInterface
            examConfig={examCfg}
            questions={mcqQuestions}
            mode="mock"
            candidateName={candidateName || "Candidate"}
            rollNo={rollNumber || rollNo}
            onComplete={() => setPhase("result")}
          />
        );
      }
      if (examCfg.examType === "railway") {
        return (
          <TCSMCQInterface
            examConfig={examCfg}
            questions={mcqQuestions}
            mode="mock"
            candidateName={candidateName || "Candidate"}
            rollNo={rollNumber || rollNo}
            onComplete={() => setPhase("result")}
          />
        );
      }
      return (
        <SSCMCQInterface
          examConfig={examCfg}
          questions={mcqQuestions}
          mode="mock"
          candidateName={candidateName || "Candidate"}
          rollNo={rollNumber || rollNo}
          onComplete={() => setPhase("result")}
        />
      );
    }

    // Typing exam
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="bg-[#0d1b4b] text-white px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3 text-sm">
              <Monitor className="h-4 w-4" />
              <span>Node: C001</span>
              <span className="text-blue-300">|</span>
              <span>{exam}</span>
              <span className="text-blue-300">|</span>
              <Keyboard className="h-4 w-4" />
              <span>{keyboardLayout}</span>
            </div>
            <div
              className={`flex items-center gap-2 text-xl font-bold tabular-nums ${
                timeLeft < 60 ? "text-red-400 animate-pulse" : "text-yellow-300"
              }`}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-xs">
                  {candidateName || "Candidate"}
                </div>
                <div className="text-blue-300 text-xs">
                  {rollNumber || rollNo}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 py-4 px-4">
          <div className="max-w-4xl mx-auto">
            <UserIdentityHeader
              userId={rollNumber || rollNo}
              name={candidateName || "Candidate"}
              sessionName={`${exam} Exam`}
            />

            <TypingControlPanel
              selectedMinutes={selectedMinutes}
              onSelectMinutes={(m) => {
                if (!examStarted) {
                  setSelectedMinutes(m);
                  setTimeLeft(m * 60);
                }
              }}
              timerRunning={examStarted && !finished}
              textSize={textSize}
              onTextSizeChange={setTextSize}
              highlightEnabled={highlightEnabled}
              onHighlightChange={setHighlightEnabled}
              autoScroll={autoScroll}
              onAutoScrollChange={setAutoScroll}
              backspaceAllowed={backspaceAllowed}
              onBackspaceChange={setBackspaceAllowed}
              onStop={handleStopExam}
              onSubmit={handleSubmitExam}
              testStarted={examStarted}
              testEnded={finished}
            />

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg border-2 border-[#DAA520] p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{wpm}</div>
                <div className="text-xs text-gray-500">WPM</div>
              </div>
              <div className="bg-white rounded-lg border-2 border-[#DAA520] p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {accuracy}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="bg-white rounded-lg border-2 border-[#DAA520] p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((typed.length / passage.length) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>

            <Progress
              value={(typed.length / passage.length) * 100}
              className="mb-4 h-2"
            />

            <div
              ref={passageDivRef}
              className={`bg-white rounded-xl border-2 border-[#DAA520] p-5 mb-4 font-mono ${textSizeClass} leading-9 select-none text-black overflow-auto max-h-56`}
            >
              {highlightEnabled ? (
                <CharHighlight chars={passageChars} typed={typed} />
              ) : (
                <BoldText text={builtInPara.text} />
              )}
            </div>

            <textarea
              value={typed}
              onChange={handleExamInput}
              onKeyDown={handleExamKeyDown}
              placeholder="Exam started — begin typing the passage above..."
              className={`w-full h-32 p-4 border-2 border-[#DAA520] rounded-xl focus:outline-none font-mono ${textSizeClass} resize-none bg-white text-black shadow mb-4`}
              data-ocid="mock.editor"
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-semibold"
                  data-ocid="mock.open_modal_button"
                >
                  Submit Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="mock.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to submit your exam?
                    <br />
                    <span className="text-gray-500">
                      क्या आप परीक्षा सबमिट करना चाहते हैं?
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="mock.cancel_button">
                    Cancel / रद्द करें
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSubmitExam}
                    className="bg-red-600 hover:bg-red-700"
                    data-ocid="mock.confirm_button"
                  >
                    Submit / सबमिट करें
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    );
  }

  // ─── PHASE: RESULT ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto" data-ocid="mock.success_state">
          <div className="bg-white rounded-xl border-2 border-[#DAA520] p-8">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-[#0d1b4b]">
                Exam Submitted!
              </h2>
              <p className="text-gray-500">{exam} — Typing Test Result</p>
              {candidateName && (
                <p className="text-sm text-gray-400 mt-1">
                  {candidateName} | {rollNumber || rollNo} | {category}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{wpm}</div>
                <div className="text-sm text-gray-500">WPM</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {correctWords}
                </div>
                <div className="text-sm text-gray-500">Correct Words</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {wrongWords}
                </div>
                <div className="text-sm text-gray-500">Error Words</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Detailed Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Taken:</span>
                  <span className="font-semibold">
                    {formatTime(duration - timeLeft)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Words Typed:</span>
                  <span className="font-semibold">{totalWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Keyboard Layout:</span>
                  <span className="font-semibold">{keyboardLayout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Paper Language:</span>
                  <span className="font-semibold">{paperLang}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chars Typed:</span>
                  <span className="font-semibold">{typed.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Exam:</span>
                  <span className="font-semibold">{exam}</span>
                </div>
              </div>
            </div>

            {typedWords.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Word Analysis:
                </h3>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {typedWords.map((word) => {
                    const isCorrect =
                      word === passageWords[typedWords.indexOf(word)];
                    return (
                      <span
                        key={word}
                        className={`px-2 py-0.5 rounded text-xs font-mono border ${
                          isCorrect
                            ? "bg-green-50 text-green-800 border-green-300"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSaveResult}
                className="bg-[#DAA520] hover:bg-amber-600 text-white flex-1"
                data-ocid="mock.save_button"
              >
                Save Result
              </Button>
              <Button
                onClick={() => {
                  setTyped("");
                  setTimeLeft(duration);
                  setFinished(false);
                  setExamStarted(false);
                  setStartTime(null);
                  setPhase("exam");
                }}
                variant="outline"
                className="flex-1 border-orange-500 text-orange-700 hover:bg-orange-50"
                data-ocid="mock.secondary_button"
              >
                Try Again (Same Text)
              </Button>
              <Button
                onClick={() => {
                  setParaIndex((prev) => prev + 1);
                  setTyped("");
                  setTimeLeft(duration);
                  setFinished(false);
                  setExamStarted(false);
                  setStartTime(null);
                  setDeclared(false);
                  setPhase("practice");
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                data-ocid="mock.primary_button"
              >
                Next Practice Test →
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
