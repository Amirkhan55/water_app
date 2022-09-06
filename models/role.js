const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");
const Role = db.define(
  "role",
  {
    isAdmin: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
    isSalesman: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
    isUser: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = Role;
