import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { useState } from "react";

interface ExamInstructionsProps {
  examName: string;
  examType: "typing" | "mcq";
  onReady: () => void;
}

const hindiInstructions = [
  "परीक्षा शुरू होने से पहले सभी निर्देश ध्यान से पढ़ें।",
  "टाइपिंग टेस्ट में बैकस्पेस का उपयोग नियमों के अनुसार होगा।",
  "परीक्षा के दौरान किसी भी मोबाइल या इलेक्ट्रॉनिक उपकरण का उपयोग न करें।",
  "टाइमर शुरू होते ही टाइप करना शुरू करें।",
  "सभी प्रश्नों का उत्तर देने का प्रयास करें।",
  "परीक्षा समाप्त होने पर परिणाम स्वतः दिखाई देगा।",
  "किसी भी तकनीकी समस्या के लिए परीक्षा केंद्र से संपर्क करें।",
];

const englishInstructions = [
  "Read all instructions carefully before starting the exam.",
  "Backspace usage in typing test will be as per exam rules.",
  "Do not use any mobile or electronic device during the exam.",
  "Start typing as soon as the timer begins.",
  "Attempt all questions.",
  "Results will be displayed automatically after the exam ends.",
  "Contact the exam center for any technical issues.",
];

export default function ExamInstructions({
  examName,
  examType,
  onReady,
}: ExamInstructionsProps) {
  const [lang, setLang] = useState<"hindi" | "english">("hindi");
  const [keyboardType, setKeyboardType] = useState("remington");
  const [paperLang, setPaperLang] = useState("hindi");
  const [declared, setDeclared] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const instructions =
    lang === "hindi" ? hindiInstructions : englishInstructions;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* System Info Bar */}
      <div className="bg-[#0d1b4b] text-white text-xs px-4 py-1.5 flex flex-wrap gap-4 justify-between">
        <span>System Node No: C001</span>
        <span>Exam Date: {today}</span>
        <span>Session: Morning</span>
        <span>
          Time:{" "}
          {new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex-1 flex items-start justify-center py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-white rounded-xl border-2 border-[#DAA520] shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#DAA520] text-white px-6 py-4">
            <h1 className="text-lg font-bold text-center">{examName}</h1>
            <p className="text-center text-sm opacity-90 mt-0.5">
              परीक्षा निर्देश / Exam Instructions
            </p>
          </div>

          <div className="p-6">
            {/* Controls row */}
            <div className="flex flex-wrap gap-3 mb-5">
              {/* Language toggle */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setLang("hindi")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-l-lg border-2 border-[#DAA520] transition-colors ${
                    lang === "hindi"
                      ? "bg-[#DAA520] text-white"
                      : "bg-white text-black hover:bg-amber-50"
                  }`}
                  data-ocid="instructions.toggle"
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setLang("english")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-r-lg border-2 border-l-0 border-[#DAA520] transition-colors ${
                    lang === "english"
                      ? "bg-[#DAA520] text-white"
                      : "bg-white text-black hover:bg-amber-50"
                  }`}
                  data-ocid="instructions.toggle"
                >
                  English
                </button>
              </div>

              {/* Keyboard dropdown (typing only) */}
              {examType === "typing" && (
                <Select value={keyboardType} onValueChange={setKeyboardType}>
                  <SelectTrigger
                    className="h-8 text-xs border-[#DAA520] w-40"
                    data-ocid="instructions.select"
                  >
                    <SelectValue placeholder="Keyboard Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remington">Remington</SelectItem>
                    <SelectItem value="inscript">Inscript</SelectItem>
                    <SelectItem value="phonetic">Phonetic</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Paper language dropdown */}
              <Select value={paperLang} onValueChange={setPaperLang}>
                <SelectTrigger
                  className="h-8 text-xs border-[#DAA520] w-36"
                  data-ocid="instructions.select"
                >
                  <SelectValue placeholder="Paper Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instructions list */}
            <div className="bg-amber-50 border border-[#DAA520] rounded-lg p-4 mb-5">
              <h2 className="text-sm font-bold text-[#0d1b4b] mb-3">
                {lang === "hindi"
                  ? "महत्वपूर्ण निर्देश:"
                  : "Important Instructions:"}
              </h2>
              <ol className="space-y-2">
                {instructions.map((inst, i) => (
                  <motion.li
                    key={inst.slice(0, 20)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-2 text-sm text-gray-800"
                  >
                    <span className="flex-shrink-0 w-5 h-5 bg-[#DAA520] text-white rounded-full text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Declaration */}
            <div className="border border-[#DAA520] rounded-lg p-4 mb-5 bg-white">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="declaration"
                  checked={declared}
                  onCheckedChange={(v) => setDeclared(!!v)}
                  className="mt-0.5 border-[#DAA520] data-[state=checked]:bg-[#DAA520]"
                  data-ocid="instructions.checkbox"
                />
                <label
                  htmlFor="declaration"
                  className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                >
                  मैंने सभी निर्देश पढ़ और समझ लिए हैं।{" "}
                  <span className="text-gray-500">
                    / I have read and understood all instructions.
                  </span>
                </label>
              </div>
            </div>

            {/* Ready Button */}
            <div className="text-center">
              <motion.div
                animate={declared ? { scale: [1, 1.03, 1] } : {}}
                transition={{
                  repeat: declared ? Number.POSITIVE_INFINITY : 0,
                  duration: 2,
                }}
              >
                <Button
                  onClick={onReady}
                  disabled={!declared}
                  className={`px-8 py-3 text-base font-bold transition-all ${
                    declared
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  data-ocid="instructions.primary_button"
                >
                  {lang === "hindi"
                    ? "मैं शुरू करने के लिए तैयार हूँ"
                    : "I am ready to begin"}
                </Button>
              </motion.div>
              {!declared && (
                <p className="text-xs text-gray-400 mt-2">
                  {lang === "hindi"
                    ? "पहले declaration checkbox check करें"
                    : "Please check the declaration checkbox first"}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
