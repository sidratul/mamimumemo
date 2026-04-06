import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { resolvers } from "./health.resolver.ts";

Deno.test("healthCheck resolver", () => {
  const result = resolvers.Query.healthCheck();
  assertEquals(result, "Server is up and running!");
});
