import { ObjectId } from 'mongodb';

// Base interfaces for composition
export interface BaseDocument {
  _id: ObjectId;
}

export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface Activatable {
  isActive: boolean;
}

export interface Permission {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

// Main document interfaces using composition
export interface User extends BaseDocument, Timestamped, Activatable {
  email: string;
  username: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerifiedAt?: Date;
  roleIds: ObjectId[];
  status: 'pending' | 'active' | 'inactive';
  tempPassword: boolean;
  invitationToken?: string;
}

export interface Role extends BaseDocument, Timestamped, Activatable {
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface UserSession extends BaseDocument {
  userId: ObjectId;
  sessionToken: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface AuditLog extends BaseDocument {
  userId: ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: object;
  newValues?: object;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Invitation extends BaseDocument, Timestamped {
  userId: ObjectId;
  email: string;
  token: string;
  invitedBy: ObjectId;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expiresAt: Date;
}

// API response types with populated data
export interface UserWithRoles extends Omit<User, 'roleIds'> {
  roles: Role[];
}
