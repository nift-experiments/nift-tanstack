# Mitigation workflow

Mitigation workflow guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Prefer reversible traffic shifts over untested emergency code changes. Write down the expected result and rollback trigger before each mitigation.

## When to use this guide

The mitigation workflow workflow belongs to the incident response owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Mitigation workflow",
  "environment": "staging",
  "observationMinutes": 14,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this mitigation workflow check without private context.
