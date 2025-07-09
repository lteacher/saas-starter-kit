import { ObjectId } from 'mongodb';
import type { User, Role, UserWithRoles } from '../types';
import { db } from '../connection';

// Finds a user by their email address
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return db.collection<User>('users').findOne({ email });
};

// Finds a user by their username
export const findUserByUsername = async (username: string): Promise<User | null> => {
  return db.collection<User>('users').findOne({ username });
};

// Finds a user by their ID
export const findUserById = async (id: string): Promise<User | null> => {
  return db.collection<User>('users').findOne({ _id: new ObjectId(id) });
};

// Finds a user by ID with populated roles
export const findUserByIdWithRoles = async (id: string): Promise<UserWithRoles | null> => {
  const user = await findUserById(id);
  if (!user) return null;

  const roles = await db
    .collection<Role>('roles')
    .find({
      _id: { $in: user.roleIds },
    })
    .toArray();

  return { ...user, roles };
};

// Finds a user by email with populated roles
export const findUserByEmailWithRoles = async (email: string): Promise<UserWithRoles | null> => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const roles = await db
    .collection<Role>('roles')
    .find({
      _id: { $in: user.roleIds },
    })
    .toArray();

  return { ...user, roles };
};

// Finds a user by username with populated roles
export const findUserByUsernameWithRoles = async (
  username: string,
): Promise<UserWithRoles | null> => {
  const user = await db.collection<User>('users').findOne({ username });
  if (!user) return null;

  const roles = await db
    .collection<Role>('roles')
    .find({
      _id: { $in: user.roleIds },
    })
    .toArray();

  return { ...user, roles };
};

// Creates a new user
export const createUser = async (userData: {
  email: string;
  username: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  roleIds?: string[];
  tempPassword?: boolean;
}): Promise<User> => {
  let roleObjectIds: ObjectId[];

  if (userData.roleIds) {
    roleObjectIds = userData.roleIds.map((id) => new ObjectId(id));
  } else {
    const defaultRole = await db.collection<Role>('roles').findOne({ name: 'user' });
    if (!defaultRole) {
      throw new Error('Default user role not found');
    }
    roleObjectIds = [defaultRole._id];
  }

  const now = new Date();
  const newUser: Omit<User, '_id'> = {
    email: userData.email,
    username: userData.username,
    passwordHash: userData.passwordHash || '',
    firstName: userData.firstName,
    lastName: userData.lastName,
    isActive: true,
    isVerified: false,
    status: userData.passwordHash ? 'active' : 'pending',
    tempPassword: userData.tempPassword || false,
    createdAt: now,
    updatedAt: now,
    roleIds: roleObjectIds,
  };

  const result = await db.collection<User>('users').insertOne(newUser as User);
  return { ...newUser, _id: result.insertedId };
};

// Updates user's last login timestamp
export const updateLastLogin = async (userId: string): Promise<void> => {
  await db.collection<User>('users').updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      },
    },
  );
};

// Updates user profile information
export const updateUser = async (
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    isActive?: boolean;
    isVerified?: boolean;
    passwordHash?: string;
    status?: 'pending' | 'active' | 'inactive';
  },
): Promise<User | null> => {
  const result = await db.collection<User>('users').findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' },
  );

  return result;
};

// Gets paginated list of users
export const listUsers = async (
  options: {
    limit?: number;
    offset?: number;
    includeInactive?: boolean;
  } = {},
): Promise<{ users: User[]; total: number }> => {
  const { limit = 20, offset = 0, includeInactive = false } = options;

  const filter = includeInactive ? {} : { isActive: true };

  const [users, total] = await Promise.all([
    db
      .collection<User>('users')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray(),
    db.collection<User>('users').countDocuments(filter),
  ]);

  return { users, total };
};

// Gets paginated list of users with populated roles
export const listUsersWithRoles = async (
  options: {
    limit?: number;
    offset?: number;
    includeInactive?: boolean;
  } = {},
): Promise<{ users: UserWithRoles[]; total: number }> => {
  const { users, total } = await listUsers(options);

  // Get all unique role IDs
  const roleIds = [...new Set(users.flatMap((user) => user.roleIds))];

  // Fetch all roles in one query
  const roles = await db
    .collection<Role>('roles')
    .find({
      _id: { $in: roleIds },
    })
    .toArray();

  // Create role lookup map
  const roleMap = new Map(roles.map((role) => [role._id.toString(), role]));

  // Populate users with their roles
  const usersWithRoles = users.map((user) => ({
    ...user,
    roles: user.roleIds.map((roleId) => roleMap.get(roleId.toString())).filter(Boolean) as Role[],
  }));

  return { users: usersWithRoles, total };
};

// Adds a role to a user
export const addRoleToUser = async (userId: string, roleId: string): Promise<void> => {
  await db.collection<User>('users').updateOne(
    { _id: new ObjectId(userId) },
    {
      $addToSet: { roleIds: new ObjectId(roleId) },
      $set: { updatedAt: new Date() },
    },
  );
};

// Removes a role from a user
export const removeRoleFromUser = async (userId: string, roleId: string): Promise<void> => {
  await db.collection<User>('users').updateOne(
    { _id: new ObjectId(userId) },
    {
      $pull: { roleIds: new ObjectId(roleId) },
      $set: { updatedAt: new Date() },
    },
  );
};
