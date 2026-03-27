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

          <section className="bg-white rounded-xl shadow-card p-6 mb-8">
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

          <section className="bg-[#0d1b4b] text-white rounded-xl shadow-card p-6 mb-8">
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
                  className="bg-white rounded-xl shadow-card p-5"
                  data-ocid={`learning.item.${i + 1}`}
                >
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-card p-6">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
