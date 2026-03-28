import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  CheckCircle,
  ClipboardList,
  Keyboard,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Certificate from "../components/Certificate";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  type ExamResult,
  clearExamResults,
  getExamResults,
} from "../utils/results";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return iso;
  }
}

function ResultCard({ result, index }: { result: ExamResult; index: number }) {
  const isTyping = result.examType === "typing";
  const [showCert, setShowCert] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col gap-3"
      data-ocid={`results.item.${index + 1}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              isTyping ? "bg-blue-100" : "bg-gray-900"
            }`}
          >
            {isTyping ? (
              <Keyboard className="w-4 h-4 text-blue-700" />
            ) : (
              <ClipboardList className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm leading-tight">
              {result.examName}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {formatDate(result.date)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Badge
            className={`text-xs ${
              isTyping
                ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"
                : "bg-gray-900 text-white border-gray-800 hover:bg-gray-900"
            }`}
          >
            {isTyping ? "Typing" : "MCQ"}
          </Badge>
          {result.passed ? (
            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Pass
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 text-xs">
              <XCircle className="w-3 h-3 mr-1" />
              Fail
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {isTyping ? (
          <>
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-blue-700">
                {result.wpm ?? "-"}
              </div>
              <div className="text-xs text-blue-500">WPM</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-green-700">
                {result.accuracy ?? "-"}%
              </div>
              <div className="text-xs text-green-500">Accuracy</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-orange-50 rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-orange-600">
                {result.score ?? "-"}%
              </div>
              <div className="text-xs text-orange-400">Score</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-gray-700">
                {result.correct ?? "-"}/{result.total ?? "-"}
              </div>
              <div className="text-xs text-gray-400">Correct</div>
            </div>
          </>
        )}
      </div>

      {result.passed && (
        <Button
          size="sm"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs"
          onClick={() => setShowCert(true)}
          data-ocid={`results.certificate.button.${index + 1}`}
        >
          <Award className="w-3 h-3 mr-1" />
          Download Certificate
        </Button>
      )}
      {!result.passed && (
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs border-amber-300 text-amber-600 hover:bg-amber-50"
          onClick={() => setShowCert(true)}
          data-ocid={`results.certificate.button.${index + 1}`}
        >
          <Award className="w-3 h-3 mr-1" />
          Download Certificate
        </Button>
      )}
      {showCert && (
        <Certificate
          type={result.examType === "typing" ? "typing" : "mcq"}
          candidateName="Student"
          examName={result.examName}
          wpm={result.wpm}
          accuracy={result.accuracy}
          score={result.score}
          totalQuestions={result.total}
          date={result.date}
          onClose={() => setShowCert(false)}
        />
      )}
    </div>
  );
}

export default function ResultsHistory() {
  const [filter, setFilter] = useState<"all" | "typing" | "mcq">("all");
  const [results, setResults] = useState<ExamResult[]>(() => getExamResults());

  const filtered = results.filter(
    (r) => filter === "all" || r.examType === filter,
  );

  const handleClear = () => {
    clearExamResults();
    setResults([]);
    toast.success("Saare results clear ho gaye!");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to bottom, #e8f0fe, #dce8f8)" }}
      data-ocid="results.page"
    >
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b]">
                📊 My Results
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sabhi exams ke score cards ek jagah — {results.length} total
                results
              </p>
            </div>
            {results.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    data-ocid="results.delete_button"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="results.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Saare Results Delete Karein?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Yeh action undo nahi ho sakta. Saare exam results
                      permanently delete ho jayenge.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="results.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClear}
                      className="bg-red-600 hover:bg-red-700"
                      data-ocid="results.confirm_button"
                    >
                      Haan, Delete Karein
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Filter Tabs */}
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as "all" | "typing" | "mcq")}
            className="mb-6"
          >
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="all" data-ocid="results.filter.tab">
                All ({results.length})
              </TabsTrigger>
              <TabsTrigger value="typing" data-ocid="results.filter.tab">
                🖥️ Typing (
                {results.filter((r) => r.examType === "typing").length})
              </TabsTrigger>
              <TabsTrigger value="mcq" data-ocid="results.filter.tab">
                📋 MCQ ({results.filter((r) => r.examType === "mcq").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Results Grid */}
          {filtered.length === 0 ? (
            <div
              className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow"
              data-ocid="results.empty_state"
            >
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-700">
                {filter === "all"
                  ? "Abhi tak koi result nahi"
                  : `Koi ${filter.toUpperCase()} result nahi`}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Exam dene ke baad yahan aapke scores dikhai denge
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((result, i) => (
                <ResultCard key={result.id} result={result} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
