import {
  ChevronLeft,
  ChevronRight,
  Download,
  HelpCircle,
  Minus,
  Monitor,
  Printer,
  Save,
  Square,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { paragraphs as allParagraphs } from "../data/paragraphs";
import { saveExamResult } from "../utils/results";
import { type ExamBoard, calcTypingScore } from "../utils/typingScoring";

const DOC_PASSAGES_201_220 = allParagraphs.filter(
  (p) => p.id >= 201 && p.id <= 220,
);
const DOC_PASSAGES_221_260 = allParagraphs.filter(
  (p) => p.id >= 221 && p.id <= 260,
);
const DOC_PASSAGES_261_300 = allParagraphs.filter(
  (p) => p.id >= 261 && p.id <= 300,
);

const DURATION_OPTIONS = [
  { label: "1 Minute", seconds: 60 },
  { label: "2 Minutes", seconds: 120 },
  { label: "3 Minutes", seconds: 180 },
  { label: "5 Minutes", seconds: 300 },
  { label: "10 Minutes", seconds: 600 },
  { label: "15 Minutes", seconds: 900 },
  { label: "20 Minutes", seconds: 1200 },
];

const WORD_COUNT_OPTIONS = [
  { label: "50 Words", count: 50 },
  { label: "100 Words", count: 100 },
  { label: "200 Words", count: 200 },
  { label: "500 Words", count: 500 },
  { label: "1000 Words", count: 1000 },
  { label: "All Words", count: 0 },
];

type Phase = "idle" | "typing" | "result";
type WordStatus = "pending" | "correct" | "wrong";

interface WordSpan {
  id: string;
  word: string;
}

function buildWordSpans(passage: string): WordSpan[] {
  return passage
    .trim()
    .split(/\s+/)
    .map((word, pos) => ({ id: `${pos}-${word}`, word }));
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const ICON_BTN_CLS =
  "w-7 h-7 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-200 transition-colors";

// Detect exam board from paragraph category
function detectExamBoard(category: string | undefined): ExamBoard {
  if (!category) return "General";
  const c = category.toLowerCase();
  if (c.includes("ssc")) return "SSC";
  if (c.includes("railway") || c.includes("ntpc")) return "Railway";
  if (c.includes("delhi police")) return "DelhiPolice";
  if (c.includes("dsssb") || c.includes("deo")) return "DSSSB";
  if (c.includes("hssc") || c.includes("haryana") || c.includes("hartron"))
    return "HSSC";
  if (c.includes("bank")) return "Banking";
  if (c.includes("teach") || c.includes("ctet") || c.includes("clerk"))
    return "Teaching";
  return "General";
}

export default function TypingTestPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeGroup, setActiveGroup] = useState(1);
  const [paraIndex, setParaIndex] = useState(0);
  const [duration, setDuration] = useState(DURATION_OPTIONS[3]);
  const [language, setLanguage] = useState("English");
  const [wordCountOption, setWordCountOption] = useState(WORD_COUNT_OPTIONS[5]);

  const [wordSpans, setWordSpans] = useState<WordSpan[]>([]);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [typed, setTyped] = useState("");
  const [currentWordTyped, setCurrentWordTyped] = useState("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [totalKeyDepressions, setTotalKeyDepressions] = useState(0);
  const [correctCharsCount, setCorrectCharsCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_OPTIONS[3].seconds);
  const [timeTaken, setTimeTaken] = useState(0);
  const [started, setStarted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getGroupPassages = (group: number) => {
    const pool =
      group === 1
        ? DOC_PASSAGES_201_220
        : group === 2
          ? DOC_PASSAGES_221_260
          : group === 3
            ? DOC_PASSAGES_261_300
            : allParagraphs.filter((p) => p.category === "society");
    const filtered = pool.filter((p) => p.language === language);
    return filtered.length > 0 ? filtered : pool;
  };
  const groupPassages = getGroupPassages(activeGroup);
  const currentPassageObj =
    groupPassages[paraIndex % groupPassages.length] || groupPassages[0];
  const currentPassage = currentPassageObj?.text || "";
  const groupIndices = groupPassages.map((_, i) => i);

  const words = wordSpans.map((s) => s.word);

  // Derive stats from wordStatuses
  const correctWords = wordStatuses.filter((s) => s === "correct").length;
  const wrongWords = wordStatuses.filter((s) => s === "wrong").length;
  const totalTyped = correctWords + wrongWords;

  const elapsedSec =
    timeTaken > 0
      ? timeTaken
      : started
        ? (Date.now() - startTimeRef.current) / 1000
        : 0;
  const wpm = elapsedSec > 0 ? Math.round((correctWords / elapsedSec) * 60) : 0;
  const accuracy =
    totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 0;

  function beginTest() {
    const spans = buildWordSpans(currentPassage);
    const limitedSpans =
      wordCountOption.count > 0 ? spans.slice(0, wordCountOption.count) : spans;
    setWordSpans(limitedSpans);
    setWordStatuses(
      new Array(limitedSpans.length).fill("pending") as WordStatus[],
    );
    setTyped("");
    setCurrentWordTyped("");
    setCurrentWordIdx(0);
    setTotalKeyDepressions(0);
    setCorrectCharsCount(0);
    setStarted(false);
    setTimeTaken(0);
    setTimeLeft(duration.seconds);
    setPhase("typing");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Count key depressions (all printable keys + space + backspace)
    if (e.key.length === 1 || e.key === "Backspace" || e.key === " ") {
      setTotalKeyDepressions((n) => n + 1);
    }
  }

  function handleType(val: string) {
    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const left = duration.seconds - elapsed;
        if (left <= 0) {
          clearInterval(timerRef.current!);
          setTimeTaken(duration.seconds);
          setPhase("result");
        } else {
          setTimeLeft(left);
        }
      }, 100);
    }

    const prevVal = typed;
    setTyped(val);

    // Detect if space was pressed (new word boundary)
    const prevEndsWithSpace = prevVal.endsWith(" ");
    const curEndsWithSpace = val.endsWith(" ");

    if (curEndsWithSpace && !prevEndsWithSpace) {
      // Space just pressed — finalize current word
      const parts = val.trimEnd().split(" ");
      const finishedWordTyped = parts[parts.length - 1] || "";
      const targetWord = words[currentWordIdx] || "";
      const status: WordStatus =
        finishedWordTyped === targetWord ? "correct" : "wrong";

      setWordStatuses((prev) => {
        const next = [...prev];
        next[currentWordIdx] = status;
        return next;
      });

      // Count correct chars in just-finished word
      let cc = 0;
      for (
        let i = 0;
        i < Math.min(finishedWordTyped.length, targetWord.length);
        i++
      ) {
        if (finishedWordTyped[i] === targetWord[i]) cc++;
      }
      setCorrectCharsCount((n) => n + cc);

      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);
      setCurrentWordTyped("");

      // Auto-finish if all words done
      if (nextIdx >= words.length && words.length > 0) {
        setTimeout(() => {
          if (timerRef.current) clearInterval(timerRef.current);
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setTimeTaken(elapsed);
          setPhase("result");
        }, 500);
      }
    } else {
      // Update current word typed (chars after last space)
      const parts = val.split(" ");
      setCurrentWordTyped(parts[parts.length - 1] || "");
    }
  }

  function finishTest() {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = started ? duration.seconds - timeLeft : 0;
    setTimeTaken(elapsed || 1);
    setPhase("result");
  }

  function clearTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTyped("");
    setCurrentWordTyped("");
    setCurrentWordIdx(0);
    setWordStatuses([]);
    setTotalKeyDepressions(0);
    setCorrectCharsCount(0);
    setStarted(false);
    setTimeTaken(0);
    setPhase("idle");
  }

  function changeGroup(g: number) {
    setActiveGroup(g);
    setParaIndex(0);
    clearTimer();
  }

  function changePara(dir: "prev" | "next") {
    const len = groupPassages.length;
    const newIdx =
      dir === "next" ? (paraIndex + 1) % len : (paraIndex - 1 + len) % len;
    setParaIndex(newIdx);
    clearTimer();
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional save-once
  useEffect(() => {
    if (phase === "result" && timeTaken > 0) {
      const timeMin = timeTaken / 60;
      const scoring = calcTypingScore({
        examBoard: detectExamBoard(currentPassageObj?.category),
        totalKeyDepressions,
        correctWords,
        wrongWords,
        totalWords: words.length,
        correctChars: correctCharsCount,
        timeMinutes: timeMin,
      });
      saveExamResult({
        examName: `Typing Test - ${duration.label}`,
        examType: "typing",
        wpm: scoring.netWPM,
        accuracy,
        passed: scoring.isPassed,
      });
    }
  }, [phase, timeTaken]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // ── RESULT PHASE ─────────────────────────────────────────────────
  if (phase === "result") {
    const timeMin = Math.max(timeTaken / 60, 0.01);
    const examBoard = detectExamBoard(currentPassageObj?.category);
    const scoring = calcTypingScore({
      examBoard,
      totalKeyDepressions,
      correctWords,
      wrongWords,
      totalWords: words.length,
      correctChars: correctCharsCount,
      timeMinutes: timeMin,
    });
    const qualify = scoring.isPassed;

    return (
      <div className="min-h-screen" style={{ background: "#f0f2f5" }}>
        <ExamNavbar />
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded shadow-md p-8">
            <h2
              className="text-2xl font-bold text-center mb-2"
              style={{ color: "#1a237e", fontFamily: "Georgia, serif" }}
            >
              🏆 Typing Test Result
            </h2>
            <p className="text-center text-gray-500 text-sm mb-4">
              {duration.label} Test — {dateStr} — {examBoard}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {[
                {
                  label: "Gross WPM",
                  value: scoring.grossWPM,
                  color: "#1565c0",
                  bg: "#e3f2fd",
                },
                {
                  label: "Net WPM",
                  value: scoring.netWPM,
                  color: "#2e7d32",
                  bg: "#e8f5e9",
                },
                {
                  label: "Mistakes",
                  value: scoring.mistakes,
                  color: "#c62828",
                  bg: "#ffebee",
                },
                {
                  label: "Penalty",
                  value: scoring.penaltyApplied,
                  color: "#e65100",
                  bg: "#fff3e0",
                },
                {
                  label: "Accuracy",
                  value: `${accuracy}%`,
                  color: "#6a1b9a",
                  bg: "#f3e5f5",
                },
                {
                  label: "Time Taken",
                  value: formatTime(Math.round(timeTaken)),
                  color: "#00695c",
                  bg: "#e0f2f1",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg p-4 text-center"
                  style={{ background: s.bg }}
                >
                  <div
                    className="text-3xl font-bold"
                    style={{
                      color: s.color,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            {/* Formula display */}
            <div
              className="p-3 rounded-lg mb-4 text-xs font-mono"
              style={{
                background: "#f5f5f5",
                color: "#333",
                border: "1px solid #e0e0e0",
              }}
            >
              <span className="font-semibold text-gray-700">Formula: </span>
              {scoring.formula}
            </div>
            <div
              className="p-4 rounded-lg text-center font-semibold mb-6"
              style={{
                background: qualify ? "#e8f5e9" : "#ffebee",
                color: qualify ? "#2e7d32" : "#c62828",
                border: `1px solid ${qualify ? "#a5d6a7" : "#ef9a9a"}`,
              }}
            >
              {qualify
                ? `🏅 Qualified! Net WPM ${scoring.netWPM} ≥ ${scoring.passThreshold}`
                : `💪 Keep practicing! Need ${scoring.passThreshold} WPM — Got ${scoring.netWPM}`}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearTimer}
                className="flex-1 py-2.5 rounded font-semibold text-sm border-2 transition-colors"
                style={{ borderColor: "#1565c0", color: "#1565c0" }}
                data-ocid="typing.new_test_button"
              >
                New Test
              </button>
              <button
                type="button"
                onClick={beginTest}
                className="flex-1 py-2.5 rounded font-semibold text-sm text-white transition-colors"
                style={{ background: "#1565c0" }}
                data-ocid="typing.retry_button"
              >
                ▶ Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── IDLE / TYPING PHASE ────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f0f2f5", fontSize: "13px" }}
    >
      <ExamNavbar />

      {/* TOOLBAR ROW */}
      <div
        className="flex items-center px-3 py-1.5 border-b"
        style={{ background: "#f5f5f5", borderColor: "#d0d0d0" }}
      >
        <div className="flex gap-1 mr-4">
          <button
            type="button"
            className={ICON_BTN_CLS}
            style={{ borderColor: "#b0b0b0" }}
          >
            <Save size={13} />
          </button>
          <button
            type="button"
            className={ICON_BTN_CLS}
            style={{ borderColor: "#b0b0b0" }}
          >
            <Download size={13} />
          </button>
          <button
            type="button"
            className={ICON_BTN_CLS}
            style={{ borderColor: "#b0b0b0" }}
          >
            <Printer size={13} />
          </button>
          <button
            type="button"
            className={ICON_BTN_CLS}
            style={{ borderColor: "#b0b0b0" }}
          >
            <HelpCircle size={13} />
          </button>
        </div>
        <div
          className="flex-1 text-center font-bold text-sm"
          style={{ color: "#1a237e" }}
        >
          Typing Test — {dateStr}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            className="w-6 h-5 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-200"
            style={{ borderColor: "#b0b0b0" }}
          >
            <Minus size={10} />
          </button>
          <button
            type="button"
            className="w-6 h-5 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-200"
            style={{ borderColor: "#b0b0b0" }}
          >
            <Square size={10} />
          </button>
          <button
            type="button"
            className="w-6 h-5 flex items-center justify-center border rounded text-white"
            style={{ background: "#e53935", borderColor: "#e53935" }}
          >
            <X size={10} />
          </button>
        </div>
      </div>

      {/* ALL EXAM ROW */}
      <div
        className="flex items-center px-3 py-1.5 border-b"
        style={{ background: "#ffffff", borderColor: "#d0d0d0" }}
      >
        <span className="font-bold text-sm mr-4" style={{ color: "#1a237e" }}>
          All Exam
        </span>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => changeGroup(g)}
              className="px-3 py-0.5 rounded text-xs font-semibold border transition-colors"
              style={{
                background: activeGroup === g ? "#1565c0" : "transparent",
                color: activeGroup === g ? "#ffffff" : "#1565c0",
                borderColor: "#1565c0",
              }}
              data-ocid={`typing.group.${g}.tab`}
            >
              {g === 4 ? "Society" : `Group ${g}`}
            </button>
          ))}
        </div>
        <div className="ml-auto font-bold text-sm" style={{ color: "#1a237e" }}>
          Time Left :{" "}
          {formatTime(
            Math.round(phase === "typing" ? timeLeft : duration.seconds),
          )}
        </div>
      </div>

      {/* INFO BAR */}
      <div
        className="flex items-center px-3 py-1 gap-4"
        style={{ background: "#3949ab" }}
      >
        <span className="text-white text-xs">Keyboard Layout: Inscript</span>
        <span className="text-white text-xs">|</span>
        <span className="text-white text-xs">Language: {language}</span>
        {phase === "typing" && started && (
          <>
            <span className="text-white text-xs ml-4">|</span>
            <span className="text-yellow-300 text-xs font-bold">
              WPM: {wpm}
            </span>
            <span className="text-white text-xs">|</span>
            <span className="text-green-300 text-xs font-bold">
              Accuracy: {accuracy}%
            </span>
          </>
        )}
      </div>

      {/* MAIN TWO-PANEL AREA */}
      <div
        className="flex border-b"
        style={{ borderColor: "#d0d0d0", height: "280px" }}
      >
        {/* LEFT PANEL — Paragraph with word highlighting */}
        <div
          className="flex-1 p-5 border-r"
          style={{
            borderColor: "#d0d0d0",
            background: "#ffffff",
            height: "280px",
            overflowY: "auto",
          }}
        >
          {phase === "typing" ? (
            <div
              className="leading-relaxed text-justify"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "20px",
                lineHeight: "1.9",
              }}
            >
              {wordSpans.map((span, pos) => {
                const status = wordStatuses[pos] || "pending";
                const isCurrent = pos === currentWordIdx;

                if (isCurrent) {
                  // Current word: char-by-char coloring
                  return (
                    <span
                      key={span.id}
                      style={{
                        background: "#fff9c4",
                        textDecoration: "underline",
                        marginRight: "4px",
                        padding: "0 1px",
                        fontWeight: "600",
                      }}
                    >
                      {span.word.split("").map((ch, ci) => {
                        if (ci < currentWordTyped.length) {
                          const correct = ch === currentWordTyped[ci];
                          return (
                            <span
                              key={`${span.id}-c${ci}`}
                              style={{ color: correct ? "#1565c0" : "#c62828" }}
                            >
                              {ch}
                            </span>
                          );
                        }
                        return (
                          <span
                            key={`${span.id}-c${ci}`}
                            style={{ color: "#555" }}
                          >
                            {ch}
                          </span>
                        );
                      })}
                    </span>
                  );
                }

                // Past words: only use wordStatuses, never cascade
                if (status === "correct") {
                  return (
                    <span
                      key={span.id}
                      style={{
                        color: "#1565c0",
                        fontWeight: "600",
                        marginRight: "4px",
                        padding: "0 1px",
                      }}
                    >
                      {span.word}
                    </span>
                  );
                }
                if (status === "wrong") {
                  return (
                    <span
                      key={span.id}
                      style={{
                        color: "#ffffff",
                        background: "#c62828",
                        fontWeight: "600",
                        marginRight: "4px",
                        padding: "0 3px",
                        borderRadius: "2px",
                      }}
                    >
                      {span.word}
                    </span>
                  );
                }
                // pending (future words)
                return (
                  <span
                    key={span.id}
                    style={{
                      color: "#333333",
                      marginRight: "4px",
                      padding: "0 1px",
                    }}
                  >
                    {span.word}
                  </span>
                );
              })}
            </div>
          ) : (
            <p
              className="leading-relaxed text-justify text-gray-800"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "20px",
                lineHeight: "1.9",
              }}
            >
              {currentPassage}
            </p>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div
          className="w-64 shrink-0 flex flex-col"
          style={{ background: "#ffffff" }}
        >
          <div
            className="py-2 px-3 text-center font-bold text-white text-xs tracking-wide"
            style={{ background: "#1a237e" }}
          >
            CANDIDATE PROFILE &amp; LOGIN
          </div>
          <div className="flex justify-center py-4">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                background: "#e0e0e0",
                border: "2px solid #b0b0b0",
              }}
            >
              <User size={36} style={{ color: "#9e9e9e" }} />
            </div>
          </div>
          <div className="px-4 space-y-2">
            <div>
              <label
                htmlFor="exam-uid"
                className="block text-xs font-semibold text-gray-700 mb-0.5"
              >
                User ID:
              </label>
              <input
                id="exam-uid"
                type="text"
                placeholder="Enter User ID"
                className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{ borderColor: "#b0b0b0" }}
                data-ocid="typing.user_id.input"
              />
            </div>
            <div>
              <label
                htmlFor="exam-pwd"
                className="block text-xs font-semibold text-gray-700 mb-0.5"
              >
                Password:
              </label>
              <input
                id="exam-pwd"
                type="password"
                placeholder="••••••••"
                className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{ borderColor: "#b0b0b0" }}
                data-ocid="typing.password.input"
              />
            </div>
            <button
              type="button"
              className="w-full py-1.5 rounded text-white text-xs font-semibold"
              style={{ background: "#1565c0" }}
              data-ocid="typing.login.button"
            >
              Log in
            </button>
            <div className="text-center">
              <button
                type="button"
                className="text-xs"
                style={{ color: "#1565c0" }}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <hr className="mx-4 my-3" style={{ borderColor: "#e0e0e0" }} />
          <div className="px-4 space-y-2">
            {[
              { label: "Required WPM:", value: "30" },
              { label: "Min Accuracy:", value: "85%" },
              {
                label: "Duration:",
                value: duration.label
                  .replace(" Minutes", " min")
                  .replace(" Minute", " min"),
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-gray-600">{stat.label}</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "#1565c0" }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 px-4 py-3 mt-auto">
            <button
              type="button"
              onClick={() => changePara("prev")}
              className="w-6 h-6 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-100"
              style={{ borderColor: "#b0b0b0" }}
              data-ocid="typing.para_prev.button"
            >
              <ChevronLeft size={12} />
            </button>
            <span
              className="text-xs font-semibold"
              style={{ color: "#1a237e" }}
            >
              {paraIndex + 1}/{groupIndices.length}
            </span>
            <button
              type="button"
              onClick={() => changePara("next")}
              className="w-6 h-6 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-100"
              style={{ borderColor: "#b0b0b0" }}
              data-ocid="typing.para_next.button"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b flex-wrap"
        style={{ background: "#f5f5f5", borderColor: "#d0d0d0" }}
      >
        <span className="text-xs font-semibold text-gray-700">Minutes:</span>
        <div className="flex gap-1 flex-wrap">
          {[1, 2, 3, 5, 10, 15, 20].map((m) => {
            const sec = m * 60;
            const isActive = duration.seconds === sec;
            return (
              <button
                key={m}
                type="button"
                onClick={() => {
                  const opt = DURATION_OPTIONS.find(
                    (d) => d.seconds === sec,
                  ) || {
                    label: `${m} Minute${m > 1 ? "s" : ""}`,
                    seconds: sec,
                  };
                  setDuration(opt);
                  setTimeLeft(sec);
                }}
                className="px-2 py-0.5 rounded border text-xs font-semibold transition-colors"
                style={{
                  background: isActive ? "#1565c0" : "transparent",
                  color: isActive ? "#fff" : "#1565c0",
                  borderColor: "#1565c0",
                }}
                data-ocid={`typing.min.${m}`}
              >
                {m}m
              </button>
            );
          })}
        </div>
        <span className="text-xs font-semibold text-gray-700 ml-2">Words:</span>
        <div className="flex gap-1 flex-wrap">
          {WORD_COUNT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setWordCountOption(opt)}
              className="px-2 py-0.5 rounded border text-xs font-semibold transition-colors"
              style={{
                background:
                  wordCountOption.label === opt.label
                    ? "#388e3c"
                    : "transparent",
                color: wordCountOption.label === opt.label ? "#fff" : "#388e3c",
                borderColor: "#388e3c",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => changePara("next")}
          className="flex items-center gap-1 px-3 py-0.5 rounded border text-xs font-semibold hover:bg-blue-50"
          style={{ borderColor: "#1565c0", color: "#1565c0" }}
          data-ocid="typing.select_para.button"
        >
          📄 Select Para
        </button>
        <button
          type="button"
          onClick={() => changePara("prev")}
          className="w-6 h-6 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-200"
          style={{ borderColor: "#b0b0b0" }}
          data-ocid="typing.ctrl_prev.button"
        >
          <ChevronLeft size={11} />
        </button>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{ background: "#e8eaf6", color: "#1a237e" }}
        >
          Paragraph {paraIndex + 1}/{groupIndices.length}
        </span>
        <button
          type="button"
          onClick={() => changePara("next")}
          className="w-6 h-6 flex items-center justify-center border rounded text-gray-600 hover:bg-gray-200"
          style={{ borderColor: "#b0b0b0" }}
          data-ocid="typing.ctrl_next.button"
        >
          <ChevronRight size={11} />
        </button>
        <button
          type="button"
          className="px-2 py-0.5 rounded text-xs font-bold text-white"
          style={{ background: "#388e3c" }}
        >
          ☑ ON
        </button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-2 py-0.5 text-xs font-semibold"
          style={{ borderColor: "#b0b0b0", color: "#1a237e" }}
          data-ocid="typing.language.select"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
        <div className="flex gap-1 ml-1">
          <button
            type="button"
            className="w-6 h-6 flex items-center justify-center border rounded text-gray-500 hover:bg-gray-200"
            style={{ borderColor: "#b0b0b0" }}
          >
            <Monitor size={11} />
          </button>
          <button
            type="button"
            className="w-6 h-6 flex items-center justify-center border rounded text-gray-500 hover:bg-gray-200"
            style={{ borderColor: "#b0b0b0" }}
          >
            <HelpCircle size={11} />
          </button>
        </div>
        {phase === "typing" && (
          <button
            type="button"
            onClick={finishTest}
            className="ml-auto px-3 py-0.5 rounded text-xs font-bold text-white"
            style={{ background: "#c62828" }}
            data-ocid="typing.stop_button"
          >
            ■ Stop / Submit
          </button>
        )}
      </div>

      {/* ACTION ROW */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ background: "#ffffff", borderColor: "#d0d0d0" }}
      >
        <p className="text-xs italic text-gray-500">
          Click below and start typing — test begins automatically
        </p>
        <button
          type="button"
          onClick={() => {
            if (phase === "idle") beginTest();
            else textareaRef.current?.focus();
          }}
          className="flex items-center gap-1 px-4 py-1.5 rounded text-white text-xs font-bold hover:opacity-90"
          style={{ background: "#1a237e" }}
          data-ocid="typing.start_button"
        >
          ▶ Start Test
        </button>
      </div>

      {/* TYPING AREA */}
      <div className="flex-1 p-3" style={{ background: "#ffffff" }}>
        <textarea
          ref={textareaRef}
          className="w-full rounded px-3 py-2 resize-none focus:outline-none"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "15px",
            background: "#fafafa",
            border: "1px solid #e0e0e0",
            color: "#333",
            height: "248px",
            overflowY: "auto",
          }}
          placeholder="Start typing here — timer starts automatically on first keystroke..."
          value={typed}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            if (phase === "idle") beginTest();
            handleType(e.target.value);
          }}
          data-ocid="typing.input"
        />
        {phase === "typing" && (
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span>
              ✓ <strong className="text-green-700">{correctWords}</strong>{" "}
              correct
            </span>
            <span>
              ✗ <strong className="text-red-600">{wrongWords}</strong> wrong
            </span>
            <span>
              ⌨ <strong style={{ color: "#1565c0" }}>{wpm}</strong> WPM
            </span>
            <span>
              🎯 <strong className="text-green-700">{accuracy}%</strong>{" "}
              accuracy
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ExamNavbar() {
  return (
    <nav
      className="flex items-center px-4 py-2"
      style={{ background: "#0d1b4b" }}
    >
      <div className="flex items-center gap-2 mr-8">
        <div
          className="w-9 h-9 flex items-center justify-center rounded text-white font-bold text-lg"
          style={{ background: "#1565c0", border: "2px solid #42a5f5" }}
        >
          ⌨
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight tracking-wide">
            KARWASHRA
          </div>
          <div className="text-xs leading-tight" style={{ color: "#90caf9" }}>
            TYPING EXAM
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 flex-1">
        {["📖 LEARN TYPING", "HOME", "EXAM CATEGORIES", "ABOUT"].map((link) => (
          <button
            key={link}
            type="button"
            className="text-white text-xs font-semibold hover:opacity-80 tracking-wide"
          >
            {link}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-white text-xs font-semibold hover:opacity-80"
        >
          Login
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded-full text-white text-xs font-bold"
          style={{ background: "#1a237e", border: "1px solid #42a5f5" }}
        >
          SIGN UP
        </button>
      </div>
    </nav>
  );
}
