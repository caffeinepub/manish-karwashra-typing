import { useParams } from "@tanstack/react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NTAMCQInterface from "../components/exam/NTAMCQInterface";
import SSCMCQInterface from "../components/exam/SSCMCQInterface";
import TCSMCQInterface from "../components/exam/TCSMCQInterface";
import { getExamConfig } from "../data/examConfig";
import { getQuestionsForExam } from "../data/mcqQuestions";

export default function LiveTest() {
  const params = useParams({ strict: false }) as { examSlug?: string };
  const examSlug = params.examSlug || "ssc-cgl";
  const examConfig = getExamConfig(examSlug);
  const questions = getQuestionsForExam(examSlug);

  if (examConfig.examType === "nta") {
    return (
      <NTAMCQInterface
        examConfig={examConfig}
        questions={questions}
        mode="live"
      />
    );
  }

  if (examConfig.examType === "railway") {
    return (
      <TCSMCQInterface
        examConfig={examConfig}
        questions={questions}
        mode="live"
      />
    );
  }

  return (
    <>
      <Header />
      <SSCMCQInterface
        examConfig={examConfig}
        questions={questions}
        mode="live"
      />
      <Footer />
    </>
  );
}
