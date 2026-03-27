import { Square, Upload } from "lucide-react";

const TIMER_PRESETS = [1, 2, 5, 10, 15, 20, 30];

interface TypingControlPanelProps {
  selectedMinutes: number;
  onSelectMinutes: (m: number) => void;
  timerRunning: boolean;
  textSize: "small" | "large";
  onTextSizeChange: (s: "small" | "large") => void;
  highlightEnabled: boolean;
  onHighlightChange: (v: boolean) => void;
  autoScroll: boolean;
  onAutoScrollChange: (v: boolean) => void;
  backspaceAllowed: boolean;
  onBackspaceChange: (v: boolean) => void;
  onStop: () => void;
  onSubmit: () => void;
  testStarted: boolean;
  testEnded: boolean;
}

function ToggleBtn({
  active,
  onClick,
  children,
  color = "amber",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: "amber" | "red" | "green";
}) {
  const activeColors = {
    amber: "bg-[#DAA520] text-white border-[#DAA520]",
    red: "bg-red-600 text-white border-red-600",
    green: "bg-green-600 text-white border-green-600",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
        active
          ? activeColors[color]
          : "bg-white text-black border-[#DAA520] hover:bg-amber-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function TypingControlPanel({
  selectedMinutes,
  onSelectMinutes,
  timerRunning,
  textSize,
  onTextSizeChange,
  highlightEnabled,
  onHighlightChange,
  autoScroll,
  onAutoScrollChange,
  backspaceAllowed,
  onBackspaceChange,
  onStop,
  onSubmit,
  testStarted,
  testEnded,
}: TypingControlPanelProps) {
  return (
    <div
      className="bg-white border-2 border-[#DAA520] rounded-lg px-3 py-2 mb-3 flex flex-wrap gap-2 items-center"
      data-ocid="typing.panel"
    >
      {/* Timer presets */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs font-semibold text-gray-600 mr-1">Time:</span>
        {TIMER_PRESETS.map((m) => (
          <ToggleBtn
            key={m}
            active={selectedMinutes === m}
            onClick={() => !timerRunning && onSelectMinutes(m)}
          >
            {m}m
          </ToggleBtn>
        ))}
      </div>

      <div className="w-px h-6 bg-[#DAA520] hidden sm:block" />

      {/* Text size */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-gray-600 mr-1">Text:</span>
        <ToggleBtn
          active={textSize === "small"}
          onClick={() => onTextSizeChange("small")}
        >
          Small
        </ToggleBtn>
        <ToggleBtn
          active={textSize === "large"}
          onClick={() => onTextSizeChange("large")}
        >
          Large
        </ToggleBtn>
      </div>

      <div className="w-px h-6 bg-[#DAA520] hidden sm:block" />

      {/* Highlight */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-gray-600 mr-1">
          Highlight:
        </span>
        <ToggleBtn
          active={highlightEnabled}
          onClick={() => onHighlightChange(true)}
        >
          On
        </ToggleBtn>
        <ToggleBtn
          active={!highlightEnabled}
          onClick={() => onHighlightChange(false)}
        >
          Off
        </ToggleBtn>
      </div>

      <div className="w-px h-6 bg-[#DAA520] hidden sm:block" />

      {/* Scroll */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-gray-600 mr-1">
          Scroll:
        </span>
        <ToggleBtn
          active={!autoScroll}
          onClick={() => onAutoScrollChange(false)}
        >
          Manual
        </ToggleBtn>
        <ToggleBtn active={autoScroll} onClick={() => onAutoScrollChange(true)}>
          Auto
        </ToggleBtn>
      </div>

      <div className="w-px h-6 bg-[#DAA520] hidden sm:block" />

      {/* Backspace */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-gray-600 mr-1">
          Backspace:
        </span>
        <ToggleBtn
          active={backspaceAllowed}
          onClick={() => onBackspaceChange(true)}
          color="green"
        >
          Allow
        </ToggleBtn>
        <ToggleBtn
          active={!backspaceAllowed}
          onClick={() => onBackspaceChange(false)}
          color="red"
        >
          Block
        </ToggleBtn>
      </div>

      {/* Action buttons */}
      {testStarted && !testEnded && (
        <>
          <div className="w-px h-6 bg-[#DAA520] hidden sm:block" />
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-red-600 text-white border border-red-600 hover:bg-red-700 transition-colors"
            data-ocid="typing.delete_button"
          >
            <Square className="h-3 w-3" /> Stop
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-green-600 text-white border border-green-600 hover:bg-green-700 transition-colors"
            data-ocid="typing.submit_button"
          >
            <Upload className="h-3 w-3" /> Submit
          </button>
        </>
      )}
    </div>
  );
}
