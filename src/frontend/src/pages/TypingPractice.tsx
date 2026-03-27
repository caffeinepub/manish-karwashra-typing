import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CharHighlight from "../components/CharHighlight";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePassagesByExam, useSaveTypingResult } from "../hooks/useQueries";

const SAMPLE_PASSAGE = {
  id: BigInt(0),
  title: "General Practice Passage",
  content:
    "The quick brown fox jumps over the lazy dog. This is a sample typing passage for government exam preparation. Practice daily to improve your speed and accuracy. Regular practice is the key to success in any competitive examination. Focus on both speed and accuracy to achieve the best results.",
  wordCount: BigInt(46),
  language: "English",
  examCategory: "all-exam",
};

const DURATION = 5 * 60;

export default function TypingPractice() {
  const params = useParams({ strict: false }) as { examCategory?: string };
  const examCategory = params.examCategory || "all-exam";
  const { data: passages } = usePassagesByExam(examCategory);
  const { mutate: saveResult } = useSaveTypingResult();
  const { identity } = useInternetIdentity();

  const [passageIndex, setPassageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const allPassages =
    passages && passages.length > 0 ? passages : [SAMPLE_PASSAGE];
  const passage = allPassages[passageIndex % allPassages.length];
  const passageText = passage.content;
  const passageChars = passageText.split("");

  const wpm = useCallback(() => {
    if (!startTime || typed.length === 0) return 0;
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = typed.trim().split(/\s+/).length;
    return Math.round(wordsTyped / Math.max(elapsed, 0.01));
  }, [startTime, typed]);

  const accuracy = useCallback(() => {
    if (typed.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passageText[i]) correct++;
    }
    return Math.round((correct / typed.length) * 100);
  }, [typed, passageText]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  useEffect(() => {
    if (typed.length >= passageText.length && started && !finished) {
      clearInterval(timerRef.current!);
      setFinished(true);
    }
  }, [typed, passageText, started, finished]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setTyped(e.target.value);
  };

  const handleSave = () => {
    const userId = identity?.getPrincipal().toString() || "anonymous";
    saveResult(
      {
        wpm: BigInt(wpm()),
        accuracy: BigInt(accuracy()),
        duration: BigInt(DURATION - timeLeft),
        isPractice: true,
        userId,
        examCategory,
        timestamp: BigInt(Date.now()),
        passageId: passage.id,
        attemptNumber: BigInt(1),
      },
      {
        onSuccess: () => toast.success("Result saved!"),
        onError: () => toast.error("Failed to save result"),
      },
    );
  };

  const handleReset = () => {
    setTyped("");
    setTimeLeft(DURATION);
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleNewPassage = () => {
    setPassageIndex((i) => i + 1);
    handleReset();
  };
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progressPct = (typed.length / passageText.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-[#0d1b4b] mb-1">
            Typing Practice
          </h1>
          <p className="text-gray-500 text-sm mb-6 capitalize">
            {examCategory.replace(/-/g, " ")}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div
              className="bg-white rounded-xl shadow-card p-4 text-center"
              data-ocid="typing.panel"
            >
              <div className="text-3xl font-bold text-blue-600">{wpm()}</div>
              <div className="text-xs text-gray-500 mt-1">WPM</div>
            </div>
            <div className="bg-white rounded-xl shadow-card p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {accuracy()}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Accuracy</div>
            </div>
            <div className="bg-white rounded-xl shadow-card p-4 text-center">
              <div
                className={`text-3xl font-bold ${timeLeft < 30 ? "text-red-600" : "text-orange-600"}`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Time Left</div>
            </div>
          </div>
          <Progress value={progressPct} className="mb-5 h-2" />
          {!finished ? (
            <>
              <div className="bg-white rounded-xl shadow-card p-5 mb-4 font-mono text-base leading-8 select-none">
                <CharHighlight chars={passageChars} typed={typed} />
              </div>
              <textarea
                ref={textareaRef}
                value={typed}
                onChange={handleInput}
                placeholder="Start typing here..."
                className="w-full h-32 p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 outline-none font-mono text-base resize-none bg-white shadow-card"
                data-ocid="typing.editor"
              />
            </>
          ) : (
            <div
              className="bg-white rounded-xl shadow-card p-8 text-center"
              data-ocid="typing.success_state"
            >
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-[#0d1b4b] mb-6">
                Test Complete!
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {wpm()}
                  </div>
                  <div className="text-sm text-gray-500">WPM</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">
                    {accuracy()}%
                  </div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {formatTime(DURATION - timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">Time Taken</div>
                </div>
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                <Button
                  onClick={handleSave}
                  className="bg-[#1565c0] hover:bg-blue-700 text-white"
                  data-ocid="typing.save_button"
                >
                  Save Result
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  data-ocid="typing.secondary_button"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleNewPassage}
                  variant="outline"
                  data-ocid="typing.secondary_button"
                >
                  New Passage
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
