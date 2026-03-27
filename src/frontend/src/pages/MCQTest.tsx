import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { MCQQuestion } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMCQsByExam, useSaveMCQResult } from "../hooks/useQueries";

const SAMPLE_MCQS: MCQQuestion[] = [
  {
    id: BigInt(1),
    questionText: "What is the capital of India?",
    option1: "Mumbai",
    option2: "New Delhi",
    option3: "Kolkata",
    option4: "Chennai",
    correctAnswer: BigInt(2),
    language: "English",
    examCategory: "general",
  },
  {
    id: BigInt(2),
    questionText: "Who wrote the Indian National Anthem?",
    option1: "Mahatma Gandhi",
    option2: "Jawaharlal Nehru",
    option3: "Rabindranath Tagore",
    option4: "Subhas Chandra Bose",
    correctAnswer: BigInt(3),
    language: "English",
    examCategory: "general",
  },
  {
    id: BigInt(3),
    questionText: "What is the full form of SSC?",
    option1: "State Service Commission",
    option2: "Staff Selection Commission",
    option3: "Senior Selection Committee",
    option4: "Special Services Corps",
    correctAnswer: BigInt(2),
    language: "English",
    examCategory: "general",
  },
  {
    id: BigInt(4),
    questionText: "In which year was the Indian Constitution adopted?",
    option1: "1947",
    option2: "1948",
    option3: "1949",
    option4: "1950",
    correctAnswer: BigInt(3),
    language: "English",
    examCategory: "general",
  },
  {
    id: BigInt(5),
    questionText: "What is the typing speed required for SSC CGL in English?",
    option1: "25 WPM",
    option2: "30 WPM",
    option3: "35 WPM",
    option4: "40 WPM",
    correctAnswer: BigInt(3),
    language: "English",
    examCategory: "general",
  },
];

const DURATION = 10 * 60;

export default function MCQTest() {
  const params = useParams({ strict: false }) as { examCategory?: string };
  const examCategory = params.examCategory || "all-exam";
  const { data: mcqs } = useMCQsByExam(examCategory);
  const { mutate: saveResult } = useSaveMCQResult();
  const { identity } = useInternetIdentity();

  const questions = mcqs && mcqs.length > 0 ? mcqs : SAMPLE_MCQS;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);

  const score = questions.reduce(
    (acc, q, i) => (answers[i] === Number(q.correctAnswer) ? acc + 1 : acc),
    0,
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (!submittedRef.current) {
            submittedRef.current = true;
            setSubmitted(true);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAnswer = (optionNum: number) => {
    setAnswers((prev) => ({ ...prev, [current]: optionNum }));
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current!);
    submittedRef.current = true;
    setSubmitted(true);
    const finalScore = questions.reduce(
      (acc, q, i) => (answers[i] === Number(q.correctAnswer) ? acc + 1 : acc),
      0,
    );
    const userId = identity?.getPrincipal().toString() || "anonymous";
    saveResult(
      {
        score: BigInt(finalScore),
        totalQuestions: BigInt(questions.length),
        isPractice: true,
        userId,
        examCategory,
        timestamp: BigInt(Date.now()),
        attemptNumber: BigInt(1),
      },
      { onSuccess: () => toast.success("Result saved!") },
    );
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const q = questions[current];
  const options = [q.option1, q.option2, q.option3, q.option4];

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="bg-white rounded-xl shadow-card p-8 text-center"
              data-ocid="mcq.success_state"
            >
              <div className="text-5xl mb-4">
                {score >= questions.length / 2 ? "🏆" : "📝"}
              </div>
              <h2 className="text-2xl font-bold text-[#0d1b4b] mb-2">
                Test Completed!
              </h2>
              <p className="text-gray-500 mb-6">Here are your results</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {score}
                  </div>
                  <div className="text-sm text-gray-500">Correct</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-600">
                    {questions.length - score}
                  </div>
                  <div className="text-sm text-gray-500">Incorrect</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>
              <div className="text-left space-y-4">
                {questions.map((ques, i) => {
                  const opts = [
                    ques.option1,
                    ques.option2,
                    ques.option3,
                    ques.option4,
                  ];
                  const correct = Number(ques.correctAnswer) - 1;
                  const userAnswer =
                    answers[i] !== undefined ? answers[i] - 1 : -1;
                  const isCorrect = answers[i] === Number(ques.correctAnswer);
                  return (
                    <div
                      key={String(ques.id)}
                      className={`p-4 rounded-lg border-l-4 ${isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
                      data-ocid={`mcq.item.${i + 1}`}
                    >
                      <p className="font-medium text-gray-800 mb-2">
                        {i + 1}. {ques.questionText}
                      </p>
                      <p className="text-sm text-green-700">
                        Correct: {opts[correct]}
                      </p>
                      {!isCorrect && userAnswer >= 0 && (
                        <p className="text-sm text-red-700">
                          Your answer: {opts[userAnswer]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6 bg-[#1565c0] text-white"
                data-ocid="mcq.primary_button"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#0d1b4b]">MCQ Test</h1>
            <div
              className={`text-lg font-bold px-4 py-2 rounded-lg ${timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Question {current + 1} of {questions.length}
            </span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <Progress
            value={((current + 1) / questions.length) * 100}
            className="mb-6 h-2"
          />
          <div
            className="bg-white rounded-xl shadow-card p-6 mb-4"
            data-ocid="mcq.panel"
          >
            <p className="text-lg font-semibold text-gray-800 mb-6">
              {current + 1}. {q.questionText}
            </p>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: MCQ options are positional A/B/C/D
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(i + 1)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${answers[current] === i + 1 ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 hover:border-blue-300 text-gray-700"}`}
                  data-ocid="mcq.radio"
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>{" "}
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              variant="outline"
              data-ocid="mcq.secondary_button"
            >
              Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button
                onClick={() => setCurrent((c) => c + 1)}
                className="bg-[#1565c0] text-white"
                data-ocid="mcq.primary_button"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-orange-500 text-white hover:bg-orange-600"
                data-ocid="mcq.submit_button"
              >
                Submit Test
              </Button>
            )}
          </div>
          <div className="mt-6 bg-white rounded-xl shadow-card p-4">
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Question Navigator
            </p>
            <div className="flex flex-wrap gap-2">
              {questions.map((ques, i) => (
                <button
                  key={String(ques.id)}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`w-8 h-8 rounded text-sm font-semibold transition-colors ${i === current ? "bg-blue-600 text-white" : answers[i] !== undefined ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  data-ocid={`mcq.item.${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
