import { createFileRoute, notFound } from "@tanstack/react-router";
import { DeploymentDetail } from "../../../shared/Portal";
import { portalQuery } from "../../../shared/data";
export const Route = createFileRoute("/app/deployments/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(portalQuery);
    if (!data.deployments.some((d) => d.id === params.id)) throw notFound();
    return data;
  },
  component: Detail,
});
function Detail() {
  const { id } = Route.useParams();
  return <DeploymentDetail id={id} />;
}
