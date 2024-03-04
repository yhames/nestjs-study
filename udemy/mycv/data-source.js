// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataSource } = require('typeorm');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('./ormconfig');

/**
 * migration:generate는 DataSource를 반드시 사용해야 한다.
 */
let AppDataSource = new DataSource(dbConfig);

module.exports = AppDataSource;
