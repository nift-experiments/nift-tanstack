import { createFileRoute } from "@tanstack/react-router";
import { DeploymentTable } from "../../../shared/Portal";
import { portalQuery } from "../../../shared/data";
export const Route = createFileRoute("/app/deployments/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQuery),
  component: () => (
    <>
      <h1>Deployments</h1>
      <DeploymentTable />
    </>
  ),
});
