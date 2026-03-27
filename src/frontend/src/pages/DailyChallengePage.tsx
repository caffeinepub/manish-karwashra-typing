import { useEffect, useRef, useState } from "react";

const CHALLENGE_PASSAGES = [
  "The quick brown fox jumps over the lazy dog and every good boy does fine. Typing is an essential skill for all government job aspirants in India. Practice daily to improve your speed and accuracy significantly.",
  "India became independent on 15th August 1947. The Constitution of India came into effect on 26th January 1950. Dr. Rajendra Prasad was the first President of India. The national flag has three colors saffron white and green.",
  "Haryana was formed on 1st November 1966. Chandigarh is its capital city. The state is known for agriculture and sports. Many Olympic medal winners come from Haryana. The state has made significant progress in education and industry.",
  "Computer knowledge is essential in modern times. MS Office email and internet skills help in daily office work. Data Entry Operators need at least 35 words per minute. Regular typing practice improves both speed and accuracy.",
  "The Indian Railways is one of the largest employers in the world. Railway exams are conducted every year for various posts. Typing speed is tested for clerical and data entry positions. Practice on official exam interfaces for best results.",
  "Banking sector in India provides employment to millions. IBPS conducts recruitment exams for public sector banks. Typing test is mandatory for clerical cadre posts. Accuracy is more important than raw speed in banking exams.",
  "Teaching is a noble profession that shapes the future of the nation. CTET and TET exams are conducted for teacher recruitment. Hindi and English typing both are required for various teaching posts. Continuous practice leads to mastery.",
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

function getTodaysPassage() {
  const d = new Date();
  const idx = (d.getDate() + d.getMonth() * 31) % CHALLENGE_PASSAGES.length;
  return CHALLENGE_PASSAGES[idx];
}

function getStreak(): number {
  try {
    const data = JSON.parse(localStorage.getItem("daily_challenge") || "{}");
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastDate === yesterday) return data.streak || 0;
    return 0;
  } catch {
    return 0;
  }
}

export default function DailyChallengePage() {
  const passageText = getTodaysPassage();
  const items = buildItems(passageText);
  const words = items.map((i) => i.word);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"ready" | "typing" | "done">("ready");
  const [timeLeft, setTimeLeft] = useState(300);
  const [timeTaken, setTimeTaken] = useState(0);
  const streak = getStreak();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startChallenge() {
    setPhase("typing");
    setTyped("");
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left = 300 - elapsed;
      if (left <= 0) {
        clearInterval(timerRef.current!);
        setTimeTaken(300);
        setPhase("done");
      } else {
        setTimeLeft(left);
      }
    }, 500);
  }

  function finishChallenge() {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = (Date.now() - startRef.current) / 1000;
    setTimeTaken(elapsed);
    setPhase("done");
    const today = new Date().toDateString();
    const prevData = JSON.parse(
      localStorage.getItem("daily_challenge") || "{}",
    );
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak =
      prevData.lastDate === yesterday ? (prevData.streak || 0) + 1 : 1;
    localStorage.setItem(
      "daily_challenge",
      JSON.stringify({ lastDate: today, streak: newStreak }),
    );
  }

  const typedWords = typed.trim().split(" ");
  const correctWords = typedWords.filter((w, pos) => w === words[pos]).length;
  const wpm = timeTaken > 0 ? Math.round((correctWords / timeTaken) * 60) : 0;
  const accuracy =
    typedWords.filter(Boolean).length > 0
      ? Math.round((correctWords / typedWords.filter(Boolean).length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b]">
            📅 Daily Challenge
          </h1>
          <div className="bg-orange-100 border border-orange-300 rounded-xl px-4 py-2 text-center">
            <div className="text-2xl font-bold text-orange-600">
              🔥 {streak}
            </div>
            <div className="text-xs text-orange-500">Day Streak</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm text-blue-700">
          📅 <strong>Aaj ka challenge:</strong>{" "}
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          <br />⏱ 5 minutes mein yeh paragraph type karein.
        </div>

        {phase === "ready" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Aaj ka Passage:
              </h3>
              <p className="text-gray-600 leading-relaxed">{passageText}</p>
            </div>
            <button
              type="button"
              onClick={startChallenge}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-lg transition-colors"
              data-ocid="challenge.start_button"
            >
              ▶️ Challenge Start Karein
            </button>
          </div>
        )}

        {phase === "typing" && (
          <div className="space-y-4">
            <div className="bg-[#0d1b4b] text-white rounded-xl p-4 flex justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.ceil(timeLeft)}</div>
                <div className="text-xs text-gray-400">Seconds Left</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {correctWords}
                </div>
                <div className="text-xs text-gray-400">Words</div>
              </div>
              <button
                type="button"
                onClick={finishChallenge}
                className="bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                data-ocid="challenge.submit_button"
              >
                Submit
              </button>
            </div>
            <div className="bg-white rounded-xl shadow p-5 font-mono text-sm leading-loose">
              {items.map((item, pos) => {
                const tw = typedWords[pos];
                let cls = "text-gray-700";
                if (tw !== undefined && tw !== "") {
                  cls = tw === item.word ? "text-green-600" : "text-red-500";
                }
                return (
                  <span key={item.id} className={`${cls} mr-1`}>
                    {item.word}
                  </span>
                );
              })}
            </div>
            <textarea
              className="w-full h-28 border-2 border-red-300 rounded-xl p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type here..."
              data-ocid="challenge.input"
            />
          </div>
        )}

        {phase === "done" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-[#0d1b4b] mb-6">
              Challenge Complete!
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-600">{wpm}</div>
                <div className="text-sm text-gray-500">WPM</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhase("ready");
                setTyped("");
                setTimeLeft(300);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
