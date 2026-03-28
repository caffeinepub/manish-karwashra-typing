export type ExamBoard =
  | "SSC"
  | "Railway"
  | "DelhiPolice"
  | "DSSSB"
  | "HSSC"
  | "Banking"
  | "Teaching"
  | "General";

export interface ScoringInput {
  examBoard: ExamBoard;
  totalKeyDepressions: number;
  correctWords: number;
  wrongWords: number;
  totalWords: number;
  correctChars: number;
  timeMinutes: number;
}

export interface ScoringResult {
  grossWPM: number;
  netWPM: number;
  mistakes: number;
  penaltyApplied: number;
  formula: string;
  passThreshold: number;
  isPassed: boolean;
}

export function calcTypingScore(input: ScoringInput): ScoringResult {
  const {
    examBoard,
    totalKeyDepressions,
    correctWords,
    wrongWords,
    totalWords,
    correctChars,
    timeMinutes,
  } = input;
  const mistakes = wrongWords;
  const time = Math.max(timeMinutes, 0.01);

  let grossWPM = 0;
  let netWPM = 0;
  let formula = "";
  let passThreshold = 30;
  let penaltyApplied = 0;

  switch (examBoard) {
    case "SSC":
      grossWPM = Math.round(totalKeyDepressions / (5 * time));
      penaltyApplied = mistakes;
      netWPM = Math.max(0, grossWPM - penaltyApplied);
      formula = `SSC: Gross = KeyDepressions/(5×Time) = ${totalKeyDepressions}/(5×${time.toFixed(1)}) = ${grossWPM} | Net = ${grossWPM} - ${penaltyApplied} = ${netWPM}`;
      passThreshold = 35;
      break;
    case "Railway": {
      grossWPM = Math.round(totalWords / time);
      const forgiven = Math.floor(totalWords * 0.05);
      const penalizedMistakes = Math.max(0, mistakes - forgiven);
      penaltyApplied = Math.round((penalizedMistakes * 10) / time);
      netWPM = Math.max(0, grossWPM - penaltyApplied);
      formula = `Railway: Gross=${grossWPM} | 5% forgiven=${forgiven} | Net = ${grossWPM} - (${penalizedMistakes}×10/${time.toFixed(1)}) = ${netWPM}`;
      passThreshold = 25;
      break;
    }
    case "DelhiPolice":
      grossWPM = Math.round(totalWords / time);
      penaltyApplied = Math.round(mistakes / time);
      netWPM = Math.max(0, grossWPM - penaltyApplied);
      formula = `Delhi Police: Net = Gross - Mistakes/Time = ${grossWPM} - ${mistakes}/${time.toFixed(1)} = ${netWPM}`;
      passThreshold = 30;
      break;
    case "DSSSB":
      grossWPM = Math.round((correctWords + wrongWords) / time);
      netWPM = Math.round(correctWords / time);
      penaltyApplied = wrongWords;
      formula = `DSSSB/DEO: WPM = CorrectWords/Time = ${correctWords}/${time.toFixed(1)} = ${netWPM}`;
      passThreshold = 30;
      break;
    case "HSSC":
      grossWPM = Math.round(totalWords / time);
      penaltyApplied = mistakes;
      netWPM = Math.max(0, grossWPM - penaltyApplied);
      formula = `Hartron/HSSC: Net WPM = Gross - Mistakes = ${grossWPM} - ${mistakes} = ${netWPM}`;
      passThreshold = 30;
      break;
    case "Banking":
      grossWPM = Math.round(totalWords / time);
      netWPM = Math.max(0, Math.round((totalWords - wrongWords) / time));
      penaltyApplied = Math.round(wrongWords / time);
      formula = `Banking/State PCS: WPM = (TotalWords-WrongWords)/Time = (${totalWords}-${wrongWords})/${time.toFixed(1)} = ${netWPM}`;
      passThreshold = 30;
      break;
    case "Teaching":
      grossWPM = Math.round(totalKeyDepressions / (5 * time));
      netWPM = Math.round(correctChars / (5 * time));
      penaltyApplied = grossWPM - netWPM;
      formula = `Teaching/Clerical: WPM = NetChars/(5×Time) = ${correctChars}/(5×${time.toFixed(1)}) = ${netWPM}`;
      passThreshold = 30;
      break;
    default:
      grossWPM = Math.round(totalWords / time);
      netWPM = Math.max(0, Math.round(correctWords / time));
      penaltyApplied = wrongWords;
      formula = `General: Net WPM = CorrectWords/Time = ${correctWords}/${time.toFixed(1)} = ${netWPM}`;
      passThreshold = 30;
  }

  return {
    grossWPM,
    netWPM,
    mistakes,
    penaltyApplied,
    formula,
    passThreshold,
    isPassed: netWPM >= passThreshold,
  };
}
