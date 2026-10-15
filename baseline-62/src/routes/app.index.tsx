import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "../../shared/Portal";
import { portalQuery } from "../../shared/data";
export const Route = createFileRoute("/app/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQuery),
  component: () => (
    <>
      <Dashboard />
    </>
  ),
});
