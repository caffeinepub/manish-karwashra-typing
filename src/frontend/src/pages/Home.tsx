import { Badge } from "@/components/ui/badge";
import { useRouter } from "@tanstack/react-router";
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

const LANGUAGES = ["हिंदी", "English", "All Language"];

const QUICK_MENU = [
  {
    emoji: "⌨️",
    label: "Start Typing Test",
    path: "/typing-test",
    bg: "bg-blue-600",
  },
  {
    emoji: "📚",
    label: "Practice Lessons",
    path: "/practice",
    bg: "bg-green-600",
  },
  {
    emoji: "🏛️",
    label: "Exam Typing Mode",
    path: "/exam-mode",
    bg: "bg-orange-600",
  },
  { emoji: "🎮", label: "Typing Games", path: "/games", bg: "bg-purple-600" },
  {
    emoji: "🎤",
    label: "Dictation Mode",
    path: "/dictation",
    bg: "bg-pink-600",
  },
  {
    emoji: "📊",
    label: "Progress Report",
    path: "/progress",
    bg: "bg-teal-600",
  },
  {
    emoji: "🏆",
    label: "Leaderboard",
    path: "/leaderboard",
    bg: "bg-yellow-600",
  },
  {
    emoji: "📅",
    label: "Daily Challenge",
    path: "/daily-challenge",
    bg: "bg-red-600",
  },
  {
    emoji: "🏅",
    label: "Certificate / Result",
    path: "/results",
    bg: "bg-amber-600",
  },
  { emoji: "⚙️", label: "Settings", path: "/settings", bg: "bg-gray-600" },
  {
    emoji: "👤",
    label: "Profile / Login",
    path: "/profile",
    bg: "bg-indigo-600",
  },
];

export default function Home() {
  const [activeLang, setActiveLang] = useState("All Language");
  const router = useRouter();

  const handleTypingNav = (examName: string) => {
    const slug = examName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.navigate({
      to: "/typing/$examCategory",
      params: { examCategory: slug },
    });
  };

  const handleMCQ = (examName: string) => {
    const slug = examName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.navigate({
      to: "/mcq/$examCategory",
      params: { examCategory: slug },
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #e8f0fe, #dce8f8)",
      }}
    >
      <Header />

      {/* Language Bar */}
      <div className="bg-white border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-lg">🇮🇳</span>
          {LANGUAGES.map((lang) => (
            <button
              type="button"
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
                activeLang === lang
                  ? "bg-[#0d1b4b] text-white border-[#0d1b4b]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
              data-ocid="lang.tab"
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <section className="py-5 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => router.navigate({ to: "/mock-list" })}
              data-ocid="home.mock_test.button"
              className="flex flex-col items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl shadow-lg py-8 px-6 transition-transform hover:scale-105 active:scale-95 w-full"
            >
              <span className="text-5xl">📝</span>
              <span className="text-xl font-bold">Exam Mock Test</span>
              <span className="text-sm opacity-80">100+ Numbered Mocks</span>
            </button>
            <button
              type="button"
              onClick={() => router.navigate({ to: "/typing-test" })}
              data-ocid="home.typing_test.button"
              className="flex flex-col items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-lg py-8 px-6 transition-transform hover:scale-105 active:scale-95 w-full"
            >
              <span className="text-5xl">⌨️</span>
              <span className="text-xl font-bold">Typing Test</span>
              <span className="text-sm opacity-80">All Exam Patterns</span>
            </button>
            <button
              type="button"
              onClick={() => router.navigate({ to: "/practice" })}
              data-ocid="home.practice_test.button"
              className="flex flex-col items-center justify-center gap-3 bg-green-700 hover:bg-green-800 text-white rounded-2xl shadow-lg py-8 px-6 transition-transform hover:scale-105 active:scale-95 w-full"
            >
              <span className="text-5xl">📚</span>
              <span className="text-xl font-bold">Practice Test</span>
              <span className="text-sm opacity-80">Beginner to Advanced</span>
            </button>
          </div>
        </div>
      </section>
      {/* Welcome Banner */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-xl shadow-lg border border-gray-300 py-10 px-6 text-center"
            style={{
              background:
                "linear-gradient(135deg, #c8c8c8 0%, #e8e8e8 40%, #f5f5f5 60%, #d0d0d0 100%)",
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold italic text-orange-600 mb-3">
              Welcome to Karwashra Typing
            </h1>
            <p className="text-gray-600 text-lg">
              Speed up your typing &amp; Crack all Govt. &amp; State Exams!
            </p>
          </div>
        </div>
      </section>

      {/* Live Test / Live Mock Section */}
      <section className="py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl border border-gray-700 p-6"
            style={{
              background: "rgba(10, 15, 40, 0.82)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <h2 className="text-white text-xl font-bold mb-5 text-center tracking-wide">
              🔴 Live Test / Live Mock
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: "/live-test/$examSlug",
                    params: { examSlug: "ssc" },
                  })
                }
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                data-ocid="live.ssc.button"
              >
                🔴 SSC Live Test
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: "/live-test/$examSlug",
                    params: { examSlug: "railway" },
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                data-ocid="live.railway.button"
              >
                🔵 Railway Live Test
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: "/mock-test/$examSlug",
                    params: { examSlug: "banking" },
                  })
                }
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                data-ocid="live.banking.button"
              >
                🔵 Banking Mock
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: "/mock-test/$examSlug",
                    params: { examSlug: "delhi-police" },
                  })
                }
                className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                data-ocid="live.delhi.button"
              >
                🔴 Delhi Police Mock
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/learning" })}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                data-ocid="live.pro_typing.button"
              >
                📚 Pro Typing
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: "/mock-test/$examSlug",
                    params: { examSlug: "state" },
                  })
                }
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                data-ocid="live.state.button"
              >
                🟢 State Mock
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Menu */}
      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-400" />
            <h2 className="text-base font-bold text-gray-900 whitespace-nowrap">
              🚀 Quick Access Menu
            </h2>
            <div className="flex-1 h-px bg-gray-400" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {QUICK_MENU.map((item, i) => (
              <button
                key={item.path}
                type="button"
                onClick={() => router.navigate({ to: item.path })}
                className={`${item.bg} hover:opacity-90 text-white rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all shadow hover:shadow-md hover:-translate-y-0.5`}
                data-ocid={`quick.menu.${i + 1}`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[10px] font-semibold text-center leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Cards Section */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-400" />
            <h2 className="text-base font-bold text-gray-900 whitespace-nowrap">
              🖥️ Typing Exam &amp; MCQ Test — Select Your Exam
            </h2>
            <div className="flex-1 h-px bg-gray-400" />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mb-5">
            <Badge className="bg-blue-600 text-white hover:bg-blue-600 border border-blue-700">
              Typing
            </Badge>
            <span className="text-sm text-gray-900 font-medium">
              — Typing Speed Test
            </span>
            <span className="mx-2 text-gray-500">|</span>
            <Badge className="bg-gray-900 text-white hover:bg-gray-900 border border-gray-700">
              MCQ
            </Badge>
            <span className="text-sm text-gray-900 font-medium">
              — MCQ / Objective Test
            </span>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {EXAM_CARDS.map((card, i) => (
              <div
                key={card.name}
                className="bg-white rounded-xl shadow p-3 flex flex-col items-center gap-2"
                data-ocid={`exam.item.${i + 1}`}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: card.color }}
                >
                  {card.emoji}
                </div>
                <span className="text-xs font-semibold text-gray-900 text-center leading-tight">
                  {card.name}
                </span>
                <div className="grid grid-cols-2 gap-1 w-full">
                  <button
                    type="button"
                    onClick={() => handleTypingNav(card.name)}
                    className="text-xs bg-red-600 text-white px-1 py-1 rounded hover:bg-red-700 transition-colors font-medium"
                    data-ocid={`exam.typing.button.${i + 1}`}
                  >
                    Typing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMCQ(card.name)}
                    className="text-xs bg-gray-900 text-white px-1 py-1 rounded hover:bg-gray-800 transition-colors font-medium"
                    data-ocid={`exam.mcq.button.${i + 1}`}
                  >
                    MCQ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
