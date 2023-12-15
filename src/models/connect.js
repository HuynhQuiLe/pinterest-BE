const { Sequelize } = require("sequelize");
const config = require("../config/config");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(config.database, config.user, config.pass, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

// TEST
// const test = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// test();

module.exports = sequelize;
