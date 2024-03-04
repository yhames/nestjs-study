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
      entities: ['**/*.entity.js'], // local에서는 dist/js를 사용합니다.
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'], // jest는 ./ts를 사용합니다.
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationRun: true,
      entities: ['**/*.entity.js'], // production에서는 dist/js를 사용합니다.
      ssl: {
        rejectUnauthorized: false, // heroku에서는 ssl 옵션을 추가해야 합니다.
      },
    });
    break;
  default:
    throw new Error('Environment not recognized');
}

module.exports = dbConfig;
