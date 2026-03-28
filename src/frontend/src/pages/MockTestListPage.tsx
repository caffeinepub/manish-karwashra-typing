import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Clock, HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import { EXAM_CONFIGS } from "../data/examConfig";

const ORDERED_EXAMS = [
  "ssc-cgl",
  "ssc-chsl",
  "ssc-mts",
  "delhi-police-hcm",
  "railway-ntpc",
  "ntpc-graduate",
  "ntpc-undergraduate",
  "dsssb",
  "hssc",
  "banking",
  "pcs",
  "ctet",
];

const EXAM_HEADER_COLORS: Record<string, string> = {
  "ssc-cgl": "from-blue-700 to-blue-500",
  "ssc-chsl": "from-blue-600 to-blue-400",
  "ssc-mts": "from-blue-500 to-blue-300",
  "delhi-police-hcm": "from-indigo-700 to-indigo-500",
  "railway-ntpc": "from-orange-600 to-orange-400",
  "ntpc-graduate": "from-orange-800 to-orange-600",
  "ntpc-undergraduate": "from-red-700 to-red-500",
  dsssb: "from-teal-700 to-teal-500",
  hssc: "from-green-700 to-green-500",
  banking: "from-slate-800 to-slate-600",
  pcs: "from-emerald-700 to-emerald-500",
  ctet: "from-purple-700 to-purple-500",
};

const BUTTON_BG: Record<string, string> = {
  "ssc-cgl": "#1d4ed8",
  "ssc-chsl": "#2563eb",
  "ssc-mts": "#3b82f6",
  "delhi-police-hcm": "#4f46e5",
  "railway-ntpc": "#f97316",
  "ntpc-graduate": "#ea580c",
  "ntpc-undergraduate": "#dc2626",
  dsssb: "#0d9488",
  hssc: "#16a34a",
  banking: "#334155",
  pcs: "#059669",
  ctet: "#9333ea",
};

// Fallback config for exams not in EXAM_CONFIGS
const FALLBACK_CONFIGS: Record<
  string,
  {
    name: string;
    nameHi: string;
    fullName: string;
    totalQuestions: number;
    duration: number;
    sections: number;
    badge: string;
  }
> = {
  "ssc-mts": {
    name: "SSC MTS",
    nameHi: "एसएससी एमटीएस",
    fullName: "SSC Multi-Tasking Staff",
    totalQuestions: 100,
    duration: 90,
    sections: 2,
    badge: "SSC",
  },
  "delhi-police-hcm": {
    name: "Delhi Police HCM",
    nameHi: "दिल्ली पुलिस",
    fullName: "Delhi Police Head Constable Ministerial",
    totalQuestions: 100,
    duration: 90,
    sections: 4,
    badge: "POLICE",
  },
  "ntpc-graduate": {
    name: "NTPC Graduate",
    nameHi: "एनटीपीसी ग्रेजुएट",
    fullName: "RRB NTPC Graduate Level CBT-1",
    totalQuestions: 100,
    duration: 90,
    sections: 3,
    badge: "RAILWAY",
  },
  "ntpc-undergraduate": {
    name: "NTPC UG Level",
    nameHi: "एनटीपीसी अंडर ग्रेजुएट",
    fullName: "RRB NTPC Under Graduate Level CBT-1",
    totalQuestions: 100,
    duration: 90,
    sections: 3,
    badge: "RAILWAY",
  },
  pcs: {
    name: "PCS",
    nameHi: "पीसीएस",
    fullName: "Provincial Civil Services Prelims",
    totalQuestions: 150,
    duration: 120,
    sections: 2,
    badge: "STATE",
  },
  ctet: {
    name: "CTET",
    nameHi: "सीटेट",
    fullName: "Central Teacher Eligibility Test",
    totalQuestions: 150,
    duration: 150,
    sections: 5,
    badge: "NTA",
  },
};

export default function MockTestListPage() {
  const navigate = useNavigate();
  const [searchNums, setSearchNums] = useState<Record<string, string>>({});
  const [hartronSearch, setHartronSearch] = useState("");

  const handleMockClick = (examSlug: string, mockNum: number) => {
    navigate({ to: `/mock-test/${examSlug}/${mockNum}` });
  };

  const getFilteredMocks = (examSlug: string): number[] => {
    const search = searchNums[examSlug]?.trim();
    if (!search) return Array.from({ length: 100 }, (_, i) => i + 1);
    const num = Number.parseInt(search);
    if (!Number.isNaN(num) && num >= 1 && num <= 100) {
      return [num];
    }
    return Array.from({ length: 100 }, (_, i) => i + 1).filter((n) =>
      n.toString().includes(search),
    );
  };

  const getHartronFilteredMocks = (): number[] => {
    const search = hartronSearch.trim();
    if (!search) return Array.from({ length: 43 }, (_, i) => i + 1);
    const num = Number.parseInt(search);
    if (!Number.isNaN(num) && num >= 1 && num <= 43) return [num];
    return Array.from({ length: 43 }, (_, i) => i + 1).filter((n) =>
      n.toString().includes(search),
    );
  };

  const hartronMocks = getHartronFilteredMocks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0d1b4b] to-[#1a3a8f] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">📋 Mock Tests</h1>
          <p className="text-blue-200 text-sm md:text-base">
            Har exam ke 100+ practice mock tests — numbered aur ready
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ✅ 13 Exams
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ✅ 100 Mocks each
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ✅ Hartron: 43 Mocks (1287 Qs)
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ✅ NTPC Graduate & UG Level
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* ── Hartron Special Card ── */}
        <Card className="overflow-hidden shadow-lg border-0 ring-2 ring-cyan-400/40">
          <CardHeader className="bg-gradient-to-r from-cyan-700 to-teal-600 text-white py-4 px-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    HARTRON
                  </Badge>
                  <Badge className="bg-cyan-400/30 text-cyan-100 border-cyan-300/30 text-xs">
                    NEW ✨
                  </Badge>
                </div>
                <h2 className="text-xl font-bold">Hartron CBT</h2>
                <p className="text-cyan-100 text-sm">
                  हार्ट्रॉन — Haryana State Electronics Development Corporation
                </p>
              </div>
              <div className="flex gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>30 Qs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>15 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>1287 Q Bank</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="bg-white/15 px-2.5 py-1 rounded-full">
                General: 15/30 to Pass
              </span>
              <span className="bg-white/15 px-2.5 py-1 rounded-full">
                SC/ST/OBC/EWS: 14/30 to Pass
              </span>
              <span className="bg-white/15 px-2.5 py-1 rounded-full">
                No Negative Marking
              </span>
              <span className="bg-white/15 px-2.5 py-1 rounded-full">
                43 Unique Mocks
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Input
                placeholder="Mock नंबर खोजें (1-43)"
                className="max-w-xs h-8 text-sm"
                value={hartronSearch}
                onChange={(e) => setHartronSearch(e.target.value)}
                data-ocid="hartron.search_input"
              />
              {hartronSearch && (
                <button
                  type="button"
                  className="text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => setHartronSearch("")}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hartronMocks.map((n) => (
                <Button
                  key={n}
                  size="sm"
                  style={{
                    backgroundColor: "#0891b2",
                    color: "white",
                    minWidth: "60px",
                  }}
                  className="h-7 px-2.5 text-xs font-medium"
                  onClick={() => navigate({ to: `/hartron-mock/${n}` })}
                  data-ocid={`hartron.mock.item.${n}`}
                >
                  Mock {n}
                </Button>
              ))}
              {hartronMocks.length === 0 && (
                <p className="text-sm text-gray-400 italic">
                  No matching mock found
                </p>
              )}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              {hartronMocks.length === 43
                ? "43 mock tests available — 1287 questions in bank"
                : `${hartronMocks.length} result${hartronMocks.length !== 1 ? "s" : ""} found`}
            </p>
          </CardContent>
        </Card>

        {/* ── Other Exam Cards ── */}
        {ORDERED_EXAMS.map((slug) => {
          const cfg = EXAM_CONFIGS[slug];
          const fb = FALLBACK_CONFIGS[slug];
          const name = cfg?.name ?? fb?.name ?? slug.toUpperCase();
          const nameHi = cfg?.nameHi ?? fb?.nameHi ?? name;
          const fullName = cfg?.fullName ?? fb?.fullName ?? name;
          const totalQ = cfg?.totalQuestions ?? fb?.totalQuestions ?? 100;
          const duration = cfg?.duration ?? fb?.duration ?? 60;
          const sections =
            cfg?.sections?.length ??
            (typeof fb?.sections === "number" ? fb.sections : 0);
          const badge = cfg?.badge ?? fb?.badge ?? "EXAM";
          const headerGradient =
            EXAM_HEADER_COLORS[slug] ?? "from-gray-700 to-gray-500";
          const btnBg = BUTTON_BG[slug] ?? "#4b5563";
          const mocks = getFilteredMocks(slug);
          const isNew =
            slug === "ntpc-graduate" || slug === "ntpc-undergraduate";

          return (
            <Card key={slug} className="overflow-hidden shadow-md border-0">
              <CardHeader
                className={`bg-gradient-to-r ${headerGradient} text-white py-4 px-5`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        {badge}
                      </Badge>
                      {isNew && (
                        <Badge className="bg-yellow-400/30 text-yellow-100 border-yellow-300/30 text-xs">
                          NEW ✨
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{name}</h2>
                    <p className="text-white/80 text-sm">
                      {nameHi} — {fullName}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" />
                      <span>{totalQ} Qs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{sections} Sections</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <Input
                    placeholder="Mock नंबर खोजें (1-100)"
                    className="max-w-xs h-8 text-sm"
                    value={searchNums[slug] ?? ""}
                    onChange={(e) =>
                      setSearchNums((prev) => ({
                        ...prev,
                        [slug]: e.target.value,
                      }))
                    }
                    data-ocid="mock.search_input"
                  />
                  {searchNums[slug] && (
                    <button
                      type="button"
                      className="text-xs text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setSearchNums((prev) => ({ ...prev, [slug]: "" }))
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mocks.map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      style={{
                        backgroundColor: btnBg,
                        color: "white",
                        minWidth: "60px",
                      }}
                      className="h-7 px-2.5 text-xs font-medium"
                      onClick={() => handleMockClick(slug, n)}
                      data-ocid={`mock.item.${n}`}
                    >
                      Mock {n}
                    </Button>
                  ))}
                  {mocks.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      No matching mock found
                    </p>
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  {mocks.length === 100
                    ? "100 mock tests available"
                    : `${mocks.length} result${mocks.length !== 1 ? "s" : ""} found`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
