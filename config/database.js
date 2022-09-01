const Sequelize = require("sequelize");
if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  module.exports = new Sequelize(process.env.DATABASE_URL, {
    // dialect: "postgres",
    // protocol: "postgres",
    // logging: true, //false
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        // Ref.: https://github.com/brianc/node-postgres/issues/2009
        rejectUnauthorized: false,
      },
      keepAlive: true,
    },
  });
} else {
  // the application is executed on the local machine
  module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
      operatorsAliases: false,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}
