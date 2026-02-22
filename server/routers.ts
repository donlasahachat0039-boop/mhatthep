import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return getAllProducts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProductById(input.id);
      }),
    
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1, "ชื่อพระเครื่องจำเป็น"),
        description: z.string().optional(),
        price: z.string().min(1, "ราคาจำเป็น"),
        imageUrl: z.string().optional(),
        imageAlt: z.string().optional(),
        status: z.enum(["available", "unavailable", "sold"]).default("available"),
        category: z.string().optional(),
        monk: z.string().optional(),
        temple: z.string().optional(),
        year: z.string().optional(),
        material: z.string().optional(),
        condition: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createProduct({
            name: input.name,
            description: input.description,
            price: input.price,
            imageUrl: input.imageUrl,
            imageAlt: input.imageAlt,
            status: input.status,
            category: input.category,
            monk: input.monk,
            temple: input.temple,
            year: input.year,
            material: input.material,
            condition: input.condition,
          });
          return { success: true, message: "เพิ่มพระเครื่องสำเร็จ" };
        } catch (error) {
          console.error("Create product error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ไม่สามารถเพิ่มพระเครื่องได้",
          });
        }
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        imageUrl: z.string().optional(),
        imageAlt: z.string().optional(),
        status: z.enum(["available", "unavailable", "sold"]).optional(),
        category: z.string().optional(),
        monk: z.string().optional(),
        temple: z.string().optional(),
        year: z.string().optional(),
        material: z.string().optional(),
        condition: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { id, ...updateData } = input;
          
          // Filter out undefined values
          const cleanData = Object.fromEntries(
            Object.entries(updateData).filter(([, v]) => v !== undefined)
          );
          
          await updateProduct(id, cleanData);
          return { success: true, message: "อัปเดตพระเครื่องสำเร็จ" };
        } catch (error) {
          console.error("Update product error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ไม่สามารถอัปเดตพระเครื่องได้",
          });
        }
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          await deleteProduct(input.id);
          return { success: true, message: "ลบพระเครื่องสำเร็จ" };
        } catch (error) {
          console.error("Delete product error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ไม่สามารถลบพระเครื่องได้",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
