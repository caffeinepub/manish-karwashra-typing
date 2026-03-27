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
import { CheckCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { stripBold } from "../BoldText";

interface TypingPassage {
  text: string;
  title?: string;
  category?: string;
  language?: string;
}

interface Props {
  examName: string;
  passages: TypingPassage[];
  duration: number; // seconds
  backspaceAllowed?: boolean;
  candidateName?: string;
  rollNo?: string;
  onComplete?: (result: {
    wpm: number;
    accuracy: number;
    correctWords: number;
    wrongWords: number;
  }) => void;
}

type BackspaceMode = "none" | "word" | "full";
type HighlightColor = "black" | "blue" | "yellow";

export default function ExamTypingInterface({
  examName,
  passages,
  duration,
  backspaceAllowed = false,
  candidateName: _candidateName = "Candidate",
  rollNo: _rollNo = "2024001",
  onComplete,
}: Props) {
  const [passageIdx, setPassageIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [keyboardSound, setKeyboardSound] = useState(false);
  const [backspaceMode, setBackspaceMode] = useState<BackspaceMode>(
    backspaceAllowed ? "full" : "none",
  );
  const [highlightColor, setHighlightColor] = useState<HighlightColor>("black");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const passageRef = useRef<HTMLDivElement>(null);

  const passage =
    passages.length > 0
      ? passages[passageIdx % passages.length]
      : { text: "No passage available. Please add typing content." };
  const passageText = stripBold(passage.text);
  const passageWords = passageText.trim().split(/\s+/).filter(Boolean);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const correctWords = typedWords.filter(
    (w, i) => w === passageWords[i],
  ).length;
  const wrongWords = typedWords.length - correctWords;
  const elapsed = duration - timeLeft;
  const wpm = elapsed > 0 ? Math.round((typedWords.length / elapsed) * 60) : 0;
  const correctChars = typed
    .split("")
    .filter((c, i) => c === passageText[i]).length;
  const accuracy =
    typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 0;

  // Current word index in passage
  const typedParts = typed.split(" ");
  const currentWordIndex = typedParts.length - 1;
  const currentWordTyped = typedParts[currentWordIndex] || "";

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleFinish = useCallback(() => {
    stopTimer();
    setFinished(true);
    onComplete?.({ wpm, accuracy, correctWords, wrongWords });
  }, [stopTimer, wpm, accuracy, correctWords, wrongWords, onComplete]);

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
    if (autoScroll && passageRef.current) {
      const wordSpans = passageRef.current.querySelectorAll("[data-word]");
      const curSpan = wordSpans[currentWordIndex];
      curSpan?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [currentWordIndex, autoScroll]);

  // Auto-finish when all words are typed
  useEffect(() => {
    if (
      !finished &&
      started &&
      passageWords.length > 0 &&
      typedWords.length >= passageWords.length
    ) {
      const timer = setTimeout(() => handleFinish(), 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedWords.length, passageWords.length, finished, started, handleFinish]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    if (!started) setStarted(true);
    setTyped(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (backspaceMode === "none") {
        e.preventDefault();
      } else if (backspaceMode === "word") {
        // Prevent backspace if would go back past start of current word (i.e., last char is space)
        if (typed.length > 0 && typed[typed.length - 1] === " ") {
          e.preventDefault();
        }
      }
    }
    // Keyboard shortcuts
    if (e.altKey) {
      if (e.key === "d") {
        e.preventDefault();
        setBackspaceMode("none");
      }
      if (e.key === "o") {
        e.preventDefault();
        setBackspaceMode("word");
      }
      if (e.key === "e") {
        e.preventDefault();
        setBackspaceMode("full");
      }
      if (e.key === "h") {
        e.preventDefault();
        setHighlightEnabled((h) => !h);
      }
      if (e.key === "s") {
        e.preventDefault();
        setAutoScroll((a) => !a);
      }
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullScreen((f) => !f);
  };

  // Highlight color class for current word box
  const currentWordBg = {
    black: "bg-black text-white",
    blue: "bg-blue-700 text-white",
    yellow: "bg-yellow-400 text-black",
  }[highlightColor];

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div
          style={{ background: "#1a237e" }}
          className="text-white px-4 py-3 flex items-center justify-between"
        >
          <div className="font-bold">{examName} — Result</div>
          <div className="text-xs text-blue-300">Node: C001</div>
        </div>
        <div className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="bg-white rounded-xl border-2 border-[#DAA520] p-6"
              data-ocid="typing.success_state"
            >
              <div className="text-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-[#0d1b4b]">
                  Typing Test Complete / टाइपिंग परीक्षा समाप्त
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-blue-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{wpm}</div>
                  <div className="text-xs text-gray-500">WPM</div>
                </div>
                <div className="bg-green-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {accuracy}%
                  </div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="bg-emerald-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {correctWords}
                  </div>
                  <div className="text-xs text-gray-500">Correct Words</div>
                </div>
                <div className="bg-red-50 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {wrongWords}
                  </div>
                  <div className="text-xs text-gray-500">Errors</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Word Analysis:
                </h3>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto bg-gray-50 rounded p-3">
                  {typedWords.map((word, i) => (
                    <span
                      key={`word-${i}-${word.slice(0, 3)}`}
                      className={`px-2 py-0.5 rounded text-xs font-mono border ${
                        word === passageWords[i]
                          ? "bg-green-50 text-green-800 border-green-300"
                          : "bg-red-50 text-red-800 border-red-300"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setTyped("");
                    setTimeLeft(duration);
                    setStarted(false);
                    setFinished(false);
                  }}
                  variant="outline"
                  className="flex-1"
                  data-ocid="typing.secondary_button"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    setPassageIdx((p) => p + 1);
                    setTyped("");
                    setTimeLeft(duration);
                    setStarted(false);
                    setFinished(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  data-ocid="typing.primary_button"
                >
                  Next Passage →
                </Button>
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
      {/* Top toolbar */}
      <div className="bg-white border-b border-gray-300 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 text-xs border border-gray-400 rounded bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            How to type this?
          </button>
          <span className="text-xs text-gray-500 ml-2">{examName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => textareaRef.current?.focus()}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
            data-ocid="typing.primary_button"
          >
            Start
          </button>
          <button
            type="button"
            onClick={toggleFullScreen}
            className="px-3 py-1 text-xs border border-gray-400 rounded bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            {isFullScreen ? "Exit Full Screen" : "Full Screen (esc)"}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: passage + typing area */}
        <div className="flex-1 flex flex-col p-3 gap-3 min-w-0">
          {/* Passage box */}
          <div
            ref={passageRef}
            className="bg-white border border-gray-300 rounded p-4 overflow-y-auto flex-1 min-h-0"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: "2",
              maxHeight: "calc(50vh - 60px)",
              minHeight: "180px",
              fontFamily: "monospace",
              userSelect: "none",
            }}
          >
            {highlightEnabled ? (
              // Word-level highlight view
              <span>
                {passageWords.map((word, wIdx) => {
                  let wordClass = "text-gray-700";
                  if (wIdx < currentWordIndex) {
                    // Already typed word
                    wordClass =
                      typedWords[wIdx] === word
                        ? "text-gray-800"
                        : "text-red-500 underline decoration-red-400";
                  } else if (wIdx === currentWordIndex) {
                    // Current word being typed - highlight it
                    wordClass = `${currentWordBg} px-0.5 rounded`;
                    // Show partial correctness within current word
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
                  return (
                    <span key={word + String(wIdx)}>
                      <span data-word={wIdx} className={wordClass}>
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
          <div
            className="bg-white border border-gray-300 rounded"
            style={{ minHeight: "120px" }}
          >
            <textarea
              ref={textareaRef}
              value={typed}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Click here and start typing the passage above..."
              className="w-full h-full resize-none p-4 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: "1.8",
                fontFamily: "monospace",
                minHeight: "120px",
                background: "white",
              }}
              data-ocid="typing.editor"
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div
          className="bg-white border-l border-gray-300 flex flex-col"
          style={{ width: "220px", flexShrink: 0 }}
        >
          {/* Submit button */}
          <div className="p-2 border-b border-gray-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="w-full py-2 px-3 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded"
                  data-ocid="typing.open_modal_button"
                >
                  Submit
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="typing.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Typing Test?</AlertDialogTitle>
                  <AlertDialogDescription>
                    WPM: {wpm} | Accuracy: {accuracy}% | Words Typed:{" "}
                    {typedWords.length}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="typing.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleFinish}
                    className="bg-orange-500 hover:bg-orange-600"
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
              className={`font-mono font-bold text-2xl leading-tight ${
                timeLeft < 60 ? "text-red-600" : "text-gray-800"
              }`}
              data-ocid="typing.panel"
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Time Left</div>
          </div>

          {/* Font Size */}
          <div className="p-3 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Font Size</div>
            <div className="flex items-center gap-1 justify-center">
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.min(s + 1, 22))}
                className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded hover:bg-green-600"
                data-ocid="typing.toggle"
              >
                A+
              </button>
              <span className="text-sm font-mono w-6 text-center">
                {fontSize}
              </span>
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.max(s - 1, 10))}
                className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded hover:bg-red-600"
                data-ocid="typing.toggle"
              >
                A-
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Setting
            </div>
            <p className="text-xs italic text-red-500 mb-3 leading-tight">
              This setting block is only For Practice Purpose, Not Available in
              Exam.
            </p>

            {/* Backspace mode */}
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-1 font-medium">
                Backspace mode:
              </div>
              {(
                [
                  ["none", "No backspace", "Alt+d"],
                  ["word", "Current word backspace", "Alt+o"],
                  ["full", "Full backspace", "Alt+e"],
                ] as [BackspaceMode, string, string][]
              ).map(([val, label, shortcut]) => (
                <label
                  key={val}
                  className="flex items-center gap-1.5 mb-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="backspace"
                    value={val}
                    checked={backspaceMode === val}
                    onChange={() => setBackspaceMode(val)}
                    className="w-3 h-3"
                    data-ocid="typing.radio"
                  />
                  <span className="text-xs text-gray-700">
                    {label}{" "}
                    <span className="text-gray-400 text-[10px]">
                      ({shortcut})
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {/* Checkboxes */}
            <div className="mb-3 space-y-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightEnabled}
                  onChange={(e) => setHighlightEnabled(e.target.checked)}
                  className="w-3 h-3"
                  data-ocid="typing.checkbox"
                />
                <span className="text-xs text-gray-700">
                  Highlight Word{" "}
                  <span className="text-gray-400 text-[10px]">(Alt+h)</span>
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-3 h-3"
                  data-ocid="typing.checkbox"
                />
                <span className="text-xs text-gray-700">
                  Auto Scroll{" "}
                  <span className="text-gray-400 text-[10px]">(Alt+s)</span>
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keyboardSound}
                  onChange={(e) => setKeyboardSound(e.target.checked)}
                  className="w-3 h-3"
                  data-ocid="typing.checkbox"
                />
                <span className="text-xs text-gray-700">
                  Play Keyboard Sound
                </span>
              </label>
            </div>

            <div className="text-xs font-semibold text-gray-500 mb-1">
              Setting
            </div>
            <div className="text-xs font-medium text-orange-600 mb-2">
              Highlighter Colour
            </div>

            {/* Highlighter color */}
            <div className="space-y-1">
              {(["black", "blue", "yellow"] as HighlightColor[]).map(
                (color) => (
                  <label
                    key={color}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="highlightColor"
                      value={color}
                      checked={highlightColor === color}
                      onChange={() => setHighlightColor(color)}
                      className="w-3 h-3"
                      data-ocid="typing.radio"
                    />
                    <span className="flex items-center gap-1 text-xs text-gray-700">
                      <span
                        className="inline-block w-3 h-3 rounded-sm border border-gray-400"
                        style={{
                          background:
                            color === "black"
                              ? "#000"
                              : color === "blue"
                                ? "#1d4ed8"
                                : "#fbbf24",
                        }}
                      />
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </span>
                  </label>
                ),
              )}
            </div>

            {/* Stop button */}
            <div className="mt-4">
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
                      Are you sure you want to stop the test? Your progress will
                      be shown.
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
    </div>
  );
}
