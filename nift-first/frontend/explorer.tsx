import { createRoot } from "react-dom/client";
import { useMemo, useRef, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useForm } from "@tanstack/react-form";
const validateEmail = ({ value }: { value: string }) =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? undefined : "Enter a valid email.";

function Explorer() {
  const [term, setTerm] = useState(""),
    [sorting, setSorting] = useState<SortingState>([]),
    [message, setMessage] = useState("");
  const parent = useRef<HTMLDivElement>(null);
  const {
    data = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["api-reference"],
    queryFn: async () => {
      const r = await fetch("/api/catalog.json");
      if (!r.ok) throw Error("Catalog unavailable");
      return r.json() as Promise<
        { slug: string; title: string; section: string }[]
      >;
    },
  });
  const columns = useMemo(
    () => [
      { accessorKey: "title", header: "Reference" },
      { accessorKey: "section", header: "Section" },
    ],
    [],
  );
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: term, sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const rows = table.getRowModel().rows;
  const virtual = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parent.current,
    estimateSize: () => 48,
    overscan: 8,
  });
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: ({ value }) => {
      setMessage("Local subscription saved for " + value.email);
      localStorage.setItem("pulse-reference-email", value.email);
    },
  });
  return (
    <>
      <h1>API reference explorer</h1>
      <p>
        Query loads the local catalog; Table filters/sorts it; Virtual bounds
        visible rows. This fixture sends no subscription request.
      </p>
      <label>
        Filter API reference
        <input value={term} onChange={(e) => setTerm(e.target.value)} />
      </label>
      {isPending && <p>Loading catalog…</p>}
      {error && <p role="alert">{error.message}</p>}
      <p role="status">{rows.length} matching references</p>
      <div className="row">
        {table.getHeaderGroups().flatMap((g) =>
          g.headers.map((h) => (
            <button key={h.id} onClick={h.column.getToggleSortingHandler()}>
              {flexRender(h.column.columnDef.header, h.getContext())}
              {h.column.getIsSorted() ? " " + h.column.getIsSorted() : ""}
            </button>
          )),
        )}
      </div>
      <div
        ref={parent}
        style={{ height: 384, overflow: "auto" }}
        aria-label="Virtual API references"
        tabIndex={0}
      >
        <div style={{ height: virtual.getTotalSize(), position: "relative" }}>
          {virtual.getVirtualItems().map((v) => {
            const row = rows[v.index];
            return (
              <div
                key={row.id}
                data-index={v.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 48,
                  transform: `translateY(${v.start}px)`,
                }}
              >
                <a href={"/docs/" + row.original.slug + "/"}>
                  {row.original.title}
                </a>{" "}
                · {row.original.section}
              </div>
            );
          })}
        </div>
      </div>
      <h2>Reference updates</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: validateEmail,
            onSubmit: validateEmail,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor="reference-update-email">Update email</label>
              <input
                id="reference-update-email"
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={
                  field.state.meta.errors.length > 0
                    ? "reference-update-email-error"
                    : undefined
                }
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <span id="reference-update-email-error" role="alert">
                  {Array.from(new Set(field.state.meta.errors)).join(", ")}
                </span>
              )}
            </div>
          )}
        </form.Field>
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button disabled={!canSubmit || isSubmitting}>
              Save local subscription
            </button>
          )}
        </form.Subscribe>
        <p role="status">{message}</p>
      </form>
    </>
  );
}
createRoot(document.querySelector("#api-explorer")!).render(
  <QueryClientProvider client={new QueryClient()}>
    <Explorer />
  </QueryClientProvider>,
);
