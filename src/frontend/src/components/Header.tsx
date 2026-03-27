import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Keyboard, LogOut, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleLogout = () => {
    auth.logout();
    navigate({ to: "/login" });
  };

  const handleChangePassword = () => {
    if (newPass.length < 6) {
      toast.error("Password kam se kam 6 characters ka hona chahiye");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("Naye passwords match nahi kar rahe");
      return;
    }
    const result = auth.changePassword(oldPass, newPass);
    if (result.success) {
      toast.success("Password badal gaya!");
      setChangePwdOpen(false);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      toast.error(result.error || "Password change failed");
    }
  };

  const displayName =
    auth.currentUser?.name || auth.currentUser?.username || "";

  return (
    <header className="bg-[#0d1b4b] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-ocid="nav.link">
          <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center flex-shrink-0">
            <Keyboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">
              Manish Karwashra Typing
            </div>
            <div className="text-xs text-gray-400 leading-tight">
              Govt Exam Typing Platform
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-gray-200 hover:text-orange-400 transition-colors"
            data-ocid="nav.link"
          >
            Practice
          </Link>
          <Link
            to="/learning"
            className="text-sm text-gray-200 hover:text-orange-400 transition-colors"
            data-ocid="nav.link"
          >
            Learning
          </Link>
          <Link
            to="/live-test"
            className="text-sm text-gray-200 hover:text-orange-400 transition-colors"
            data-ocid="nav.link"
          >
            Live
          </Link>
          <Link
            to="/results"
            className="text-sm text-gray-200 hover:text-orange-400 transition-colors"
            data-ocid="nav.link"
          >
            Results
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {auth.currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-[#DAA520] hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  data-ocid="auth.dropdown_menu"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#0d1b4b] text-xs font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{displayName}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-gray-500">
                  ID: {auth.currentUser.id}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setChangePwdOpen(true)}
                  className="cursor-pointer"
                  data-ocid="auth.button"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Password Badlein
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  data-ocid="auth.button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: "/login" })}
                className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white"
                data-ocid="auth.button"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate({ to: "/login" })}
                className="bg-teal-500 hover:bg-teal-600 text-white border-0"
                data-ocid="auth.button"
              >
                Register
              </Button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0a1540] px-4 py-3 flex flex-col gap-3">
          <Link
            to="/"
            className="text-sm text-gray-200"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            Practice
          </Link>
          <Link
            to="/learning"
            className="text-sm text-gray-200"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            Learning
          </Link>
          <Link
            to="/live-test"
            className="text-sm text-gray-200"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            Live
          </Link>
          <Link
            to="/results"
            className="text-sm text-gray-200"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            Results
          </Link>
          {auth.currentUser ? (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#DAA520] font-medium">
                {displayName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setChangePwdOpen(true);
                  setMenuOpen(false);
                }}
                className="border-white text-white bg-transparent w-fit text-xs"
                data-ocid="auth.button"
              >
                Password Badlein
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-400 text-red-400 bg-transparent w-fit text-xs"
                data-ocid="auth.button"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: "/login" })}
                className="border-white text-white bg-transparent w-fit"
                data-ocid="auth.button"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate({ to: "/login" })}
                className="bg-teal-500 hover:bg-teal-600 text-white border-0 w-fit"
                data-ocid="auth.button"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Change Password Dialog */}
      <Dialog open={changePwdOpen} onOpenChange={setChangePwdOpen}>
        <DialogContent className="max-w-sm" data-ocid="auth.dialog">
          <DialogHeader>
            <DialogTitle>Password Badlein</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold mb-1 block">
                Purana Password
              </Label>
              <Input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Purana password"
                className="border-[#DAA520]"
                data-ocid="auth.input"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1 block">
                Naya Password
              </Label>
              <Input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Naya password (min 6 chars)"
                className="border-[#DAA520]"
                data-ocid="auth.input"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1 block">
                Confirm Password
              </Label>
              <Input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Dobara likhein"
                className="border-[#DAA520]"
                data-ocid="auth.input"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              className="w-full bg-[#DAA520] hover:bg-amber-600 text-white"
              data-ocid="auth.submit_button"
            >
              Password Badlein
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
