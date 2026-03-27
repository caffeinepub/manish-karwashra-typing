import { User } from "lucide-react";
import { useEffect, useState } from "react";

interface UserIdentityHeaderProps {
  userId?: string;
  name?: string;
  photoUrl?: string;
  sessionName?: string;
  examDate?: string;
}

export default function UserIdentityHeader({
  userId = "2024001",
  name = "Candidate",
  photoUrl,
  sessionName = "Morning Session",
  examDate,
}: UserIdentityHeaderProps) {
  const [liveTime, setLiveTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today =
    examDate ||
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className="flex items-center gap-4 px-4 py-2 bg-white border-2 border-[#DAA520] rounded-lg mb-3 flex-wrap"
      data-ocid="exam.panel"
    >
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#DAA520] overflow-hidden flex items-center justify-center bg-amber-50 flex-shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-amber-600" />
          )}
        </div>
        <div>
          <div className="text-xs text-gray-500 leading-none">Candidate</div>
          <div className="font-bold text-black text-sm leading-snug">
            {name}
          </div>
          <div className="text-xs text-gray-500">ID: {userId}</div>
        </div>
      </div>

      <div className="h-8 w-px bg-[#DAA520] hidden sm:block" />

      {/* Date */}
      <div className="text-center">
        <div className="text-xs text-gray-500">Exam Date</div>
        <div className="text-sm font-semibold text-black">{today}</div>
      </div>

      <div className="h-8 w-px bg-[#DAA520] hidden sm:block" />

      {/* Live time */}
      <div className="text-center">
        <div className="text-xs text-gray-500">Time</div>
        <div className="text-sm font-semibold text-black tabular-nums">
          {liveTime}
        </div>
      </div>

      <div className="h-8 w-px bg-[#DAA520] hidden sm:block" />

      {/* Session */}
      <div className="text-center">
        <div className="text-xs text-gray-500">Session</div>
        <div className="text-sm font-semibold text-black">{sessionName}</div>
      </div>
    </div>
  );
}
