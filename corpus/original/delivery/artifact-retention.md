# Artifact retention

Artifact retention guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Keep the last ten successful production digests plus all revisions referenced by open incidents. Garbage collection must not remove the active rollback target.

## When to use this guide

The artifact retention workflow belongs to the delivery owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Artifact retention",
  "environment": "staging",
  "observationMinutes": 11,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this artifact retention check without private context.
