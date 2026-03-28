import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { HARTRON_Q1 } from "../data/questions/hartron_q1";
import { HARTRON_Q2 } from "../data/questions/hartron_q2";
import { HARTRON_Q3 } from "../data/questions/hartron_q3";

interface HartronQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  language: string;
  section: string;
}

type Category = "General" | "SC" | "ST" | "OBC" | "EWS";
type Step = "registration" | "instructions" | "exam" | "result";

const ALL_QUESTIONS: HartronQuestion[] = [
  ...HARTRON_Q1,
  ...HARTRON_Q2,
  ...HARTRON_Q3,
];

const PASSING_MARKS: Record<Category, number> = {
  General: 15,
  SC: 14,
  ST: 14,
  OBC: 14,
  EWS: 14,
};

function seededShuffle(
  arr: HartronQuestion[],
  seed: number,
): HartronQuestion[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HartronMockPage() {
  const params = useParams({ strict: false }) as { mockNumber?: string };
  const mockNumber = Number.parseInt(params.mockNumber ?? "1");

  // Step state
  const [step, setStep] = useState<Step>("registration");

  // Registration
  const [rollNo, setRollNo] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Instructions
  const [instructionsRead, setInstructionsRead] = useState(false);

  // Exam
  const [questions, setQuestions] = useState<HartronQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Result
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // Load questions on mount
  useEffect(() => {
    const shuffled = seededShuffle(ALL_QUESTIONS, mockNumber * 12345);
    setQuestions(shuffled.slice(0, 30));
  }, [mockNumber]);

  // Timer logic
  useEffect(() => {
    if (step !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setStep("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleRegistration = () => {
    const errs: Record<string, string> = {};
    if (!rollNo.trim()) errs.rollNo = "Roll Number required";
    if (!candidateName.trim()) errs.name = "Candidate Name required";
    if (!category) errs.category = "Category required";
    setRegErrors(errs);
    if (Object.keys(errs).length === 0) setStep("instructions");
  };

  const handleSubmitExam = () => {
    clearInterval(timerRef.current!);
    setShowSubmitDialog(false);
    setStep("result");
  };

  const getScore = () => {
    return questions.reduce((acc, q, idx) => {
      return answers[idx] === q.correct ? acc + 1 : acc;
    }, 0);
  };

  const passingMark = category ? PASSING_MARKS[category as Category] : 15;
  const score = step === "result" ? getScore() : 0;
  const passed = score >= passingMark;

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = 30 - answeredCount;

  // ─── Step 1: Registration ───────────────────────────────────────────────────
  if (step === "registration") {
    return (
      <div className="min-h-screen bg-gray-50" data-ocid="hartron.page">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-800 to-teal-700 text-white px-6 py-5">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Badge className="bg-white/20 text-white border-white/30">
                HARTRON
              </Badge>
              <Badge className="bg-cyan-600/40 text-cyan-100 border-cyan-500/30">
                Mock {mockNumber}
              </Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">
              Hartron Computer Based Test (CBT)
            </h1>
            <p className="text-cyan-200 text-sm mt-1">
              हार्ट्रॉन कंप्यूटर प्रवीणता परीक्षा
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b">
              <CardTitle className="text-lg text-cyan-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Candidate Registration
              </CardTitle>
              <p className="text-sm text-gray-500">
                Please fill in your details before proceeding to the exam
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Roll Number */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="rollNo"
                  className="text-sm font-medium text-gray-700"
                >
                  Roll Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rollNo"
                  placeholder="Enter your Roll Number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className={regErrors.rollNo ? "border-red-400" : ""}
                  data-ocid="hartron.roll_input"
                />
                {regErrors.rollNo && (
                  <p
                    className="text-xs text-red-500 flex items-center gap-1"
                    data-ocid="hartron.roll_error"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {regErrors.rollNo}
                  </p>
                )}
              </div>

              {/* Candidate Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="candidateName"
                  className="text-sm font-medium text-gray-700"
                >
                  Candidate Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidateName"
                  placeholder="Enter your Full Name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className={regErrors.name ? "border-red-400" : ""}
                  data-ocid="hartron.name_input"
                />
                {regErrors.name && (
                  <p
                    className="text-xs text-red-500 flex items-center gap-1"
                    data-ocid="hartron.name_error"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {regErrors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as Category)}
                  data-ocid="hartron.category_select"
                >
                  <SelectTrigger
                    className={regErrors.category ? "border-red-400" : ""}
                  >
                    <SelectValue placeholder="Select your category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General (सामान्य)</SelectItem>
                    <SelectItem value="SC">SC (अनुसूचित जाति)</SelectItem>
                    <SelectItem value="ST">ST (अनुसूचित जनजाति)</SelectItem>
                    <SelectItem value="OBC">OBC (अन्य पिछड़ा वर्ग)</SelectItem>
                    <SelectItem value="EWS">
                      EWS (आर्थिक रूप से कमजोर वर्ग)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {regErrors.category && (
                  <p
                    className="text-xs text-red-500 flex items-center gap-1"
                    data-ocid="hartron.category_error"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {regErrors.category}
                  </p>
                )}
              </div>

              {/* Exam Info */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-cyan-800 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Exam Summary
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-gray-500">Total Questions:</span>
                  <span className="font-medium">30</span>
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">15 Minutes</span>
                  <span className="text-gray-500">General Passing:</span>
                  <span className="font-medium text-green-700">15/30</span>
                  <span className="text-gray-500">Reserved Passing:</span>
                  <span className="font-medium text-green-700">14/30</span>
                  <span className="text-gray-500">Negative Marking:</span>
                  <span className="font-medium text-red-600">None ✓</span>
                </div>
              </div>

              <Button
                className="w-full bg-cyan-700 hover:bg-cyan-800 text-white h-11 font-semibold"
                onClick={handleRegistration}
                data-ocid="hartron.proceed_button"
              >
                Proceed to Instructions →
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Step 2: Instructions ────────────────────────────────────────────────────
  if (step === "instructions") {
    return (
      <div
        className="min-h-screen bg-gray-50"
        data-ocid="hartron.instructions.page"
      >
        <div className="bg-gradient-to-r from-cyan-800 to-teal-700 text-white px-6 py-5">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold">Exam Instructions</h1>
            <p className="text-cyan-200 text-sm">
              Roll No: <strong>{rollNo}</strong> | {candidateName} | {category}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
              <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Hartron Computer Proficiency Test — Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Candidate Info Bar */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Roll Number</p>
                  <p className="font-semibold text-gray-800">{rollNo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Candidate</p>
                  <p className="font-semibold text-gray-800">{candidateName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Category</p>
                  <p className="font-semibold text-gray-800">{category}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Mock No.</p>
                  <p className="font-semibold text-gray-800">
                    Mock {mockNumber}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Total Questions",
                      val: "30",
                      color: "bg-blue-50 border-blue-200 text-blue-700",
                    },
                    {
                      label: "Time Limit",
                      val: "15 Minutes",
                      color: "bg-green-50 border-green-200 text-green-700",
                    },
                    {
                      label: "Passing (General)",
                      val: "15 / 30",
                      color: "bg-amber-50 border-amber-200 text-amber-700",
                    },
                    {
                      label: "Passing (Reserved)",
                      val: "14 / 30",
                      color: "bg-purple-50 border-purple-200 text-purple-700",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`border rounded-lg p-3 text-center ${item.color}`}
                    >
                      <p className="text-xs opacity-70">{item.label}</p>
                      <p className="text-lg font-bold mt-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <strong>No Negative Marking</strong> — Wrong answers will NOT
                  deduct any marks.
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      icon: "1",
                      text: "This test contains 30 Multiple Choice Questions (MCQs).",
                    },
                    {
                      icon: "2",
                      text: "You have 15 minutes to complete the exam. Timer starts when you click 'Start Exam'.",
                    },
                    {
                      icon: "3",
                      text: "Each correct answer carries 1 mark. There is NO negative marking for wrong answers.",
                    },
                    {
                      icon: "4",
                      text: "Passing marks: General category = 15/30 | SC/ST/OBC/EWS = 14/30",
                    },
                    {
                      icon: "5",
                      text: "You can navigate between questions using Previous/Next buttons or the question palette.",
                    },
                    {
                      icon: "6",
                      text: "Answered questions appear in GREEN in the palette; unanswered in WHITE.",
                    },
                    {
                      icon: "7",
                      text: "The timer will auto-submit your exam when time is up.",
                    },
                    {
                      icon: "8",
                      text: "Do NOT refresh, close, or navigate away during the exam.",
                    },
                    {
                      icon: "9",
                      text: "Topics covered: MS Office (Word, Excel, PowerPoint, Access), Computer Fundamentals, Database, Internet & Networking.",
                    },
                    {
                      icon: "10",
                      text: "After submission, you can view the complete answer key with correct answers.",
                    },
                  ].map((item) => (
                    <div
                      key={item.icon}
                      className="flex gap-3 text-sm text-gray-700"
                    >
                      <span className="w-6 h-6 bg-cyan-700 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold mt-0.5">
                        {item.icon}
                      </span>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkbox */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <Checkbox
                  id="readInstructions"
                  checked={instructionsRead}
                  onCheckedChange={(v) => setInstructionsRead(!!v)}
                  data-ocid="hartron.instructions.checkbox"
                />
                <Label
                  htmlFor="readInstructions"
                  className="text-sm text-gray-700 cursor-pointer leading-5"
                >
                  I have read and understood all the instructions. I am ready to
                  start the exam.
                </Label>
              </div>

              <Button
                className="w-full mt-4 bg-cyan-700 hover:bg-cyan-800 text-white h-11 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!instructionsRead}
                onClick={() => setStep("exam")}
                data-ocid="hartron.start_exam_button"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Step 3: Exam ────────────────────────────────────────────────────────────
  if (step === "exam") {
    const currentQuestion = questions[currentQ];
    const isTimeLow = timeLeft < 120;

    return (
      <div
        className="min-h-screen bg-gray-100 flex flex-col"
        data-ocid="hartron.exam.page"
      >
        {/* Exam Topbar */}
        <div className="bg-gradient-to-r from-cyan-800 to-teal-700 text-white px-4 py-3 sticky top-0 z-10 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 font-bold">
                HARTRON CBT
              </Badge>
              <span className="text-sm text-cyan-100 hidden sm:block">
                {rollNo} | {candidateName} | {category}
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-lg ${
                isTimeLow ? "bg-red-600 animate-pulse" : "bg-white/20"
              }`}
              data-ocid="hartron.exam.timer"
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-5">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant="outline"
                    className="text-cyan-700 border-cyan-300 font-semibold"
                  >
                    Q.{currentQ + 1} / 30
                  </Badge>
                  {currentQuestion?.section && (
                    <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                      {currentQuestion.section}
                    </Badge>
                  )}
                </div>

                {/* Question Text */}
                <p
                  className="text-gray-800 font-medium text-base leading-relaxed mb-5"
                  data-ocid="hartron.exam.question"
                >
                  {currentQuestion?.question}
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuestion?.options.map((opt, i) => {
                    const selected = answers[currentQ] === i;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [currentQ]: i }))
                        }
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm flex items-start gap-3 transition-all ${
                          selected
                            ? "border-cyan-600 bg-cyan-50 text-cyan-900 font-medium"
                            : "border-gray-200 bg-white text-gray-700 hover:border-cyan-300 hover:bg-cyan-50/50"
                        }`}
                        data-ocid={`hartron.exam.option.${i + 1}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                            selected
                              ? "bg-cyan-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                disabled={currentQ === 0}
                data-ocid="hartron.exam.prev_button"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowSubmitDialog(true)}
                data-ocid="hartron.exam.submit_button"
              >
                Submit Exam
              </Button>

              <Button
                variant="outline"
                onClick={() => setCurrentQ((p) => Math.min(29, p + 1))}
                disabled={currentQ === 29}
                data-ocid="hartron.exam.next_button"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right Panel: Question Palette */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md sticky top-20">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm text-gray-700">
                  Question Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-1.5 mb-4">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQ(idx)}
                      className={`h-8 w-full rounded text-xs font-bold border-2 transition-all ${
                        idx === currentQ
                          ? "border-cyan-600 bg-cyan-100 text-cyan-800"
                          : answers[idx] !== undefined
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 bg-white text-gray-600 hover:border-cyan-300"
                      }`}
                      data-ocid={`hartron.palette.item.${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-1.5 text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-green-500 border border-green-500" />
                    Answered ({answeredCount})
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-white border-2 border-gray-300" />
                    Not Answered ({unansweredCount})
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-cyan-100 border-2 border-cyan-600" />
                    Current
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent data-ocid="hartron.submit.dialog">
            <DialogHeader>
              <DialogTitle>Submit Exam?</DialogTitle>
              <DialogDescription>
                You have answered <strong>{answeredCount}</strong> out of 30
                questions.
                {unansweredCount > 0 && (
                  <span className="text-amber-600">
                    {" "}
                    {unansweredCount} question(s) are still unanswered.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                data-ocid="hartron.submit.cancel_button"
              >
                Continue Exam
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSubmitExam}
                data-ocid="hartron.submit.confirm_button"
              >
                Submit Final
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─── Step 4: Result ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50" data-ocid="hartron.result.page">
      <div className="bg-gradient-to-r from-cyan-800 to-teal-700 text-white px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold">Exam Result — Mock {mockNumber}</h1>
          <p className="text-cyan-200 text-sm">
            {rollNo} | {candidateName} | {category}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Score Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div
            className={`py-8 text-center ${passed ? "bg-gradient-to-b from-green-600 to-green-700" : "bg-gradient-to-b from-red-600 to-red-700"} text-white`}
          >
            <p className="text-4xl font-black">{score} / 30</p>
            <p className="text-lg mt-1 opacity-90">Your Score</p>
            <div
              className={`inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full text-lg font-bold border-2 ${
                passed
                  ? "border-white/50 bg-white/20"
                  : "border-white/50 bg-white/20"
              }`}
              data-ocid="hartron.result.badge"
            >
              {passed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {passed ? "PASS" : "FAIL"}
            </div>
          </div>

          <CardContent className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{score}</p>
                <p className="text-xs text-gray-500 mt-1">Correct</p>
              </div>
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {Object.keys(answers).length - score}
                </p>
                <p className="text-xs text-gray-500 mt-1">Wrong</p>
              </div>
              <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">
                  {30 - Object.keys(answers).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Not Attempted</p>
              </div>
            </div>

            {/* Threshold Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              Passing mark for <strong>{category}</strong> category:{" "}
              <strong>{passingMark}/30</strong>. &nbsp;No negative marking
              applied.
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                variant="outline"
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className="flex-1"
                data-ocid="hartron.result.answer_key_button"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showAnswerKey ? "Hide" : "View"} Answer Key
              </Button>
              <Button
                className="bg-cyan-700 hover:bg-cyan-800 text-white flex-1"
                onClick={() => {
                  window.location.href = "/mock-list";
                }}
                data-ocid="hartron.result.another_mock_button"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Attempt Another Mock
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Key */}
        {showAnswerKey && (
          <Card
            className="border-0 shadow-md"
            data-ocid="hartron.result.answer_key"
          >
            <CardHeader className="border-b">
              <CardTitle className="text-base">
                Answer Key — All 30 Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {questions.map((q, idx) => {
                const userAns = answers[idx];
                const isCorrect = userAns === q.correct;
                const notAttempted = userAns === undefined;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      notAttempted
                        ? "border-l-gray-300 bg-gray-50"
                        : isCorrect
                          ? "border-l-green-500 bg-green-50"
                          : "border-l-red-500 bg-red-50"
                    }`}
                    data-ocid={`hartron.answer_key.item.${idx + 1}`}
                  >
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      <span className="font-bold text-gray-500 mr-2">
                        Q{idx + 1}.
                      </span>
                      {q.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        className={`flex items-center gap-1.5 ${notAttempted ? "text-gray-400" : isCorrect ? "text-green-700" : "text-red-600"}`}
                      >
                        {notAttempted ? (
                          "—"
                        ) : isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        Your answer:{" "}
                        {notAttempted ? "Not attempted" : q.options[userAns]}
                      </div>
                      <div className="flex items-center gap-1.5 text-green-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Correct: {q.options[q.correct]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
