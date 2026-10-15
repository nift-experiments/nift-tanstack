# Error budgets

Error budgets guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Calculate remaining budget over the agreed rolling window. Exhausted budget should pause risky releases rather than silently changing the objective.

## When to use this guide

The error budgets workflow belongs to the observability owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Error budgets",
  "environment": "staging",
  "observationMinutes": 11,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this error budgets check without private context.
