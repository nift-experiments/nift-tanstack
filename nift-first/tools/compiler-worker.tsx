import { readFile, mkdir, writeFile } from "node:fs/promises";
import { unified } from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import rehype from "remark-rehype";
import highlight from "rehype-highlight";
import slug from "rehype-slug";
import stringify from "rehype-stringify";
import { compile, runSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
const job = JSON.parse(await readFile(process.argv[2], "utf8"));
const markdown = unified()
  .use(parse)
  .use(gfm)
  .use(rehype)
  .use(slug)
  .use(highlight, { detect: false })
  .use(stringify);
for (const record of job.records) {
  const source = await readFile("../" + record.file, "utf8");
  let html = "",
    islands = false;
  if (record.format === "md") html = String(await markdown.process(source));
  else {
    const compiled = await compile(
      { value: source, path: record.file },
      {
        format: "mdx",
        outputFormat: "function-body",
        development: false,
        remarkPlugins: [gfm],
        rehypePlugins: [slug, [highlight, { detect: false }]],
      },
    );
    const Content = runSync(String(compiled), {
      ...runtime,
      baseUrl: import.meta.url,
    }).default;
    const components = {
      a: ({ href, ...props }: any) => <a href={href} {...props} />,
      Callout: ({
        title,
        tone = "note",
        children,
      }: {
        title: string;
        tone?: string;
        children: ReactNode;
      }) => (
        <aside
          className={"callout callout-" + tone}
          aria-label={tone + ": " + title}
        >
          <strong>
            {tone === "note"
              ? "Note"
              : tone === "warning"
                ? "Warning"
                : "Critical"}
            : {title}
          </strong>
          <div>{children}</div>
        </aside>
      ),
      ServiceTopology: () => (
        <figure>
          <img
            src="/assets/service-topology.svg"
            width="640"
            height="120"
            alt="Gateway sends requests to identity and payments services."
          />
          <figcaption>
            Example service dependencies for a recovery drill.
          </figcaption>
        </figure>
      ),
      Tabs: (props: { labels: string[]; values: string[] }) => {
        islands = true;
        return (
          <div data-island="Tabs" data-props={JSON.stringify(props)}>
            <section>
              <div role="tablist" aria-label="Code example">
                {props.labels.map((label, i) => (
                  <button
                    key={label}
                    role="tab"
                    aria-selected={i === 0}
                    disabled
                  >
                    {label}
                  </button>
                ))}
              </div>
              <pre role="tabpanel" aria-label={props.labels[0]}>
                <code>{props.values[0]}</code>
              </pre>
              <noscript>
                {props.values.slice(1).map((value, i) => (
                  <pre key={i}>{value}</pre>
                ))}
              </noscript>
            </section>
          </div>
        );
      },
      BudgetCalculator: (props: { initial?: number }) => {
        islands = true;
        const n = props.initial ?? 100;
        return (
          <div
            data-island="BudgetCalculator"
            data-props={JSON.stringify(props)}
          >
            <section>
              <label>
                Requests per minute
                <input
                  aria-label="Requests per minute"
                  type="range"
                  min="10"
                  max="1000"
                  defaultValue={n}
                  disabled
                />
              </label>
              <output>
                {n} requests/min · {n * 60} requests/hour
              </output>
              <noscript>Enable JavaScript to adjust the request rate.</noscript>
            </section>
          </div>
        );
      },
    };
    html = renderToStaticMarkup(<Content components={components} />);
  }
  const text = source
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*`|\[\]{}]/g, " ")
    .slice(0, 18000);
  const file = ".generated/rendered/" + record.slug + ".json";
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(
    file,
    JSON.stringify({ html, text, islands, inputKey: record.inputKey }) + "\n",
  );
}
