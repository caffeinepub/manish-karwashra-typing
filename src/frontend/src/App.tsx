import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createRootRoute, createRoute, redirect } from "@tanstack/react-router";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import LearningTyping from "./pages/LearningTyping";
import LiveTest from "./pages/LiveTest";
import LoginPage from "./pages/LoginPage";
import MCQTest from "./pages/MCQTest";
import MockTest from "./pages/MockTest";
import TypingPractice from "./pages/TypingPractice";

function isLoggedIn(): boolean {
  try {
    return !!JSON.parse(localStorage.getItem("exam_current_user") || "null");
  } catch {
    return false;
  }
}

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: Home,
});

const typingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/typing/$examCategory",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: TypingPractice,
});

const mcqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mcq/$examCategory",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: MCQTest,
});

const liveTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-test",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: LiveTest,
});

const liveTestExamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-test/$examSlug",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: LiveTest,
});

const mockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-test",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: MockTest,
});

const mockTestExamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-test/$examSlug",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: MockTest,
});

const learningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learning",
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: "/login" });
  },
  component: LearningTyping,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  typingRoute,
  mcqRoute,
  liveTestRoute,
  liveTestExamRoute,
  mockTestRoute,
  mockTestExamRoute,
  learningRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
