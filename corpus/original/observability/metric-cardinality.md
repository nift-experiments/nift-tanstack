# Metric cardinality

Metric cardinality guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Bound label values for tenant, path and request identifiers. Unbounded identifiers can turn a small metric into an expensive high-cardinality workload.

## When to use this guide

The metric cardinality workflow belongs to the observability owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Metric cardinality",
  "environment": "staging",
  "observationMinutes": 17,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this metric cardinality check without private context.
