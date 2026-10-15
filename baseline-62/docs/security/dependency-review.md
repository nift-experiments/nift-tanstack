# Dependency review

Dependency review guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Review transitive dependency changes as well as direct updates. Pin the lockfile and record exceptions when an urgent patch bypasses normal review.

## When to use this guide

The dependency review workflow belongs to the security & governance owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Dependency review",
  "environment": "staging",
  "observationMinutes": 17,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this dependency review check without private context.
