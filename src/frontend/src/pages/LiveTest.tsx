import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BoldText, { stripBold } from "../components/BoldText";
import CharHighlight from "../components/CharHighlight";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TypingControlPanel from "../components/TypingControlPanel";
import UserIdentityHeader from "../components/UserIdentityHeader";
import { paragraphs as allParagraphs } from "../data/paragraphs";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  usePassagesByExamAndLanguage,
  useSaveTypingResult,
} from "../hooks/useQueries";

const EXAMS = [
  "All Exam",
  "SSC CGL",
  "SSC CHSL",
  "Delhi Police HCM",
  "Railway NTPC",
  "DSSSB",
  "Banking",
  "PCS",
];
const LANGS = ["English", "Hindi"];

export default function LiveTest() {
  const [exam, setExam] = useState("SSC CGL");
  const [lang, setLang] = useState("English");
  const [testStarted, setTestStarted] = useState(false);

  // Control panel state
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [textSize, setTextSize] = useState<"small" | "large">("small");
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [backspaceAllowed, setBackspaceAllowed] = useState(false); // strict by default for live

  const examSlug = exam
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { data: backendPassages } = usePassagesByExamAndLanguage(
    examSlug,
    lang,
  );
  const { mutate: saveResult } = useSaveTypingResult();
  const { identity } = useInternetIdentity();

  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(selectedMinutes * 60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const passageDivRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pick a paragraph from built-in data filtered by language
  const langParas = allParagraphs.filter((p) => p.language === lang);
  const builtInPara = langParas[0] || allParagraphs[0];

  const passage =
    backendPassages && backendPassages.length > 0
      ? stripBold(backendPassages[0].content)
      : stripBold(builtInPara.text);
  const passageChars = passage.split("");
  const textSizeClass = textSize === "large" ? "text-lg" : "text-sm";

  // Reset timeLeft when selectedMinutes changes (before start)
  useEffect(() => {
    if (!started) {
      setTimeLeft(selectedMinutes * 60);
    }
  }, [selectedMinutes, started]);

  // Auto-scroll passage
  useEffect(() => {
    if (!autoScroll || !passageDivRef.current) return;
    const spans = passageDivRef.current.querySelectorAll("span");
    const curSpan = spans[typed.length];
    if (curSpan) {
      curSpan.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [typed, autoScroll]);

  const wpm = useCallback(() => {
    if (!startTime || typed.length === 0) return 0;
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    return Math.round(
      typed.trim().split(/\s+/).length / Math.max(elapsed, 0.01),
    );
  }, [startTime, typed]);

  const accuracy = useCallback(() => {
    if (typed.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passage[i]) correct++;
    }
    return Math.round((correct / typed.length) * 100);
  }, [typed, passage]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  useEffect(() => {
    if (typed.length >= passage.length && started && !finished) {
      clearInterval(timerRef.current!);
      setFinished(true);
    }
  }, [typed, passage, started, finished]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setTyped(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace" && !backspaceAllowed) {
      e.preventDefault();
    }
  };

  const handleStart = () => {
    setTestStarted(true);
    setTyped("");
    setTimeLeft(selectedMinutes * 60);
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
  };

  const handleSubmit = () => handleStop();

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Word analysis
  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const passageWords = passage.trim().split(/\s+/).filter(Boolean);
  const correctWordCount = typedWords.filter(
    (w, i) => w === passageWords[i],
  ).length;
  const errorWordCount = typedWords.length - correctWordCount;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h1 className="text-2xl font-bold text-[#0d1b4b]">Live Test</h1>
          </div>

          {!testStarted ? (
            <div className="bg-white rounded-xl border-2 border-[#DAA520] p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Configure Your Live Test
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label
                    htmlFor="live-exam-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Exam
                  </label>
                  <Select value={exam} onValueChange={setExam}>
                    <SelectTrigger
                      id="live-exam-select"
                      className="border-[#DAA520]"
                      data-ocid="live.select"
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
                <div>
                  <label
                    htmlFor="live-lang-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Language
                  </label>
                  <Select value={lang} onValueChange={setLang}>
                    <SelectTrigger
                      id="live-lang-select"
                      className="border-[#DAA520]"
                      data-ocid="live.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Timer selection in pre-start */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Select Duration:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 5, 10, 15, 20, 30].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setSelectedMinutes(m)}
                      className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                        selectedMinutes === m
                          ? "bg-[#DAA520] text-white border-[#DAA520]"
                          : "bg-white text-black border-[#DAA520] hover:bg-amber-50"
                      }`}
                      data-ocid="live.toggle"
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-[#DAA520] rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 font-medium">
                  Duration: {selectedMinutes} minutes | Live Test — Backspace
                  Disabled | Once started, timer cannot be paused.
                </p>
              </div>
              <Button
                onClick={handleStart}
                className="bg-[#c62828] hover:bg-red-800 text-white px-8"
                data-ocid="live.primary_button"
              >
                Start Live Test
              </Button>
            </div>
          ) : (
            <>
              <UserIdentityHeader
                userId={
                  identity?.getPrincipal().toString().slice(0, 12) ||
                  "LIVE-GUEST"
                }
                name={"Candidate"}
                sessionName="Live Test Session"
              />

              <TypingControlPanel
                selectedMinutes={selectedMinutes}
                onSelectMinutes={setSelectedMinutes}
                timerRunning={started && !finished}
                textSize={textSize}
                onTextSizeChange={setTextSize}
                highlightEnabled={highlightEnabled}
                onHighlightChange={setHighlightEnabled}
                autoScroll={autoScroll}
                onAutoScrollChange={setAutoScroll}
                backspaceAllowed={backspaceAllowed}
                onBackspaceChange={setBackspaceAllowed}
                onStop={handleStop}
                onSubmit={handleSubmit}
                testStarted={started}
                testEnded={finished}
              />

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-lg border-2 border-[#DAA520] p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {wpm()}
                  </div>
                  <div className="text-xs text-gray-500">WPM</div>
                </div>
                <div className="bg-white rounded-lg border-2 border-[#DAA520] p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {accuracy()}%
                  </div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="bg-white rounded-lg border-2 border-[#DAA520] p-3 text-center">
                  <div
                    className={`text-2xl font-bold ${
                      timeLeft < 60 ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-gray-500">Time Left</div>
                </div>
              </div>

              <Progress
                value={(typed.length / passage.length) * 100}
                className="mb-4 h-2"
              />

              {!finished ? (
                <>
                  <div
                    ref={passageDivRef}
                    className={`bg-white rounded-xl border-2 border-[#DAA520] p-5 mb-4 font-mono ${textSizeClass} leading-8 select-none text-black overflow-auto max-h-56`}
                  >
                    {highlightEnabled ? (
                      <CharHighlight chars={passageChars} typed={typed} />
                    ) : (
                      <BoldText text={builtInPara.text} />
                    )}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={typed}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Start typing..."
                    className={`w-full h-32 p-4 border-2 border-[#DAA520] rounded-xl focus:outline-none font-mono ${textSizeClass} resize-none bg-white text-black shadow-sm`}
                    data-ocid="live.editor"
                  />
                </>
              ) : (
                <div
                  className="bg-white rounded-xl border-2 border-[#DAA520] p-8"
                  data-ocid="live.success_state"
                >
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🏆</div>
                    <h2 className="text-2xl font-bold text-black">
                      Live Test Complete!
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {wpm()}
                      </div>
                      <div className="text-sm text-gray-500">WPM</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {accuracy()}%
                      </div>
                      <div className="text-sm text-gray-500">Accuracy</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-emerald-600">
                        {correctWordCount}
                      </div>
                      <div className="text-sm text-gray-500">Correct Words</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {errorWordCount}
                      </div>
                      <div className="text-sm text-gray-500">Error Words</div>
                    </div>
                  </div>

                  {/* Word analysis */}
                  {typedWords.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Word Analysis:
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {typedWords.map((word, i) => {
                          const isCorrect = word === passageWords[i];
                          const k = `lw-${i}`;
                          return (
                            <span
                              key={k}
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

                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button
                      onClick={() => {
                        saveResult(
                          {
                            wpm: BigInt(wpm()),
                            accuracy: BigInt(accuracy()),
                            duration: BigInt(selectedMinutes * 60 - timeLeft),
                            isPractice: false,
                            userId:
                              identity?.getPrincipal().toString() ||
                              "anonymous",
                            examCategory: examSlug,
                            timestamp: BigInt(Date.now()),
                            passageId: BigInt(0),
                            attemptNumber: BigInt(1),
                          },
                          { onSuccess: () => toast.success("Result saved!") },
                        );
                      }}
                      className="bg-[#DAA520] hover:bg-amber-600 text-white"
                      data-ocid="live.save_button"
                    >
                      Save Result
                    </Button>
                    <Button
                      onClick={handleStart}
                      variant="outline"
                      className="border-[#DAA520] text-black hover:bg-amber-50"
                      data-ocid="live.secondary_button"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
