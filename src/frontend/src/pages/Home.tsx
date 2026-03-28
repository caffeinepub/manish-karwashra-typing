import { Badge } from "@/components/ui/badge";
import { useRouter } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  LayoutGrid,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";

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

const RECENT_ACTIVITY = [
  {
    initials: "BT",
    name: "Bailwasi Typing Tests",
    time: "2 months ago",
    color: "bg-blue-500",
  },
  {
    initials: "ST",
    name: "Start Typing Test",
    time: "3 months ago",
    color: "bg-green-500",
  },
  {
    initials: "MK",
    name: "Manish Karwashra Tests",
    time: "5 months ago",
    color: "bg-orange-500",
  },
];

const LEADERBOARD_ITEMS = [
  { icon: "📝", label: "Mock Tests", user: "Sukhdev", live: true },
  { icon: "🔴", label: "Live Tests", user: "Sukhdev", live: true },
  { icon: "📚", label: "Practice Tests", user: "Rajesh K.", live: false },
];

const NEWS_ITEMS = [
  {
    initials: "KT",
    title: "Karwashra Typing New SSC Mock Added",
    time: "1 hour ago",
    color: "bg-blue-600",
  },
  {
    initials: "GE",
    title: "Govt Exam Pattern 2026 Updated",
    time: "3 hours ago",
    color: "bg-red-600",
  },
  {
    initials: "HP",
    title: "HSSC New Recruitment Notification",
    time: "1 day ago",
    color: "bg-green-600",
  },
  {
    initials: "RT",
    title: "Railway NTPC Typing Speed Tips",
    time: "2 days ago",
    color: "bg-orange-600",
  },
];

const PAGE_LIST = [
  { icon: "📋", title: "Full Mock Library", desc: "100+ mocks per exam" },
  { icon: "🎯", title: "Learning Paths", desc: "Beginner to advanced" },
  { icon: "📊", title: "Performance Analytics", desc: "Track your progress" },
  { icon: "📅", title: "Live Event Calendar", desc: "Upcoming mock events" },
];

export default function Home() {
  const [activeLang, setActiveLang] = useState("All Language");
  const [activeTab, setActiveTab] = useState("Practice");
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

  const TAB_ROUTES: Record<string, string> = {
    Practice: "/practice",
    Learning: "/learning",
    Live: "/live-test",
    Results: "/results",
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to bottom, #e8f0fe, #dce8f8)" }}
    >
      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Brand */}
          <div className="flex-shrink-0">
            <div className="text-sm font-bold text-gray-900 leading-tight">
              Manish Karwashra Typing
            </div>
            <div className="text-[10px] text-gray-500">
              Govt Exam Typing Platform
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1 ml-4 flex-1">
            {["Practice", "Learning", "Live", "Results"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  router.navigate({ to: TAB_ROUTES[tab] });
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-700 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                data-ocid={`nav.${tab.toLowerCase()}.tab`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right: Bell + User */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              data-ocid="nav.bell.button"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Sukhdev
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Language Bar ── */}
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

      {/* ── Main Layout: Content + Right Sidebar ── */}
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* 3 Feature Cards */}
          <section className="py-5 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => router.navigate({ to: "/mock-list" })}
                data-ocid="home.mock_test.button"
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 text-left w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-2xl flex-shrink-0">
                  📝
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">
                    Mock Tests
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    100+ numbered mocks per exam. Real exam pattern MCQ &
                    Typing.
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/learning" })}
                data-ocid="home.learning.button"
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 text-left w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">
                    Learning
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Structured lessons, keyboard practice, finger placement
                    guide.
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/live-test" })}
                data-ocid="home.live_test.button"
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 text-left w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                  <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">
                    Live Tests
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Live sessions with random candidate ID. No login required.
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Welcome Banner */}
          <section className="py-2 px-4">
            <div
              className="rounded-xl shadow-lg border border-gray-300 py-8 px-6 text-center"
              style={{
                background:
                  "linear-gradient(135deg, #c8c8c8 0%, #e8e8e8 40%, #f5f5f5 60%, #d0d0d0 100%)",
              }}
            >
              <h1 className="text-3xl md:text-4xl font-bold italic text-orange-600 mb-2">
                Welcome to Karwashra Typing
              </h1>
              <p className="text-gray-600">
                Speed up your typing &amp; Crack all Govt. &amp; State Exams!
              </p>
            </div>
          </section>

          {/* Two-column row: Quick Menu + Live Section */}
          <section className="py-4 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Quick Access Menu */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-gray-300" />
                  <h2 className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    🚀 Quick Access Menu
                  </h2>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                  {QUICK_MENU.map((item, i) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => router.navigate({ to: item.path })}
                      className={`${item.bg} hover:opacity-90 text-white rounded-xl p-2.5 flex flex-col items-center gap-1 transition-all shadow hover:shadow-md hover:-translate-y-0.5`}
                      data-ocid={`quick.menu.${i + 1}`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-[10px] font-semibold text-center leading-tight">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Test Section */}
              <div className="lg:col-span-2">
                <div
                  className="rounded-xl border border-gray-700 p-4 h-full"
                  style={{ background: "rgba(10, 15, 40, 0.88)" }}
                >
                  <h2 className="text-white text-base font-bold mb-3 text-center tracking-wide">
                    🔴 Live Test / Live Mock
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        router.navigate({
                          to: "/live-test/$examSlug",
                          params: { examSlug: "ssc" },
                        })
                      }
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-2 rounded-lg text-xs"
                      data-ocid="live.ssc.button"
                    >
                      🔴 SSC Live
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        router.navigate({
                          to: "/live-test/$examSlug",
                          params: { examSlug: "railway" },
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-lg text-xs"
                      data-ocid="live.railway.button"
                    >
                      🔵 Railway Live
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        router.navigate({
                          to: "/mock-test/$examSlug",
                          params: { examSlug: "banking" },
                        })
                      }
                      className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-2 rounded-lg text-xs"
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
                      className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-2 rounded-lg text-xs"
                      data-ocid="live.delhi.button"
                    >
                      🔴 Delhi Police
                    </button>
                    <button
                      type="button"
                      onClick={() => router.navigate({ to: "/learning" })}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-2 rounded-lg text-xs"
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
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-2 rounded-lg text-xs"
                      data-ocid="live.state.button"
                    >
                      🟢 State Mock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Exam Cards Section */}
          <section className="py-4 px-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 h-px bg-gray-400" />
              <h2 className="text-sm font-bold text-gray-900 whitespace-nowrap">
                🖥️ Typing Exam &amp; MCQ Test — Select Your Exam
              </h2>
              <div className="flex-1 h-px bg-gray-400" />
            </div>
            <div className="flex items-center gap-3 mb-4">
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
                      className="text-xs bg-red-600 text-white px-1 py-1 rounded hover:bg-red-700 font-medium"
                      data-ocid={`exam.typing.button.${i + 1}`}
                    >
                      Typing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMCQ(card.name)}
                      className="text-xs bg-gray-900 text-white px-1 py-1 rounded hover:bg-gray-800 font-medium"
                      data-ocid={`exam.mcq.button.${i + 1}`}
                    >
                      MCQ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex-1" />
          <Footer />
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="w-64 flex-shrink-0 hidden xl:flex flex-col gap-4 px-3 py-4 border-l border-gray-200 bg-white/60 sticky top-[52px] self-start max-h-[calc(100vh-52px)] overflow-y-auto">
          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Recent Activity
              </h3>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                data-ocid="sidebar.activity.link"
              >
                View all
              </button>
            </div>
            <div className="space-y-2.5">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Leaderboard */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Top Leaderboard
              </h3>
              <span className="flex items-center gap-1 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-2">
              {LEADERBOARD_ITEMS.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-2"
                  data-ocid={`sidebar.leaderboard.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {item.user}
                      </div>
                    </div>
                  </div>
                  {item.live && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* News & Updates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                News &amp; Updates
              </h3>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                data-ocid="sidebar.news.link"
              >
                View all
              </button>
            </div>
            <div className="space-y-2.5">
              {NEWS_ITEMS.map((item) => (
                <div key={item.title} className="flex items-start gap-2">
                  <div
                    className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5`}
                  >
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-gray-800 leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Page List */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Page List
            </h3>
            <div className="space-y-1.5">
              {PAGE_LIST.map((page, i) => (
                <div
                  key={page.title}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-2 hover:bg-blue-50 cursor-pointer transition-colors group"
                  data-ocid={`sidebar.page.item.${i + 1}`}
                >
                  <span className="text-base">{page.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-gray-700 group-hover:text-blue-700">
                      {page.title}
                    </div>
                    <div className="text-[10px] text-gray-400">{page.desc}</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
