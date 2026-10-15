# List deployments

List deployments guidance for reliable service operations. Use this procedure in a staging workspace before production.

## Specific operating contract

Return only deployments visible to the workspace principal. Stable sorting by creation timestamp plus identifier prevents cursor pages from duplicating tied records.

## When to use this guide

The list deployments workflow belongs to the api reference owner. Capture the service, environment and intended outcome in the change record.

## Request

```http
GET /v1/list-deployments?limit=25 HTTP/1.1
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

Record the timestamp, workspace and revision. The reviewer should be able to repeat this list deployments check without private context.
