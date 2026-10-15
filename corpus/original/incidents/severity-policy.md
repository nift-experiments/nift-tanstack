# Severity policy

Severity policy guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Use customer impact and data risk to assign severity. A small number of affected administrative users can still justify the highest severity when data integrity is uncertain.

## When to use this guide

The severity policy workflow belongs to the incident response owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Severity policy",
  "environment": "staging",
  "observationMinutes": 11,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this severity policy check without private context.
