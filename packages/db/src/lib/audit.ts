import { Db, ObjectId } from 'mongodb';
import type { AuditLog } from '../types';

// Creates a new audit log entry
export const createAuditLog = async (
  db: Db,
  logData: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    oldValues?: object;
    newValues?: object;
    ipAddress?: string;
    userAgent?: string;
  },
): Promise<AuditLog> => {
  const newLog: Omit<AuditLog, '_id'> = {
    userId: new ObjectId(logData.userId),
    action: logData.action,
    resource: logData.resource,
    resourceId: logData.resourceId,
    oldValues: logData.oldValues,
    newValues: logData.newValues,
    ipAddress: logData.ipAddress,
    userAgent: logData.userAgent,
    createdAt: new Date(),
  };

  const result = await db.collection<AuditLog>('audit-logs').insertOne(newLog as AuditLog);
  return { ...newLog, _id: result.insertedId };
};

// Gets paginated audit logs
export const listAuditLogs = async (
  db: Db,
  options: {
    limit?: number;
    offset?: number;
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  } = {},
): Promise<{ logs: AuditLog[]; total: number }> => {
  const { limit = 50, offset = 0, userId, resource, action, startDate, endDate } = options;

  const filter: any = {};

  if (userId) {
    filter.userId = new ObjectId(userId);
  }

  if (resource) {
    filter.resource = resource;
  }

  if (action) {
    filter.action = action;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = startDate;
    if (endDate) filter.createdAt.$lte = endDate;
  }

  const [logs, total] = await Promise.all([
    db
      .collection<AuditLog>('audit-logs')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray(),
    db.collection<AuditLog>('audit-logs').countDocuments(filter),
  ]);

  return { logs, total };
};

// Gets audit logs for a specific user
export const getUserAuditLogs = async (
  db: Db,
  userId: string,
  options: {
    limit?: number;
    offset?: number;
  } = {},
): Promise<{ logs: AuditLog[]; total: number }> => {
  return listAuditLogs(db, { ...options, userId });
};

// Gets audit logs for a specific resource
export const getResourceAuditLogs = async (
  db: Db,
  resource: string,
  resourceId?: string,
  options: {
    limit?: number;
    offset?: number;
  } = {},
): Promise<{ logs: AuditLog[]; total: number }> => {
  const filter: any = { resource };
  if (resourceId) {
    filter.resourceId = resourceId;
  }

  const { limit = 50, offset = 0 } = options;

  const [logs, total] = await Promise.all([
    db
      .collection<AuditLog>('audit-logs')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray(),
    db.collection<AuditLog>('audit-logs').countDocuments(filter),
  ]);

  return { logs, total };
};

// Cleans up old audit logs (older than specified days)
export const cleanupOldAuditLogs = async (db: Db, olderThanDays: number): Promise<number> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const result = await db.collection<AuditLog>('audit-logs').deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  return result.deletedCount;
};
