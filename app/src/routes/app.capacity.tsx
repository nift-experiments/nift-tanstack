import { createFileRoute } from "@tanstack/react-router";
import { Capacity } from "../../../shared/Capacity";
import { portalQuery } from "../../../shared/data";
export const Route = createFileRoute("/app/capacity")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQuery),
  component: Capacity,
});
