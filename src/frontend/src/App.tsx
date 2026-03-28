import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createRootRoute, createRoute } from "@tanstack/react-router";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./context/AuthContext";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPanel from "./pages/AdminPanel";
import DailyChallengePage from "./pages/DailyChallengePage";
import DictationPage from "./pages/DictationPage";
import ExamModePage from "./pages/ExamModePage";
import GamesPage from "./pages/GamesPage";
import HartronMockPage from "./pages/HartronMockPage";
import Home from "./pages/Home";
import LeaderboardPage from "./pages/LeaderboardPage";
import LearningTyping from "./pages/LearningTyping";
import LiveTest from "./pages/LiveTest";
import LoginPage from "./pages/LoginPage";
import MCQTest from "./pages/MCQTest";
import MockTest from "./pages/MockTest";
import MockTestListPage from "./pages/MockTestListPage";
import PracticePage from "./pages/PracticePage";
import ProfilePage from "./pages/ProfilePage";
import ProgressPage from "./pages/ProgressPage";
import ResultsHistory from "./pages/ResultsHistory";
import SettingsPage from "./pages/SettingsPage";
import TypingPractice from "./pages/TypingPractice";
import TypingTestPage from "./pages/TypingTestPage";

function withLayout(Component: React.ComponentType) {
  return function WrappedComponent() {
    return (
      <AppLayout>
        <Component />
      </AppLayout>
    );
  };
}

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-login",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: withLayout(Home),
});

const typingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/typing/$examCategory",
  component: withLayout(TypingPractice),
});

const mcqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mcq/$examCategory",
  component: withLayout(MCQTest),
});

const liveTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-test",
  component: withLayout(LiveTest),
});

const liveTestExamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-test/$examSlug",
  component: withLayout(LiveTest),
});

const mockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-test",
  component: withLayout(MockTest),
});

const mockTestExamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-test/$examSlug",
  component: withLayout(MockTest),
});

const mockListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-list",
  component: withLayout(MockTestListPage),
});

const mockTestNumberedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-test/$examSlug/$mockNumber",
  component: withLayout(MockTest),
});

const hartronMockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hartron-mock/$mockNumber",
  component: withLayout(HartronMockPage),
});

const learningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learning",
  component: withLayout(LearningTyping),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: withLayout(ResultsHistory),
});

const typingTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/typing-test",
  component: withLayout(TypingTestPage),
});

const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/practice",
  component: withLayout(PracticePage),
});

const examModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exam-mode",
  component: withLayout(ExamModePage),
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games",
  component: withLayout(GamesPage),
});

const dictationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dictation",
  component: withLayout(DictationPage),
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progress",
  component: withLayout(ProgressPage),
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: withLayout(LeaderboardPage),
});

const dailyChallengeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/daily-challenge",
  component: withLayout(DailyChallengePage),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: withLayout(SettingsPage),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: withLayout(ProfilePage),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  adminLoginRoute,
  adminRoute,
  indexRoute,
  typingRoute,
  mcqRoute,
  liveTestRoute,
  liveTestExamRoute,
  mockTestRoute,
  mockTestExamRoute,
  mockListRoute,
  mockTestNumberedRoute,
  hartronMockRoute,
  learningRoute,
  resultsRoute,
  typingTestRoute,
  practiceRoute,
  examModeRoute,
  gamesRoute,
  dictationRoute,
  progressRoute,
  leaderboardRoute,
  dailyChallengeRoute,
  settingsRoute,
  profileRoute,
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
