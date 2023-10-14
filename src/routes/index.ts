import App from "@/App";
import { LinkedInPage } from "@/pages/linkedIn/linkedIn";
import { RootRoute, Route, Router } from "@tanstack/react-router";

// Create a root route
const rootRoute = new RootRoute({
  component: App,
});

export const linkedInProfile = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LinkedInPage,
});

const routeTree = rootRoute.addChildren([linkedInProfile]);

export const router = new Router({ routeTree });
