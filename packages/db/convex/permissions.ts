import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List all available permissions
export const listPermissions = query(async (ctx) => {
  return await ctx.db.query("permissions").collect();
});

// Find a permission by its ID
export const findPermissionById = query({
  args: { id: v.id("permissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Find a permission by its resource and action
export const findPermissionByResourceAction = query({
  args: { resource: v.string(), action: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("permissions")
      .filter((q) => 
        q.and(
          q.eq(q.field("resource"), args.resource),
          q.eq(q.field("action"), args.action)
        )
      )
      .unique();
  },
});

// Create a new permission
export const createPermission = mutation({
  args: { resource: v.string(), action: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("permissions", args);
  },
});

// Update a permission's details
export const updatePermission = mutation({
  args: { permissionId: v.id("permissions"), updates: v.object({ resource: v.optional(v.string()), action: v.optional(v.string()) }) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.permissionId, args.updates);
  },
});
