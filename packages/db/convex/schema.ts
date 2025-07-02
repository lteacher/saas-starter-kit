import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    username: v.string(),
    passwordHash: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    isActive: v.boolean(),
    isVerified: v.boolean(),
  }).index("by_email", ["email"]),

  roles: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }).index("by_name", ["name"]),

  permissions: defineTable({
    action: v.string(),
    resource: v.string(),
  }),

  user_roles: defineTable({
    userId: v.id("users"),
    roleId: v.id("roles"),
  }).index("by_user_role", ["userId", "roleId"]),

  role_permissions: defineTable({
    roleId: v.id("roles"),
    permissionId: v.id("permissions"),
  }).index("by_role_permission", ["roleId", "permissionId"]),
});
