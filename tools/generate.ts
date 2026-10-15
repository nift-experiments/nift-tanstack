import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const limit = Number(
  process.argv[2] ||
    JSON.parse(await readFile("corpus/scale.json", "utf8")).pages,
);
if (![62, 500, 1500, 3000].includes(limit))
  throw Error("Supported scales: 62,500,1500,3000");
export type RecordDoc = {
  slug: string;
  title: string;
  section: string;
  file: string;
  format: "md" | "mdx";
  summary: string;
};
const original: RecordDoc[] = JSON.parse(
  await readFile("corpus/original/index.json", "utf8"),
).map((d: any) => ({
  ...d,
  file: d.file.replace("docs/", "corpus/original/"),
  format: "md",
}));
const services = [
  ["payments", "charge", "amountCents", "integer", "currency", "USD"],
  ["gateway", "route", "upstream", "string", "timeoutMs", "250"],
  ["identity", "principal", "role", "string", "sessionMinutes", "30"],
  ["search", "index", "shards", "integer", "replicas", "2"],
  ["notifications", "delivery", "channel", "string", "retryLimit", "5"],
  ["analytics", "event", "retentionDays", "integer", "region", "eu-west"],
  ["storage", "object", "sizeBytes", "integer", "storageClass", "standard"],
  ["compute", "job", "cpuMillis", "integer", "memoryMiB", "512"],
  ["network", "policy", "cidr", "string", "direction", "egress"],
  ["registry", "package", "digest", "string", "visibility", "private"],
  ["observability", "signal", "sampleRate", "number", "windowSeconds", "60"],
  ["security", "grant", "scope", "string", "expiresMinutes", "15"],
  ["workflow", "run", "trigger", "string", "concurrency", "4"],
  ["database", "replica", "lagMs", "integer", "readOnly", "true"],
  ["cache", "lease", "ttlSeconds", "integer", "consistency", "strong"],
  ["edge", "function", "runtime", "string", "regions", "global"],
];
const topics = [
  "create",
  "read",
  "update",
  "delete",
  "list",
  "batch",
  "validate",
  "export",
  "subscribe",
  "retry",
  "idempotency",
  "pagination",
  "rate-limits",
  "webhooks",
  "schema",
  "permissions",
  "audit",
  "quotas",
  "migration",
  "versioning",
  "quickstart",
  "configuration",
  "deployment",
  "rollback",
  "canary",
  "backup",
  "restore",
  "failover",
  "capacity",
  "monitoring",
  "alerting",
  "tracing",
  "authentication-errors",
  "validation-errors",
  "timeout-errors",
  "conflict-errors",
  "throttling-errors",
  "unavailable-errors",
  "stale-data",
  "recovery-checks",
  "architecture",
  "consistency",
  "security-model",
  "retention",
  "ownership",
  "disaster-recovery",
];
const additions: RecordDoc[] = JSON.parse(
  await readFile("corpus/additions.json", "utf8").catch(() => "[]"),
);
const record: RecordDoc[] = [...original, ...additions];
await mkdir("corpus/generated", { recursive: true });
for (let t = 0; t < topics.length && record.length < 3000; t++)
  for (let v = 1; v <= 4 && record.length < 3000; v++)
    for (let n = 0; n < services.length && record.length < 3000; n++) {
      const [service, resource, field, type, option, defaultValue] =
        services[n];
      const topic = topics[t];
      const slug = `reference/${service}/v${v}/${topic}`;
      const mdx = (t + n + v) % 3 === 0;
      const title = `${service}: ${topic.replaceAll("-", " ")} (v${v})`;
      const file = `corpus/generated/${slug}.${mdx ? "mdx" : "md"}`;
      const summary = `${topic.replaceAll("-", " ")} contract for ${service} ${resource} resources in API v${v}.`;
      const timeout = 150 + v * 50 + n * 15,
        quota = 40 + v * 20 + n * 7;
      const endpoint = `/v${v}/${service}/${resource}s`;
      const sample = {
        id: `${resource}_${String(n * 10 + v).padStart(4, "0")}`,
        [field]:
          type === "integer"
            ? 100 * (v + n + 1)
            : type === "number"
              ? 0.25
              : `${service}-${topic}`,
        [option]: defaultValue,
        revision: v,
        workspace: "staging",
      };
      let text = `# ${title}\n\n${summary} This contract is owned by the ${service} team and applies to the v${v} workspace boundary.\n\n## Operational context\n\nThe ${resource} workflow coordinates ${field} with ${option}. Version ${v} uses a ${timeout}ms request budget and a ${quota}-request burst allowance. The limit is scoped to a workspace, not a browser or individual connection. Record a request identifier whenever an operation changes persistent state.\n\n`;
      if (t < 20) {
        text += `## Request contract\n\n\`\`\`http\n${["POST", "GET", "PATCH", "DELETE", "GET"][t % 5]} ${endpoint}${t % 5 === 4 ? "?limit=25" : ""} HTTP/1.1\nAuthorization: Bearer WORKSPACE_TOKEN\nContent-Type: application/json\nIdempotency-Key: ${service}-v${v}-${topic}\n\`\`\`\n\n| Field | Type | Validation |\n| --- | --- | --- |\n| id | string | Stable ${resource} identifier |\n| ${field} | ${type} | Required within this workspace |\n| ${option} | string | Defaults to ${defaultValue} |\n| revision | integer | Compare against revision ${v} before mutation |\n\n## Example payload\n\n\`\`\`json\n${JSON.stringify(sample, null, 2)}\n\`\`\`\n\n### Failure semantics\n\nReject an invalid ${field} with 422 and code \`${service.toUpperCase()}_INVALID_${field.toUpperCase()}\`. A revision mismatch is409 and must not be retried blindly. A throttled response includes Retry-After and does not consume the idempotency key.\n\n`;
      } else if (t < 32) {
        text += `## Safe procedure\n\n1. Inspect the ${resource} baseline and capture revision ${v}.\n2. Validate ${field} and ${option} in a non-production workspace.\n3. Apply ${topic} to a single ${resource}; wait at least ${v + 2} probe windows.\n4. Confirm customer-facing success, then expand scope.\n\n\`\`\`sh\npulse ${service} ${topic} --workspace staging --api-version ${v} --dry-run\npulse ${service} inspect --resource ${sample.id}\n\`\`\`\n\n## Exit and rollback gates\n\n| Signal | Continue | Abort |\n| --- | --- | --- |\n| p95 latency | Below ${timeout}ms | Above ${timeout * 2}ms |\n| Pending work | Below ${quota} | Growing for ${v + 2} windows |\n| Revision | Expected value ${v} | Conflicting writer observed |\n\nKeep the last healthy resource configuration until the owner signs off. For ${service}, validate the ${field} contract as well as process availability; a green process health check does not prove a correct ${resource}.\n\n`;
      } else if (t < 40) {
        text += `## Diagnosis\n\nThe \`${service.toUpperCase()}_${topic.toUpperCase().replaceAll("-", "_")}\` signal identifies a failed ${resource} operation. First distinguish caller input, authorization scope and transient dependency failures.\n\n\`\`\`ts\nconst response = await client.${service}.inspect({\n  id: '${sample.id}',\n  revision: ${v},\n  timeoutMs: ${timeout}\n})\nif (!response.ok) {\n  console.error(response.requestId, response.error.code)\n}\n\`\`\`\n\n### Recovery checklist\n\n- [ ] Preserve the original request identifier and ${field}.\n- [ ] Compare workspace scope and expected revision.\n- [ ] Back off within the ${quota}-request allowance.\n- [ ] Escalate a persistent failure to the ${service} owner.\n\nDo not delete a ${resource} merely to remove an error indicator. Preserve evidence and restore the last healthy ${option} value before reopening traffic.\n\n`;
      } else {
        text += `## Design decision\n\nThe ${service} boundary owns ${resource} identity and the ${field} invariant. Other services may cache a read projection but cannot silently redefine its ${option} policy. Version ${v} makes this ownership explicit so failure handling does not require a distributed implicit transaction.\n\n### Tradeoffs\n\n| Choice | Benefit | Cost |\n| --- | --- | --- |\n| Workspace isolation | Bounded incident scope | Explicit cross-workspace exports |\n| Revision checks | Detect concurrent changes | Caller must recover from409 |\n| ${timeout}ms budget | Predictable request lifetime | Async follow-up for slow work |\n\n\`\`\`yaml\nservice: ${service}\nresource: ${resource}\napiVersion: ${v}\npolicy:\n  ${option}: ${defaultValue}\n  burst: ${quota}\n  timeoutMs: ${timeout}\n\`\`\`\n\n## Review questions\n\nWho may change ${field}? How is an expired ${resource} represented? Which downstream projections can be stale? A design review should answer these questions before enabling a production workspace.\n\n`;
      }
      if (mdx)
        text += `## Interactive examples\n\n<Callout title="${service} safety boundary">Validate workspace scope before changing ${field}. The examples below are interactive React components, hydrated in the same Router application.</Callout>\n\n<Tabs labels={["CLI", "SDK", "HTTP"]} values={["pulse ${service} ${topic} --version ${v}", "client.${service}.${topic.replaceAll("-", "_")}()", "${endpoint}"]} />\n\n<BudgetCalculator initial={${quota}} />\n\n`;
      text += `## Related documentation\n\n[Workspace setup](/docs/start/workspace-setup/) · [${service} create contract](/docs/reference/${service}/v${v}/create/) · [Incident severity](/docs/incidents/severity-policy/)\n\n## Evidence to retain\n\nCapture the UTC time, ${resource} identifier, workspace, API version and outcome. A reviewer must be able to reproduce the ${topic} observation without access to the original operator's browser.\n`;
      await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
      if (
        !(await Bun.file(file).exists()) ||
        process.argv.includes("--regenerate")
      )
        await writeFile(file, text);
      record.push({
        slug,
        title,
        section: `reference/${service}`,
        file,
        format: mdx ? "mdx" : "md",
        summary,
      });
    }
const active = record.slice(0, limit);
await writeFile("corpus/scale.json", JSON.stringify({ pages: limit }) + "\n");
await writeFile("corpus/active.json", JSON.stringify(active, null, 2) + "\n");
await writeFile(
  "corpus/generation.json",
  JSON.stringify(
    {
      version: 1,
      seed: "pulseops-contracts-v1",
      count: active.length,
      original: 62,
      generated: active.filter((d) => d.file.startsWith("corpus/generated/"))
        .length,
      additions: active.filter(d=>d.file.startsWith("corpus/authored/")).length,
      mdx: active.filter((d) => d.format === "mdx").length,
      services: services.length,
      apiVersions: 4,
      topics: topics.length,
      sourceHash: createHash("sha256")
        .update(await readFile("tools/generate.ts"))
        .digest("hex"),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Selected ${active.length} authored documents (${active.filter((d) => d.format === "mdx").length} MDX).`,
);
