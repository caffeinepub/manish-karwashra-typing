import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "@tanstack/react-router";
import { BookOpen, ClipboardList, Keyboard, Zap } from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const EXAM_CARDS = [
  { name: "All Exam", color: "#1565c0", emoji: "📋" },
  { name: "Delhi Police HCM", color: "#c62828", emoji: "🚔" },
  { name: "DSSSB", color: "#424242", emoji: "🏛️" },
  { name: "SSC CGL", color: "#e65100", emoji: "📝" },
  { name: "SSC CHSL", color: "#c2185b", emoji: "📄" },
  { name: "SSC MTS", color: "#b71c1c", emoji: "📑" },
  { name: "Railway NTPC", color: "#1a237e", emoji: "🚂" },
  { name: "Banking", color: "#0d47a1", emoji: "🏦" },
  { name: "State Level", color: "#1b5e20", emoji: "🏢" },
  { name: "Hartron", color: "#e65100", emoji: "💻" },
  { name: "DEO", color: "#e65100", emoji: "🖥️" },
  { name: "PCS", color: "#004d40", emoji: "⚖️" },
  { name: "Teaching", color: "#6a1b9a", emoji: "🎓" },
  { name: "Clerk", color: "#283593", emoji: "📂" },
];

const EXAM_PATTERN = [
  {
    exam: "SSC CGL (Tier 1)",
    questions: "100",
    medium: "Hindi / English",
    wpm: "35 (E) / 30 (H)",
    negative: "0.50",
  },
  {
    exam: "SSC CHSL (Tier 1)",
    questions: "100",
    medium: "Hindi / English",
    wpm: "35 (E) / 30 (H)",
    negative: "0.50",
  },
  {
    exam: "SSC MTS",
    questions: "90",
    medium: "Hindi / English + Regional",
    wpm: "N/A",
    negative: "1.0 (Sec-II)",
  },
  {
    exam: "Delhi Police HCM",
    questions: "100",
    medium: "Hindi / English",
    wpm: "30 (E) / 25 (H)",
    negative: "0.50",
  },
  {
    exam: "Railway NTPC (CBT-1)",
    questions: "100",
    medium: "Hindi / English + Regional",
    wpm: "30 (E) / 25 (H)",
    negative: "1/3 (0.33)",
  },
  {
    exam: "DSSSB (Clerk)",
    questions: "200",
    medium: "Hindi / English",
    wpm: "35 (E) / 30 (H)",
    negative: "0.25",
  },
  {
    exam: "Hartron DEO",
    questions: "30 (MCQ)",
    medium: "English",
    wpm: "30 (English)",
    negative: "Nil",
  },
  {
    exam: "HSSC / State Clerk",
    questions: "100",
    medium: "Hindi / English",
    wpm: "30 (E) / 25 (H)",
    negative: "0.25",
  },
  {
    exam: "Banking (Prelims)",
    questions: "100",
    medium: "Hindi / English",
    wpm: "30+ (Recommended)",
    negative: "0.25",
  },
  {
    exam: "PCS (Prelims)",
    questions: "150 - 200",
    medium: "Hindi / English",
    wpm: "N/A",
    negative: "0.33",
  },
  {
    exam: "Teaching (CTET)",
    questions: "150",
    medium: "Hindi / English",
    wpm: "N/A",
    negative: "Nil",
  },
];

const LANGUAGES = ["हिंदी", "English", "All Language"];

export default function Home() {
  const [activeLang, setActiveLang] = useState("All Language");
  const router = useRouter();

  const handleTyping = (examName: string) => {
    const slug = examName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.navigate({ to: `/typing/${slug}` });
  };

  const handleMCQ = (examName: string) => {
    const slug = examName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.navigate({ to: `/mcq/${slug}` });
  };

  const handlePractice = (examName: string) => {
    const slug = examName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.navigate({ to: `/mock-test/${slug}` });
  };

  const handleLive = (examName: string) => {
    const slug = examName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.navigate({ to: `/live-test/${slug}` });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />

      <div className="bg-white border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 flex-wrap">
          <span className="text-lg">🇮🇳</span>
          {LANGUAGES.map((lang) => (
            <button
              type="button"
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-4 py-1 rounded border text-sm font-medium transition-colors ${
                activeLang === lang
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
              data-ocid="lang.tab"
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-[#e8f0fe] py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold italic text-orange-600 mb-3">
            Welcome to Karwashra Typing
          </h1>
          <p className="text-gray-500 text-lg">
            Speed up your typing &amp; Crack all Govt. &amp; State Exams!
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => router.navigate({ to: "/live-test" })}
            className="flex items-center gap-3 bg-[#c62828] text-white rounded-xl px-5 py-5 font-semibold text-base hover:opacity-90 transition-opacity shadow-card"
            data-ocid="feature.button"
          >
            <Zap className="w-7 h-7" />
            <span>Live Test</span>
          </button>
          <button
            type="button"
            onClick={() =>
              router.navigate({
                to: "/typing/$examCategory",
                params: { examCategory: "all-exam" },
              })
            }
            className="flex items-center gap-3 bg-[#1565c0] text-white rounded-xl px-5 py-5 font-semibold text-base hover:opacity-90 transition-opacity shadow-card"
            data-ocid="feature.button"
          >
            <Keyboard className="w-7 h-7" />
            <span>Typing Practice</span>
          </button>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/mock-test" })}
            className="flex items-center gap-3 bg-orange-600 text-white rounded-xl px-5 py-5 font-semibold text-base hover:opacity-90 transition-opacity shadow-card"
            data-ocid="feature.button"
          >
            <ClipboardList className="w-7 h-7" />
            <span>Mock Test</span>
          </button>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/learning" })}
            className="flex items-center gap-3 bg-[#2e7d32] text-white rounded-xl px-5 py-5 font-semibold text-base hover:opacity-90 transition-opacity shadow-card"
            data-ocid="feature.button"
          >
            <BookOpen className="w-7 h-7" />
            <span>Learning Typing</span>
          </button>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Typing Exam &amp; MCQ Test — Select Your Exam
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="flex items-center gap-3 mb-5">
            <Badge className="bg-blue-600 text-white hover:bg-blue-600">
              Typing
            </Badge>
            <Badge className="bg-orange-500 text-white hover:bg-orange-500">
              MCQ
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {EXAM_CARDS.map((card, i) => (
              <div
                key={card.name}
                className="bg-white rounded-lg shadow-card p-3 flex flex-col items-center gap-2"
                data-ocid={`exam.item.${i + 1}`}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: card.color }}
                >
                  {card.emoji}
                </div>
                <span className="text-xs font-semibold text-gray-800 text-center leading-tight">
                  {card.name}
                </span>
                <div className="grid grid-cols-2 gap-1 w-full">
                  <button
                    type="button"
                    onClick={() => handleTyping(card.name)}
                    className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded hover:bg-blue-700 transition-colors"
                    data-ocid={`exam.typing.button.${i + 1}`}
                  >
                    Typing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMCQ(card.name)}
                    className="text-xs bg-orange-500 text-white px-1 py-0.5 rounded hover:bg-orange-600 transition-colors"
                    data-ocid={`exam.mcq.button.${i + 1}`}
                  >
                    MCQ
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePractice(card.name)}
                    className="text-xs bg-orange-600 text-white px-1 py-0.5 rounded hover:bg-orange-700 transition-colors"
                    data-ocid={`exam.practice.button.${i + 1}`}
                  >
                    Practice
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLive(card.name)}
                    className="text-xs bg-[#c62828] text-white px-1 py-0.5 rounded hover:bg-red-800 transition-colors"
                    data-ocid={`exam.live.button.${i + 1}`}
                  >
                    Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-xl font-bold text-gray-800">
              Exam Pattern &amp; Eligibility Overview
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#0d1b4b] hover:bg-[#0d1b4b]">
                  <TableHead className="text-white font-semibold">
                    Exam
                  </TableHead>
                  <TableHead className="text-white font-semibold text-center">
                    Total Questions
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Paper Medium
                  </TableHead>
                  <TableHead className="text-white font-semibold text-center">
                    Typing Speed (WPM)
                  </TableHead>
                  <TableHead className="text-white font-semibold text-center">
                    Negative Marking
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EXAM_PATTERN.map((row, i) => (
                  <TableRow
                    key={row.exam}
                    className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    data-ocid={`pattern.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-gray-800">
                      {row.exam}
                    </TableCell>
                    <TableCell className="text-center text-gray-700">
                      {row.questions}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {row.medium}
                    </TableCell>
                    <TableCell className="text-center text-gray-700">
                      {row.wpm}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${row.negative === "Nil" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {row.negative}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
