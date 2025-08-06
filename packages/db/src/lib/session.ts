import { ObjectId } from 'mongodb';
import type { UserSession } from '../types';
import { db } from '../connection';

// Creates a new user session
export const createSession = async (sessionData: {
  userId: string;
  sessionToken: string;
  refreshToken?: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}): Promise<UserSession> => {
  const now = new Date();
  const newSession: Omit<UserSession, '_id'> = {
    userId: new ObjectId(sessionData.userId),
    sessionToken: sessionData.sessionToken,
    refreshToken: sessionData.refreshToken,
    expiresAt: sessionData.expiresAt,
    createdAt: now,
    lastAccessedAt: now,
    ipAddress: sessionData.ipAddress,
    userAgent: sessionData.userAgent,
    isActive: true,
  };

  const result = await db
    .collection<UserSession>('user-sessions')
    .insertOne(newSession as UserSession);
  return { ...newSession, _id: result.insertedId };
};

// Finds a session by session token
export const findSessionByToken = async (sessionToken: string): Promise<UserSession | null> => {
  return db.collection<UserSession>('user-sessions').findOne({
    sessionToken,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

// Finds a session by refresh token
export const findSessionByRefreshToken = async (
  refreshToken: string,
): Promise<UserSession | null> => {
  return db.collection<UserSession>('user-sessions').findOne({
    refreshToken,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

// Updates session's last accessed time
export const updateSessionAccess = async (sessionId: string): Promise<void> => {
  await db
    .collection<UserSession>('user-sessions')
    .updateOne({ _id: new ObjectId(sessionId) }, { $set: { lastAccessedAt: new Date() } });
};

// Deactivates a session (logout)
export const deactivateSession = async (sessionToken: string): Promise<void> => {
  await db
    .collection<UserSession>('user-sessions')
    .updateOne({ sessionToken }, { $set: { isActive: false } });
};

// Deactivates all sessions for a user
export const deactivateAllUserSessions = async (userId: string): Promise<void> => {
  await db
    .collection<UserSession>('user-sessions')
    .updateMany({ userId: new ObjectId(userId) }, { $set: { isActive: false } });
};

// Gets active sessions for a user
export const getUserSessions = async (userId: string): Promise<UserSession[]> => {
  return db
    .collection<UserSession>('user-sessions')
    .find({
      userId: new ObjectId(userId),
      isActive: true,
      expiresAt: { $gt: new Date() },
    })
    .sort({ lastAccessedAt: -1 })
    .toArray();
};

// Cleans up expired sessions
export const cleanupExpiredSessions = async (): Promise<number> => {
  const result = await db.collection<UserSession>('user-sessions').deleteMany({
    $or: [{ expiresAt: { $lte: new Date() } }, { isActive: false }],
  });

  return result.deletedCount;
};
