CREATE MIGRATION m1n332pg6unp4guzufysdggaut64zox6n66efj2ialelqi5vtpwhwq
    ONTO initial
{
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::AuditLog {
      CREATE REQUIRED PROPERTY action: std::str;
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE INDEX ON ((.action, .createdAt));
      CREATE PROPERTY ipAddress: std::str;
      CREATE PROPERTY newValues: std::json;
      CREATE PROPERTY oldValues: std::json;
      CREATE REQUIRED PROPERTY resource: std::str;
      CREATE PROPERTY resourceId: std::str;
      CREATE PROPERTY userAgent: std::str;
  };
  CREATE TYPE default::User {
      CREATE PROPERTY passwordResetToken: std::str;
      CREATE INDEX ON (.passwordResetToken);
      CREATE PROPERTY emailVerificationToken: std::str;
      CREATE INDEX ON (.emailVerificationToken);
      CREATE REQUIRED PROPERTY username: std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::max_len_value(50);
          CREATE CONSTRAINT std::min_len_value(3);
      };
      CREATE INDEX ON (.username);
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::regexp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
      };
      CREATE INDEX ON (.email);
      CREATE PROPERTY avatarUrl: std::str;
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY emailVerifiedAt: std::datetime;
      CREATE PROPERTY firstName: std::str;
      CREATE PROPERTY lastName: std::str;
      CREATE PROPERTY fullName := ((((.firstName ++ ' ') ++ .lastName) IF (EXISTS (.firstName) AND EXISTS (.lastName)) ELSE .username));
      CREATE REQUIRED PROPERTY isActive: std::bool {
          SET default := true;
      };
      CREATE REQUIRED PROPERTY isVerified: std::bool {
          SET default := false;
      };
      CREATE PROPERTY lastLoginAt: std::datetime;
      CREATE REQUIRED PROPERTY passwordHash: std::str;
      CREATE PROPERTY passwordResetExpires: std::datetime;
      CREATE PROPERTY updatedAt: std::datetime;
  };
  ALTER TYPE default::AuditLog {
      CREATE REQUIRED LINK user: default::User;
      CREATE INDEX ON ((.user, .createdAt));
  };
  CREATE TYPE default::Permission {
      CREATE REQUIRED PROPERTY action: std::str;
      CREATE REQUIRED PROPERTY resource: std::str;
      CREATE CONSTRAINT std::exclusive ON ((.resource, .action));
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::expression ON (((std::re_test('^[a-z_]+$', .name) AND std::re_test('^[a-z_]+$', .resource)) AND (((((.action = 'create') OR (.action = 'read')) OR (.action = 'update')) OR (.action = 'delete')) OR (.action = 'manage'))));
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
  };
  CREATE TYPE default::Role {
      CREATE MULTI LINK permissions: default::Permission;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::expression ON ((((((.name = 'admin') OR (.name = 'moderator')) OR (.name = 'user')) OR (.name = 'guest')) OR std::re_test('^[a-z_]+$', .name)));
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY isActive: std::bool {
          SET default := true;
      };
  };
  ALTER TYPE default::Permission {
      CREATE MULTI LINK roles := (.<permissions[IS default::Role]);
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK roles: default::Role;
  };
  ALTER TYPE default::Role {
      CREATE MULTI LINK users := (.<roles[IS default::User]);
  };
  CREATE TYPE default::UserSession {
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY isActive: std::bool {
          SET default := true;
      };
      CREATE INDEX ON ((.user, .isActive));
      CREATE REQUIRED PROPERTY sessionToken: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.sessionToken);
      CREATE PROPERTY refreshToken: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.refreshToken);
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expiresAt: std::datetime;
      CREATE PROPERTY ipAddress: std::str;
      CREATE PROPERTY lastAccessedAt: std::datetime;
      CREATE PROPERTY userAgent: std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK sessions: default::UserSession;
  };
};
