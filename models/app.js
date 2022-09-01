const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");
const app_version = db.define(
  "app_version",
  {
    version: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);
module.exports = app_version;
