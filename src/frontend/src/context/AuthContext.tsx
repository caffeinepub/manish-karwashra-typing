import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email?: string;
  username: string;
  passwordHash: string;
  securityQuestion: string;
  securityAnswer: string;
}

export const SECURITY_QUESTIONS = [
  "Aapki maa ka naam?",
  "Aapke school ka naam?",
  "Aapka pehla pet ka naam?",
];

const USERS_KEY = "exam_users";
const CURRENT_USER_KEY = "exam_current_user";

function hashPassword(password: string): string {
  return btoa(password);
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const DEMO_USER: User = {
  id: "DEMO01",
  name: "Demo User",
  username: "demo",
  email: "demo@test.com",
  passwordHash: btoa("demo123"),
  securityQuestion: "Aapka pehla pet ka naam?",
  securityAnswer: "tommy",
};

function ensureDemoUser() {
  const users = getUsers();
  const hasDemo = users.some((u) => u.id === "DEMO01");
  if (!hasDemo) {
    saveUsers([DEMO_USER, ...users]);
  }
}

interface AuthContextType {
  currentUser: User | null;
  login: (
    emailOrUsername: string,
    password: string,
  ) => { success: boolean; error?: string };
  register: (
    emailOrUsername: string,
    password: string,
    securityQuestion: string,
    securityAnswer: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (
    oldPass: string,
    newPass: string,
  ) => { success: boolean; error?: string };
  resetPassword: (
    emailOrUsername: string,
    securityAnswer: string,
    newPass: string,
  ) => { success: boolean; error?: string };
  getSecurityQuestion: (emailOrUsername: string) => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    ensureDemoUser();
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const login = (emailOrUsername: string, password: string) => {
    const users = getUsers();
    const user = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === emailOrUsername.toLowerCase()) ||
        u.username.toLowerCase() === emailOrUsername.toLowerCase(),
    );
    if (!user)
      return {
        success: false,
        error:
          "User nahi mila. Pehle 'Register' tab mein account banayein, ya 'demo' / 'demo123' se try karein",
      };
    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, error: "Password galat hai" };
    }
    setCurrentUser(user);
    return { success: true };
  };

  const register = (
    emailOrUsername: string,
    password: string,
    securityQuestion: string,
    securityAnswer: string,
  ) => {
    const users = getUsers();
    const isEmail = emailOrUsername.includes("@");
    if (isEmail) {
      if (
        users.some(
          (u) => u.email?.toLowerCase() === emailOrUsername.toLowerCase(),
        )
      ) {
        return { success: false, error: "Email pehle se registered hai" };
      }
    } else {
      if (
        users.some(
          (u) => u.username.toLowerCase() === emailOrUsername.toLowerCase(),
        )
      ) {
        return { success: false, error: "Username pehle se liya hua hai" };
      }
    }
    const newUser: User = {
      id: generateId(),
      name: isEmail ? emailOrUsername.split("@")[0] : emailOrUsername,
      email: isEmail ? emailOrUsername : undefined,
      username: isEmail ? emailOrUsername.split("@")[0] : emailOrUsername,
      passwordHash: hashPassword(password),
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
    };
    saveUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, error: "Login karein pehle" };
    if (currentUser.passwordHash !== hashPassword(oldPass)) {
      return { success: false, error: "Purana password galat hai" };
    }
    const users = getUsers();
    const updated = users.map((u) =>
      u.id === currentUser.id
        ? { ...u, passwordHash: hashPassword(newPass) }
        : u,
    );
    saveUsers(updated);
    const updatedUser = { ...currentUser, passwordHash: hashPassword(newPass) };
    setCurrentUser(updatedUser);
    return { success: true };
  };

  const resetPassword = (
    emailOrUsername: string,
    securityAnswer: string,
    newPass: string,
  ) => {
    const users = getUsers();
    const user = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === emailOrUsername.toLowerCase()) ||
        u.username.toLowerCase() === emailOrUsername.toLowerCase(),
    );
    if (!user)
      return {
        success: false,
        error:
          "User nahi mila. Apna sahi email ya username daalein jo register ke time use kiya tha",
      };
    if (user.securityAnswer !== securityAnswer.toLowerCase().trim()) {
      return { success: false, error: "Security answer galat hai" };
    }
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, passwordHash: hashPassword(newPass) } : u,
    );
    saveUsers(updated);
    return { success: true };
  };

  const getSecurityQuestion = (emailOrUsername: string): string | null => {
    const users = getUsers();
    const user = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === emailOrUsername.toLowerCase()) ||
        u.username.toLowerCase() === emailOrUsername.toLowerCase(),
    );
    return user?.securityQuestion || null;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        changePassword,
        resetPassword,
        getSecurityQuestion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
