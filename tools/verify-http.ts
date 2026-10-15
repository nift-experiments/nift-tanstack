import assert from "node:assert/strict";
const bases = ["http://127.0.0.1:4212", "http://127.0.0.1:4213"];
let checks = 0;
for (const base of bases) {
  for (const path of [
    "/",
    "/docs/",
    "/docs/start/workspace-setup/",
    "/docs/reference/gateway/v2/create/",
    "/app",
    "/app/deployments",
    "/app/deployments/dpl-075",
    "/app/incidents",
    "/app/services",
    "/app/settings",
    "/app/capacity",
    "/search-index.json",
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, base + path);
    checks++;
  }
  for (const path of [
    "/docs/missing/",
    "/app/deployments/no-such-deployment",
    "/not-found",
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404, base + path);
    checks++;
  }
}
console.log(JSON.stringify({ checks, bases }));
