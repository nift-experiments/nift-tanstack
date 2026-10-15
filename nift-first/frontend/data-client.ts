import { queryOptions } from "@tanstack/react-query";
import type fixtures from "../../shared/fixtures.json";
export async function getPortalData(): Promise<typeof fixtures> {
  const r = await fetch("/api/fixtures.json");
  if (!r.ok) throw Error("Fixture API unavailable");
  return r.json();
}
export const portalQuery = queryOptions({
  queryKey: ["portal"],
  queryFn: getPortalData,
  staleTime: 30000,
});
