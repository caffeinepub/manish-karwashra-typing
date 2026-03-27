import { useState } from "react";

const LESSONS = [
  {
    id: "beginner",
    title: "Beginner Lessons",
    emoji: "👶",
    keys: ["F", "J"],
    description:
      "Typing ki duniya mein aapka swagat hai! Pehle F aur J keys se shuru karein.",
    practice: "fjfjfj jfjffjj fjfj jjff ffjj fjjf fj jf ffjj jjff fjfj",
    tip: "F aur J par apni index ungliyan rakhein. Inme bump hota hai.",
  },
  {
    id: "homerow",
    title: "Home Row Keys",
    emoji: "🏠",
    keys: ["A", "S", "D", "F", "J", "K", "L"],
    description:
      "Home row ASDF aur JKL; hoti hai. Haath hamesha yahan waapis layen.",
    practice: "asdf jkl asdf jkl fdsajkl asjd klf dasj lkf asdf jkla",
    tip: "Yeh sabse zaroori row hai. Speed isi se aati hai.",
  },
  {
    id: "toprow",
    title: "Top Row Keys",
    emoji: "⬆️",
    keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    description: "QWERTY row - yahan se bahut saare common letters milte hain.",
    practice: "qwer tyui opqw erty uiop wert yuio pqwe qwerty uiop erty",
    tip: "Top row reach karne ke liye unglion ko upar kheenchein, haath mat hilao.",
  },
  {
    id: "bottomrow",
    title: "Bottom Row Keys",
    emoji: "⬇️",
    keys: ["Z", "X", "C", "V", "B", "N", "M"],
    description:
      "Bottom row mein Z se M tak keys hain. Andar reach karni padti hai.",
    practice: "zxcv bnm zxcv mnbv cvbn mznx vbcm zx cv bn mx vb nc",
    tip: "Small finger (pinky) Z ke liye, index finger B/N ke liye.",
  },
  {
    id: "numbers",
    title: "Number Keys",
    emoji: "🔢",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    description:
      "Numbers typing ke liye top row se upar ki taraf jaana padta hai.",
    practice: "1234 5678 90 1357 2468 9012 3456 7890 12 34 56 78 90",
    tip: "Numbers ke liye hamesha number row use karein, numpad nahi.",
  },
  {
    id: "symbols",
    title: "Symbol Keys",
    emoji: "🔤",
    keys: [],
    description: "Shift + number = symbol. Practice se yeh bhi fast ho jayega.",
    practice: "abc def ghi jkl mno pqr stu vwx yz ab cd ef gh ij kl",
    tip: "Shift key ko chhote finger se dabayen aur symbol key ko usi haath ki ungli se.",
  },
  {
    id: "capitals",
    title: "Capital Letters",
    emoji: "⬆️",
    keys: [],
    description:
      "Capital letters ke liye Shift key ka use karein. CapsLock use na karein.",
    practice: "The Quick Brown Fox Jumps Over The Lazy Dog Today India",
    tip: "Left haath ke letter ke liye right Shift, right haath ke liye left Shift.",
  },
  {
    id: "words",
    title: "Word Practice",
    emoji: "📝",
    keys: [],
    description:
      "Ab puri words type karein. Speed se zyada accuracy par focus karein.",
    practice:
      "the and is a to in of that with for on are was he she we they have this",
    tip: "Common words practice se automatically fast ho jaate hain.",
  },
  {
    id: "sentences",
    title: "Sentence Practice",
    emoji: "💬",
    keys: [],
    description: "Puri sentences type karein. Punctuation dhyan se daalein.",
    practice:
      "India is a great country We should work hard Practice makes a man perfect",
    tip: "Sentence end hone par Space bar ek baar hi dabayen.",
  },
  {
    id: "paragraphs",
    title: "Paragraph Practice",
    emoji: "📖",
    keys: [],
    description: "Lambe paragraphs type karna sabse important skill hai.",
    practice:
      "The Republic of India is a sovereign socialist secular democratic republic with a parliamentary system of government and the most populous democracy in the world",
    tip: "Long paragraphs mein rhythm maintain karein. Speed constant rakhein.",
  },
];

const KEYBOARD_LAYOUT = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

interface WordItem {
  id: string;
  word: string;
}

function buildItems(text: string): WordItem[] {
  return text
    .trim()
    .split(" ")
    .map((word, pos) => ({ id: `${pos}-${word}`, word }));
}

export default function PracticePage() {
  const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
  const [typed, setTyped] = useState("");
  const [items] = useState<Record<string, WordItem[]>>({});

  const currentItems: WordItem[] =
    items[activeLesson.id] ?? buildItems(activeLesson.practice);
  const words = currentItems.map((i) => i.word);
  const typedWords = typed.trim().split(" ");
  const correct = typedWords.filter((w, pos) => w === words[pos]).length;
  const accuracy =
    typedWords.filter(Boolean).length > 0
      ? Math.round((correct / typedWords.filter(Boolean).length) * 100)
      : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto py-4 min-h-screen">
          <div className="px-4 mb-3">
            <h2 className="font-bold text-[#0d1b4b] text-sm uppercase tracking-wider">
              📚 Practice Lessons
            </h2>
          </div>
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => {
                setActiveLesson(lesson);
                setTyped("");
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                activeLesson.id === lesson.id
                  ? "bg-green-50 text-green-700 font-semibold border-r-2 border-green-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              data-ocid={`practice.lesson.${lesson.id}`}
            >
              <span>{lesson.emoji}</span>
              <span>{lesson.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-[#0d1b4b]">
                {activeLesson.emoji} {activeLesson.title}
              </h1>
              <p className="text-gray-600 mt-1">{activeLesson.description}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <span className="font-semibold text-yellow-800">💡 Tip: </span>
              <span className="text-yellow-700">{activeLesson.tip}</span>
            </div>

            {/* Virtual Keyboard */}
            <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
              {KEYBOARD_LAYOUT.map((row) => (
                <div
                  key={row.join("")}
                  className="flex gap-1 mb-1 justify-center"
                >
                  {row.map((key) => {
                    const isHighlight = activeLesson.keys.includes(key);
                    return (
                      <div
                        key={key}
                        className={`min-w-8 h-8 px-1 flex items-center justify-center rounded text-xs font-mono font-bold transition-all ${
                          isHighlight
                            ? "bg-orange-400 text-white scale-110 shadow-lg"
                            : "bg-gray-600 text-gray-200"
                        }`}
                      >
                        {key}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="flex justify-center mt-1">
                <div className="w-64 h-8 bg-gray-600 text-gray-200 flex items-center justify-center rounded text-xs font-mono font-bold">
                  SPACE
                </div>
              </div>
            </div>

            {/* Practice Text */}
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="font-semibold text-gray-700 mb-3">
                Practice Text:
              </h3>
              <div className="font-mono text-base leading-loose">
                {currentItems.map((item, pos) => {
                  const tw = typedWords[pos];
                  let cls = "text-gray-700";
                  if (tw !== undefined && tw !== "") {
                    cls = tw === item.word ? "text-green-600" : "text-red-600";
                  }
                  return (
                    <span key={item.id} className={`${cls} mr-2`}>
                      {item.word}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Input */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Type here:
                </span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-bold">
                    Accuracy: {accuracy}%
                  </span>
                  <span className="text-blue-600 font-bold">
                    Correct: {correct}
                  </span>
                </div>
              </div>
              <textarea
                className="w-full h-24 border-2 border-green-300 rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Yahan type karein..."
                data-ocid="practice.input"
              />
              <button
                type="button"
                onClick={() => setTyped("")}
                className="mt-2 text-xs text-gray-500 hover:text-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
