import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CharHighlight from "../components/CharHighlight";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  usePassagesByExamAndLanguage,
  useSaveTypingResult,
} from "../hooks/useQueries";

const EXAMS = [
  "All Exam",
  "SSC CGL",
  "SSC CHSL",
  "Delhi Police HCM",
  "Railway NTPC",
  "DSSSB",
  "Banking",
  "PCS",
];
const LANGS = ["English", "Hindi"];
const SAMPLE_PASSAGE =
  "The quick brown fox jumps over the lazy dog. In competitive examinations, time management and speed are crucial factors that determine your success. Practice typing daily to improve your words per minute and accuracy. Government jobs require specific typing speeds that you must achieve through consistent practice and dedication.";
const DURATION = 15 * 60;

export default function LiveTest() {
  const [exam, setExam] = useState("SSC CGL");
  const [lang, setLang] = useState("English");
  const [testStarted, setTestStarted] = useState(false);
  const examSlug = exam
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { data: passages } = usePassagesByExamAndLanguage(examSlug, lang);
  const { mutate: saveResult } = useSaveTypingResult();
  const { identity } = useInternetIdentity();

  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passage =
    passages && passages.length > 0 ? passages[0].content : SAMPLE_PASSAGE;
  const passageChars = passage.split("");

  const wpm = useCallback(() => {
    if (!startTime || typed.length === 0) return 0;
    const elapsed = (Date.now() - startTime) / 1000 / 60;
    return Math.round(
      typed.trim().split(/\s+/).length / Math.max(elapsed, 0.01),
    );
  }, [startTime, typed]);

  const accuracy = useCallback(() => {
    if (typed.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passage[i]) correct++;
    }
    return Math.round((correct / typed.length) * 100);
  }, [typed, passage]);

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
    if (typed.length >= passage.length && started && !finished) {
      clearInterval(timerRef.current!);
      setFinished(true);
    }
  }, [typed, passage, started, finished]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setTyped(e.target.value);
  };

  const handleStart = () => {
    setTestStarted(true);
    setTyped("");
    setTimeLeft(DURATION);
    setStarted(false);
    setFinished(false);
    setStartTime(null);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h1 className="text-2xl font-bold text-[#0d1b4b]">Live Test</h1>
          </div>

          {!testStarted ? (
            <div className="bg-white rounded-xl shadow-card p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Configure Your Live Test
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                  <label
                    htmlFor="live-exam-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Exam
                  </label>
                  <Select value={exam} onValueChange={setExam}>
                    <SelectTrigger
                      id="live-exam-select"
                      data-ocid="live.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAMS.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="live-lang-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Language
                  </label>
                  <Select value={lang} onValueChange={setLang}>
                    <SelectTrigger
                      id="live-lang-select"
                      data-ocid="live.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700 font-medium">
                  Duration: 15 minutes | This is a timed live test. Once
                  started, the timer cannot be paused.
                </p>
              </div>
              <Button
                onClick={handleStart}
                className="bg-[#c62828] hover:bg-red-800 text-white px-8"
                data-ocid="live.primary_button"
              >
                Start Live Test
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-xl shadow-card p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {wpm()}
                  </div>
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
                    className={`text-3xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-orange-600"}`}
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Time Left</div>
                </div>
              </div>
              <Progress
                value={(typed.length / passage.length) * 100}
                className="mb-4 h-2"
              />
              {!finished ? (
                <>
                  <div className="bg-white rounded-xl shadow-card p-5 mb-4 font-mono text-base leading-8 select-none">
                    <CharHighlight chars={passageChars} typed={typed} />
                  </div>
                  <textarea
                    value={typed}
                    onChange={handleInput}
                    placeholder="Start typing..."
                    className="w-full h-32 p-4 border-2 border-red-200 rounded-xl focus:border-red-500 outline-none font-mono text-base resize-none bg-white shadow-card"
                    data-ocid="live.editor"
                  />
                </>
              ) : (
                <div
                  className="bg-white rounded-xl shadow-card p-8 text-center"
                  data-ocid="live.success_state"
                >
                  <div className="text-4xl mb-4">🏆</div>
                  <h2 className="text-2xl font-bold text-[#0d1b4b] mb-4">
                    Live Test Complete!
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
                  <Button
                    onClick={() => {
                      saveResult(
                        {
                          wpm: BigInt(wpm()),
                          accuracy: BigInt(accuracy()),
                          duration: BigInt(DURATION - timeLeft),
                          isPractice: false,
                          userId:
                            identity?.getPrincipal().toString() || "anonymous",
                          examCategory: examSlug,
                          timestamp: BigInt(Date.now()),
                          passageId: BigInt(0),
                          attemptNumber: BigInt(1),
                        },
                        { onSuccess: () => toast.success("Result saved!") },
                      );
                    }}
                    className="bg-[#1565c0] text-white mr-3"
                    data-ocid="live.save_button"
                  >
                    Save Result
                  </Button>
                  <Button
                    onClick={handleStart}
                    variant="outline"
                    data-ocid="live.secondary_button"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
