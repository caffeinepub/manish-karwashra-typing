import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "@tanstack/react-router";
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
import { usePassagesByExam, useSaveTypingResult } from "../hooks/useQueries";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "haryana-gk", label: "Haryana GK" },
  { value: "india-history", label: "India History" },
  { value: "story", label: "Stories" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "covid-19", label: "COVID-19" },
  { value: "g20", label: "G20" },
  { value: "transport", label: "Transport" },
  { value: "entertainment", label: "Entertainment" },
  { value: "nature", label: "Nature" },
  { value: "general", label: "General" },
];

export default function TypingPractice() {
  const params = useParams({ strict: false }) as { examCategory?: string };
  const navigate = useNavigate();
  const examCategory = params.examCategory || "all-exam";
  const { data: backendPassages } = usePassagesByExam(examCategory);
  const { mutate: saveResult } = useSaveTypingResult();
  const { identity } = useInternetIdentity();

  // Control panel state
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [textSize, setTextSize] = useState<"small" | "large">("small");
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [backspaceAllowed, setBackspaceAllowed] = useState(true);

  // Paragraph selection
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [passageIndex, setPassageIndex] = useState(0);

  // Typing state
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(selectedMinutes * 60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const passageDivRef = useRef<HTMLDivElement>(null);

  // Filter paragraphs by category + language
  const filteredParas =
    selectedCategory === "all"
      ? allParagraphs
      : allParagraphs.filter((p) => p.category === selectedCategory);
  const currentPara = filteredParas[passageIndex % filteredParas.length];

  // Use backend passages if available, else use built-in
  const passageText =
    backendPassages && backendPassages.length > 0
      ? stripBold(
          backendPassages[passageIndex % backendPassages.length].content,
        )
      : stripBold(currentPara.text);
  const passageChars = passageText.split("");

  const textSizeClass = textSize === "large" ? "text-lg" : "text-sm";

  // Reset timer when selectedMinutes changes
  useEffect(() => {
    if (!started) {
      setTimeLeft(selectedMinutes * 60);
    }
  }, [selectedMinutes, started]);

  // Auto-scroll passage to current typed position
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
    const wordsTyped = typed.trim().split(/\s+/).length;
    return Math.round(wordsTyped / Math.max(elapsed, 0.01));
  }, [startTime, typed]);

  const accuracy = useCallback(() => {
    if (typed.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passageText[i]) correct++;
    }
    return Math.round((correct / typed.length) * 100);
  }, [typed, passageText]);

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
    if (typed.length >= passageText.length && started && !finished) {
      clearInterval(timerRef.current!);
      setFinished(true);
    }
  }, [typed, passageText, started, finished]);

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

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
  };

  const handleSubmit = () => {
    handleStop();
  };

  const handleSave = () => {
    const userId = identity?.getPrincipal().toString() || "anonymous";
    saveResult(
      {
        wpm: BigInt(wpm()),
        accuracy: BigInt(accuracy()),
        duration: BigInt(selectedMinutes * 60 - timeLeft),
        isPractice: true,
        userId,
        examCategory,
        timestamp: BigInt(Date.now()),
        passageId: BigInt(currentPara.id),
        attemptNumber: BigInt(1),
      },
      {
        onSuccess: () => toast.success("Result saved!"),
        onError: () => toast.error("Failed to save result"),
      },
    );
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTyped("");
    setTimeLeft(selectedMinutes * 60);
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleNewPassage = () => {
    setPassageIndex((i) => i + 1);
    handleReset();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progressPct = (typed.length / passageText.length) * 100;

  // Word-level error analysis
  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const passageWords = passageText.trim().split(/\s+/).filter(Boolean);
  const correctWordCount = typedWords.filter(
    (w, i) => w === passageWords[i],
  ).length;
  const errorWordCount = typedWords.length - correctWordCount;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tab switcher */}
          <div
            className="flex gap-1 mb-4 border-b-2 border-[#DAA520]"
            data-ocid="typing.tab"
          >
            <button
              type="button"
              className="px-5 py-2 text-sm font-semibold rounded-t-lg bg-[#DAA520] text-white border-2 border-[#DAA520] -mb-0.5"
              data-ocid="typing.tab"
            >
              Typing Practice
            </button>
            <button
              type="button"
              className="px-5 py-2 text-sm font-semibold rounded-t-lg bg-white text-black border-2 border-[#DAA520] -mb-0.5 hover:bg-amber-50 transition-colors"
              onClick={() => navigate({ to: `/mcq/${examCategory}` })}
              data-ocid="typing.tab"
            >
              MCQ Test
            </button>
          </div>

          <UserIdentityHeader
            userId={identity?.getPrincipal().toString().slice(0, 12) || "GUEST"}
            name={"Candidate"}
            sessionName="Practice Session"
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

          {/* Category + Paragraph selector */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">
                Category:
              </span>
              <Select
                value={selectedCategory}
                onValueChange={(v) => {
                  setSelectedCategory(v);
                  setPassageIndex(0);
                  handleReset();
                }}
              >
                <SelectTrigger
                  className="h-8 text-xs border-[#DAA520] w-44"
                  data-ocid="typing.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewPassage}
              className="h-8 text-xs border-[#DAA520] text-black hover:bg-amber-50"
              data-ocid="typing.secondary_button"
            >
              Next Passage
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg border-2 border-[#DAA520] p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{wpm()}</div>
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
                  timeLeft < 30 ? "text-red-600" : "text-orange-600"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-500">Time Left</div>
            </div>
          </div>

          <Progress value={progressPct} className="mb-4 h-2" />

          {/* Passage title */}
          <div className="mb-1">
            <span className="text-xs font-semibold text-[#DAA520]">
              {currentPara.title}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              {currentPara.language} • {currentPara.category}
            </span>
          </div>

          {!finished ? (
            <>
              <div
                ref={passageDivRef}
                className={`bg-white rounded-xl border-2 border-[#DAA520] p-5 mb-4 font-mono ${textSizeClass} leading-8 select-none text-black overflow-auto max-h-56`}
              >
                {highlightEnabled ? (
                  <CharHighlight chars={passageChars} typed={typed} />
                ) : (
                  <BoldText text={currentPara.text} />
                )}
              </div>
              <textarea
                ref={textareaRef}
                value={typed}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Start typing here..."
                className={`w-full h-32 p-4 border-2 border-[#DAA520] rounded-xl focus:outline-none font-mono ${textSizeClass} resize-none bg-white text-black shadow-sm`}
                data-ocid="typing.editor"
              />
            </>
          ) : (
            <div
              className="bg-white rounded-xl border-2 border-[#DAA520] p-6"
              data-ocid="typing.success_state"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-xl font-bold text-black mb-1">
                  Test Complete!
                </h2>
                <p className="text-gray-500 text-sm">{currentPara.title}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {wpm()}
                  </div>
                  <div className="text-xs text-gray-500">WPM</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {accuracy()}%
                  </div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {correctWordCount}
                  </div>
                  <div className="text-xs text-gray-500">Correct Words</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {errorWordCount}
                  </div>
                  <div className="text-xs text-gray-500">Error Words</div>
                </div>
              </div>

              {/* Word analysis */}
              {typedWords.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Word Analysis:
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {typedWords.map((word, i) => {
                      const isCorrect = word === passageWords[i];
                      const key = `w-${i}`;
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

              <div className="flex justify-center gap-3 flex-wrap">
                <Button
                  onClick={handleSave}
                  className="bg-[#DAA520] hover:bg-amber-600 text-white"
                  data-ocid="typing.save_button"
                >
                  Save Result
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-[#DAA520] text-black hover:bg-amber-50"
                  data-ocid="typing.secondary_button"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleNewPassage}
                  variant="outline"
                  className="border-[#DAA520] text-black hover:bg-amber-50"
                  data-ocid="typing.secondary_button"
                >
                  New Passage
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
