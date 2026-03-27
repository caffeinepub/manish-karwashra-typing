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
import { Badge } from "@/components/ui/badge";
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
import { useCallback, useEffect, useRef, useState } from "react";
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

type Phase = "select" | "instructions" | "practice" | "exam" | "result";

const slugToExam: Record<string, string> = {
  "ssc-cgl": "SSC CGL",
  "ssc-chsl": "SSC CHSL",
  "delhi-police-hcm": "Delhi Police HCM",
  "railway-ntpc": "Railway NTPC",
  dsssb: "DSSSB",
  banking: "Banking",
  pcs: "PCS",
  "ssc-mts": "SSC MTS",
  "state-level": "SSC CGL",
  hartron: "SSC CGL",
  deo: "SSC CGL",
  "all-exam": "SSC CGL",
  clerk: "DSSSB",
  teaching: "SSC CGL",
};

export default function MockTest() {
  const params = useParams({ strict: false });
  const examSlugParam = (params as Record<string, string>)?.examSlug;
  const [exam, setExam] = useState(
    examSlugParam ? slugToExam[examSlugParam] || "SSC CGL" : "SSC CGL",
  );
  const [phase, setPhase] = useState<Phase>(
    examSlugParam ? "instructions" : "select",
  );
  const [paraIndex, setParaIndex] = useState(0);

  // Login state
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
  const [backspaceAllowed, setBackspaceAllowed] = useState(false); // strict by default

  // Exam state
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const passageDivRef = useRef<HTMLDivElement>(null);

  const examSlug = exam
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { data: passages } = usePassagesByExam(examSlug);
  const { mutate: saveResult } = useSaveTypingResult();
  const { identity } = useInternetIdentity();

  const duration = selectedMinutes * 60;

  // Pick passage: backend first, then built-in, cycle via paraIndex
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

  // Auto-scroll passage
  useEffect(() => {
    if (!autoScroll || !passageDivRef.current) return;
    const spans = passageDivRef.current.querySelectorAll("span");
    const curSpan = spans[typed.length];
    if (curSpan) {
      curSpan.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [typed, autoScroll]);

  // Practice timer
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

  // Exam countdown
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
    if (e.key === "Backspace" && !backspaceAllowed) {
      e.preventDefault();
    }
  };

  const handleStopExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
    setPhase("result");
  };

  const handleSubmitExam = () => {
    handleStopExam();
  };

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

  // Word analysis
  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const passageWords = passage.trim().split(/\s+/).filter(Boolean);
  const correctWords = typedWords.filter(
    (w, i) => w === passageWords[i],
  ).length;
  const totalWords = typedWords.length;
  const wrongWords = totalWords - correctWords;

  // ---- RENDER PHASES ----

  if (phase === "select") {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">
              Mock Test
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
                  Full exam simulation with instructions Full exam simulation
                  with login, instructions &amp; practiceamp; practice
                </p>
                <p className="text-sm text-amber-700">
                  Backspace restricted in exam mode
                </p>
              </div>
              <Button
                onClick={() => setPhase("instructions")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                data-ocid="mock.primary_button"
              >
                Start Exam <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          <Badge variant="outline" className="text-white border-white text-xs">
            STEP 2 / 4
          </Badge>
        </div>

        <main className="flex-1 py-6 px-4">
          <div className="max-w-3xl mx-auto">
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
                className={`w-full py-3 text-base font-semibold transition-all ${
                  declared
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                data-ocid="mock.primary_button"
              >
                {declared ? <CheckCircle className="mr-2 h-5 w-5" /> : null}I am
                Ready to Begin / मैं शुरू करने के लिए तैयार हूं
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "practice") {
    const practiceChars = PRACTICE_PASSAGE.split("");
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
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-base font-semibold"
              data-ocid="mock.primary_button"
            >
              Start Main Exam <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "exam") {
    const examCfg = getExamConfig(examSlug);
    const mcqQuestions = getQuestionsForExam(examSlug);
    // MCQ-only exams render the appropriate portal interface
    if (examCfg.mode === "mcq") {
      if (examCfg.examType === "nta") {
        return (
          <NTAMCQInterface
            examConfig={examCfg}
            questions={mcqQuestions}
            mode="mock"
            candidateName={rollNo || "Candidate"}
            rollNo={rollNo || "2024001"}
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
            candidateName={rollNo || "Candidate"}
            rollNo={rollNo || "2024001"}
            onComplete={() => setPhase("result")}
          />
        );
      }
      return (
        <SSCMCQInterface
          examConfig={examCfg}
          questions={mcqQuestions}
          mode="mock"
          candidateName={rollNo || "Candidate"}
          rollNo={rollNo || "2024001"}
          onComplete={() => setPhase("result")}
        />
      );
    }
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Exam top bar */}
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
                  {rollNo || "Candidate"}
                </div>
                <div className="text-blue-300 text-xs">
                  {rollNo || "2024001"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 py-4 px-4">
          <div className="max-w-4xl mx-auto">
            {/* User Identity Header */}
            <UserIdentityHeader
              userId={rollNo || "2024001"}
              name={rollNo || "Candidate"}
              sessionName={`${exam} Exam`}
            />

            {/* Control Panel */}
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

            {/* Stats */}
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

            {/* Passage */}
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

            {/* Typing area */}
            <textarea
              value={typed}
              onChange={handleExamInput}
              onKeyDown={handleExamKeyDown}
              placeholder="Exam started — begin typing the passage above..."
              className={`w-full h-32 p-4 border-2 border-[#DAA520] rounded-xl focus:outline-none font-mono ${textSizeClass} resize-none bg-white text-black shadow mb-4`}
              data-ocid="mock.editor"
            />

            {/* Submit */}
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

  // Result phase
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

            {/* Word Analysis */}
            {typedWords.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Word Analysis (after time ends):
                </h3>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {typedWords.map((word, i) => {
                    const isCorrect = word === passageWords[i];
                    const key = `mw-${i}`;
                    return (
                      <span
                        key={key}
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
