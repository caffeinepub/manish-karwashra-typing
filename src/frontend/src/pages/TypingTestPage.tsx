import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { saveExamResult } from "../utils/results";

const TEST_MODES = [
  { id: "10s", label: "10 Seconds", seconds: 10 },
  { id: "1m", label: "1 Minute", seconds: 60 },
  { id: "5m", label: "5 Minutes", seconds: 300 },
  { id: "15m", label: "15 Minutes", seconds: 900 },
  { id: "20m", label: "20 Minutes", seconds: 1200 },
  { id: "words500", label: "500 Words", seconds: 0 },
  { id: "words1000", label: "1000 Words", seconds: 0 },
  { id: "words2000", label: "2000 Words", seconds: 0 },
  { id: "paragraph", label: "Paragraph Test", seconds: 180 },
  { id: "custom", label: "Custom Text", seconds: 0 },
];

const SAMPLE_PASSAGES = [
  "The quick brown fox jumps over the lazy dog. Practice makes a man perfect. Typing speed is very important for government exams. Regular practice helps improve your words per minute score. Focus on accuracy before increasing speed. Always use all ten fingers while typing.",
  "India is a land of diverse cultures and traditions. The Constitution of India was adopted on 26th November 1949 and came into effect on 26th January 1950. Dr. B. R. Ambedkar was the chief architect of the Indian Constitution. India has 28 states and 8 union territories.",
  "The Haryana government has taken many initiatives for the welfare of the people. The state is known for its rich agricultural heritage and its contribution to the national food production. Sports culture is very strong in Haryana and many Olympic medalists come from this state.",
  "Computer skills are essential in today's digital world. Every government office now requires basic computer knowledge. MS Office, internet browsing, and email communication are some of the important skills. Data Entry Operators need to type at least 35 words per minute with high accuracy.",
  "The Indian Railways is one of the largest railway networks in the world. It connects all major cities and towns across the country. The railways provide employment to millions of people. Various recruitment exams are held every year for different posts in the railways.",
];

const COMMON_WORDS = [
  "the",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "lazy",
  "dog",
  "and",
  "is",
  "a",
  "to",
  "in",
  "of",
  "that",
  "with",
  "for",
  "on",
  "are",
  "was",
  "he",
  "she",
  "it",
  "we",
  "they",
  "have",
  "this",
  "from",
  "or",
  "had",
  "not",
  "but",
  "what",
  "all",
  "were",
  "when",
  "your",
  "can",
  "said",
  "there",
  "use",
  "each",
  "which",
  "do",
  "how",
  "their",
  "if",
  "will",
  "up",
  "other",
  "about",
  "out",
  "many",
  "then",
  "them",
  "these",
  "so",
  "some",
  "her",
  "would",
  "make",
  "like",
  "into",
  "time",
  "has",
  "look",
  "two",
  "more",
  "write",
  "go",
];

function generateWords(count: number): string {
  const arr: string[] = [];
  for (let pos = 0; pos < count; pos++) {
    arr.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  }
  return arr.join(" ");
}

type Phase = "select" | "typing" | "result";

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

export default function TypingTestPage() {
  const [mode, setMode] = useState(TEST_MODES[1]);
  const [customText, setCustomText] = useState("");
  const [phase, setPhase] = useState<Phase>("select");
  const [wordSpans, setWordSpans] = useState<WordSpan[]>([]);
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const words = wordSpans.map((s) => s.word);
  const typedWords = typed.trim().split(/\s+/);

  const correctWords = typedWords.filter((w, pos) => w === words[pos]).length;
  const wrongWords = typedWords.filter(
    (w, pos) => w !== words[pos] && w !== "",
  ).length;
  const totalTyped = typedWords.filter((w) => w !== "").length;

  const elapsedSec =
    timeTaken > 0
      ? timeTaken
      : started
        ? (Date.now() - startTimeRef.current) / 1000
        : 0;
  const wpm = elapsedSec > 0 ? Math.round((correctWords / elapsedSec) * 60) : 0;
  const accuracy =
    totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 0;
  const mistakes = wrongWords;

  function buildPassage() {
    if (mode.id === "custom") return customText.trim();
    if (mode.id === "words500") return generateWords(500);
    if (mode.id === "words1000") return generateWords(1000);
    if (mode.id === "words2000") return generateWords(2000);
    return SAMPLE_PASSAGES[Math.floor(Math.random() * SAMPLE_PASSAGES.length)];
  }

  function startTest() {
    const p = buildPassage();
    if (!p) return;
    setWordSpans(buildWordSpans(p));
    setTyped("");
    setStarted(false);
    setTimeTaken(0);
    setTimeLeft(mode.seconds);
    setPhase("typing");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function handleType(val: string) {
    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
      if (mode.seconds > 0) {
        timerRef.current = setInterval(() => {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const left = mode.seconds - elapsed;
          if (left <= 0) {
            clearInterval(timerRef.current!);
            setTimeTaken(mode.seconds);
            setPhase("result");
          } else {
            setTimeLeft(left);
          }
        }, 100);
      }
    }
    setTyped(val);
    if (mode.seconds === 0) {
      const tw = val.trim().split(/\s+/).filter(Boolean);
      if (tw.length >= words.length) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setTimeTaken(elapsed);
        setPhase("result");
      }
    }
  }

  function finishTest() {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed =
      mode.seconds > 0
        ? mode.seconds - timeLeft
        : (Date.now() - startTimeRef.current) / 1000;
    setTimeTaken(elapsed);
    setPhase("result");
  }

  useEffect(() => {
    if (phase === "result" && timeTaken > 0) {
      const finalWpm = Math.round((correctWords / timeTaken) * 60);
      const finalAcc =
        totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 0;
      saveExamResult({
        examName: `Typing Test - ${mode.label}`,
        examType: "typing",
        wpm: finalWpm,
        accuracy: finalAcc,
        passed: finalWpm >= 30 && finalAcc >= 80,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeTaken, correctWords, mode.label, totalTyped]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b] mb-6">
          ⌨️ Typing Test
        </h1>

        {phase === "select" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Test Mode Select Karen
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {TEST_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      mode.id === m.id
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300 text-gray-700"
                    }`}
                    data-ocid={`typing.mode.${m.id}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {mode.id === "custom" && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Apna Text Paste Karen
                </h2>
                <textarea
                  className="w-full h-40 border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yahan apna custom text paste karein..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  data-ocid="typing.custom_text"
                />
              </div>
            )}

            <Button
              onClick={startTest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              data-ocid="typing.start_button"
            >
              ▶️ Start Test
            </Button>
          </div>
        )}

        {phase === "typing" && (
          <div className="space-y-4">
            <div className="bg-[#0d1b4b] text-white rounded-xl px-6 py-3 flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {started && mode.seconds > 0
                    ? Math.ceil(timeLeft)
                    : mode.seconds > 0
                      ? mode.seconds
                      : "--"}
                </div>
                <div className="text-xs text-gray-400">Seconds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{wpm}</div>
                <div className="text-xs text-gray-400">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {accuracy}%
                </div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
              <Button
                size="sm"
                onClick={finishTest}
                className="bg-red-600 hover:bg-red-700"
                data-ocid="typing.stop_button"
              >
                Submit
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow p-5 text-base leading-relaxed min-h-32 font-mono">
              {wordSpans.map((span, pos) => {
                const tw = typedWords[pos];
                let cls = "text-gray-700";
                if (tw !== undefined) {
                  cls =
                    tw === span.word
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold";
                }
                const isCurrent =
                  pos === typedWords.length - 1 ||
                  (pos === typedWords.length && typed.endsWith(" "));
                return (
                  <span
                    key={span.id}
                    className={`${cls} ${isCurrent ? "underline" : ""} mr-1`}
                  >
                    {span.word}
                  </span>
                );
              })}
            </div>

            <textarea
              ref={textareaRef}
              className="w-full h-28 border-2 border-blue-300 rounded-xl p-4 text-base font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Yahan type karna shuru karein..."
              value={typed}
              onChange={(e) => handleType(e.target.value)}
              data-ocid="typing.input"
            />
          </div>
        )}

        {phase === "result" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center text-[#0d1b4b] mb-6">
                🏆 Test Result
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: "WPM",
                    value: wpm,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Accuracy",
                    value: `${accuracy}%`,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    label: "Mistakes",
                    value: mistakes,
                    color: "text-red-600",
                    bg: "bg-red-50",
                  },
                  {
                    label: "Time",
                    value: `${Math.round(timeTaken)}s`,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "Correct Words",
                    value: correctWords,
                    color: "text-teal-600",
                    bg: "bg-teal-50",
                  },
                  {
                    label: "Wrong Words",
                    value: wrongWords,
                    color: "text-orange-600",
                    bg: "bg-orange-50",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`${s.bg} rounded-xl p-4 text-center`}
                  >
                    <div className={`text-3xl font-bold ${s.color}`}>
                      {s.value}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div
                className={`p-4 rounded-xl text-center font-semibold ${
                  wpm >= 30 && accuracy >= 80
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {wpm >= 30 && accuracy >= 80
                  ? "🏅 Congratulations! Aap qualify ho gaye!"
                  : "💪 Keep practicing! Aur mehnat karein."}
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setPhase("select")}
                  variant="outline"
                  className="flex-1"
                  data-ocid="typing.new_test_button"
                >
                  New Test
                </Button>
                <Button
                  onClick={startTest}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  data-ocid="typing.retry_button"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
