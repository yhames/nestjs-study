let dbConfig = {
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'],
  cli: {
    migrationsDir: __dirname + '/migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('Environment not recognized');
}

module.exports = dbConfig;
