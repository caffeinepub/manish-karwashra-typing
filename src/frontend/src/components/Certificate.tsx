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
        <style>
          body { margin: 0; padding: 20px; font-family: 'Georgia', serif; background: #fff; }
          .cert { width: 800px; margin: 0 auto; }
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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Certificate */}
        <div
          ref={certRef}
          className="p-8 bg-white rounded-2xl"
          style={{
            border: "8px double #DAA520",
            background:
              "linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #fffbeb 100%)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-1">🏆</div>
            <div className="text-xs font-bold tracking-[0.3em] text-amber-700 uppercase mb-1">
              Certificate of Achievement
            </div>
            <div
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Manish Karwashra Typing
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="text-amber-500 text-lg">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>

          {/* Body */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">This is to certify that</p>
            <p
              className="text-3xl font-bold text-gray-900"
              style={{
                fontFamily: "Georgia, serif",
                borderBottom: "2px solid #DAA520",
                display: "inline-block",
                paddingBottom: "4px",
              }}
            >
              {candidateName}
            </p>
            <p className="text-sm text-gray-600">
              has successfully qualified the
            </p>
            <p className="text-xl font-bold text-amber-700">
              {examName} {type === "typing" ? "Typing Test" : "MCQ Test"}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 my-6">
            {type === "typing" && (
              <>
                <div className="text-center bg-amber-50 rounded-xl px-6 py-3 border border-amber-200">
                  <div className="text-3xl font-bold text-blue-700">{wpm}</div>
                  <div className="text-xs text-gray-500 font-medium">WPM</div>
                </div>
                <div className="text-center bg-amber-50 rounded-xl px-6 py-3 border border-amber-200">
                  <div className="text-3xl font-bold text-green-700">
                    {accuracy}%
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Accuracy
                  </div>
                </div>
              </>
            )}
            {type === "mcq" && (
              <>
                <div className="text-center bg-amber-50 rounded-xl px-6 py-3 border border-amber-200">
                  <div className="text-3xl font-bold text-blue-700">
                    {score}/{totalQuestions}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Score</div>
                </div>
                <div className="text-center bg-amber-50 rounded-xl px-6 py-3 border border-amber-200">
                  <div className="text-3xl font-bold text-green-700">
                    {totalQuestions
                      ? Math.round((score! / totalQuestions) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Percentage
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="text-amber-500 text-lg">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">Date</div>
              <div className="text-sm font-semibold text-gray-800">{today}</div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl mb-1"
                style={{ fontFamily: "cursive", color: "#1a1a8c" }}
              >
                Manish K
              </div>
              <div className="border-t-2 border-gray-400 pt-1 text-xs text-gray-500 w-32 text-center">
                Authorized Signature
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Platform</div>
              <div className="text-sm font-semibold text-amber-700">
                MK Typing
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center p-4 border-t">
          <Button
            onClick={handleDownload}
            className="bg-[#DAA520] hover:bg-amber-600 text-white"
          >
            Download Certificate
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
