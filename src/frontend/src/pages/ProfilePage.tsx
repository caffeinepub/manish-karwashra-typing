import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { getExamResults } from "../utils/results";

const ACHIEVEMENTS = [
  {
    emoji: "🌱",
    label: "First Test",
    desc: "Pehla typing test complete kiya",
    key: "firstTest",
  },
  {
    emoji: "🔥",
    label: "Speed Demon",
    desc: "50+ WPM achieve kiya",
    key: "speed50",
  },
  {
    emoji: "🎯",
    label: "Sharp Shooter",
    desc: "95%+ accuracy achieve ki",
    key: "accuracy95",
  },
  {
    emoji: "💪",
    label: "Marathon Typist",
    desc: "10 tests complete kiye",
    key: "tests10",
  },
  {
    emoji: "🏆",
    label: "Champion",
    desc: "SSC exam qualify kiya",
    key: "sscQualify",
  },
  {
    emoji: "📅",
    label: "Consistent",
    desc: "7 din streak maintain ki",
    key: "streak7",
  },
];

export default function ProfilePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const results = getExamResults();

  if (!auth.currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Login Required
          </h2>
          <p className="text-gray-500 mb-6">
            Profile dekhne ke liye pehle login karein.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold"
            data-ocid="profile.login_button"
          >
            Login Karein
          </button>
        </div>
      </div>
    );
  }

  const typingResults = results.filter((r) => r.examType === "typing" && r.wpm);
  const bestWpm = typingResults.length
    ? Math.max(...typingResults.map((r) => r.wpm || 0))
    : 0;
  const avgAccuracy = typingResults.length
    ? Math.round(
        typingResults.reduce((s, r) => s + (r.accuracy || 0), 0) /
          typingResults.length,
      )
    : 0;
  const certificates = results.filter((r) => r.passed).length;
  const displayName = auth.currentUser.name || auth.currentUser.username;

  const unlockedAchievements = new Set(
    [
      results.length >= 1 ? "firstTest" : null,
      bestWpm >= 50 ? "speed50" : null,
      avgAccuracy >= 95 ? "accuracy95" : null,
      results.length >= 10 ? "tests10" : null,
    ].filter(Boolean),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-4xl text-white font-bold flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {displayName}
              </h2>
              {auth.currentUser.email && (
                <p className="text-gray-500">{auth.currentUser.email}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                User ID: {auth.currentUser.id}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                auth.logout();
                navigate({ to: "/login" });
              }}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              data-ocid="profile.logout_button"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              label: "Avg Accuracy",
              value: `${avgAccuracy}%`,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: "Certificates",
              value: certificates,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Results</h3>
            <button
              type="button"
              onClick={() => navigate({ to: "/results" })}
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Koi result nahi. Tests lein!
            </p>
          ) : (
            <div className="space-y-2">
              {results.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {r.examName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.date).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">
                      {r.wpm ? `${r.wpm} WPM` : `${r.score}%`}
                    </div>
                    <span
                      className={`text-xs font-semibold ${r.passed ? "text-green-600" : "text-red-500"}`}
                    >
                      {r.passed ? "✅ Pass" : "❌ Fail"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-bold text-gray-800 mb-4">🏅 Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedAchievements.has(a.key);
              return (
                <div
                  key={a.key}
                  className={`p-4 rounded-xl border-2 text-center ${
                    unlocked
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-100 bg-gray-50 opacity-50"
                  }`}
                  data-ocid={`achievement.${a.key}`}
                >
                  <div className="text-3xl mb-1">{a.emoji}</div>
                  <div className="font-semibold text-sm text-gray-800">
                    {a.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{a.desc}</div>
                  {unlocked && (
                    <div className="text-xs text-yellow-600 font-bold mt-1">
                      ★ Unlocked!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
