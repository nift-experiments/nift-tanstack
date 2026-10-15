# Latency analysis

Latency analysis guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Compare p50, p95 and p99 by route and deployment revision. A low global average can conceal a failing high-value endpoint.

## When to use this guide

The latency analysis workflow belongs to the observability owner. Capture the service, environment and intended outcome in the change record.

## Operational checklist

- [ ] Identify the accountable owner.
- [ ] Record the baseline and a rollback point.
- [ ] Confirm the change does not expose credentials.
- [ ] Link the resulting evidence in the review.

## Common failure

A successful command does not establish a healthy service. Check the customer-facing probe and compare the new revision against the previous one.

> Escalate when uncertainty affects customer data or production availability.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this latency analysis check without private context.
