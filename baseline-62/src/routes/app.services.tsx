import { createFileRoute } from "@tanstack/react-router";
import { Services } from "../../shared/Portal";
import { portalQuery } from "../../shared/data";
export const Route = createFileRoute("/app/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQuery),
  component: Services,
});
