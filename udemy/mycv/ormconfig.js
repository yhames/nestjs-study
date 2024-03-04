let dbConfig = {
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'], // 1) __dirname 사용해서 dist경로 문제 해결, 2) .js -> .ts로 변경
  cli: {
    migrationsDir: __dirname + '/migrations', // 1) __dirname 사용해서 dist경로 문제 해결
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
