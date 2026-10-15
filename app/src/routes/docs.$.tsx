import { createFileRoute, notFound } from "@tanstack/react-router";
import { getDoc } from "../../../shared/content-api";
import { Document } from "../../../shared/Document";
export const Route = createFileRoute("/docs/$")({
  loader: async ({ params }) => {
    const doc = await getDoc({ data: params._splat || "" });
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: (loaderData?.title || "Documentation") + " · PulseOps" }],
  }),
  component: () => <Document doc={Route.useLoaderData()} />,
});
