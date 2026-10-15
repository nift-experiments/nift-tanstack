# CLI installation

CLI installation guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Pin the CLI version in the repository toolchain file. Confirm the resolved executable before running a deployment from an automated shell.

## When to use this guide

The cli installation workflow belongs to the getting started owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "CLI installation",
  "environment": "staging",
  "observationMinutes": 14,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this cli installation check without private context.

## Scoped package example

```sh
npm install --save-dev @pulse/cli
```

A package scope is literal source text, not a template instruction.
