import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Keyboard, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SECURITY_QUESTIONS, useAuth } from "../context/AuthContext";

function generateRandomUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Login state
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [regType, setRegType] = useState<"email" | "username">("email");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState(generateRandomUsername());
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regSecQ, setRegSecQ] = useState(SECURITY_QUESTIONS[0]);
  const [regSecA, setRegSecA] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot password state
  const [forgotId, setForgotId] = useState("");
  const [forgotSecQ, setForgotSecQ] = useState<string | null>(null);
  const [forgotSecA, setForgotSecA] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [showForgotPass, setShowForgotPass] = useState(false);

  const handleLogin = () => {
    if (!loginId || !loginPass) {
      toast.error("Email/Username aur password daalein");
      return;
    }
    const result = auth.login(loginId, loginPass);
    if (result.success) {
      toast.success("Login safal raha!");
      navigate({ to: "/" });
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const handleRegister = () => {
    const identifier = regType === "email" ? regEmail : regUsername;
    if (!identifier) {
      toast.error(regType === "email" ? "Email daalein" : "Username daalein");
      return;
    }
    if (regType === "email" && !identifier.includes("@")) {
      toast.error("Sahi email daalein");
      return;
    }
    if (regPass.length < 6) {
      toast.error("Password kam se kam 6 characters ka hona chahiye");
      return;
    }
    if (regPass !== regConfirm) {
      toast.error("Passwords match nahi kar rahe");
      return;
    }
    if (!regSecA.trim()) {
      toast.error("Security answer daalein");
      return;
    }
    if (!agreeTerms) {
      toast.error("Terms and conditions accept karein");
      return;
    }
    const result = auth.register(identifier, regPass, regSecQ, regSecA);
    if (result.success) {
      toast.success("Registration safal raha!");
      navigate({ to: "/" });
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  const handleForgotLookup = () => {
    if (!forgotId) {
      toast.error("Email ya username daalein");
      return;
    }
    const q = auth.getSecurityQuestion(forgotId);
    if (!q) {
      toast.error("User nahi mila");
      return;
    }
    setForgotSecQ(q);
  };

  const handleResetPassword = () => {
    if (forgotNewPass.length < 6) {
      toast.error("Password kam se kam 6 characters ka hona chahiye");
      return;
    }
    const result = auth.resetPassword(forgotId, forgotSecA, forgotNewPass);
    if (result.success) {
      toast.success("Password reset ho gaya! Ab login karein.");
      setForgotId("");
      setForgotSecQ(null);
      setForgotSecA("");
      setForgotNewPass("");
    } else {
      toast.error(result.error || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#0d1b4b] rounded-xl flex items-center justify-center">
              <Keyboard className="w-7 h-7 text-[#DAA520]" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xl text-[#0d1b4b]">
                Manish Karwashra
              </div>
              <div className="text-xs text-gray-500">Typing Platform</div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Government Exam Typing & MCQ Practice
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#DAA520] shadow-lg overflow-hidden">
          <Tabs defaultValue="login">
            <TabsList className="w-full rounded-none border-b-2 border-[#DAA520] bg-amber-50 h-auto p-0">
              <TabsTrigger
                value="login"
                className="flex-1 rounded-none py-3 text-sm font-semibold data-[state=active]:bg-[#DAA520] data-[state=active]:text-white"
                data-ocid="auth.tab"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 rounded-none py-3 text-sm font-semibold data-[state=active]:bg-[#DAA520] data-[state=active]:text-white"
                data-ocid="auth.tab"
              >
                Register
              </TabsTrigger>
              <TabsTrigger
                value="forgot"
                className="flex-1 rounded-none py-3 text-sm font-semibold data-[state=active]:bg-[#DAA520] data-[state=active]:text-white"
                data-ocid="auth.tab"
              >
                Forgot
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login" className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Email ya Username
                </Label>
                <Input
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="email@example.com ya username"
                  className="border-[#DAA520] focus-visible:ring-[#DAA520]"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  data-ocid="auth.input"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showLoginPass ? "text" : "password"}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Password daalein"
                    className="border-[#DAA520] focus-visible:ring-[#DAA520] pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    data-ocid="auth.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-[#DAA520] hover:bg-amber-600 text-white font-semibold"
                data-ocid="auth.submit_button"
              >
                Login Karein
              </Button>
              <div className="text-center text-xs text-gray-500 pt-2">
                Pehli baar aa rahe hain?{" "}
                <Tabs>
                  <TabsTrigger
                    value="register"
                    className="text-[#DAA520] font-semibold p-0 h-auto"
                  >
                    Register karo
                  </TabsTrigger>
                </Tabs>
              </div>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register" className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Login Type
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={regType === "email"}
                      onChange={() => setRegType("email")}
                      className="accent-[#DAA520]"
                    />
                    <span className="text-sm">Email se</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={regType === "username"}
                      onChange={() => setRegType("username")}
                      className="accent-[#DAA520]"
                    />
                    <span className="text-sm">Username se (Random)</span>
                  </label>
                </div>
              </div>

              {regType === "email" ? (
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Email
                  </Label>
                  <Input
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="aapka@email.com"
                    type="email"
                    className="border-[#DAA520] focus-visible:ring-[#DAA520]"
                    data-ocid="auth.input"
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Username
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="username"
                      className="border-[#DAA520] focus-visible:ring-[#DAA520]"
                      data-ocid="auth.input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setRegUsername(generateRandomUsername())}
                      className="border-[#DAA520] hover:bg-amber-50 flex-shrink-0"
                      title="Generate new"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Password (min 6 characters)
                </Label>
                <div className="relative">
                  <Input
                    type={showRegPass ? "text" : "password"}
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="Password daalein"
                    className="border-[#DAA520] focus-visible:ring-[#DAA520] pr-10"
                    data-ocid="auth.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showRegPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="Password dobara daalein"
                  className={`border-[#DAA520] focus-visible:ring-[#DAA520] ${
                    regConfirm && regPass !== regConfirm ? "border-red-500" : ""
                  }`}
                  data-ocid="auth.input"
                />
                {regConfirm && regPass !== regConfirm && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords match nahi kar rahe
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Security Question
                </Label>
                <Select value={regSecQ} onValueChange={setRegSecQ}>
                  <SelectTrigger
                    className="border-[#DAA520]"
                    data-ocid="auth.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECURITY_QUESTIONS.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Security Answer
                </Label>
                <Input
                  value={regSecA}
                  onChange={(e) => setRegSecA(e.target.value)}
                  placeholder="Apna jawab likhein"
                  className="border-[#DAA520] focus-visible:ring-[#DAA520]"
                  data-ocid="auth.input"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(v) => setAgreeTerms(!!v)}
                  className="border-[#DAA520] data-[state=checked]:bg-[#DAA520]"
                  data-ocid="auth.checkbox"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-gray-600 cursor-pointer"
                >
                  Main terms and conditions se agree karta/karti hoon
                </label>
              </div>

              <Button
                onClick={handleRegister}
                className="w-full bg-[#DAA520] hover:bg-amber-600 text-white font-semibold"
                data-ocid="auth.submit_button"
              >
                Register Karein
              </Button>
            </TabsContent>

            {/* FORGOT PASSWORD */}
            <TabsContent value="forgot" className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Email ya Username
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={forgotId}
                    onChange={(e) => {
                      setForgotId(e.target.value);
                      setForgotSecQ(null);
                    }}
                    placeholder="Apna email ya username likhein"
                    className="border-[#DAA520] focus-visible:ring-[#DAA520]"
                    data-ocid="auth.input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleForgotLookup}
                    className="border-[#DAA520] hover:bg-amber-50 flex-shrink-0 text-xs px-3"
                  >
                    Dhundho
                  </Button>
                </div>
              </div>

              {forgotSecQ && (
                <>
                  <div className="bg-amber-50 border border-[#DAA520] rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Security Question:
                    </p>
                    <p className="text-sm text-gray-800">{forgotSecQ}</p>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Security Answer
                    </Label>
                    <Input
                      value={forgotSecA}
                      onChange={(e) => setForgotSecA(e.target.value)}
                      placeholder="Apna jawab likhein"
                      className="border-[#DAA520] focus-visible:ring-[#DAA520]"
                      data-ocid="auth.input"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Naya Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showForgotPass ? "text" : "password"}
                        value={forgotNewPass}
                        onChange={(e) => setForgotNewPass(e.target.value)}
                        placeholder="Naya password daalein"
                        className="border-[#DAA520] focus-visible:ring-[#DAA520] pr-10"
                        data-ocid="auth.input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotPass(!showForgotPass)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showForgotPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    className="w-full bg-[#DAA520] hover:bg-amber-600 text-white font-semibold"
                    data-ocid="auth.submit_button"
                  >
                    Password Reset Karein
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#DAA520] hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
