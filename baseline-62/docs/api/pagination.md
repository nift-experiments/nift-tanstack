# Pagination

Pagination guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Treat cursors as opaque values bound to the original filter. Return a clear invalid-cursor error if a client changes its filter midway through a result set.

## When to use this guide

The pagination workflow belongs to the api reference owner. Capture the service, environment and intended outcome in the change record.

## Request

```http
GET /v1/pagination?limit=25 HTTP/1.1
Authorization: Bearer TOKEN
Accept: application/json
```

## Response contract

| Field | Type | Meaning |
| --- | --- | --- |
| data | array | Visible workspace records |
| nextCursor | string or null | Continuation token |
| requestId | string | Correlation identifier |

Reject missing credentials with 401; invalid input with 422. Retry 429 responses only after the Retry-After interval.

## Verification

Record the timestamp, workspace and revision. The reviewer should be able to repeat this pagination check without private context.
