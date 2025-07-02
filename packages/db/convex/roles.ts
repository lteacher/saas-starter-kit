import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper to get role details with permissions
const getRoleDetails = async (ctx: any, role: any) => {
  if (!role) return null;
  const rolePermissions = await ctx.db
    .query("role_permissions")
    .withIndex("by_role_permission", (q: any) => q.eq("roleId", role._id))
    .collect();
  const permissionIds = rolePermissions.map((rp: any) => rp.permissionId);
  const permissions = await Promise.all(permissionIds.map((id: any) => ctx.db.get(id)));
  return { ...role, permissions: permissions.filter(Boolean) };
};

// List all roles with their permissions
export const listRoles = query(async (ctx) => {
  const roles = await ctx.db.query("roles").collect();
  return Promise.all(roles.map(role => getRoleDetails(ctx, role)));
});

// Find a role by its ID
export const findRoleById = query({
  args: { id: v.id("roles") },
  handler: async (ctx, args) => {
    const role = await ctx.db.get(args.id);
    return getRoleDetails(ctx, role);
  },
});

// Find a role by its name
export const findRoleByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roles")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
  },
});

// Create a new role
export const createRole = mutation({
  args: { name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roles", args);
  },
});

// Update a role's information
export const updateRole = mutation({
  args: { roleId: v.id("roles"), updates: v.object({ name: v.optional(v.string()), description: v.optional(v.string()) }) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roleId, args.updates);
  },
});

// Assign a set of permissions to a role
export const assignPermissionsToRole = mutation({
  args: { roleId: v.id("roles"), permissionIds: v.array(v.id("permissions")) },
  handler: async (ctx, args) => {
    // Clear existing permissions for simplicity. A more robust solution might do a diff.
    const existing = await ctx.db.query("role_permissions").withIndex("by_role_permission", q => q.eq("roleId", args.roleId)).collect();
    await Promise.all(existing.map(link => ctx.db.delete(link._id)));

    // Add new permissions
    await Promise.all(
      args.permissionIds.map(permissionId => 
        ctx.db.insert("role_permissions", { roleId: args.roleId, permissionId })
      )
    );
  },
});
