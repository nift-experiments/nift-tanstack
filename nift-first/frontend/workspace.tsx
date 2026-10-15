import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Dashboard,
  DeploymentTable,
  DeploymentDetail,
  Incidents,
  Settings,
  Services,
  PreferenceRestore,
} from "../../shared/Portal";
import { Capacity } from "../../shared/Capacity";
const root = createRootRoute({
  component: () => (
    <>
      <PreferenceRestore />
      <Outlet />
    </>
  ),
  notFoundComponent: () => <h1>Page not found</h1>,
});
const routes = [
  createRoute({
    getParentRoute: () => root,
    path: "/app",
    component: Dashboard,
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/app/deployments",
    component: () => (
      <>
        <h1>Deployment explorer</h1>
        <DeploymentTable />
      </>
    ),
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/app/deployments/$id",
    component: () => <DeploymentDetail id={detail.useParams().id} />,
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/app/incidents",
    component: Incidents,
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/app/settings",
    component: Settings,
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/app/services",
    component: Services,
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/app/capacity",
    component: Capacity,
  }),
];
const detail = routes[2];
const router = createRouter({ routeTree: root.addChildren(routes) });
// React Links from shared views that target static docs cross the boundary intentionally.
document.addEventListener(
  "click",
  (e) => {
    const a = (e.target as Element).closest?.("a");
    if (
      a &&
      new URL(a.href).origin === location.origin &&
      new URL(a.href).pathname.startsWith("/docs") &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.altKey &&
      e.button === 0
    ) {
      e.preventDefault();
      e.stopPropagation();
      location.assign(a.href);
    }
  },
  true,
);
window.addEventListener("pulse-navigate", (e: Event) => {
  void router.navigate({
    to: (e as CustomEvent<string>).detail
      .replace(/\/index\.html$/, "")
      .replace(/\/$/, ""),
  });
});
const client = new QueryClient();
createRoot(document.querySelector("#workspace")!).render(
  <QueryClientProvider client={client}>
    <Suspense fallback={<p>Loading workspace…</p>}>
      <RouterProvider router={router} />
    </Suspense>
  </QueryClientProvider>,
);
