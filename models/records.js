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
      type: Sequelize.INTEGER,
      default: true,
    },
    remaining: {
      type: Sequelize.INTEGER,
      default: true,
    },
    total: {
      type: Sequelize.INTEGER,
      default: true,
    },
    salesman: {
      type: Sequelize.STRING,
      default: true,
    },
    salesmanNumber: {
      type: Sequelize.INTEGER,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = Records;