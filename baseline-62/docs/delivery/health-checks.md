# Health checks

Health checks guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Probe the externally visible transaction rather than only the process port. A running process with a broken database connection is not a healthy deployment.

## When to use this guide

The health checks workflow belongs to the delivery owner. Capture the service, environment and intended outcome in the change record.

## Operational checklist

- [ ] Identify the accountable owner.
- [ ] Record the baseline and a rollback point.
- [ ] Confirm the change does not expose credentials.
- [ ] Link the resulting evidence in the review.

## Common failure

A successful command does not establish a healthy service. Check the customer-facing probe and compare the new revision against the previous one.

> Escalate when uncertainty affects customer data or production availability.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this health checks check without private context.
