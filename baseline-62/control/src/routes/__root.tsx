import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Header, PreferenceRestore } from "../../../shared/Portal";
import css from "../../../shared/site.css?url";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "PulseOps · Developer operations" },
      ],
      links: [{ rel: "stylesheet", href: css }],
    }),
    component: Root,
    notFoundComponent: () => (
      <main>
        <h1>Page not found</h1>
        <a href="/">Return home</a>
      </main>
    ),
  },
);
function Root() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <PreferenceRestore />
        <Header docsClient />
        <main>
          <Outlet />
        </main>
        <footer>PulseOps · Local developer operations workspace</footer>
        <Scripts />
      </body>
    </html>
  );
}
