import { createFileRoute } from "@tanstack/react-router";
import { getCatalog } from "../../../shared/content-api";
import { Knowledge } from "../../../shared/Knowledge";
export const Route = createFileRoute("/docs/")({
  loader: () => getCatalog(),
  component: () => <Knowledge catalog={Route.useLoaderData()} />,
});
