const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");
const Daily_report = db.define(
  "daily_Report",
  {
    Client: {
      type: Sequelize.STRING,
      default: true,
    },
    address: {
      type: Sequelize.STRING,
      default: true,
    },
    cash19: {
      type: Sequelize.INTEGER,
      default: true,
    },
    credit19: {
      type: Sequelize.INTEGER,
      default: true,
    },
    quantity19: {
      type: Sequelize.INTEGER,
      default: true,
    },
    credit12: {
      type: Sequelize.INTEGER,
      default: true,
    },
    cash12: {
      type: Sequelize.INTEGER,
      default: true,
    },
    quantity12: {
      type: Sequelize.INTEGER,
      default: true,
    },
    credit6: {
      type: Sequelize.INTEGER,
      default: true,
    },
    cash6: {
      type: Sequelize.INTEGER,
      default: true,
    },
    quantity6: {
      type: Sequelize.INTEGER,
      default: true,
    },
    cash1: {
      type: Sequelize.INTEGER,
      default: true,
    },
    credit1: {
      type: Sequelize.INTEGER,
      default: true,
    },
    quantity1: {
      type: Sequelize.INTEGER,
      default: true,
    },
    cash0: {
      type: Sequelize.INTEGER,
      default: true,
    },
    credit0: {
      type: Sequelize.INTEGER,
      default: true,
    },
    quantity0: {
      type: Sequelize.INTEGER,
      default: true,
    },
    totalcash: {
      type: Sequelize.BIGINT,
      default: true,
    },
    totalpaid: {
      type: Sequelize.BIGINT,
      default: true,
    },
    totalcredit: {
      type: Sequelize.BIGINT,
      default: true,
    },
    previous: {
      type: Sequelize.BIGINT,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = Daily_report;
