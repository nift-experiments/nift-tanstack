# Local development

Local development guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Use fixture credentials and a loopback service endpoint. Never point an exploratory local build at the production deployment API.

## When to use this guide

The local development workflow belongs to the getting started owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Local development",
  "environment": "staging",
  "observationMinutes": 17,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this local development check without private context.
