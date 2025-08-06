import type { ObjectId } from 'mongodb';

// MongoDB document with _id field
interface MongoDocument {
  _id: ObjectId;
  [key: string]: any;
}

// Transforms MongoDB _id to id for a single document
export const transformMongoId = <T extends MongoDocument>(
  doc: T,
): Omit<T, '_id'> & { id: string } => {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
  } as Omit<T, '_id'> & { id: string };
};

// Transforms MongoDB _id to id for an array of documents
export const transformMongoIds = <T extends MongoDocument>(
  docs: T[],
): (Omit<T, '_id'> & { id: string })[] => {
  return docs.map(transformMongoId);
};

// Transforms user document with nested roles
export const transformUserWithRoles = (user: any): any => {
  const { _id: userId, ...userData } = user;
  return {
    ...userData,
    id: userId.toString(),
    roles: user.roles.map((role: any) => {
      const { _id: roleId, ...roleData } = role;
      return {
        ...roleData,
        id: roleId.toString(),
      };
    }),
  };
};

// Transforms role document with nested permissions
export const transformRoleWithPermissions = (role: any): any => {
  const { _id: roleId, ...roleData } = role;
  return {
    ...roleData,
    id: roleId.toString(),
    permissions: role.permissions || [],
  };
};

// Common projection for user queries (excludes sensitive fields)
export const USER_PROJECTION = {
  passwordHash: 0,
  __v: 0,
};

// Common projection for role queries
export const ROLE_PROJECTION = {
  __v: 0,
};

// Common projection for invitation queries
export const INVITATION_PROJECTION = {
  __v: 0,
};

// Helper to create consistent pagination response
export const createPaginatedResponse = <T>(
  items: T[],
  total: number,
  page: number = 1,
  limit: number = 20,
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    items,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
    },
  };
};

// Helper to validate MongoDB ObjectId format
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
