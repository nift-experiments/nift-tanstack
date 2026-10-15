# Rollback strategy

Rollback strategy guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Rollback application and configuration together when the contract changed. Database rollback requires an explicit compatibility plan; restoring code alone may not be safe.

## When to use this guide

The rollback strategy workflow belongs to the delivery owner. Capture the service, environment and intended outcome in the change record.

## Procedure

1. Confirm the workspace and service owner.
2. Inspect the latest deployment and its health indicators.
3. Apply the smallest reversible change.
4. Verify the outcome for ten minutes before closing the record.

```sh
pulse inspect payments --environment staging
pulse verify payments --window 10m
```

## Recovery

If the error rate exceeds the service objective, stop the rollout and restore the last known healthy revision. Preserve the request identifiers for investigation.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this rollback strategy check without private context.
