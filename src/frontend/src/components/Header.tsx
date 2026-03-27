import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Keyboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const [menuOpen, setMenuOpen] = useState(false);
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal ? `${principal.slice(0, 8)}...` : null;

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
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {identity ? (
            <>
              <span className="text-sm text-gray-300">{shortPrincipal}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="border-white text-white hover:bg-white hover:text-[#0d1b4b] bg-transparent"
                data-ocid="auth.button"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="border-white text-white hover:bg-white hover:text-[#0d1b4b] bg-transparent"
                data-ocid="auth.button"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                data-ocid="auth.button"
              >
                Register
              </Button>
            </>
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
          {identity ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="border-white text-white bg-transparent w-fit"
              data-ocid="auth.button"
            >
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              className="bg-orange-500 text-white w-fit"
              data-ocid="auth.button"
            >
              Login / Register
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
