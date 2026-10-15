# Dependency failure drills

Use a small, reversible drill to learn whether a service handles a slow or unavailable dependency. Start in an isolated test environment with synthetic traffic and a named operator who can end the drill.

## Prepare a bounded experiment

Choose one dependency and one failure mode, such as timeouts. Record the expected timeout, retry limit, fallback behavior and maximum acceptable queue growth. Identify the dashboard and user-facing probe that will reveal a failure. Set a stop time and an explicit abort condition before starting.

## Run and observe

1. Confirm the baseline probe succeeds and save its timing.
2. Inject the agreed failure for the agreed service only. Record the start time.
3. Check that retries are bounded and callers receive the expected fallback or clear error. Watch whether unrelated services degrade.
4. End the injection immediately if the abort condition fires, then verify the injection is disabled.
5. Restore the dependency and validate requests, queues and delayed jobs through the recovery window.

Avoid combining multiple failure modes in the first drill: an unexplained result is easier to investigate when only one condition changed.

## Turn findings into work

Capture expected versus observed behavior, detection delay, recovery time and any manual intervention. Assign owners and completion dates for missing alerts, unsafe retries or absent runbook steps. Repeat the same drill after fixing a finding so improvement has comparable evidence.

Use the [recovery validation guide](../recovery-validation/) to define the final checks.
