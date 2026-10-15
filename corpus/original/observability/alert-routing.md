# Alert routing

Alert routing guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Route urgent pages to the accountable on-call rotation. A dashboard notification is insufficient for an alert that requires action within five minutes.

## When to use this guide

The alert routing workflow belongs to the observability owner. Capture the service, environment and intended outcome in the change record.

## Operational checklist

- [ ] Identify the accountable owner.
- [ ] Record the baseline and a rollback point.
- [ ] Confirm the change does not expose credentials.
- [ ] Link the resulting evidence in the review.

## Common failure

A successful command does not establish a healthy service. Check the customer-facing probe and compare the new revision against the previous one.

> Escalate when uncertainty affects customer data or production availability.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this alert routing check without private context.
