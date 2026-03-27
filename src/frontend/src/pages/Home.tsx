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
      <section
        className="py-6 px-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(26,35,126,0.08) 0%, rgba(13,71,161,0.08) 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-2xl border border-white/20 shadow-xl p-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h2 className="text-center text-white font-bold text-xl mb-5">
              🖥️ Live Test / Live Mock
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => router.navigate({ to: "/live-test" })}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-4 font-bold text-base w-full transition-colors"
                data-ocid="feature.button"
              >
                🔴 Live Test
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: "/typing/$examCategory",
                    params: { examCategory: "all-exam" },
                  })
                }
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg py-4 font-bold text-base w-full transition-colors"
                data-ocid="feature.button"
              >
                🖥️ Typing Practice
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/live-test" })}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-4 font-bold text-base w-full transition-colors"
                data-ocid="feature.button"
              >
                🔴 Live Test
              </button>
              <button
                type="button"
                onClick={() =>
                  router.navigate({
                    to: "/typing/$examCategory",
                    params: { examCategory: "all-exam" },
                  })
                }
                className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg py-4 font-bold text-base w-full transition-colors"
                data-ocid="feature.button"
              >
                🖥️ Typing Practice
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/mock-test" })}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-4 font-bold text-base w-full transition-colors"
                data-ocid="feature.button"
              >
                📋 Mock Test
              </button>
              <button
                type="button"
                onClick={() => router.navigate({ to: "/learning" })}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-4 font-bold text-base w-full transition-colors"
                data-ocid="feature.button"
              >
                🎓 Learning Typing
              </button>
            </div>
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
                    onClick={() => handleTyping(card.name)}
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
