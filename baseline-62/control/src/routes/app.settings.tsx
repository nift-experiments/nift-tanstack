import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "../../../shared/Portal";
import { portalQuery } from "../../../shared/data";
export const Route = createFileRoute("/app/settings")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQuery),
  component: () => (
    <>
      <Settings />
    </>
  ),
});
