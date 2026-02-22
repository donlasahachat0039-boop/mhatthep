import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("products router", () => {
  it("should list all products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should get product by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get all products
    const products = await caller.products.list();

    if (products.length > 0) {
      const firstProduct = products[0];
      const result = await caller.products.getById({ id: firstProduct.id });

      expect(result).toBeDefined();
      expect(result?.id).toBe(firstProduct.id);
      expect(result?.name).toBe(firstProduct.name);
    }
  });

  it("should return undefined for non-existent product", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.getById({ id: 99999 });

    expect(result).toBeUndefined();
  });
});
