### **Revised Plan of Attack**

#### Phase 1: Environment Setup & Teardown

1.  **Introduce Convex Docker Environment:** Create a `docker-compose.yml` and a corresponding `.env` file in `packages/db` to run the self-hosted Convex services using PostgreSQL, based on the official Convex examples.
2.  **Remove EdgeDB:** Delete all EdgeDB files (`dbschema/`, `gel.toml`, old `docker-compose.yml`), and remove EdgeDB dependencies from all `package.json` files.

#### Phase 2: Schema Definition & Backend Refactoring

1.  **Define Convex Schema:** The new database schema will be defined in `packages/db/convex/schema.ts`. This file will contain all `defineTable` and `defineSchema` calls, serving as the source of truth for the database structure, keeping it correctly isolated in the `db` package.
2.  **Implement Convex Data Layer:** In the `services/api` package, create a new directory, for example `src/lib/convex/`, to hold all Convex query and mutation functions. These functions will replace the logic currently in `src/lib/user.ts`, `src/lib/role.ts`, etc., and will be responsible for all interactions with the Convex database.
3.  **Update API Handlers:** The Elysia handlers in `services/api/src/handlers/*.ts` will be updated to call the new Convex data layer functions. Their responsibility will be to mediate between incoming API requests and the Convex functions, ensuring the data returned to the client matches the existing API contract.

#### Phase 3: API Integration & Verification

1.  **Preserve the API Contract:** The core goal is to keep the public-facing API contract identical. The frontend should not be aware of the database switch. The `apiClient` used by the UI will continue to work without changes.
2.  **Adapt Shared Packages:**
    *   **`packages/schemas`**: The TypeBox schemas that define the API request and response shapes should not need to change. The backend will handle any necessary data transformation.
    *   **`packages/types`**: Similarly, the shared TypeScript types should remain stable. Convex's auto-generated types can be leveraged *within the backend* to ensure type safety between the API and the database, but these types will not be exposed to the frontend.

#### Phase 4: Finalization

1.  **Update Documentation:** Update the `README.md` and other project documentation to reflect the new database stack.
2.  **Cleanup:** Perform a final check to remove any unused files or dependencies.
