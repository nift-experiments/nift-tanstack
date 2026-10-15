# Postmortem writing

Postmortem writing guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Separate triggering events from contributing conditions. The review should explain how the system allowed the event to become customer impact.

## When to use this guide

The postmortem writing workflow belongs to the incident response owner. Capture the service, environment and intended outcome in the change record.

## Decision table

| Signal | Threshold | Action |
| --- | --- | --- |
| Error ratio | > 1% for 5m | Pause and investigate |
| p95 latency | > 250ms | Compare baseline traces |
| Healthy probes | < 99% | Notify service owner |

## Configuration

```json
{
  "workflow": "Postmortem writing",
  "environment": "staging",
  "observationMinutes": 17,
  "owner": "platform"
}
```

Keep environment-specific values in the workspace configuration. Review threshold changes with the service owner.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this postmortem writing check without private context.
