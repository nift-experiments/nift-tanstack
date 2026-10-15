# Service dependencies

Service dependencies guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Record service dependencies with ownership and timeout budgets. A downstream identity outage should be visible before restarting every upstream service.

## When to use this guide

The service dependencies workflow belongs to the delivery owner. Capture the service, environment and intended outcome in the change record.

## Operational checklist

- [ ] Identify the accountable owner.
- [ ] Record the baseline and a rollback point.
- [ ] Confirm the change does not expose credentials.
- [ ] Link the resulting evidence in the review.

## Common failure

A successful command does not establish a healthy service. Check the customer-facing probe and compare the new revision against the previous one.

> Escalate when uncertainty affects customer data or production availability.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this service dependencies check without private context.
