import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface CertificateProps {
  type: "typing" | "mcq";
  candidateName: string;
  examName: string;
  wpm?: number;
  accuracy?: number;
  score?: number;
  totalQuestions?: number;
  date?: string;
  onClose: () => void;
}

type ExamStyle = {
  headerBg: string;
  headerText: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  statsBg: string;
  statsText: string;
  footerBg: string;
  orgName: string;
  orgSubtitle: string;
  sealColor: string;
  ribbonColor: string;
  logo: string;
};

function getExamStyle(examName: string): ExamStyle {
  const name = examName.toUpperCase();

  // NTA / CTET / Teaching
  if (
    name.includes("NTA") ||
    name.includes("CTET") ||
    name.includes("TEACHING") ||
    name.includes("JEE") ||
    name.includes("NEET")
  ) {
    return {
      headerBg:
        "linear-gradient(135deg, #4a0e8f 0%, #6b21a8 50%, #7c3aed 100%)",
      headerText: "#ffffff",
      accentColor: "#7c3aed",
      borderColor: "#6b21a8",
      bgGradient:
        "linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #f3e8ff 100%)",
      statsBg: "#f3e8ff",
      statsText: "#4a0e8f",
      footerBg: "#4a0e8f",
      orgName: "National Testing Agency",
      orgSubtitle: "Karwashra Typing | NTA Certified Practice",
      sealColor: "#6b21a8",
      ribbonColor: "#4a0e8f",
      logo: "NTA",
    };
  }

  // Railway / TCS iON / NTPC / RRB
  if (
    name.includes("RAILWAY") ||
    name.includes("NTPC") ||
    name.includes("RRB") ||
    name.includes("TCS") ||
    name.includes("GROUP D")
  ) {
    return {
      headerBg:
        "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)",
      headerText: "#ffffff",
      accentColor: "#ea580c",
      borderColor: "#c2410c",
      bgGradient:
        "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #ffedd5 100%)",
      statsBg: "#ffedd5",
      statsText: "#c2410c",
      footerBg: "#c2410c",
      orgName: "Indian Railways – TCS iON",
      orgSubtitle: "Karwashra Typing | Railway Practice Portal",
      sealColor: "#ea580c",
      ribbonColor: "#c2410c",
      logo: "RRB",
    };
  }

  // Banking / IBPS / SBI
  if (
    name.includes("BANKING") ||
    name.includes("IBPS") ||
    name.includes("SBI") ||
    name.includes("BANK")
  ) {
    return {
      headerBg:
        "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #2196f3 100%)",
      headerText: "#ffffff",
      accentColor: "#1b6ca8",
      borderColor: "#0f4c75",
      bgGradient:
        "linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #bbdefb 100%)",
      statsBg: "#e3f2fd",
      statsText: "#0f4c75",
      footerBg: "#0f4c75",
      orgName: "Institute of Banking Personnel Selection",
      orgSubtitle: "Karwashra Typing | Banking Practice Portal",
      sealColor: "#1b6ca8",
      ribbonColor: "#0f4c75",
      logo: "IBPS",
    };
  }

  // DSSSB
  if (name.includes("DSSSB")) {
    return {
      headerBg:
        "linear-gradient(135deg, #1a5276 0%, #2874a6 50%, #3498db 100%)",
      headerText: "#ffffff",
      accentColor: "#2874a6",
      borderColor: "#1a5276",
      bgGradient:
        "linear-gradient(135deg, #eaf2ff 0%, #ffffff 50%, #d6eaf8 100%)",
      statsBg: "#d6eaf8",
      statsText: "#1a5276",
      footerBg: "#1a5276",
      orgName: "Delhi Subordinate Services Selection Board",
      orgSubtitle: "Karwashra Typing | DSSSB Practice Portal",
      sealColor: "#2874a6",
      ribbonColor: "#1a5276",
      logo: "DSSSB",
    };
  }

  // HSSC / Haryana / State
  if (
    name.includes("HSSC") ||
    name.includes("HARYANA") ||
    name.includes("STATE CLERK") ||
    name.includes("HARTRON")
  ) {
    return {
      headerBg:
        "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
      headerText: "#ffffff",
      accentColor: "#047857",
      borderColor: "#065f46",
      bgGradient:
        "linear-gradient(135deg, #ecfdf5 0%, #ffffff 50%, #d1fae5 100%)",
      statsBg: "#d1fae5",
      statsText: "#065f46",
      footerBg: "#065f46",
      orgName: "Haryana Staff Selection Commission",
      orgSubtitle: "Karwashra Typing | HSSC Practice Portal",
      sealColor: "#047857",
      ribbonColor: "#065f46",
      logo: "HSSC",
    };
  }

  // Delhi Police
  if (name.includes("DELHI POLICE") || name.includes("HCM")) {
    return {
      headerBg:
        "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #3b82f6 100%)",
      headerText: "#ffffff",
      accentColor: "#1d4ed8",
      borderColor: "#1e3a5f",
      bgGradient:
        "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #dbeafe 100%)",
      statsBg: "#dbeafe",
      statsText: "#1e3a5f",
      footerBg: "#1e3a5f",
      orgName: "Delhi Police",
      orgSubtitle: "Karwashra Typing | Delhi Police Practice Portal",
      sealColor: "#1d4ed8",
      ribbonColor: "#1e3a5f",
      logo: "DP",
    };
  }

  // SSC default (CGL, CHSL, MTS, etc.)
  return {
    headerBg: "linear-gradient(135deg, #0d2137 0%, #1e3a5f 50%, #1e4976 100%)",
    headerText: "#ffffff",
    accentColor: "#1e3a5f",
    borderColor: "#0d2137",
    bgGradient:
      "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #e8f0fe 100%)",
    statsBg: "#e8f0fe",
    statsText: "#0d2137",
    footerBg: "#0d2137",
    orgName: "Staff Selection Commission",
    orgSubtitle: "Karwashra Typing | SSC Practice Portal",
    sealColor: "#1e3a5f",
    ribbonColor: "#0d2137",
    logo: "SSC",
  };
}

export default function Certificate({
  type,
  candidateName,
  examName,
  wpm,
  accuracy,
  score,
  totalQuestions,
  date,
  onClose,
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const style = getExamStyle(examName);
  const today =
    date ||
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleDownload = () => {
    const el = certRef.current;
    if (!el) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${candidateName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
        <style>
          body { margin: 0; padding: 20px; font-family: 'Lato', sans-serif; background: #f0f0f0; }
          .cert { width: 850px; margin: 0 auto; }
          @media print { body { background: white; padding: 0; } }
        </style>
      </head>
      <body>
        <div class="cert">${el.outerHTML}</div>
        <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const pct =
    type === "mcq" && totalQuestions
      ? Math.round((score! / totalQuestions) * 100)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-auto">
      <div
        className="rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
        style={{ border: `3px solid ${style.borderColor}` }}
      >
        {/* Certificate */}
        <div
          ref={certRef}
          style={{
            background: style.bgGradient,
            fontFamily: "'Lato', sans-serif",
          }}
        >
          {/* Top Header Bar */}
          <div style={{ background: style.headerBg, padding: "0" }}>
            {/* Top ribbon strip */}
            <div
              style={{ background: "rgba(255,255,255,0.15)", height: "6px" }}
            />

            <div
              style={{
                padding: "20px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Left: Logo badge */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 13,
                    textAlign: "center",
                    letterSpacing: 1,
                  }}
                >
                  {style.logo}
                </span>
              </div>

              {/* Center: Title */}
              <div style={{ textAlign: "center", flex: 1, padding: "0 16px" }}>
                <div
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 11,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {style.orgName}
                </div>
                <div
                  style={{
                    color: "#ffffff",
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  CERTIFICATE OF ACHIEVEMENT
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {style.orgSubtitle}
                </div>
              </div>

              {/* Right: Seal */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "2px solid rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 28 }}>🏛️</span>
              </div>
            </div>

            {/* Bottom ribbon strip */}
            <div style={{ background: "rgba(0,0,0,0.2)", height: "4px" }} />
          </div>

          {/* Body */}
          <div style={{ padding: "32px 40px" }}>
            {/* Presented to */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <p
                style={{
                  color: "#666",
                  fontSize: 13,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                This is to certify that
              </p>
              <div
                style={{
                  display: "inline-block",
                  borderBottom: `3px solid ${style.accentColor}`,
                  paddingBottom: 6,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {candidateName}
                </span>
              </div>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 6 }}>
                has successfully qualified the
              </p>
              <p
                style={{
                  color: style.accentColor,
                  fontSize: 20,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {examName}{" "}
                {type === "typing" ? "Typing Test" : "MCQ Examination"}
              </p>
            </div>

            {/* Decorative line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${style.accentColor})`,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: style.accentColor,
                  margin: "0 12px",
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(to left, transparent, ${style.accentColor})`,
                }}
              />
            </div>

            {/* Stats boxes */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                margin: "20px 0",
              }}
            >
              {type === "typing" && (
                <>
                  <div
                    style={{
                      background: style.statsBg,
                      border: `2px solid ${style.accentColor}`,
                      borderRadius: 12,
                      padding: "16px 28px",
                      textAlign: "center",
                      minWidth: 110,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: style.statsText,
                      }}
                    >
                      {wpm}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Words / Min
                    </div>
                  </div>
                  <div
                    style={{
                      background: style.statsBg,
                      border: `2px solid ${style.accentColor}`,
                      borderRadius: 12,
                      padding: "16px 28px",
                      textAlign: "center",
                      minWidth: 110,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: style.statsText,
                      }}
                    >
                      {accuracy}%
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Accuracy
                    </div>
                  </div>
                </>
              )}
              {type === "mcq" && (
                <>
                  <div
                    style={{
                      background: style.statsBg,
                      border: `2px solid ${style.accentColor}`,
                      borderRadius: 12,
                      padding: "16px 28px",
                      textAlign: "center",
                      minWidth: 110,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: style.statsText,
                      }}
                    >
                      {score}/{totalQuestions}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Score
                    </div>
                  </div>
                  <div
                    style={{
                      background: style.statsBg,
                      border: `2px solid ${style.accentColor}`,
                      borderRadius: 12,
                      padding: "16px 28px",
                      textAlign: "center",
                      minWidth: 110,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: style.statsText,
                      }}
                    >
                      {pct}%
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Percentage
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Decorative line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${style.accentColor})`,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: style.accentColor,
                  margin: "0 12px",
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(to left, transparent, ${style.accentColor})`,
                }}
              />
            </div>

            {/* Footer: Date + Signature + Branding */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: 24,
              }}
            >
              {/* Date */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}
                >
                  {today}
                </div>
                <div
                  style={{
                    borderTop: `2px solid ${style.accentColor}`,
                    paddingTop: 4,
                    fontSize: 11,
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Date of Issue
                </div>
              </div>

              {/* Seal */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    border: `3px solid ${style.sealColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 6px",
                    flexDirection: "column",
                    background: style.statsBg,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: style.statsText,
                      textAlign: "center",
                      padding: "0 6px",
                      lineHeight: 1.2,
                    }}
                  >
                    KARWASHRA{"\n"}TYPING
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Official Seal
                </div>
              </div>

              {/* Signature */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "cursive",
                    fontSize: 22,
                    color: style.accentColor,
                    marginBottom: 2,
                  }}
                >
                  Manish K.
                </div>
                <div
                  style={{
                    borderTop: `2px solid ${style.accentColor}`,
                    paddingTop: 4,
                    fontSize: 11,
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Authorized Signatory
                </div>
                <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>
                  Karwashra Typing
                </div>
              </div>
            </div>
          </div>

          {/* Bottom footer bar */}
          <div
            style={{
              background: style.footerBg,
              padding: "10px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              KARWASHRA TYPING PORTAL
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>
              This is a practice certificate issued by Karwashra Typing for
              educational purposes only.
            </span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
              {today}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center p-4 bg-white border-t">
          <Button
            onClick={handleDownload}
            className="text-white font-semibold px-6"
            style={{ background: style.headerBg }}
          >
            ⬇ Download Certificate
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
