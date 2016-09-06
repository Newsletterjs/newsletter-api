let configs = {
  port: process.env.PORT || 4040,
  database: {
    prod: {
      uri: process.env.DATABASE_URL,
      dialect: 'postgres',
      protocol: 'postgres'
    },
    dev: {
      uri: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5433/postgres',
      dialect: 'postgres',
      protocol: 'postgres',
      // // others configs for debug:
      // database: 'postgres',
      // username: 'postgres',
      // password: 'postgres',
      // host: 'database',
      // post: 5432
    },
    test: {
      dialect: 'mysql',
      database: 'test',
      username: 'root',
      password: ''
    }
  }
}

if (process.env.REDIS_HOST) {
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const redis = require('redis');

  // change host and port to your redis cfgs:

  //CREATE REDIS CLIENT
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  });

  configs.session = {
    secret: process.env.REDIS_SECRET || 'adasddad1231312asdadasd',
    store: new RedisStore({
      // pass the session store settings, see the session store docs
      client: redisClient,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 31557600, // 1 year, this is set by secconds
      db: Number(process.env.REDIS_DB) || 10
    }),
    resave: false, // don't save session if unmodified
    saveUninitialized: false
  }
}

module.exports = configs;