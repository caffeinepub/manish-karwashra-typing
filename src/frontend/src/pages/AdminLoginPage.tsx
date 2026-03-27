import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Check custom admin password or default
      const customPass = localStorage.getItem("admin_password") || ADMIN_PASS;
      if (username === ADMIN_USER && password === customPass) {
        localStorage.setItem("admin_authenticated", "true");
        toast.success("Admin login successful!");
        navigate({ to: "/admin" });
      } else {
        toast.error("Username ya password galat hai");
      }
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#0d1b4b] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">
            Karwashra Typing Admin Panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Username
            </Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="border-gray-300"
              data-ocid="admin_login.username"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Password
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
              className="border-gray-300"
              data-ocid="admin_login.password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d1b4b] hover:bg-[#1a2a6e] text-white py-3"
            data-ocid="admin_login.submit"
          >
            {loading ? "Verifying..." : "Login"}
          </Button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}
