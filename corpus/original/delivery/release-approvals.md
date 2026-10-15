# Release approvals

Release approvals guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Require a second reviewer for production while allowing staging self-service. An approval must identify the artifact digest so a later build cannot inherit it.

## When to use this guide

The release approvals workflow belongs to the delivery owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Release approvals",
  "environment": "staging",
  "observationMinutes": 14,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this release approvals check without private context.
