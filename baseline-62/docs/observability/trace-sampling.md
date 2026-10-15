# Trace sampling

Trace sampling guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Sample successful traces predictably while retaining error traces within a bounded budget. Never attach raw customer payloads merely to make a trace easier to debug.

## When to use this guide

The trace sampling workflow belongs to the observability owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Trace sampling",
  "environment": "staging",
  "observationMinutes": 14,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this trace sampling check without private context.
