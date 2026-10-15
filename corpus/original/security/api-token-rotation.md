# API token rotation

API token rotation guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Issue a new token before revoking the old one. Verify the receiving automation has switched, then remove the overlap after a short bounded interval.

## When to use this guide

The api token rotation workflow belongs to the security & governance owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "API token rotation",
  "environment": "staging",
  "observationMinutes": 11,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this api token rotation check without private context.
