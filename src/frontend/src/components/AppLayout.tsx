import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Calendar,
  ClipboardList,
  Gamepad2,
  Home,
  Keyboard,
  LineChart,
  LogIn,
  Menu,
  Mic,
  Settings,
  Shield,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/typing-test", label: "Typing Test", icon: Keyboard },
  { path: "/practice", label: "Practice", icon: BookOpen },
  { path: "/exam-mode", label: "Exam Mode", icon: ClipboardList },
  { path: "/games", label: "Typing Games", icon: Gamepad2 },
  { path: "/dictation", label: "Dictation", icon: Mic },
  { path: "/progress", label: "Progress", icon: LineChart },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/daily-challenge", label: "Daily Challenge", icon: Calendar },
  { path: "/results", label: "Certificate / Result", icon: Award },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

const NAV_EXTRA = [
  { path: "/live-test", label: "Live Test", icon: Zap, color: "text-red-400" },
  {
    path: "/mock-test",
    label: "Mock Test",
    icon: ClipboardList,
    color: "text-blue-400",
  },
  {
    path: "/learning",
    label: "Pro Typing",
    icon: BookOpen,
    color: "text-purple-400",
  },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleClick = (path: string) => {
    navigate({ to: path });
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1b4b] text-white">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Keyboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">
              Karwashra Typing
            </div>
            <div className="text-[10px] text-gray-400">Govt Exam Platform</div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              type="button"
              onClick={() => handleClick(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
              data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}

        <div className="my-2 border-t border-white/10" />
        <div className="px-3 py-1 text-[10px] text-gray-500 uppercase tracking-wider">
          Tests
        </div>

        {NAV_EXTRA.map(({ path, label, icon: Icon, color }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              type="button"
              onClick={() => handleClick(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active
                  ? "bg-white/20 text-white"
                  : `${color} hover:bg-white/10 hover:text-white`
              }`}
              data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}

        <div className="my-2 border-t border-white/10" />

        <button
          type="button"
          onClick={() => handleClick("/admin-login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-left"
          data-ocid="nav.admin"
        >
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>Admin Panel</span>
        </button>
      </nav>

      {/* User Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        {auth.currentUser ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {(auth.currentUser.name || auth.currentUser.username)
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {auth.currentUser.name || auth.currentUser.username}
              </div>
              <div className="text-xs text-gray-400">
                ID: {auth.currentUser.id}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleClick("/login")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Register</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 border-r border-gray-200 overflow-hidden">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 bg-[#0d1b4b] text-white rounded-lg flex items-center justify-center shadow-lg"
            data-ocid="nav.mobile_menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64" data-ocid="nav.drawer">
          <NavContent onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar spacer */}
        <div className="md:hidden h-14" />
        {children}
      </main>
    </div>
  );
}
