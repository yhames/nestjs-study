// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataSource } = require('typeorm');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('./ormconfig');

let AppDataSource = new DataSource(dbConfig);

module.exports = AppDataSource;
