import { v } from "convex/values";
import { internalQuery, internalMutation, query, mutation } from "./_generated/server";

// Internal helper to get full user details, including roles and permissions
const getUserDetails = async (ctx: any, user: any) => {
  if (!user) return null;

  const userRoles = await ctx.db
    .query("user_roles")
    .withIndex("by_user_role", (q: any) => q.eq("userId", user._id))
    .collect();

  const roleIds = userRoles.map((ur: any) => ur.roleId);
  const roles = await Promise.all(
    roleIds.map((roleId: any) => ctx.db.get(roleId))
  );

  const permissions = await Promise.all(
    roles.map(async (role: any) => {
      if (!role) return [];
      const rolePermissions = await ctx.db
        .query("role_permissions")
        .withIndex("by_role_permission", (q: any) => q.eq("roleId", role._id))
        .collect();
      const permissionIds = rolePermissions.map((rp: any) => rp.permissionId);
      return Promise.all(permissionIds.map((pId: any) => ctx.db.get(pId)));
    })
  );

  return {
    ...user,
    roles: roles.map((role: any, i: number) => ({
      ...role,
      permissions: permissions[i].flat().filter(Boolean),
    })),
  };
};

// Find a user by their email address
export const findUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    return getUserDetails(ctx, user);
  },
});

// Find a user by their ID
export const findUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    return getUserDetails(ctx, user);
  },
});

// Create a new user and assign them the default 'user' role
export const createUser = mutation({
  args: {
    email: v.string(),
    username: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
      isActive: true,
      isVerified: false, // Or true, depending on business logic
    });

    const defaultRole = await ctx.db
      .query("roles")
      .withIndex("by_name", (q) => q.eq("name", "user"))
      .unique();

    if (defaultRole) {
      await ctx.db.insert("user_roles", {
        userId,
        roleId: defaultRole._id,
      });
    }

    return { id: userId, email: args.email, username: args.username };
  },
});

// Update user profile information
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    updates: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      username: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, args.updates);
  },
});

// Get a paginated list of users
export const listUsers = query({
  args: { paginationOpts: v.any() }, // Simplified for now
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").order("desc").collect();
    // This is a simplified version. Real pagination would use cursors.
    // For now, we fetch all and let the API handler slice.
    return Promise.all(
      users.map(async (user) => {
        const userRoles = await ctx.db
          .query("user_roles")
          .withIndex("by_user_role", (q) => q.eq("userId", user._id))
          .collect();
        const roleIds = userRoles.map((ur) => ur.roleId);
        const roles = await Promise.all(roleIds.map((id) => ctx.db.get(id)));
        return { ...user, roles: roles.filter(Boolean) };
      })
    );
  },
});
