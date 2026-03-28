import { useRouter } from "@tanstack/react-router";

const EXAMS = [
  {
    id: "ssc",
    name: "SSC Typing Test",
    emoji: "📝",
    color: "#e65100",
    wpm: "35 WPM (Hindi) / 35 WPM (English)",
    duration: "10 minutes",
    language: "Hindi / English",
    desc: "SSC CGL, CHSL, MTS ke liye typing test. Official SSC portal style.",
  },
  {
    id: "dsssb",
    name: "DSSSB Typing Test",
    emoji: "🏛️",
    color: "#424242",
    wpm: "35 WPM",
    duration: "10 minutes",
    language: "Hindi / English",
    desc: "Delhi Subordinate Services Selection Board ka official typing test.",
  },
  {
    id: "delhi-police",
    name: "Delhi Police Typing",
    emoji: "🚔",
    color: "#c62828",
    wpm: "35 WPM (English)",
    duration: "10 minutes",
    language: "English",
    desc: "Delhi Police Head Constable Ministerial ke liye typing test.",
  },
  {
    id: "court",
    name: "Court Typing Test",
    emoji: "⚖️",
    color: "#004d40",
    wpm: "30 WPM",
    duration: "15 minutes",
    language: "Hindi / English",
    desc: "District Court, High Court clerk posts ke liye typing test.",
  },
  {
    id: "banking",
    name: "Banking Typing",
    emoji: "🏦",
    color: "#0d47a1",
    wpm: "35 WPM",
    duration: "10 minutes",
    language: "English",
    desc: "IBPS, SBI, RBI bank clerk aur PO posts ke liye typing test.",
  },
  {
    id: "railway-ntpc",
    name: "Railway Typing",
    emoji: "🚂",
    color: "#1a237e",
    wpm: "35 WPM",
    duration: "10 minutes",
    language: "Hindi / English",
    desc: "RRB NTPC, Railway clerk posts ke liye typing test. TCS iON style.",
  },
  {
    id: "state",
    name: "State Exam Typing",
    emoji: "🏢",
    color: "#1b5e20",
    wpm: "25-35 WPM",
    duration: "10-15 minutes",
    language: "Hindi / English",
    desc: "HSSC, UPPSC, BPSC, RSMSSB jaise state exams ke liye typing.",
  },
  {
    id: "custom",
    name: "Custom Exam",
    emoji: "⚙️",
    color: "#6a1b9a",
    wpm: "Apna target set karein",
    duration: "Apni duration set karein",
    language: "Hindi / English",
    desc: "Apne custom settings ke saath exam practice karein.",
  },
];

export default function ExamModePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b] mb-2">
          🏛️ Exam Typing Mode
        </h1>
        <p className="text-gray-600 mb-6">
          Real exam pattern ke hisaab se typing practice karein
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              data-ocid={`exam.card.${exam.id}`}
            >
              <div
                className="h-3 w-full"
                style={{ backgroundColor: exam.color }}
              />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: exam.color }}
                  >
                    {exam.emoji}
                  </div>
                  <h3 className="font-bold text-gray-900">{exam.name}</h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">{exam.desc}</p>

                <div className="space-y-1 mb-4 text-xs text-gray-500">
                  <div>
                    ⚡ Speed:{" "}
                    <span className="font-semibold text-gray-700">
                      {exam.wpm}
                    </span>
                  </div>
                  <div>
                    ⏱ Duration:{" "}
                    <span className="font-semibold text-gray-700">
                      {exam.duration}
                    </span>
                  </div>
                  <div>
                    🌐 Language:{" "}
                    <span className="font-semibold text-gray-700">
                      {exam.language}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      router.navigate({
                        to: "/typing/$examCategory",
                        params: { examCategory: exam.id },
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-medium transition-colors"
                    data-ocid={`exam.typing.${exam.id}`}
                  >
                    ⌨️ Typing Test
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      router.navigate({
                        to: "/mcq/$examCategory",
                        params: { examCategory: exam.id },
                      })
                    }
                    className="bg-gray-800 hover:bg-gray-900 text-white text-sm py-2 rounded-lg font-medium transition-colors"
                    data-ocid={`exam.mcq.${exam.id}`}
                  >
                    📝 MCQ Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
