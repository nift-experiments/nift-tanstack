# Audit events

Audit events guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Record actor, action, target and outcome for privileged events. Audit records need a stable identifier and an explicit retention policy.

## When to use this guide

The audit events workflow belongs to the security & governance owner. Capture the service, environment and intended outcome in the change record.

## Operational checklist

- [ ] Identify the accountable owner.
- [ ] Record the baseline and a rollback point.
- [ ] Confirm the change does not expose credentials.
- [ ] Link the resulting evidence in the review.

## Common failure

A successful command does not establish a healthy service. Check the customer-facing probe and compare the new revision against the previous one.

> Escalate when uncertainty affects customer data or production availability.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this audit events check without private context.
