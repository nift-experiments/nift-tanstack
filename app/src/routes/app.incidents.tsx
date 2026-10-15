import { createFileRoute } from "@tanstack/react-router";
import { Incidents } from "../../../shared/Portal";
import { portalQuery } from "../../../shared/data";
export const Route = createFileRoute("/app/incidents")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQuery),
  component: () => (
    <>
      <Incidents />
    </>
  ),
});
