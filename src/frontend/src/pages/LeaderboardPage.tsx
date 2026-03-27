import { useState } from "react";

const MOCK_LEADERS = [
  { rank: 1, name: "Manish K.", wpm: 82, accuracy: 97, exam: "SSC CGL" },
  { rank: 2, name: "Rahul S.", wpm: 76, accuracy: 95, exam: "Railway NTPC" },
  { rank: 3, name: "Priya D.", wpm: 71, accuracy: 98, exam: "Banking" },
  { rank: 4, name: "Amit R.", wpm: 68, accuracy: 92, exam: "Delhi Police" },
  { rank: 5, name: "Kavita M.", wpm: 65, accuracy: 94, exam: "DSSSB" },
  { rank: 6, name: "Suresh P.", wpm: 62, accuracy: 91, exam: "SSC CHSL" },
  { rank: 7, name: "Deepak V.", wpm: 59, accuracy: 89, exam: "State Level" },
  { rank: 8, name: "Neha G.", wpm: 56, accuracy: 93, exam: "CTET" },
  { rank: 9, name: "Arun J.", wpm: 54, accuracy: 87, exam: "Railway NTPC" },
  { rank: 10, name: "Sita L.", wpm: 51, accuracy: 90, exam: "Banking" },
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("All Exams");
  const exams = [
    "All Exams",
    "SSC CGL",
    "Railway NTPC",
    "Banking",
    "Delhi Police",
    "DSSSB",
  ];

  const filtered =
    filter === "All Exams"
      ? MOCK_LEADERS
      : MOCK_LEADERS.filter((l) => l.exam === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b] mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600 mb-6">Top typists ka ranking dekhein</p>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {exams.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setFilter(e)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === e
                  ? "bg-[#0d1b4b] text-white border-[#0d1b4b]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
              data-ocid={`leaderboard.filter.${e}`}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* Header */}
          <div className="bg-[#0d1b4b] text-white grid grid-cols-5 p-3 text-sm font-semibold">
            <div>Rank</div>
            <div className="col-span-2">Name</div>
            <div className="text-center">WPM</div>
            <div className="text-center">Accuracy</div>
          </div>
          {filtered.map((leader, i) => (
            <div
              key={leader.rank}
              className={`grid grid-cols-5 p-3 items-center border-b border-gray-100 text-sm ${
                i === 0
                  ? "bg-yellow-50"
                  : i === 1
                    ? "bg-gray-50"
                    : i === 2
                      ? "bg-orange-50"
                      : ""
              }`}
              data-ocid={`leaderboard.row.${i + 1}`}
            >
              <div className="font-bold text-lg">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : leader.rank}
              </div>
              <div className="col-span-2">
                <div className="font-semibold text-gray-900">{leader.name}</div>
                <div className="text-xs text-gray-500">{leader.exam}</div>
              </div>
              <div className="text-center font-bold text-blue-600">
                {leader.wpm}
              </div>
              <div className="text-center font-bold text-green-600">
                {leader.accuracy}%
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          * Leaderboard demo data hai. Real-time rankings aa rahi hain jald hi.
        </p>
      </div>
    </div>
  );
}
