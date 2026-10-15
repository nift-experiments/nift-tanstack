# Recovery evidence checklist

A recovery drill is complete when an operator can explain what recovered, how it was checked and who owns the remaining work.

## Before the drill

Record the service, environment, last healthy revision, dependency owners and a rollback deadline. Use the [capacity workspace](/app/capacity) to compare deployment execution demand with the team's selected budget. Preserve the threshold and environment alongside the result so another operator can repeat the comparison.

## During recovery

Keep a timestamped log of each action and its outcome. Stop the drill when the agreed error or latency limit is crossed. Confirm downstream dependencies as well as the entry point; an HTTP success at the gateway alone is insufficient evidence.

| Evidence | Required observation |
| --- | --- |
| Release | Expected revision is active |
| Dependencies | Identity and payments checks pass |
| Customer path | A representative transaction completes |
| Monitoring | Error and latency signals return to baseline |
| Ownership | Follow-up work has an owner and deadline |

## Close the loop

Separate simulated fixture observations from real measurements. The capacity table summarizes historical deployment durations and does not measure CPU, memory or requests per second. Attach actual monitoring evidence before making infrastructure decisions.

Repeat the [capacity drill guide](/docs/reliability-advanced/capacity-drills) after a material dependency or release-process change.
