module.exports = {
  async up(db) {
    // Create collections
    await db.createCollection('users');
    await db.createCollection('roles');
    await db.createCollection('user-sessions');
    await db.createCollection('audit-logs');

    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ roleIds: 1 });
    await db.collection('users').createIndex({ isActive: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    await db.collection('users').createIndex({ passwordResetToken: 1 }, { sparse: true });
    await db.collection('users').createIndex({ emailVerificationToken: 1 }, { sparse: true });

    // Roles collection indexes
    await db.collection('roles').createIndex({ name: 1 }, { unique: true });
    await db.collection('roles').createIndex({ isActive: 1 });

    // User sessions collection indexes
    await db.collection('user-sessions').createIndex({ sessionToken: 1 }, { unique: true });
    await db
      .collection('user-sessions')
      .createIndex({ refreshToken: 1 }, { unique: true, sparse: true });
    await db.collection('user-sessions').createIndex({ userId: 1, isActive: 1 });
    await db.collection('user-sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Audit logs collection indexes
    await db.collection('audit-logs').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('audit-logs').createIndex({ action: 1, createdAt: -1 });
    await db.collection('audit-logs').createIndex({ resource: 1, createdAt: -1 });
  },

  async down(db) {
    await db.collection('users').drop();
    await db.collection('roles').drop();
    await db.collection('user-sessions').drop();
    await db.collection('audit-logs').drop();
  },
};
