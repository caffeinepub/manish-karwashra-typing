import { useEffect, useRef, useState } from "react";

const DICTATION_TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "India is a democratic republic.",
  "Practice makes a man perfect.",
  "Haryana is known for its rich culture and agriculture.",
  "Computer skills are essential in today's digital world.",
  "The Indian Railways connects all major cities.",
  "Speed and accuracy are both important in typing.",
  "Government exams require good typing skills.",
  "Every student should practice typing daily.",
  "The Constitution of India was adopted in 1949.",
];

export default function DictationPage() {
  const [text, setText] = useState(DICTATION_TEXTS[0]);
  const [typed, setTyped] = useState("");
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState<{
    correct: number;
    total: number;
    accuracy: number;
  } | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = speed;
    utter.lang = language === "Hindi" ? "hi-IN" : "en-US";
    synthRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  function checkResult() {
    const original = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/);
    const attempt = typed
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/);
    let correct = 0;
    for (let i = 0; i < original.length; i++) {
      if (attempt[i] === original[i]) correct++;
    }
    setResult({
      correct,
      total: original.length,
      accuracy: Math.round((correct / original.length) * 100),
    });
  }

  function nextText() {
    const idx = DICTATION_TEXTS.findIndex((t) => t === text);
    const next = DICTATION_TEXTS[(idx + 1) % DICTATION_TEXTS.length];
    setText(next);
    setTyped("");
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b] mb-2">
          🎤 Dictation Mode
        </h1>
        <p className="text-gray-600 mb-6">
          Audio sunkar type karein. Listening + Typing practice.
        </p>

        <div className="bg-white rounded-2xl shadow p-6 space-y-5">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <span className="text-sm font-semibold text-gray-700 mr-2">
                Language:
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                data-ocid="dictation.language"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700 mr-2">
                Speed:
              </span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                data-ocid="dictation.speed"
              >
                <option value={0.6}>Slow</option>
                <option value={1}>Normal</option>
                <option value={1.4}>Fast</option>
              </select>
            </div>
          </div>

          {/* Play Button */}
          <button
            type="button"
            onClick={speak}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-3 font-bold text-lg transition-colors"
            data-ocid="dictation.play_button"
          >
            🔊 Audio Sunein (Play)
          </button>

          <p className="text-xs text-gray-500 text-center">
            Text sunne ke baad neeche type karein. Text dekhna allowed nahi!
          </p>

          {/* Textarea */}
          <textarea
            className="w-full h-32 border-2 border-pink-300 rounded-xl p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Jo suna usse yahan type karein..."
            data-ocid="dictation.input"
          />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={checkResult}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-semibold"
              data-ocid="dictation.check_button"
            >
              Check Result
            </button>
            <button
              type="button"
              onClick={nextText}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-2.5 font-semibold"
              data-ocid="dictation.next_button"
            >
              Next Text
            </button>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`p-4 rounded-xl text-center ${
                result.accuracy >= 80
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: result.accuracy >= 80 ? "#16a34a" : "#dc2626" }}
              >
                {result.accuracy}%
              </div>
              <div className="text-sm text-gray-600">
                {result.correct} / {result.total} words correct
              </div>
              <div className="mt-2 font-semibold text-gray-700">
                Original: <span className="font-normal italic">{text}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
