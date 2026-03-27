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
import { CheckCircle, Clock, Monitor, Square, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import BoldText, { stripBold } from "../BoldText";
import CharHighlight from "../CharHighlight";

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

export default function ExamTypingInterface({
  examName,
  passages,
  duration,
  backspaceAllowed = false,
  candidateName = "Candidate",
  rollNo = "2024001",
  onComplete,
}: Props) {
  const [passageIdx, setPassageIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [textSize, setTextSize] = useState<"small" | "large">("small");
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [backspace, setBackspace] = useState(backspaceAllowed);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const passageRef = useRef<HTMLDivElement>(null);

  const passage =
    passages.length > 0
      ? passages[passageIdx % passages.length]
      : { text: "No passage available. Please add typing content." };
  const passageText = stripBold(passage.text);
  const passageChars = passageText.split("");

  const textSizeClass = textSize === "large" ? "text-lg" : "text-sm";

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const passageWords = passageText.trim().split(/\s+/).filter(Boolean);
  const correctWords = typedWords.filter(
    (w, i) => w === passageWords[i],
  ).length;
  const wrongWords = typedWords.length - correctWords;
  const elapsed = duration - timeLeft;
  const wpm = elapsed > 0 ? Math.round((typedWords.length / elapsed) * 60) : 0;
  const correct = typed
    .split("")
    .filter((c, i) => c === passageChars[i]).length;
  const accuracy =
    typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;

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
      const spans = passageRef.current.querySelectorAll("span");
      const curSpan = spans[typed.length];
      curSpan?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [typed, autoScroll]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    if (!started) setStarted(true);
    setTyped(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!backspace && e.key === "Backspace") {
      e.preventDefault();
    }
  };

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
      className="min-h-screen flex flex-col bg-gray-50"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Top Header */}
      <div style={{ background: "#1a237e" }} className="text-white">
        <div className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-sm">
            <Monitor className="h-4 w-4" />
            <span>System Node No: C001</span>
            <span className="text-blue-300">|</span>
            <span className="font-semibold">{examName}</span>
          </div>
          <div
            className={`bg-red-600 text-white px-3 py-1 rounded font-mono font-bold text-lg flex items-center gap-1.5 ${
              timeLeft < 60 ? "animate-pulse" : ""
            }`}
            data-ocid="typing.panel"
          >
            <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="font-medium">{candidateName}</span>
            <span className="text-blue-300 text-xs">Roll: {rollNo}</span>
          </div>
        </div>
      </div>

      {/* Candidate Info Strip */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-12 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-700">
            <span>
              <strong>Name:</strong> {candidateName}
            </span>
            <span>
              <strong>Roll No:</strong> {rollNo}
            </span>
            <span>
              <strong>Exam:</strong> {examName}
            </span>
            <span>
              <strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}
            </span>
            <span>
              <strong>Session:</strong> Morning
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center flex-wrap gap-3">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTextSize("small")}
            className={`px-2 py-1 text-xs rounded border ${
              textSize === "small"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 border-gray-300"
            }`}
            data-ocid="typing.toggle"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setTextSize("large")}
            className={`px-2 py-1 text-sm rounded border ${
              textSize === "large"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 border-gray-300"
            }`}
            data-ocid="typing.toggle"
          >
            A+
          </button>
        </div>
        <button
          type="button"
          onClick={() => setHighlightEnabled((h) => !h)}
          className={`px-2 py-1 text-xs rounded border ${
            highlightEnabled
              ? "bg-yellow-400 text-yellow-900"
              : "bg-white text-gray-600 border-gray-300"
          }`}
          data-ocid="typing.toggle"
        >
          Highlight {highlightEnabled ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={() => setAutoScroll((a) => !a)}
          className={`px-2 py-1 text-xs rounded border ${
            autoScroll
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600 border-gray-300"
          }`}
          data-ocid="typing.toggle"
        >
          {autoScroll ? "Auto Scroll" : "Manual Scroll"}
        </button>
        <button
          type="button"
          onClick={() => setBackspace((b) => !b)}
          className={`px-2 py-1 text-xs rounded border ${
            backspace ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
          data-ocid="typing.toggle"
        >
          Backspace: {backspace ? "Allowed" : "Blocked"}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex gap-4 overflow-x-auto">
        {[
          ["WPM", wpm, "text-blue-600"],
          ["Accuracy", `${accuracy}%`, "text-green-600"],
          ["Keystrokes", typed.length, "text-gray-600"],
          [
            "Time Left",
            formatTime(timeLeft),
            timeLeft < 60 ? "text-red-600" : "text-orange-600",
          ],
          ["Errors", wrongWords, "text-red-500"],
        ].map(([label, val, cls]) => (
          <div key={label as string} className="text-center flex-shrink-0">
            <div className={`text-base font-bold ${cls}`}>{val}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          {/* Passage Label */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-[#DAA520] text-white px-2 py-0.5 rounded">
              PASSAGE / अनुच्छेद
            </span>
            <span className="text-xs text-gray-400">
              {passage.title || examName} — {passageText.split(/\s+/).length}{" "}
              words
            </span>
          </div>

          {/* Source Passage */}
          <div
            ref={passageRef}
            className={`bg-white border-2 border-[#DAA520] rounded-xl p-4 font-mono ${textSizeClass} leading-9 select-none text-black overflow-auto max-h-56`}
          >
            {highlightEnabled ? (
              <CharHighlight chars={passageChars} typed={typed} />
            ) : (
              <BoldText text={passage.text} />
            )}
          </div>

          {/* Typing Area Label */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold bg-gray-700 text-white px-2 py-0.5 rounded uppercase tracking-wider">
              TYPE HERE / यहाँ टाइप करें
            </span>
            {!started && (
              <span className="text-xs text-gray-400 animate-pulse">
                Click here and start typing...
              </span>
            )}
          </div>

          {/* Typing Area */}
          <textarea
            ref={textareaRef}
            value={typed}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Click here and start typing the passage above... / ऊपर दिए अनुच्छेद को यहाँ टाइप करें..."
            className={`w-full border-2 border-[#DAA520] rounded-xl p-4 font-mono ${textSizeClass} leading-9 resize-none bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            style={{ height: "14rem" }}
            data-ocid="typing.editor"
          />

          {/* Bottom Buttons */}
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  data-ocid="typing.secondary_button"
                >
                  <Square className="h-4 w-4 mr-1.5" /> Stop Test
                </Button>
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-[#1a237e] hover:bg-blue-900 text-white flex-1"
                  data-ocid="typing.open_modal_button"
                >
                  Submit Test / परीक्षा सबमिट करें
                </Button>
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
                    className="bg-[#1a237e]"
                    data-ocid="typing.confirm_button"
                  >
                    Submit
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
