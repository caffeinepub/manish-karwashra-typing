import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import ExamInstructions from "../components/ExamInstructions";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NTAMCQInterface from "../components/exam/NTAMCQInterface";
import SSCMCQInterface from "../components/exam/SSCMCQInterface";
import TCSMCQInterface from "../components/exam/TCSMCQInterface";
import { getExamConfig } from "../data/examConfig";
import { getQuestionsForExam } from "../data/mcqQuestions";
import { saveExamResult } from "../utils/results";

export default function MCQTest() {
  const params = useParams({ strict: false }) as { examCategory?: string };
  const examSlug = params.examCategory || "ssc-cgl";
  const examConfig = getExamConfig(examSlug);
  const questions = getQuestionsForExam(examSlug);

  const [instructionsDone, setInstructionsDone] = useState(false);

  if (!instructionsDone) {
    return (
      <ExamInstructions
        examName={examConfig.name || examSlug.replace(/-/g, " ").toUpperCase()}
        examType="mcq"
        onReady={() => setInstructionsDone(true)}
      />
    );
  }

  // Choose interface based on exam type
  if (examConfig.examType === "nta") {
    return (
      <NTAMCQInterface
        examConfig={examConfig}
        questions={questions}
        mode="practice"
        onComplete={(r) =>
          saveExamResult({
            examName:
              examConfig.name || examSlug.replace(/-/g, " ").toUpperCase(),
            examType: "mcq",
            score: Math.round((r.score / r.total) * 100),
            correct: r.score,
            total: r.total,
            passed: Math.round((r.score / r.total) * 100) >= 60,
          })
        }
      />
    );
  }

  if (examConfig.examType === "railway") {
    return (
      <TCSMCQInterface
        examConfig={examConfig}
        questions={questions}
        mode="practice"
        onComplete={(r) =>
          saveExamResult({
            examName:
              examConfig.name || examSlug.replace(/-/g, " ").toUpperCase(),
            examType: "mcq",
            score: Math.round((r.score / r.total) * 100),
            correct: r.score,
            total: r.total,
            passed: Math.round((r.score / r.total) * 100) >= 60,
          })
        }
      />
    );
  }

  // SSC, banking, state, generic → SSC CBT style
  return (
    <>
      <Header />
      <SSCMCQInterface
        examConfig={examConfig}
        questions={questions}
        mode="practice"
        onComplete={(r) =>
          saveExamResult({
            examName:
              examConfig.name || examSlug.replace(/-/g, " ").toUpperCase(),
            examType: "mcq",
            score: Math.round((r.score / r.total) * 100),
            correct: r.score,
            total: r.total,
            passed: Math.round((r.score / r.total) * 100) >= 60,
          })
        }
      />
      <Footer />
    </>
  );
}
