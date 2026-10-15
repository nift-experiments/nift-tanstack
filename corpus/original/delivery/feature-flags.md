# Feature flags

Feature flags guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Give every feature flag an owner and removal date. Evaluate the off path in staging because rollback frequently relies on a path nobody has exercised recently.

## When to use this guide

The feature flags workflow belongs to the delivery owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Feature flags",
  "environment": "staging",
  "observationMinutes": 17,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this feature flags check without private context.
