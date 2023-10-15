import App from "@/App";
import { LoginPage } from "@/pages/login/login";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import {
  RootRoute,
  Route,
  Router,
  createMemoryHistory,
} from "@tanstack/react-router";

// Create a root route
const rootRoute = new RootRoute({
  component: () => (
    <>
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        <LoginPage />
      </SignedOut>
    </>
  ),
});

export const home = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <>
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        <LoginPage />
      </SignedOut>
    </>
  ),
});

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"], // Pass your initial url
});

const routeTree = rootRoute.addChildren([home, loginRoute]);

export const router = new Router({ routeTree, history: memoryHistory });
