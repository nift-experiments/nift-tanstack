# Canary releases

Canary releases guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Route one percent of traffic to the candidate before expanding. Compare error ratio and latency against the stable cohort, not against an unrelated daily average.

## When to use this guide

The canary releases workflow belongs to the delivery owner. Capture the service, environment and intended outcome in the change record.

## Operational checklist

- [ ] Identify the accountable owner.
- [ ] Record the baseline and a rollback point.
- [ ] Confirm the change does not expose credentials.
- [ ] Link the resulting evidence in the review.

## Common failure

A successful command does not establish a healthy service. Check the customer-facing probe and compare the new revision against the previous one.

> Escalate when uncertainty affects customer data or production availability.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this canary releases check without private context.
