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
import { usePassagesByExam, useSaveTypingResult } from "../hooks/useQueries";

const EXAMS = [
  "SSC CGL",
  "SSC CHSL",
  "Delhi Police HCM",
  "Railway NTPC",
  "DSSSB",
  "Banking",
  "PCS",
  "SSC MTS",
];
const DURATIONS: Record<string, number> = {
  "SSC CGL": 10 * 60,
  "SSC CHSL": 10 * 60,
  "Delhi Police HCM": 10 * 60,
  "Railway NTPC": 10 * 60,
  DSSSB: 15 * 60,
  Banking: 10 * 60,
  PCS: 30 * 60,
  "SSC MTS": 10 * 60,
};
const SAMPLE =
  "The Indian government conducts various competitive examinations every year to recruit candidates for different posts. Staff Selection Commission, Railway Recruitment Board and Union Public Service Commission are among the most important examination bodies. Candidates must prepare thoroughly for both written tests and skill tests including typing.";

export default function MockTest() {
  const [exam, setExam] = useState("SSC CGL");
  const [testStarted, setTestStarted] = useState(false);
  const examSlug = exam
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { data: passages } = usePassagesByExam(examSlug);
  const { mutate: saveResult } = useSaveTypingResult();
  const { identity } = useInternetIdentity();

  const duration = DURATIONS[exam] || 10 * 60;
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passage =
    passages && passages.length > 0 ? passages[0].content : SAMPLE;
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
    setTimeLeft(duration);
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
          <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">Mock Test</h1>
          {!testStarted ? (
            <div className="bg-white rounded-xl shadow-card p-8">
              <h2 className="text-lg font-semibold mb-6">
                Select Exam &amp; Start Mock Test
              </h2>
              <div className="max-w-sm mb-6">
                <label
                  htmlFor="mock-exam-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Exam
                </label>
                <Select value={exam} onValueChange={setExam}>
                  <SelectTrigger id="mock-exam-select" data-ocid="mock.select">
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
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 space-y-1">
                <p className="text-sm font-semibold text-orange-800">
                  Mock Test Rules:
                </p>
                <p className="text-sm text-orange-700">
                  Duration: {formatTime(DURATIONS[exam] || 600)}
                </p>
                <p className="text-sm text-orange-700">
                  Type the passage exactly as shown
                </p>
                <p className="text-sm text-orange-700">
                  Simulates actual exam environment
                </p>
                <p className="text-sm text-orange-700">
                  Timer starts when you begin typing
                </p>
              </div>
              <Button
                onClick={handleStart}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                data-ocid="mock.primary_button"
              >
                Start Mock Test
              </Button>
            </div>
          ) : (
            <>
              <div
                className="bg-orange-600 text-white rounded-xl p-3 mb-4 text-center text-sm font-semibold"
                data-ocid="mock.panel"
              >
                MOCK TEST MODE &mdash; {exam} | Duration: {formatTime(duration)}
              </div>
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
                    placeholder="Start typing the passage above..."
                    className="w-full h-32 p-4 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none font-mono text-base resize-none bg-white shadow-card"
                    data-ocid="mock.editor"
                  />
                </>
              ) : (
                <div
                  className="bg-white rounded-xl shadow-card p-8 text-center"
                  data-ocid="mock.success_state"
                >
                  <div className="text-4xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-[#0d1b4b] mb-4">
                    Mock Test Complete!
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
                        {formatTime(duration - timeLeft)}
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
                          duration: BigInt(duration - timeLeft),
                          isPractice: false,
                          userId:
                            identity?.getPrincipal().toString() || "anonymous",
                          examCategory: examSlug,
                          timestamp: BigInt(Date.now()),
                          passageId: BigInt(0),
                          attemptNumber: BigInt(1),
                        },
                        { onSuccess: () => toast.success("Saved!") },
                      );
                    }}
                    className="bg-[#1565c0] text-white mr-3"
                    data-ocid="mock.save_button"
                  >
                    Save Result
                  </Button>
                  <Button
                    onClick={handleStart}
                    variant="outline"
                    data-ocid="mock.secondary_button"
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
