# Data retention

Data retention guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Document retention by data class and deletion mechanism. Keeping incident metadata does not justify retaining raw customer payloads indefinitely.

## When to use this guide

The data retention workflow belongs to the security & governance owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Data retention",
  "environment": "staging",
  "observationMinutes": 14,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this data retention check without private context.
