import { useEffect, useRef, useState } from "react";
import { stripBold } from "../components/BoldText";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { paragraphs as allParagraphs } from "../data/paragraphs";

// ─── Keyboard rows ────────────────────────────────────────────────────────────
const KEYBOARD_ROWS = [
  ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift2"],
  ["Space"],
];

const FINGER_MAP: Record<string, string> = {
  "~": "bg-pink-300",
  "1": "bg-pink-300",
  Q: "bg-pink-300",
  A: "bg-pink-300",
  Z: "bg-pink-300",
  "2": "bg-purple-300",
  W: "bg-purple-300",
  S: "bg-purple-300",
  X: "bg-purple-300",
  "3": "bg-blue-300",
  E: "bg-blue-300",
  D: "bg-blue-300",
  C: "bg-blue-300",
  "4": "bg-green-300",
  "5": "bg-green-300",
  R: "bg-green-300",
  T: "bg-green-300",
  V: "bg-green-300",
  B: "bg-green-300",
  "6": "bg-yellow-300",
  "7": "bg-yellow-300",
  Y: "bg-yellow-300",
  U: "bg-yellow-300",
  H: "bg-yellow-300",
  J: "bg-yellow-400 ring-2 ring-yellow-600",
  N: "bg-yellow-300",
  M: "bg-yellow-300",
  "8": "bg-orange-300",
  I: "bg-orange-300",
  K: "bg-orange-300",
  ",": "bg-orange-300",
  "9": "bg-red-300",
  O: "bg-red-300",
  L: "bg-red-300",
  ".": "bg-red-300",
  "0": "bg-rose-300",
  "-": "bg-rose-300",
  "=": "bg-rose-300",
  P: "bg-rose-300",
  "[": "bg-rose-300",
  "]": "bg-rose-300",
  "\\\\": "bg-rose-300",
  ";": "bg-rose-300",
  "'": "bg-rose-300",
  "/": "bg-rose-300",
  F: "bg-green-400 ring-2 ring-green-600",
  G: "bg-green-300",
};

const FINGER_GUIDE: Record<string, string> = {
  A: "Left Pinky",
  S: "Left Ring",
  D: "Left Middle",
  F: "Left Index",
  G: "Left Index",
  H: "Right Index",
  J: "Right Index",
  K: "Right Middle",
  L: "Right Ring",
  ";": "Right Pinky",
  Q: "Left Pinky",
  W: "Left Ring",
  E: "Left Middle",
  R: "Left Index",
  T: "Left Index",
  Y: "Right Index",
  U: "Right Index",
  I: "Right Middle",
  O: "Right Ring",
  P: "Right Pinky",
  Z: "Left Pinky",
  X: "Left Ring",
  C: "Left Middle",
  V: "Left Index",
  B: "Left Index",
  N: "Right Index",
  M: "Right Index",
  ",": "Right Middle",
  ".": "Right Ring",
  "/": "Right Pinky",
  "1": "Left Pinky",
  "2": "Left Ring",
  "3": "Left Middle",
  "4": "Left Index",
  "5": "Left Index",
  "6": "Right Index",
  "7": "Right Index",
  "8": "Right Middle",
  "9": "Right Ring",
  "0": "Right Pinky",
};

// ─── Lessons ──────────────────────────────────────────────────────────────────
const LESSONS = [
  {
    id: "intro",
    title: "1. Introduction",
    icon: "🎯",
    desc: "Typing ke basics sikhein",
    keys: [] as string[],
  },
  {
    id: "homerow",
    title: "2. Home Row Keys",
    icon: "🏠",
    desc: "ASDF JKL; — sabse zaroori row",
    keys: ["A", "S", "D", "F", "J", "K", "L", ";"],
  },
  {
    id: "toprow",
    title: "3. Top Row Keys",
    icon: "⬆️",
    desc: "QWERTY row — upar wali row",
    keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  },
  {
    id: "bottomrow",
    title: "4. Bottom Row Keys",
    icon: "⬇️",
    desc: "ZXCVBNM — neeche wali row",
    keys: ["Z", "X", "C", "V", "B", "N", "M"],
  },
  {
    id: "numbers",
    title: "5. Number Keys",
    icon: "🔢",
    desc: "1234567890 — number row",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  },
  {
    id: "words",
    title: "6. Word Practice",
    icon: "📝",
    desc: "Common English words practice",
    keys: [],
  },
  {
    id: "sentences",
    title: "7. Sentence Practice",
    icon: "📖",
    desc: "Full sentence typing practice",
    keys: [],
  },
  {
    id: "paragraph",
    title: "8. Paragraph Practice",
    icon: "📄",
    desc: "Real exam paragraph practice",
    keys: [],
  },
];

const LESSON_TEXTS: Record<string, string> = {
  intro:
    "the quick brown fox jumps over the lazy dog type all letters use correct fingers",
  homerow:
    "asdf jkl; asdf jkl; sad fad jad kal sal dal fall glad flag ask flask",
  toprow:
    "quit were type your quite power write error top quit type power tower",
  bottomrow: "zinc vex numb mix vim cab ban van mob zoom vibe zone cave",
  numbers: "1234 5678 90 12 345 6789 100 200 500 1000 2024 2025 1000000",
  words:
    "computer typing speed accuracy keyboard practice lesson government exam selection",
  sentences:
    "The quick brown fox jumps over the lazy dog. Practice makes perfect. Good typing needs all fingers. Speed comes with accuracy. Daily practice improves performance.",
  paragraph: "",
};

const TIPS = [
  {
    icon: "🏠",
    title: "Home Row",
    desc: "ASDF (left) aur JKL; (right) — hamesha yahan vapas aayein.",
  },
  {
    icon: "👀",
    title: "Screen Dekho",
    desc: "Keyboard pe mat dekho. F aur J bumps se position pata karo.",
  },
  {
    icon: "⚡",
    title: "Accuracy Pehle",
    desc: "Pehle sahi type karo, speed apne aap aayegi.",
  },
  {
    icon: "🕐",
    title: "Daily Practice",
    desc: "15-30 minute daily practice bahut better hai week mein ek baar se.",
  },
  {
    icon: "🎯",
    title: "10 Ungliyaan",
    desc: "Har finger ke liye specific keys hain — sab use karo.",
  },
  {
    icon: "📊",
    title: "Progress Track",
    desc: "WPM aur accuracy track karo. Target: 30 → 40 → 50+ WPM.",
  },
];

// ─── Keyboard visual component ────────────────────────────────────────────────
function KeyboardVisual({
  lessonKeys,
  currentKey,
}: { lessonKeys: string[]; currentKey: string }) {
  const wideKeys = ["Tab", "Caps", "Shift", "Shift2", "Enter", "⌫", "Space"];
  return (
    <div className="bg-gray-100 rounded-xl p-3 border border-gray-200">
      {KEYBOARD_ROWS.map((row, rIdx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: keyboard row order never changes
        <div key={rIdx} className="flex gap-1 justify-center mb-1">
          {row.map((key) => {
            const isLesson = lessonKeys.includes(key);
            const isCurrent =
              currentKey !== "" &&
              key.toUpperCase() === currentKey.toUpperCase();
            const baseColor = FINGER_MAP[key] || "bg-gray-200";
            const isWide = wideKeys.includes(key);
            return (
              <div
                key={key}
                className={[
                  "flex items-center justify-center rounded text-xs font-bold select-none transition-all",
                  isWide ? "px-2 min-w-[40px]" : "w-8",
                  "h-8",
                  isCurrent
                    ? "bg-orange-400 text-white scale-110 shadow-lg ring-2 ring-orange-600"
                    : isLesson
                      ? `${baseColor} ring-2 ring-yellow-400 brightness-110 animate-pulse`
                      : `${baseColor} text-gray-700`,
                ].join(" ")}
              >
                {key === "Space" ? "___" : key === "Shift2" ? "Shift" : key}
              </div>
            );
          })}
        </div>
      ))}
      <div className="mt-2 flex flex-wrap gap-2 justify-center text-xs">
        {[
          ["bg-pink-300", "Left Pinky"],
          ["bg-purple-300", "Left Ring"],
          ["bg-blue-300", "Left Middle"],
          ["bg-green-300", "Left Index"],
          ["bg-yellow-300", "Right Index"],
          ["bg-orange-300", "Right Middle"],
          ["bg-red-300", "Right Ring"],
          ["bg-rose-300", "Right Pinky"],
        ].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1">
            <span className={`inline-block w-3 h-3 rounded ${c}`} />
            <span className="text-gray-500">{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Lesson Practice ──────────────────────────────────────────────────────────
type Phase = "idle" | "running" | "done";

function LessonPractice({
  lessonId,
  lessonKeys,
  onComplete,
}: {
  lessonId: string;
  lessonKeys: string[];
  onComplete: () => void;
}) {
  const practiceText =
    lessonId === "paragraph"
      ? (() => {
          const p = allParagraphs.find((para) => para.language === "English");
          return p
            ? stripBold(p.text).split(" ").slice(0, 80).join(" ")
            : LESSON_TEXTS.words;
        })()
      : LESSON_TEXTS[lessonId] || LESSON_TEXTS.words;

  const words = practiceText.trim().split(/\s+/).filter(Boolean);

  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentWordTyped, setCurrentWordTyped] = useState("");
  const [wordStatuses, setWordStatuses] = useState<
    ("pending" | "correct" | "wrong")[]
  >(() => new Array(words.length).fill("pending"));
  const [startTime, setStartTime] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentKey, setCurrentKey] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on lesson change
  useEffect(() => {
    setPhase("idle");
    setTyped("");
    setCurrentWordIdx(0);
    setCurrentWordTyped("");
    setWordStatuses(new Array(words.length).fill("pending"));
    setElapsedSec(0);
    setCurrentKey("");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [lessonId]);

  useEffect(() => {
    if (phase === "running") {
      timerRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, startTime]);

  const correctWords = wordStatuses.filter((s) => s === "correct").length;
  const totalTyped = wordStatuses.filter((s) => s !== "pending").length;
  const wpm = elapsedSec > 0 ? Math.round((correctWords / elapsedSec) * 60) : 0;
  const accuracy =
    totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 0;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (phase === "done") return;
    const val = e.target.value;
    const prevVal = typed;
    if (phase === "idle") {
      setPhase("running");
      setStartTime(Date.now());
    }
    setTyped(val);
    setCurrentKey(val.slice(-1).toUpperCase());
    const prevEndsWithSpace = prevVal.endsWith(" ");
    const curEndsWithSpace = val.endsWith(" ");
    if (curEndsWithSpace && !prevEndsWithSpace) {
      const parts = val.trimEnd().split(" ");
      const finishedWord = parts[parts.length - 1] || "";
      const targetWord = words[currentWordIdx] || "";
      const status: "correct" | "wrong" =
        finishedWord === targetWord ? "correct" : "wrong";
      setWordStatuses((prev) => {
        const next = [...prev];
        next[currentWordIdx] = status;
        return next;
      });
      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);
      setCurrentWordTyped("");
      if (nextIdx >= words.length) {
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 300);
      }
    } else {
      const parts = val.split(" ");
      setCurrentWordTyped(parts[parts.length - 1] || "");
    }
  };

  const resetPractice = () => {
    setPhase("idle");
    setTyped("");
    setCurrentWordIdx(0);
    setCurrentWordTyped("");
    setWordStatuses(new Array(words.length).fill("pending"));
    setElapsedSec(0);
    setCurrentKey("");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="space-y-4">
      <KeyboardVisual lessonKeys={lessonKeys} currentKey={currentKey} />

      {currentKey && FINGER_GUIDE[currentKey] && (
        <div className="text-xs text-center bg-blue-50 border border-blue-200 rounded px-3 py-1.5 text-blue-700 font-medium">
          👉 Use your <strong>{FINGER_GUIDE[currentKey]}</strong> finger for key{" "}
          <strong>{currentKey}</strong>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center">
          <div className="text-xl font-bold text-blue-700">{wpm}</div>
          <div className="text-xs text-blue-500">WPM</div>
        </div>
        <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
          <div className="text-xl font-bold text-green-700">{accuracy}%</div>
          <div className="text-xs text-green-500">Accuracy</div>
        </div>
        <div className="flex-1 bg-purple-50 rounded-lg p-2 text-center">
          <div className="text-xl font-bold text-purple-700">{elapsedSec}s</div>
          <div className="text-xs text-purple-500">Time</div>
        </div>
        <div className="flex-1 bg-orange-50 rounded-lg p-2 text-center">
          <div className="text-xl font-bold text-orange-700">
            {currentWordIdx}/{words.length}
          </div>
          <div className="text-xs text-orange-500">Words</div>
        </div>
      </div>

      {/* Practice text */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-base leading-8 font-mono select-none min-h-[80px]">
        {words.map((word, wIdx) => {
          const status = wordStatuses[wIdx];
          const isCurrent = wIdx === currentWordIdx;
          const wordKey = `w-${wIdx}-${word}`;
          if (isCurrent) {
            return (
              <span key={wordKey}>
                <span className="bg-blue-700 text-white rounded px-0.5">
                  {word.split("").map((ch, cIdx) => {
                    const charKey = `c-${wIdx}-${cIdx}`;
                    if (cIdx < currentWordTyped.length) {
                      const correct = ch === currentWordTyped[cIdx];
                      return (
                        <span
                          key={charKey}
                          className={correct ? "" : "text-red-300 line-through"}
                        >
                          {ch}
                        </span>
                      );
                    }
                    return <span key={charKey}>{ch}</span>;
                  })}
                </span>{" "}
              </span>
            );
          }
          if (status === "correct")
            return (
              <span key={wordKey}>
                <span className="text-green-600 font-semibold">
                  {word}
                </span>{" "}
              </span>
            );
          if (status === "wrong")
            return (
              <span key={wordKey}>
                <span className="bg-red-500 text-white rounded px-0.5">
                  {word}
                </span>{" "}
              </span>
            );
          return (
            <span key={wordKey}>
              <span className="text-gray-700">{word}</span>{" "}
            </span>
          );
        })}
      </div>

      {phase !== "done" ? (
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleInput}
          placeholder={
            phase === "idle"
              ? "Yahan type karo — pehla keystroke se timer start hoga..."
              : ""
          }
          className="w-full border-2 border-blue-300 rounded-xl p-3 font-mono text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          rows={3}
        />
      ) : (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-bold text-green-700 text-lg">
            Shabash! Lesson Complete!
          </div>
          <div className="text-sm text-gray-600 mt-1">
            WPM: {wpm} | Accuracy: {accuracy}%
          </div>
          <button
            type="button"
            onClick={resetPractice}
            className="mt-3 px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Dobara Karo
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={resetPractice}
        className="w-full py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        data-ocid="learning.secondary_button"
      >
        🔄 Reset
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LearningTyping() {
  const [activeLesson, setActiveLesson] = useState("intro");
  const [completedSet, setCompletedSet] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("learning_completed");
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });
  const [showTips, setShowTips] = useState(false);

  const lesson = LESSONS.find((l) => l.id === activeLesson) || LESSONS[0];
  const lessonIdx = LESSONS.findIndex((l) => l.id === activeLesson);
  const progress = Math.round((completedSet.size / LESSONS.length) * 100);

  const markComplete = (id: string) => {
    setCompletedSet((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("learning_completed", JSON.stringify([...next]));
      return next;
    });
  };

  const goToNextLesson = () => {
    const next = LESSONS[lessonIdx + 1];
    if (next) setActiveLesson(next.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <main className="flex-1 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b]">
              💻 Learn Typing
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Step-by-step typing lessons — shuruwaat se expert tak
            </p>
          </div>

          {/* Progress bar */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Lesson {lessonIdx + 1} of {LESSONS.length} — {lesson.title}
              </span>
              <span className="text-sm font-bold text-blue-600">
                {progress}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {LESSONS.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveLesson(l.id)}
                  title={l.title}
                  className={[
                    "w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold border-2 transition-all",
                    completedSet.has(l.id)
                      ? "bg-green-500 text-white border-green-500"
                      : activeLesson === l.id
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-400 border-gray-300",
                  ].join(" ")}
                >
                  {completedSet.has(l.id) ? "✓" : i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Left sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden sticky top-4">
                <div className="bg-[#0d1b4b] text-white px-4 py-3 text-sm font-bold">
                  📚 Lessons
                </div>
                <div className="divide-y divide-gray-100">
                  {LESSONS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setActiveLesson(l.id)}
                      className={[
                        "w-full text-left px-4 py-3 flex items-start gap-2 transition-all",
                        activeLesson === l.id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50 border-l-4 border-transparent",
                      ].join(" ")}
                      data-ocid="learning.tab"
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">
                        {l.icon}
                      </span>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold truncate ${activeLesson === l.id ? "text-blue-700" : "text-gray-800"}`}
                        >
                          {l.title}
                          {completedSet.has(l.id) && (
                            <span className="ml-1 text-green-500">✓</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {l.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-3 space-y-5">
              {/* Lesson header */}
              <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">{lesson.icon}</span>
                      <h2 className="text-xl font-bold text-[#0d1b4b]">
                        {lesson.title}
                      </h2>
                      {completedSet.has(lesson.id) && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{lesson.desc}</p>
                    {lesson.keys.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {lesson.keys.map((k) => (
                          <span
                            key={k}
                            className="inline-block bg-[#0d1b4b] text-yellow-300 text-xs font-bold px-2 py-0.5 rounded"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {lessonIdx < LESSONS.length - 1 && (
                    <button
                      type="button"
                      onClick={goToNextLesson}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex-shrink-0"
                      data-ocid="learning.primary_button"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>

              {/* Intro lesson */}
              {lesson.id === "intro" && (
                <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5 space-y-4">
                  <h3 className="font-bold text-[#0d1b4b] text-lg">
                    Typing Kaise Seekhein?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        color: "blue",
                        step: 1,
                        text: "Pehle Home Row keys seekho (ASDF + JKL;). Ye aapki base position hai.",
                      },
                      {
                        color: "green",
                        step: 2,
                        text: "F aur J keys pe bumps hote hain — inhe feel karo, keyboard mat dekho.",
                      },
                      {
                        color: "orange",
                        step: 3,
                        text: "Ek haath ki ungliyaan ASDF pe, doosre ki JKL; pe — yahi sahi posture hai.",
                      },
                      {
                        color: "purple",
                        step: 4,
                        text: "Accuracy pehle, speed baad mein. Daily 15-30 min practice karo.",
                      },
                    ].map(({ color, step, text }) => (
                      <div
                        key={step}
                        className={`bg-${color}-50 rounded-lg p-3`}
                      >
                        <div className={`font-bold text-${color}-700 mb-1`}>
                          🎯 Step {step}
                        </div>
                        <p className="text-sm text-gray-700">{text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 font-medium">
                      💡 Exam Targets: SSC/Railway — 35 WPM English / 30 WPM
                      Hindi | Delhi Police — 35 WPM | Banking — 30 WPM
                    </p>
                  </div>
                  <KeyboardVisual lessonKeys={[]} currentKey="" />
                  <button
                    type="button"
                    onClick={() => {
                      markComplete("intro");
                      setActiveLesson("homerow");
                    }}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    data-ocid="learning.primary_button"
                  >
                    Shuru Karen — Home Row Lesson →
                  </button>
                </div>
              )}

              {/* Practice lessons */}
              {lesson.id !== "intro" && (
                <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
                  <LessonPractice
                    key={lesson.id}
                    lessonId={lesson.id}
                    lessonKeys={lesson.keys}
                    onComplete={() => markComplete(lesson.id)}
                  />
                  {completedSet.has(lesson.id) &&
                    lessonIdx < LESSONS.length - 1 && (
                      <button
                        type="button"
                        onClick={goToNextLesson}
                        className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                        data-ocid="learning.primary_button"
                      >
                        ✓ Next Lesson: {LESSONS[lessonIdx + 1]?.title} →
                      </button>
                    )}
                </div>
              )}

              {/* Tips */}
              <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTips((v) => !v)}
                  className="w-full px-5 py-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-all"
                  data-ocid="learning.toggle"
                >
                  <span className="font-bold text-amber-800">
                    💡 Pro Typing Tips ({TIPS.length})
                  </span>
                  <span className="text-amber-600">
                    {showTips ? "▲ Hide" : "▼ Show"}
                  </span>
                </button>
                {showTips && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                    {TIPS.map((tip) => (
                      <div
                        key={tip.title}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-3"
                      >
                        <div className="font-bold text-amber-800 mb-1">
                          {tip.icon} {tip.title}
                        </div>
                        <p className="text-xs text-gray-600">{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
