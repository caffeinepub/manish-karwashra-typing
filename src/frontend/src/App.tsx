import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createRootRoute, createRoute } from "@tanstack/react-router";
import Home from "./pages/Home";
import LearningTyping from "./pages/LearningTyping";
import LiveTest from "./pages/LiveTest";
import MCQTest from "./pages/MCQTest";
import MockTest from "./pages/MockTest";
import TypingPractice from "./pages/TypingPractice";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const typingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/typing/$examCategory",
  component: TypingPractice,
});

const mcqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mcq/$examCategory",
  component: MCQTest,
});

const liveTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-test",
  component: LiveTest,
});

const mockTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mock-test",
  component: MockTest,
});

const learningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learning",
  component: LearningTyping,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  typingRoute,
  mcqRoute,
  liveTestRoute,
  mockTestRoute,
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
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
