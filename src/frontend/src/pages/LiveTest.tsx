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
import { CheckCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { stripBold } from "../components/BoldText";
import { paragraphs } from "../data/paragraphs";

type WordStatus = "pending" | "correct" | "wrong";

const EXAM_GROUPS: {
  label: string;
  value: string;
  color: string;
  categories: string[];
  duration: number;
}[] = [
  {
    label: "SSC / Govt",
    value: "ssc",
    color: "#1a3a8f",
    categories: ["ssc-cgl", "general", "haryana-gk", "india-history"],
    duration: 600,
  },
  {
    label: "Banking",
    value: "banking",
    color: "#0d47a1",
    categories: ["banking", "vocabulary", "story"],
    duration: 600,
  },
  {
    label: "Railway",
    value: "railway",
    color: "#E65100",
    categories: ["railway", "transport", "g20"],
    duration: 900,
  },
  {
    label: "Delhi Police",
    value: "delhi-police",
    color: "#1565C0",
    categories: ["delhi-police", "covid-19", "entertainment"],
    duration: 600,
  },
  {
    label: "Teaching",
    value: "teaching",
    color: "#4a0080",
    categories: ["teaching", "nature"],
    duration: 600,
  },
  {
    label: "HSSC / State",
    value: "state",
    color: "#1b5e20",
    categories: [
      "state",
      "e-governance",
      "it-infrastructure",
      "advanced-tech",
      "social-issues",
      "environment",
      "typing-skills",
    ],
    duration: 900,
  },
  {
    label: "Hartron CBT",
    value: "hartron",
    color: "#0891b2",
    categories: ["haryana-gk", "general", "state"],
    duration: 900,
  },
];

function generateCandidateId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000000) + 1000000;
  return `LT${year}${rand}`;
}

const CANDIDATE_ID = generateCandidateId();

export default function LiveTest() {
  const [selectedExam, setSelectedExam] = useState(EXAM_GROUPS[0]);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [passageIdx, setPassageIdx] = useState(0);
  const [language, setLanguage] = useState<"English" | "Hindi">("English");
  const [paragraphHeight, setParagraphHeight] = useState(280);

  const [typed, setTyped] = useState("");
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentWordTyped, setCurrentWordTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(selectedExam.duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [highlightColor, setHighlightColor] = useState<
    "black" | "blue" | "yellow"
  >("black");
  const [backspaceMode, setBackspaceMode] = useState<"none" | "word" | "full">(
    "none",
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const passageRef = useRef<HTMLDivElement>(null);

  const examParagraphs = paragraphs.filter(
    (p) =>
      selectedExam.categories.some((cat) => p.category === cat) &&
      p.language === language,
  );
  // Fallback: if no paragraphs for selected language, show all categories
  const filteredParagraphs =
    examParagraphs.length > 0
      ? examParagraphs
      : paragraphs.filter((p) =>
          selectedExam.categories.some((cat) => p.category === cat),
        );
  const GROUP_SIZE = Math.ceil(filteredParagraphs.length / 3);
  const groupedParas = [
    filteredParagraphs.slice(0, GROUP_SIZE),
    filteredParagraphs.slice(GROUP_SIZE, GROUP_SIZE * 2),
    filteredParagraphs.slice(GROUP_SIZE * 2),
  ];
  const currentGroupParas = groupedParas[selectedGroup] || filteredParagraphs;
  const currentPara =
    currentGroupParas[passageIdx % Math.max(currentGroupParas.length, 1)];
  const passageText = currentPara
    ? stripBold(currentPara.text)
    : "No passage available. Please select an exam category.";
  const passageWords = passageText.trim().split(/\s+/).filter(Boolean);

  const elapsed = selectedExam.duration - timeLeft;
  const correctWords = wordStatuses.filter((s) => s === "correct").length;
  const wrongWords = wordStatuses.filter((s) => s === "wrong").length;
  const typedCount = correctWords + wrongWords;
  const wpm = elapsed > 0 ? Math.round((typedCount / elapsed) * 60) : 0;
  const accuracy =
    typedCount > 0 ? Math.round((correctWords / typedCount) * 100) : 0;

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleFinish = useCallback(() => {
    stopTimer();
    setFinished(true);
  }, [stopTimer]);

  // Reset word statuses when passage changes
  useEffect(() => {
    setWordStatuses(
      new Array(passageWords.length).fill("pending") as WordStatus[],
    );
    setCurrentWordIdx(0);
    setCurrentWordTyped("");
  }, [passageWords.length]);

  // Reset timer when exam changes
  useEffect(() => {
    setTimeLeft(selectedExam.duration);
    setStarted(false);
    setFinished(false);
    setTyped("");
    stopTimer();
  }, [selectedExam.duration, stopTimer]);

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return stopTimer;
  }, [started, finished, handleFinish, stopTimer]);

  useEffect(() => {
    if (
      !finished &&
      started &&
      passageWords.length > 0 &&
      currentWordIdx >= passageWords.length
    ) {
      const t = setTimeout(() => handleFinish(), 500);
      return () => clearTimeout(t);
    }
  }, [currentWordIdx, passageWords.length, finished, started, handleFinish]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    const val = e.target.value;
    const prevVal = typed;
    if (!started) setStarted(true);

    const prevEndsWithSpace = prevVal.endsWith(" ");
    const curEndsWithSpace = val.endsWith(" ");
    setTyped(val);

    if (curEndsWithSpace && !prevEndsWithSpace) {
      const parts = val.trimEnd().split(" ");
      const finishedWordTyped = parts[parts.length - 1] || "";
      const targetWord = passageWords[currentWordIdx] || "";
      const status: WordStatus =
        finishedWordTyped === targetWord ? "correct" : "wrong";
      setWordStatuses((prev) => {
        const next = [...prev];
        next[currentWordIdx] = status;
        return next;
      });
      setCurrentWordIdx((idx) => idx + 1);
      setCurrentWordTyped("");
    } else {
      const parts = val.split(" ");
      setCurrentWordTyped(parts[parts.length - 1] || "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (backspaceMode === "none") e.preventDefault();
      else if (backspaceMode === "word" && typed.endsWith(" "))
        e.preventDefault();
    }
  };

  const resetTest = () => {
    stopTimer();
    setTyped("");
    setWordStatuses(
      new Array(passageWords.length).fill("pending") as WordStatus[],
    );
    setCurrentWordIdx(0);
    setCurrentWordTyped("");
    setTimeLeft(selectedExam.duration);
    setStarted(false);
    setFinished(false);
    textareaRef.current?.focus();
  };

  const currentWordBg = {
    black: "bg-black text-white",
    blue: "bg-blue-700 text-white",
    yellow: "bg-yellow-400 text-black",
  }[highlightColor];

  const today = new Date();
  const examDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
  const examTime = today.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (finished) {
    const netWpm = Math.max(0, wpm - Math.floor(wrongWords * 0.5));
    const passed = netWpm >= 25 && accuracy >= 80;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div
          className="text-white px-4 py-3 flex items-center justify-between"
          style={{ background: selectedExam.color }}
        >
          <div className="font-bold text-sm">
            KARWASHRA TYPING EXAM — Live Test Result
          </div>
          <div className="text-xs opacity-80">ID: {CANDIDATE_ID}</div>
        </div>
        <div className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="bg-white rounded-xl border-2 border-yellow-400 p-6"
              data-ocid="typing.success_state"
            >
              <div className="text-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-gray-800">
                  Live Test Complete!
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedExam.label} — Candidate: {CANDIDATE_ID}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{wpm}</div>
                  <div className="text-xs text-gray-500">Gross WPM</div>
                </div>
                <div className="bg-green-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {netWpm}
                  </div>
                  <div className="text-xs text-gray-500">Net WPM</div>
                </div>
                <div className="bg-emerald-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {accuracy}%
                  </div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="bg-red-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {wrongWords}
                  </div>
                  <div className="text-xs text-gray-500">Errors</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="font-bold text-gray-700">{correctWords}</div>
                  <div className="text-xs text-gray-500">Correct Words</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <div className="font-bold text-gray-700">{typedCount}</div>
                  <div className="text-xs text-gray-500">Total Typed</div>
                </div>
              </div>
              <div
                className={`mb-4 p-3 rounded text-center font-semibold text-sm ${
                  passed
                    ? "bg-green-50 text-green-700 border border-green-300"
                    : "bg-red-50 text-red-700 border border-red-300"
                }`}
              >
                {passed
                  ? `🏅 Qualified! Net WPM ${netWpm} ≥ 25 & Accuracy ${accuracy}% ≥ 80%`
                  : "💪 Need 25 WPM & 80% Accuracy — Keep Practicing!"}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetTest}
                  className="flex-1 py-2 text-sm font-semibold border border-gray-300 rounded hover:bg-gray-50"
                  data-ocid="typing.secondary_button"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPassageIdx((p) => p + 1);
                    resetTest();
                  }}
                  className="flex-1 py-2 text-sm font-semibold text-white rounded hover:opacity-90"
                  style={{ background: selectedExam.color }}
                  data-ocid="typing.primary_button"
                >
                  Next Passage →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Top navbar */}
      <div
        className="text-white px-3 py-2 flex items-center justify-between text-sm"
        style={{ background: selectedExam.color }}
      >
        <div className="font-bold tracking-wide">
          KARWASHRA TYPING EXAM — Live Test
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-white/20 px-2 py-0.5 rounded">{examDate}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded">{examTime}</span>
          <span className="bg-yellow-400/80 text-black px-2 py-0.5 rounded font-semibold">
            Login
          </span>
          <span className="bg-white/10 px-2 py-0.5 rounded">SIGN UP</span>
        </div>
      </div>

      {/* Exam selector + language toggle */}
      <div className="bg-white border-b border-gray-300 px-3 py-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-600 mr-1">Exam:</span>
        {EXAM_GROUPS.map((eg) => (
          <button
            key={eg.value}
            type="button"
            onClick={() => {
              setSelectedExam(eg);
              setSelectedGroup(0);
              setPassageIdx(0);
            }}
            className="px-3 py-1 text-xs font-semibold rounded border transition-all"
            style={{
              background: selectedExam.value === eg.value ? eg.color : "white",
              color: selectedExam.value === eg.value ? "white" : "#374151",
              borderColor: eg.color,
            }}
          >
            {eg.label}
          </button>
        ))}
        {/* Language toggle */}
        <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-2">
          <span className="text-xs text-gray-500">Lang:</span>
          {(["English", "Hindi"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang);
                setPassageIdx(0);
              }}
              className="px-2 py-0.5 text-xs font-semibold rounded border transition-all"
              style={{
                background: language === lang ? selectedExam.color : "white",
                color: language === lang ? "white" : "#374151",
                borderColor: selectedExam.color,
              }}
            >
              {lang}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">Font:</span>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(s + 1, 22))}
            className="px-2 py-0.5 text-xs bg-green-500 text-white rounded"
            data-ocid="typing.toggle"
          >
            A+
          </button>
          <span className="text-xs font-mono">{fontSize}</span>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(s - 1, 10))}
            className="px-2 py-0.5 text-xs bg-red-500 text-white rounded"
            data-ocid="typing.toggle"
          >
            A-
          </button>
          {/* Para size slider */}
          <span className="text-xs text-gray-500 ml-2">Para Size:</span>
          <input
            type="range"
            min={250}
            max={1500}
            step={50}
            value={paragraphHeight}
            onChange={(e) => setParagraphHeight(Number(e.target.value))}
            className="w-20 accent-blue-600"
            title={`Para height: ${paragraphHeight}px`}
          />
          <span className="text-xs font-mono text-gray-600">
            {paragraphHeight}px
          </span>
        </div>
      </div>

      {/* Group tabs */}
      <div className="bg-gray-200 border-b border-gray-300 px-3 py-1.5 flex items-center gap-2">
        {["Group 1", "Group 2", "Group 3"].map((g, i) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setSelectedGroup(i);
              setPassageIdx(0);
            }}
            className="px-4 py-1 text-xs font-semibold rounded transition-all"
            style={{
              background: selectedGroup === i ? selectedExam.color : "white",
              color: selectedGroup === i ? "white" : "#374151",
              border: `1px solid ${selectedExam.color}`,
            }}
          >
            {g} ({groupedParas[i]?.length || 0} Para)
          </button>
        ))}
        <div className="ml-3 text-xs text-gray-500">
          Para {(passageIdx % Math.max(currentGroupParas.length, 1)) + 1} of{" "}
          {currentGroupParas.length}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPassageIdx((p) => Math.max(0, p - 1))}
            className="px-2 py-0.5 text-xs bg-gray-400 text-white rounded"
          >
            ◀ Prev
          </button>
          <button
            type="button"
            onClick={() => setPassageIdx((p) => p + 1)}
            className="px-2 py-0.5 text-xs text-white rounded"
            style={{ background: selectedExam.color }}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* Left: passage + typing */}
        <div className="flex-1 flex flex-col p-3 gap-3 min-w-0">
          {/* Paragraph title */}
          {currentPara && (
            <div
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{
                background: `${selectedExam.color}20`,
                color: selectedExam.color,
              }}
            >
              {currentPara.title} | {currentPara.category.toUpperCase()} |{" "}
              {currentPara.language}
            </div>
          )}

          {/* Paragraph display */}
          <div
            ref={passageRef}
            className="bg-white border border-gray-300 rounded p-4 overflow-y-auto"
            style={{
              minHeight: `${paragraphHeight}px`,
              maxHeight: `${paragraphHeight}px`,
              fontSize: `${fontSize}px`,
              lineHeight: "2",
              fontFamily: "monospace",
              userSelect: "none",
            }}
          >
            {highlightEnabled ? (
              <span>
                {passageWords.map((word, wIdx) => {
                  const status = wordStatuses[wIdx] || "pending";
                  const isCurrent = wIdx === currentWordIdx;
                  if (isCurrent) {
                    return (
                      <span key={word + String(wIdx)}>
                        <span
                          data-word={wIdx}
                          className={`${currentWordBg} rounded px-0.5`}
                          style={{ fontFamily: "monospace" }}
                        >
                          {word.split("").map((ch, cIdx) => {
                            if (cIdx < currentWordTyped.length) {
                              const correct = ch === currentWordTyped[cIdx];
                              return (
                                <span
                                  key={ch + String(cIdx)}
                                  className={
                                    correct ? "" : "text-red-300 line-through"
                                  }
                                >
                                  {ch}
                                </span>
                              );
                            }
                            return <span key={ch + String(cIdx)}>{ch}</span>;
                          })}
                        </span>
                        <span> </span>
                      </span>
                    );
                  }
                  if (status === "correct")
                    return (
                      <span key={word + String(wIdx)}>
                        <span
                          data-word={wIdx}
                          className="text-blue-700 font-semibold"
                        >
                          {word}
                        </span>
                        <span> </span>
                      </span>
                    );
                  if (status === "wrong")
                    return (
                      <span key={word + String(wIdx)}>
                        <span
                          data-word={wIdx}
                          className="bg-red-600 text-white rounded px-0.5"
                        >
                          {word}
                        </span>
                        <span> </span>
                      </span>
                    );
                  return (
                    <span key={word + String(wIdx)}>
                      <span data-word={wIdx} className="text-gray-700">
                        {word}
                      </span>
                      <span> </span>
                    </span>
                  );
                })}
              </span>
            ) : (
              <span className="text-gray-800">{passageText}</span>
            )}
          </div>

          {/* Typing area */}
          <textarea
            ref={textareaRef}
            value={typed}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              started ? "" : "Click here and start typing the passage above..."
            }
            className="bg-white border border-gray-300 rounded p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-y-auto"
            style={{
              minHeight: `${paragraphHeight}px`,
              maxHeight: `${paragraphHeight}px`,
              fontSize: `${fontSize}px`,
              lineHeight: "1.8",
              fontFamily: "monospace",
            }}
            data-ocid="typing.editor"
          />

          {/* Bottom controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={highlightEnabled}
                onChange={(e) => setHighlightEnabled(e.target.checked)}
                className="w-3 h-3"
                data-ocid="typing.checkbox"
              />
              <span className="text-xs text-gray-700">Highlight</span>
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">Backspace:</span>
              {(["none", "word", "full"] as const).map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="bksp"
                    value={m}
                    checked={backspaceMode === m}
                    onChange={() => setBackspaceMode(m)}
                    className="w-3 h-3"
                    data-ocid="typing.radio"
                  />
                  <span className="text-xs text-gray-600">{m}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">Highlight:</span>
              {(["black", "blue", "yellow"] as const).map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="hcolor"
                    value={c}
                    checked={highlightColor === c}
                    onChange={() => setHighlightColor(c)}
                    className="w-3 h-3"
                    data-ocid="typing.radio"
                  />
                  <span
                    className="inline-block w-3 h-3 rounded-sm border border-gray-400"
                    style={{
                      background:
                        c === "black"
                          ? "#000"
                          : c === "blue"
                            ? "#1d4ed8"
                            : "#fbbf24",
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div
          className="bg-white border-l border-gray-300 flex flex-col"
          style={{ width: "200px", flexShrink: 0 }}
        >
          {/* Submit */}
          <div className="p-2 border-b border-gray-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="w-full py-2 px-3 text-sm font-semibold text-white rounded"
                  style={{ background: selectedExam.color }}
                  data-ocid="typing.open_modal_button"
                >
                  Submit
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="typing.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Live Test?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Net WPM: {wpm} | Accuracy: {accuracy}% | Words: {typedCount}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="typing.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleFinish}
                    className="text-white"
                    style={{ background: selectedExam.color }}
                    data-ocid="typing.confirm_button"
                  >
                    Submit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Timer */}
          <div className="p-3 border-b border-gray-200 text-center">
            <div
              className={`font-mono font-bold text-2xl ${
                timeLeft < 60 ? "text-red-600" : "text-gray-800"
              }`}
              data-ocid="typing.panel"
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Time Left</div>
            <div className="text-xs text-blue-600 mt-0.5 font-medium">
              {selectedExam.duration / 60} min test
            </div>
            {!started && (
              <div className="text-xs text-blue-500 mt-1">
                Start typing to begin
              </div>
            )}
          </div>

          {/* Live stats */}
          <div className="p-3 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              Live Stats
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Net WPM</span>
                <span className="font-bold text-blue-600">{wpm}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-bold text-green-600">{accuracy}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Correct</span>
                <span className="font-bold text-emerald-600">
                  {correctWords}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Errors</span>
                <span className="font-bold text-red-600">{wrongWords}</span>
              </div>
            </div>
          </div>

          {/* Candidate info */}
          <div className="p-3 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              Candidate
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600">
                <span className="font-medium">ID:</span> {CANDIDATE_ID}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Exam:</span> {selectedExam.label}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Date:</span> {examDate}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Duration:</span>{" "}
                {selectedExam.duration / 60} min
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Lang:</span> {language}
              </div>
            </div>
          </div>

          {/* Stop Test */}
          <div className="p-3 mt-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="w-full py-1.5 text-xs bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200"
                  data-ocid="typing.secondary_button"
                >
                  Stop Test
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="typing.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Stop Test?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your current progress will be shown as result.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="typing.cancel_button">
                    Continue
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleFinish}
                    className="bg-red-600 hover:bg-red-700"
                    data-ocid="typing.confirm_button"
                  >
                    Stop
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
