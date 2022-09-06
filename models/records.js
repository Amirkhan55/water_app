const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");
const Records = db.define(
  "record",
  {
    bottles: {
      type: Sequelize.INTEGER,
      default: true,
    },
    payment: {
      type: Sequelize.BIGINT,
      default: true,
    },
    remaining: {
      type: Sequelize.INTEGER,
      default: true,
    },
    total: {
      type: Sequelize.BIGINT,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = Records;
