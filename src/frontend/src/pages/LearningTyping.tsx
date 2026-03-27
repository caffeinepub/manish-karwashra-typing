import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const KEYBOARD_ROWS = [
  ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
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
  "\\": "bg-rose-300",
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

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog near the river bank on a sunny day.",
  "Government exams require regular practice and dedication to achieve success in life.",
  "India is a democratic country with a federal structure and strong constitutional values.",
  "Haryana state is known for its contribution to agriculture and sports in India.",
  "Speed and accuracy are the two most important factors in competitive typing exams.",
  "The railway network of India is one of the largest in the world connecting millions.",
];

function getRandomSentence(exclude?: string): string {
  const filtered = exclude ? SENTENCES.filter((s) => s !== exclude) : SENTENCES;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getMockPassage(): string {
  const shuffled = [...SENTENCES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).join(" ");
}

// ── Typing Practice Widget ───────────────────────────────────────────────────
function TypingPractice() {
  const [text, setText] = useState(() => getRandomSentence());
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startTime !== null) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length === 1 && startTime === null) {
      setStartTime(Date.now());
      setElapsed(0);
    }
    setTyped(val);
  };

  const handleReset = () => {
    setTyped("");
    setStartTime(null);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNewParagraph = () => {
    setText(getRandomSentence(text));
    handleReset();
  };

  const wpm =
    elapsed > 0
      ? Math.round(
          (typed.trim().split(/\s+/).filter(Boolean).length / elapsed) * 60,
        )
      : 0;
  const correctChars = typed.split("").filter((ch, i) => ch === text[i]).length;
  const accuracy =
    typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;

  // Build highlighted chars
  const chars = text.split("");

  return (
    <section
      className="bg-white rounded-xl shadow p-6 mb-8"
      data-ocid="practice.panel"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-1">Typing Practice</h2>
      <p className="text-sm text-gray-500 mb-5">
        Type the paragraph below. Stats update in real-time.
      </p>

      {/* Stats row */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex-1 min-w-[80px] bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-700">{wpm}</div>
          <div className="text-xs text-gray-600">WPM</div>
        </div>
        <div className="flex-1 min-w-[80px] bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{accuracy}%</div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </div>
        <div className="flex-1 min-w-[80px] bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-700">{elapsed}s</div>
          <div className="text-xs text-gray-600">Time</div>
        </div>
      </div>

      {/* Reference text with highlighting */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-base leading-relaxed select-none">
        {/* biome-ignore lint/suspicious/noArrayIndexKey: position index is the correct key for char spans */}
        {chars.map((ch, i) => {
          let cls = "text-gray-400";
          if (i < typed.length) {
            cls =
              typed[i] === ch
                ? "bg-green-200 text-green-900"
                : "bg-red-200 text-red-900";
          } else if (i === typed.length) {
            cls = "bg-blue-300 text-gray-900";
          }
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: char position is correct key
            <span key={i} className={cls}>
              {ch}
            </span>
          );
        })}
      </div>

      <textarea
        className="w-full border-2 border-gray-300 rounded-lg p-3 font-mono text-base focus:outline-none focus:border-blue-500 resize-none"
        rows={3}
        value={typed}
        onChange={handleChange}
        placeholder="Start typing here..."
        data-ocid="practice.input"
      />

      <div className="flex gap-3 mt-3">
        <button
          type="button"
          onClick={handleNewParagraph}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          data-ocid="practice.secondary_button"
        >
          🔄 New Paragraph
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
          data-ocid="practice.cancel_button"
        >
          ↺ Reset
        </button>
      </div>
    </section>
  );
}

// ── Mock Test Widget ─────────────────────────────────────────────────────────
const DURATIONS = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
];

type MockPhase = "setup" | "running" | "result";

function TypingMock() {
  const [duration, setDuration] = useState(60);
  const [phase, setPhase] = useState<MockPhase>("setup");
  const [passage, setPassage] = useState(() => getMockPassage());
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTest = () => {
    setPassage(getMockPassage());
    setTyped("");
    setTimeLeft(duration);
    setPhase("running");
  };

  useEffect(() => {
    if (phase === "running") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setPhase("result");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("result");
  };

  const handleNewTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("setup");
    setTyped("");
    setTimeLeft(duration);
  };

  // Results
  const elapsed = duration - timeLeft;
  const elapsedMin = elapsed > 0 ? elapsed / 60 : duration / 60;
  const typedWords = typed.trim().split(/\s+/).filter(Boolean);
  const passageWords = passage.split(/\s+/);
  let correctWords = 0;
  typedWords.forEach((w, i) => {
    if (w === passageWords[i]) correctWords++;
  });
  const errors = typedWords.length - correctWords;
  const wpm = Math.round(typedWords.length / elapsedMin);
  const correctChars = typed
    .split("")
    .filter((ch, i) => ch === passage[i]).length;
  const accuracy =
    typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 0;

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <section
      className="bg-white rounded-xl shadow p-6 mb-8"
      data-ocid="mock.panel"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Mock Test — Typing
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Unlimited practice, real exam simulation
      </p>

      {phase === "setup" && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Select Duration:
          </p>
          <div className="flex gap-2 flex-wrap mb-6">
            {DURATIONS.map((d) => (
              <button
                type="button"
                key={d.seconds}
                onClick={() => setDuration(d.seconds)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${
                  duration === d.seconds
                    ? "bg-[#0d1b4b] text-white border-[#0d1b4b]"
                    : "bg-white text-gray-800 border-gray-300 hover:border-blue-500"
                }`}
                data-ocid="mock.toggle"
              >
                {d.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={startTest}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold text-base hover:bg-green-700 transition-colors"
            data-ocid="mock.primary_button"
          >
            🚀 Start Mock Test
          </button>
        </div>
      )}

      {phase === "running" && (
        <div>
          {/* Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Time Remaining</span>
            <span
              className={`text-3xl font-mono font-bold ${
                timeLeft <= 10 ? "text-red-600" : "text-[#0d1b4b]"
              }`}
            >
              {fmt(timeLeft)}
            </span>
          </div>

          {/* Passage */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm leading-relaxed text-gray-800 select-none">
            {passage}
          </div>

          <textarea
            className="w-full border-2 border-blue-400 rounded-lg p-3 font-mono text-base focus:outline-none focus:border-blue-600 resize-none"
            rows={4}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the passage here..."
            data-ocid="mock.input"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-3 px-5 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors"
            data-ocid="mock.submit_button"
          >
            Submit
          </button>
        </div>
      )}

      {phase === "result" && (
        <div>
          <div
            className="bg-[#0d1b4b] text-white rounded-xl p-6 mb-5"
            data-ocid="mock.success_state"
          >
            <h3 className="text-lg font-bold mb-4 text-center">
              📊 Your Result
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{wpm}</div>
                <div className="text-xs text-gray-300 mt-1">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {accuracy}%
                </div>
                <div className="text-xs text-gray-300 mt-1">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">
                  {correctWords}
                </div>
                <div className="text-xs text-gray-300 mt-1">Correct Words</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  {errors < 0 ? 0 : errors}
                </div>
                <div className="text-xs text-gray-300 mt-1">Errors</div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleNewTest}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            data-ocid="mock.secondary_button"
          >
            🔄 New Mock Test
          </button>
        </div>
      )}
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

          {/* ── New Sections ── */}
          <TypingPractice />
          <TypingMock />
        </div>
      </main>
      <Footer />
    </div>
  );
}
