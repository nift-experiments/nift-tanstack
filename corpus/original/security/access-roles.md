# Access roles

Access roles guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Separate reader, deployer and administrator permissions. A deployer should not automatically gain the ability to rotate every workspace credential.

## When to use this guide

The access roles workflow belongs to the security & governance owner. Capture the service, environment and intended outcome in the change record.

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

Record the timestamp, workspace and revision. The reviewer should be able to repeat this access roles check without private context.
