const { ObjectId } = require('mongodb');

module.exports = {
  async up(db) {
    const now = new Date();

    // Properly hashed password for admin123
    const adminPasswordHash =
      '$argon2id$v=19$m=4096,t=3,p=1$99qknkC1NBVFmgk25O9tZ4KQQFUZOIDfg/a9kX4G3v4$L7du8bdjiA0vZWsg8aX93AxGPZrLURNV/OubxLsePH4';

    // Create default permissions embedded in roles
    const permissions = [
      {
        name: 'users:create',
        resource: 'users',
        action: 'create',
        description: 'Create new users',
      },
      { name: 'users:read', resource: 'users', action: 'read', description: 'View users' },
      {
        name: 'users:update',
        resource: 'users',
        action: 'update',
        description: 'Update user information',
      },
      { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
      {
        name: 'roles:create',
        resource: 'roles',
        action: 'create',
        description: 'Create new roles',
      },
      { name: 'roles:read', resource: 'roles', action: 'read', description: 'View roles' },
      { name: 'roles:update', resource: 'roles', action: 'update', description: 'Update roles' },
      { name: 'roles:delete', resource: 'roles', action: 'delete', description: 'Delete roles' },
      {
        name: 'permissions:read',
        resource: 'permissions',
        action: 'read',
        description: 'View permissions',
      },
      { name: 'audit:read', resource: 'audit', action: 'read', description: 'View audit logs' },
    ];

    // Create admin role with all permissions
    const adminRoleId = new ObjectId();
    await db.collection('roles').insertOne({
      _id: adminRoleId,
      name: 'admin',
      description: 'Administrator with full access',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      permissions: permissions,
    });

    // Create user role with limited permissions
    const userRoleId = new ObjectId();
    await db.collection('roles').insertOne({
      _id: userRoleId,
      name: 'user',
      description: 'Standard user with limited access',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      permissions: [permissions.find((p) => p.name === 'users:read')].filter(Boolean),
    });

    // Create default admin user (password: admin123)
    await db.collection('users').insertOne({
      _id: new ObjectId(),
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: adminPasswordHash,
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      isVerified: true,
      status: 'active',
      tempPassword: false,
      createdAt: now,
      updatedAt: now,
      roleIds: [adminRoleId],
    });
  },

  async down(db) {
    await db.collection('users').deleteMany({});
    await db.collection('roles').deleteMany({});
  },
};
