# Recovery validation

A successful deployment does not prove that users have recovered. Before closing an incident, choose evidence that exercises the original failure and confirms the repair holds under normal traffic.

## Define the recovery gate

Record the affected service, environment, user operation and symptom in the incident timeline. Pick one user-facing probe, one error or latency signal, and an observation window long enough to cover delayed work. Agree on thresholds before applying the mitigation so a quiet dashboard cannot become the only success criterion.

## Validate the user path

1. Run the operation that originally failed using a safe test account. Check the returned result and any downstream effect, such as a queued notification.
2. Compare errors and latency with the period before the incident. Separate production evidence from staging checks.
3. Inspect queues, retries and scheduled jobs for a backlog that could cause a second failure.
4. Observe the agreed window and record timestamps, signal links and the person who checked each gate.

If any gate fails, keep the incident active and assign a next check with an owner. A rollback may restore requests while leaving data repair unfinished; track that repair explicitly.

## Close with evidence

Write what recovered, what remains degraded and who owns follow-up work. The Services view summarizes historical fixture deployment states, so use it for orientation rather than treating its aggregate health as a live recovery gate.

Practice the process with the [dependency failure drill](../dependency-failure-drills/).
