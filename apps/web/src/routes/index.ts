import App from "@/App";
import {
  RootRoute,
  Route,
  Router,
  createMemoryHistory,
} from "@tanstack/react-router";

// Create a root route
const rootRoute = new RootRoute({
  component: App,
});

export const home = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"], // Pass your initial url
});

const routeTree = rootRoute.addChildren([home]);

export const router = new Router({ routeTree, history: memoryHistory });
