import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type ExamResult, getExamResults } from "../utils/results";

const SECTIONS = [
  "Performance Dashboard",
  "WPM Graph",
  "Accuracy Graph",
  "Typing History",
  "Mistake Analysis",
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export default function ProgressPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const results = getExamResults();

  const typingResults = results.filter((r) => r.examType === "typing" && r.wpm);
  const mcqResults = results.filter((r) => r.examType === "mcq");

  const avgWpm = typingResults.length
    ? Math.round(
        typingResults.reduce((s, r) => s + (r.wpm || 0), 0) /
          typingResults.length,
      )
    : 0;
  const bestWpm = typingResults.length
    ? Math.max(...typingResults.map((r) => r.wpm || 0))
    : 0;
  const avgAccuracy = typingResults.length
    ? Math.round(
        typingResults.reduce((s, r) => s + (r.accuracy || 0), 0) /
          typingResults.length,
      )
    : 0;
  const passRate = results.length
    ? Math.round(
        (results.filter((r) => r.passed).length / results.length) * 100,
      )
    : 0;

  const wpmChartData = typingResults
    .slice(0, 20)
    .reverse()
    .map((r, i) => ({
      name: formatDate(r.date),
      WPM: r.wpm,
      index: i + 1,
    }));

  const accuracyChartData = typingResults
    .slice(0, 20)
    .reverse()
    .map((r, i) => ({
      name: formatDate(r.date),
      Accuracy: r.accuracy,
      index: i + 1,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="flex">
        {/* Sub Nav */}
        <div className="w-56 bg-white border-r border-gray-200 min-h-screen pt-4">
          <div className="px-4 mb-3">
            <h2 className="font-bold text-[#0d1b4b] text-sm uppercase tracking-wider">
              📊 Progress
            </h2>
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSection(s)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                activeSection === s
                  ? "bg-teal-50 text-teal-700 font-semibold border-r-2 border-teal-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              data-ocid={`progress.${s.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeSection === "Performance Dashboard" && (
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">
                📊 Performance Dashboard
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Tests",
                    value: results.length,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Best WPM",
                    value: bestWpm,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    label: "Avg WPM",
                    value: avgWpm,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "Avg Accuracy",
                    value: `${avgAccuracy}%`,
                    color: "text-orange-600",
                    bg: "bg-orange-50",
                  },
                  {
                    label: "Typing Tests",
                    value: typingResults.length,
                    color: "text-teal-600",
                    bg: "bg-teal-50",
                  },
                  {
                    label: "MCQ Tests",
                    value: mcqResults.length,
                    color: "text-indigo-600",
                    bg: "bg-indigo-50",
                  },
                  {
                    label: "Pass Rate",
                    value: `${passRate}%`,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "Total Passed",
                    value: results.filter((r) => r.passed).length,
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.bg} rounded-xl p-4 text-center`}
                  >
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              {results.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-3">📊</div>
                  <p>
                    Abhi koi data nahi. Typing tests lein statistics dekhne ke
                    liye.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSection === "WPM Graph" && (
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">
                📈 WPM Progress Graph
              </h1>
              {wpmChartData.length > 0 ? (
                <div className="bg-white rounded-2xl shadow p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={wpmChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="WPM"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-3">📉</div>
                  <p>WPM data nahi hai. Typing tests lein.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "Accuracy Graph" && (
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">
                🎯 Accuracy Progress Graph
              </h1>
              {accuracyChartData.length > 0 ? (
                <div className="bg-white rounded-2xl shadow p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={accuracyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="Accuracy"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-3">🎯</div>
                  <p>Accuracy data nahi hai. Typing tests lein.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "Typing History" && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">
                📜 Typing History
              </h1>
              {results.length > 0 ? (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0d1b4b] text-white">
                      <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Exam</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-center">WPM/Score</th>
                        <th className="p-3 text-center">Accuracy</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 50).map((r: ExamResult, i: number) => (
                        <tr
                          key={r.id}
                          className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="p-3 text-gray-500">{i + 1}</td>
                          <td className="p-3 font-medium">{r.examName}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                r.examType === "typing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-900 text-white"
                              }`}
                            >
                              {r.examType.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold">
                            {r.wpm ?? `${r.score}%`}
                          </td>
                          <td className="p-3 text-center">
                            {r.accuracy ? `${r.accuracy}%` : "-"}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                r.passed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {r.passed ? "Pass" : "Fail"}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 text-xs">
                            {formatDate(r.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-3">📜</div>
                  <p>Koi history nahi. Tests lein.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "Mistake Analysis" && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-[#0d1b4b] mb-6">
                ❌ Mistake Analysis
              </h1>
              <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    💡 Common Mistake Areas
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Numbers aur symbols row - sabse zyada mistakes</li>
                    <li>• Capital letters - Shift timing off hoti hai</li>
                    <li>• Right hand pinky (P, ;, ', /) - weak area</li>
                    <li>• Long words mein middle letters miss hoti hain</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <h3 className="font-semibold text-red-800 mb-2">
                    🔍 Weak Keys (Estimated)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Q", "X", "Z", "P", ";", "'", "@", "#", "$", "%"].map(
                      (k) => (
                        <span
                          key={k}
                          className="bg-red-200 text-red-800 font-mono font-bold px-3 py-1 rounded-lg text-sm"
                        >
                          {k}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ Strong Keys
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["A", "S", "D", "F", "J", "K", "E", "I", "T", "N"].map(
                      (k) => (
                        <span
                          key={k}
                          className="bg-green-200 text-green-800 font-mono font-bold px-3 py-1 rounded-lg text-sm"
                        >
                          {k}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
