# Seed script for initial data

# Create default permissions
INSERT Permission {
  name := 'users_create',
  resource := 'users',
  action := 'create',
  description := 'Create new users'
};

INSERT Permission {
  name := 'users_read',
  resource := 'users',
  action := 'read',
  description := 'View users'
};

INSERT Permission {
  name := 'users_update',
  resource := 'users',
  action := 'update',
  description := 'Update user information'
};

INSERT Permission {
  name := 'users_delete',
  resource := 'users',
  action := 'delete',
  description := 'Delete users'
};

INSERT Permission {
  name := 'roles_create',
  resource := 'roles',
  action := 'create',
  description := 'Create new roles'
};

INSERT Permission {
  name := 'roles_read',
  resource := 'roles',
  action := 'read',
  description := 'View roles'
};

INSERT Permission {
  name := 'roles_update',
  resource := 'roles',
  action := 'update',
  description := 'Update roles'
};

INSERT Permission {
  name := 'roles_delete',
  resource := 'roles',
  action := 'delete',
  description := 'Delete roles'
};

INSERT Permission {
  name := 'permissions_read',
  resource := 'permissions',
  action := 'read',
  description := 'View permissions'
};

INSERT Permission {
  name := 'audit_read',
  resource := 'audit',
  action := 'read',
  description := 'View audit logs'
};

# Create admin role with all permissions
INSERT Role {
  name := 'admin',
  description := 'Administrator with full access',
  permissions := (
    SELECT Permission
  )
};

# Create user role with basic permissions
INSERT Role {
  name := 'user',
  description := 'Standard user with limited access',
  permissions := (
    SELECT Permission
    FILTER .resource = 'users' AND .action = 'read'
  )
};

# Create default admin user (password: admin123)
INSERT User {
  email := 'admin@example.com',
  username := 'admin',
  passwordHash := '$argon2id$v=19$m=65536,t=3,p=4$rAndomSaltForSeeding$PLACEHOLDER_HASH_CHANGE_IN_PRODUCTION',
  firstName := 'System',
  lastName := 'Administrator',
  isActive := true,
  isVerified := true,
  roles := (
    SELECT Role FILTER .name = 'admin'
  )
};