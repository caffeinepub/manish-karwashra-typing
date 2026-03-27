import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { getQuestionStats } from "../data/mcqQuestions";

const EXAMPLE_JSON = `[
  {
    "examCategory": "ssc",
    "questionText": "Hindi text here\\nEnglish question here?",
    "option1": "Option A",
    "option2": "Option B",
    "option3": "Option C",
    "option4": "Option D",
    "correctAnswer": 2
  }
]`;

export default function AdminPanel() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const stats = getQuestionStats();

  const adminCount = (() => {
    try {
      const s = localStorage.getItem("admin_mcq_questions");
      return s ? JSON.parse(s).length : 0;
    } catch {
      return 0;
    }
  })();

  const handleImport = () => {
    setError("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setError("JSON must be an array of questions.");
        return;
      }
      for (const q of parsed) {
        if (
          !q.questionText ||
          !q.option1 ||
          !q.option2 ||
          !q.option3 ||
          !q.option4 ||
          !q.correctAnswer
        ) {
          setError(
            "Each question must have: questionText, option1-4, correctAnswer",
          );
          return;
        }
      }
      // Assign IDs
      const withIds = parsed.map((q: object, i: number) => ({
        ...q,
        id: (90000 + i).toString(),
        correctAnswer: String((q as { correctAnswer: number }).correctAnswer),
        examCategory: (q as { examCategory?: string }).examCategory || "all",
        language: "Bilingual",
      }));

      const existing = (() => {
        try {
          return JSON.parse(
            localStorage.getItem("admin_mcq_questions") || "[]",
          );
        } catch {
          return [];
        }
      })();

      localStorage.setItem(
        "admin_mcq_questions",
        JSON.stringify([...existing, ...withIds]),
      );
      toast.success(`${withIds.length} questions imported successfully!`);
      setJsonInput("");
    } catch {
      setError("Invalid JSON. Please check your format.");
    }
  };

  const handleClear = () => {
    localStorage.removeItem("admin_mcq_questions");
    toast.success("All admin questions cleared.");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#1a237e] text-white rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold">
            ⚙️ Admin Panel - MCQ Question Manager
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Karwashra Typing | Exam Question Database
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(stats).map(([key, val]) => (
            <Card key={key} className="text-center">
              <CardContent className="pt-4 pb-3">
                <div className="text-2xl font-bold text-[#1a237e]">{val}</div>
                <div className="text-xs text-gray-500 mt-1">{key}</div>
              </CardContent>
            </Card>
          ))}
          <Card className="text-center border-orange-300 bg-orange-50">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-orange-600">
                {adminCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">Admin (Added)</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tags */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              Category Tags for Import
            </CardTitle>
            <CardDescription>
              Use these values in the <code>examCategory</code> field
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "ssc",
                "railway",
                "banking",
                "ctet",
                "computer",
                "haryana",
                "all",
              ].map((c) => (
                <Badge key={c} variant="outline" className="font-mono">
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Import */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bulk Import Questions (JSON)</CardTitle>
            <CardDescription>
              Paste a JSON array of questions below and click Import. Questions
              are saved in browser storage and appear in MCQ tests immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">
                Example format:
              </p>
              <pre className="bg-gray-100 rounded p-3 text-xs overflow-x-auto">
                {EXAMPLE_JSON}
              </pre>
            </div>
            <Textarea
              placeholder="Paste your JSON array here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={10}
              className="font-mono text-xs"
            />
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                className="bg-[#1a237e] hover:bg-blue-900 text-white"
                disabled={!jsonInput.trim()}
              >
                Import Questions
              </Button>
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={adminCount === 0}
              >
                Clear Admin Questions ({adminCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ℹ️ Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• Questions are saved in the browser's localStorage.</p>
            <p>
              • <code className="bg-gray-100 px-1 rounded">correctAnswer</code>:
              1=A, 2=B, 3=C, 4=D
            </p>
            <p>
              • For bilingual questions: Hindi text first, then newline, then
              English text in{" "}
              <code className="bg-gray-100 px-1 rounded">questionText</code>.
            </p>
            <p>
              • Use{" "}
              <code className="bg-gray-100 px-1 rounded">
                examCategory: "all"
              </code>{" "}
              to show question in every exam.
            </p>
            <p>
              • Each test now picks questions randomly, so every attempt gives
              fresh questions.
            </p>
            <p>
              • Total built-in question bank:{" "}
              <strong>{stats.Total}+ questions</strong>
            </p>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
