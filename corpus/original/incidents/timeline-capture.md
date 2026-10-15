# Timeline capture

Timeline capture guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Capture UTC timestamps from source systems and annotate clock skew. Preserve original event text instead of rewriting it to fit the eventual root-cause narrative.

## When to use this guide

The timeline capture workflow belongs to the incident response owner. Capture the service, environment and intended outcome in the change record.

## Operational checklist

- [ ] Identify the accountable owner.
- [ ] Record the baseline and a rollback point.
- [ ] Confirm the change does not expose credentials.
- [ ] Link the resulting evidence in the review.

## Common failure

A successful command does not establish a healthy service. Check the customer-facing probe and compare the new revision against the previous one.

> Escalate when uncertainty affects customer data or production availability.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this timeline capture check without private context.
