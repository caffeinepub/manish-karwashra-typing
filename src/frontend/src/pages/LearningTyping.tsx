import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { paragraphs as allParagraphs } from "../data/paragraphs";

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

const HOME_KEYS = ["A", "S", "D", "F", "J", "K", "L", ";"];

const TIPS = [
  {
    icon: "🏠",
    title: "Master Home Row First",
    desc: "Place your fingers on ASDF (left) and JKL; (right). These are the home row keys — always return here.",
  },
  {
    icon: "👀",
    title: "Don't Look at the Keyboard",
    desc: "Train yourself to type without looking. Use the finger bumps on F and J as guides.",
  },
  {
    icon: "⚡",
    title: "Accuracy Before Speed",
    desc: "Focus on hitting the correct keys first. Speed will come naturally with practice.",
  },
  {
    icon: "🕐",
    title: "Practice Daily",
    desc: "15-30 minutes of focused practice daily is better than 2 hours once a week.",
  },
  {
    icon: "🎯",
    title: "Use All 10 Fingers",
    desc: "Each finger is responsible for specific keys. Using all 10 fingers distributes the workload.",
  },
  {
    icon: "📊",
    title: "Track Your Progress",
    desc: "Monitor your WPM and accuracy. Set targets: 30 WPM to 40 WPM to 50+ WPM progressively.",
  },
];

const PRACTICE_WORDS = [
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "any",
  "can",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "man",
  "new",
  "now",
  "old",
  "see",
  "two",
  "way",
  "who",
  "boy",
  "did",
  "its",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use",
  "may",
  "had",
];

function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
}

// ── Pro Typing Section ────────────────────────────────────────────────────────
type ProPhase = "setup" | "running" | "result";
type WordStatus = "pending" | "correct" | "wrong";

function ProTyping() {
  const [language, setLanguage] = useState<"English" | "Hindi">("English");
  const [phase, setPhase] = useState<ProPhase>("setup");
  const [passageIndex, setPassageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentWordTyped, setCurrentWordTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredParas = allParagraphs.filter((p) => p.language === language);
  const currentPara =
    filteredParas[passageIndex % Math.max(filteredParas.length, 1)];
  const passageText = currentPara ? stripBoldMarkers(currentPara.text) : "";
  const passageWords = passageText.trim().split(/\s+/).filter(Boolean);

  const handleStart = () => {
    const words = passageText.trim().split(/\s+/).filter(Boolean);
    setTyped("");
    setWordStatuses(new Array(words.length).fill("pending") as WordStatus[]);
    setCurrentWordIdx(0);
    setCurrentWordTyped("");
    setStartTime(null);
    setEndTime(null);
    setPhase("running");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (phase !== "running") return;
    const val = e.target.value;
    const prevVal = typed;
    if (!startTime) setStartTime(Date.now());

    const prevEndsWithSpace = prevVal.endsWith(" ");
    const curEndsWithSpace = val.endsWith(" ");

    setTyped(val);

    if (curEndsWithSpace && !prevEndsWithSpace) {
      // Space pressed — finalize current word
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
      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);
      setCurrentWordTyped("");
      // Auto-finish if last word done
      if (nextIdx >= passageWords.length) {
        setEndTime(Date.now());
        setPhase("result");
      }
    } else {
      const parts = val.split(" ");
      setCurrentWordTyped(parts[parts.length - 1] || "");
    }
  };

  const handleSubmit = () => {
    setEndTime(Date.now());
    setPhase("result");
  };

  const handleReset = () => {
    setTyped("");
    setWordStatuses([]);
    setCurrentWordIdx(0);
    setCurrentWordTyped("");
    setStartTime(null);
    setEndTime(null);
    setPhase("setup");
  };

  const handleNewPassage = () => {
    setPassageIndex((i) => i + 1);
    setTyped("");
    setWordStatuses([]);
    setCurrentWordIdx(0);
    setCurrentWordTyped("");
    setStartTime(null);
    setEndTime(null);
    setPhase("setup");
  };

  const calcStats = () => {
    const elapsed =
      startTime && endTime ? (endTime - startTime) / 1000 / 60 : 1;
    const correctWords = wordStatuses.filter((s) => s === "correct").length;
    const errors = wordStatuses.filter((s) => s === "wrong").length;
    const total = correctWords + errors;
    const wpm = Math.round(total / Math.max(elapsed, 0.01));
    const accuracy = total > 0 ? Math.round((correctWords / total) * 100) : 100;
    return { wpm, accuracy, correctWords, errors };
  };

  useEffect(() => {
    if (phase === "setup") {
      setTyped("");
      setWordStatuses([]);
      setCurrentWordIdx(0);
      setCurrentWordTyped("");
      setStartTime(null);
      setEndTime(null);
    }
  }, [phase]);

  return (
    <section
      className="bg-white rounded-xl shadow p-6 mb-8"
      data-ocid="pro.panel"
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="bg-gradient-to-r from-[#DAA520] to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          PRO
        </span>
        <h2 className="text-xl font-bold text-gray-900">Pro Typing</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        100+ real exam paragraphs — SSC, Railway, Banking, Delhi Police, State
        Exams
      </p>

      {/* Setup Phase */}
      {phase === "setup" && (
        <div className="flex flex-col items-center gap-6 py-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
              भाषा / Language चुनें:
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLanguage("English")}
                className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-colors ${
                  language === "English"
                    ? "bg-[#0d1b4b] text-white border-[#0d1b4b]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#0d1b4b]"
                }`}
                data-ocid="pro.toggle"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("Hindi")}
                className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-colors ${
                  language === "Hindi"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                }`}
                data-ocid="pro.toggle"
              >
                हिंदी
              </button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-4">
              {filteredParas.length} paragraphs available • Passage{" "}
              {(passageIndex % Math.max(filteredParas.length, 1)) + 1} of{" "}
              {filteredParas.length}
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="px-10 py-3 bg-green-600 text-white rounded-xl font-bold text-base hover:bg-green-700 transition-colors shadow-md"
              data-ocid="pro.primary_button"
            >
              ▶ Start Typing
            </button>
          </div>
        </div>
      )}

      {/* Running Phase */}
      {phase === "running" && (
        <>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <span className="text-xs font-semibold text-[#DAA520]">
              {currentPara?.title}
            </span>
            <span className="text-xs text-gray-400">
              {language} •{" "}
              {(passageIndex % Math.max(filteredParas.length, 1)) + 1}/
              {filteredParas.length}
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl border-2 border-[#DAA520] p-5 mb-4 font-mono text-sm leading-8 select-none text-black overflow-auto max-h-56">
            {passageWords.map((word, wIdx) => {
              const status = wordStatuses[wIdx] || "pending";
              const isCurrent = wIdx === currentWordIdx;
              if (isCurrent) {
                return (
                  <span key={word + String(wIdx)}>
                    <span className="bg-yellow-300 text-gray-900 rounded px-0.5">
                      {Array.from(word).map((ch, charPos) => {
                        const charKey = `${wIdx}-${charPos}-${ch}`;
                        if (charPos < currentWordTyped.length) {
                          const correct = ch === currentWordTyped[charPos];
                          return (
                            <span
                              key={charKey}
                              style={{ color: correct ? "#1565c0" : "#c62828" }}
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
              if (status === "correct") {
                return (
                  <span key={word + String(wIdx)}>
                    <span className="text-green-700 font-semibold">
                      {word}
                    </span>{" "}
                  </span>
                );
              }
              if (status === "wrong") {
                return (
                  <span key={word + String(wIdx)}>
                    <span className="bg-red-600 text-white rounded px-0.5 font-semibold">
                      {word}
                    </span>{" "}
                  </span>
                );
              }
              return (
                <span key={word + String(wIdx)}>
                  <span className="text-gray-500">{word}</span>{" "}
                </span>
              );
            })}
          </div>
          <textarea
            ref={textareaRef}
            value={typed}
            onChange={handleInput}
            placeholder={
              language === "Hindi" ? "यहाँ टाइप करें..." : "Start typing here..."
            }
            className="w-full h-28 p-4 border-2 border-[#DAA520] rounded-xl focus:outline-none font-mono text-sm resize-none bg-white text-black shadow-sm"
            data-ocid="pro.editor"
          />
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              data-ocid="pro.submit_button"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
              data-ocid="pro.cancel_button"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Result Phase */}
      {phase === "result" &&
        (() => {
          const { wpm, accuracy, correctWords, errors } = calcStats();
          return (
            <div
              className="bg-white rounded-xl border-2 border-[#DAA520] p-6"
              data-ocid="pro.success_state"
            >
              <div className="text-center mb-5">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-bold text-gray-900">
                  Test Complete!
                </h3>
                <p className="text-gray-500 text-sm">{currentPara?.title}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{wpm}</div>
                  <div className="text-xs text-gray-500">WPM</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {accuracy}%
                  </div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {correctWords}
                  </div>
                  <div className="text-xs text-gray-500">Correct Words</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {errors}
                  </div>
                  <div className="text-xs text-gray-500">Errors</div>
                </div>
              </div>
              {wpm >= 30 && accuracy >= 80 && (
                <div className="text-center mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                  <div className="text-green-700 font-semibold text-sm">
                    🎓 Congratulations! You qualified this test.
                  </div>
                  <div className="text-green-600 text-xs mt-1">
                    Criteria: 30+ WPM & 80%+ accuracy
                  </div>
                </div>
              )}
              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#DAA520] text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
                  data-ocid="pro.primary_button"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={handleNewPassage}
                  className="px-4 py-2 border-2 border-[#DAA520] text-gray-800 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors"
                  data-ocid="pro.secondary_button"
                >
                  New Passage
                </button>
              </div>
            </div>
          );
        })()}
    </section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function LearningTyping() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-[#0d1b4b] mb-2">
            Learning Typing
          </h1>
          <p className="text-gray-500 mb-8">
            Master touch typing with our structured guide for government exam
            preparation
          </p>

          <section className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Keyboard Layout &amp; Finger Placement
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Colors indicate which finger to use for each key
            </p>
            <div
              className="space-y-2 overflow-x-auto"
              data-ocid="learning.panel"
            >
              {KEYBOARD_ROWS.map((row, ri) => (
                <div
                  key={row.join("-")}
                  className={`flex gap-1 ${
                    ri === 1
                      ? "ml-4"
                      : ri === 2
                        ? "ml-7"
                        : ri === 3
                          ? "ml-10"
                          : ri === 4
                            ? "justify-center"
                            : ""
                  }`}
                >
                  {row.map((key) => {
                    const isHome = HOME_KEYS.includes(key);
                    const isWide = [
                      "⌫",
                      "Tab",
                      "Caps",
                      "Enter",
                      "Shift",
                      "Space",
                      "Shift2",
                    ].includes(key);
                    const displayKey = key === "Shift2" ? "Shift" : key;
                    const colorClass = FINGER_MAP[key] || "bg-gray-100";
                    return (
                      <div
                        key={key}
                        className={[
                          isWide ? "px-3" : "w-9",
                          "h-9 rounded flex items-center justify-center text-xs font-semibold text-gray-700 border border-gray-300 shadow-sm",
                          colorClass,
                          isHome ? "ring-2 ring-offset-1 ring-blue-500" : "",
                          key === "Space" ? "w-64" : "",
                        ].join(" ")}
                      >
                        {displayKey}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { color: "bg-pink-300", label: "Left Pinky" },
                { color: "bg-purple-300", label: "Left Ring" },
                { color: "bg-blue-300", label: "Left Middle" },
                { color: "bg-green-300", label: "Left Index" },
                { color: "bg-yellow-300", label: "Right Index" },
                { color: "bg-orange-300", label: "Right Middle" },
                { color: "bg-red-300", label: "Right Ring" },
                { color: "bg-rose-300", label: "Right Pinky" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded ${item.color} border border-gray-300`}
                  />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 border-2 border-blue-500" />
                <span className="text-xs text-gray-600">Home Row Key</span>
              </div>
            </div>
          </section>

          <section className="bg-[#0d1b4b] text-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-bold mb-3">The Home Row</h2>
            <p className="text-gray-300 text-sm mb-4">
              The home row is the foundation of touch typing. Always start and
              return your fingers to these positions.
            </p>
            <div className="flex gap-2 flex-wrap">
              {["A", "S", "D", "F", "—", "J", "K", "L", ";"].map((key) => (
                <div
                  key={key}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                    key === "—"
                      ? "bg-transparent text-gray-500"
                      : ["F", "J"].includes(key)
                        ? "bg-orange-500 text-white"
                        : "bg-white text-[#0d1b4b]"
                  }`}
                >
                  {key}
                </div>
              ))}
            </div>
            <p className="text-orange-300 text-sm mt-3">
              F and J keys have bumps &mdash; use them to find the home row
              without looking!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Typing Tips for Exam Success
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TIPS.map((tip, i) => (
                <div
                  key={tip.title}
                  className="bg-white rounded-xl shadow p-5"
                  data-ocid={`learning.item.${i + 1}`}
                >
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Common Practice Words
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Start with these high-frequency words to build muscle memory
            </p>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_WORDS.map((word) => (
                <span
                  key={word}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                >
                  {word}
                </span>
              ))}
            </div>
          </section>

          {/* Pro Typing */}
          <ProTyping />
        </div>
      </main>
      <Footer />
    </div>
  );
}
