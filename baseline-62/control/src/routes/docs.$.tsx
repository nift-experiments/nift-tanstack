import { createFileRoute, notFound } from "@tanstack/react-router";
import { getDoc } from "../docs-data";
import { Sidebar } from "../../../shared/Docs";
export const Route = createFileRoute("/docs/$")({
  loader: async ({ params }) => {
    const doc = await getDoc({ data: params._splat || "" });
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: (loaderData?.title || "Docs") + " · PulseOps" }],
  }),
  component: Doc,
});
function Doc() {
  const doc = Route.useLoaderData();
  return (
    <div className="doc-layout">
      <Sidebar />
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />
    </div>
  );
}
