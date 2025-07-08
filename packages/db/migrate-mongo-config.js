const config = {
  mongodb: {
    url: process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017',
    databaseName: process.env.DB_NAME || 'saas-starter-kit',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;