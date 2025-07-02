import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convexUrl = process.env.CONVEX_URL || "http://localhost:3210";

export const db = new ConvexClient(convexUrl);

// Re-export the generated API types for convenience
export { api };
