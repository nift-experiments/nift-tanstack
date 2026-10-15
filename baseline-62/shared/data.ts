import { createServerFn } from "@tanstack/react-start";
import fixtures from "./fixtures.json";
import { queryOptions } from "@tanstack/react-query";
export const getPortalData = createServerFn({ method: "GET" }).handler(
  async () => fixtures,
);
export const portalQuery = queryOptions({
  queryKey: ["portal"],
  queryFn: () => getPortalData(),
  staleTime: 30000,
});
