import knex, { Knex } from 'knex';

export const knexConfig: Knex.Config = {
  client: 'mysql',
  connection:
    process.env.NODE_ENV === 'production'
      ? process.env.MICDROP_DB_URL
      : {
          host: 'localhost',
          user: 'root',
          port: 3307,
          password: 'example',
          database: 'micdrop',
        },
  pool: { min: 0, max: 10 },
};

export default knex(knexConfig);
