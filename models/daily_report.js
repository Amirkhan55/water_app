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
    "19cash": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "19credit": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "19quantity": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "12credit": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "12cash": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "12quantity": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "6credit": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "6cash": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "6quantity": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "1cash": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "1credit": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "1quantity": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "0cash": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "0credit": {
      type: Sequelize.INTEGER,
      default: true,
    },
    "0quantity": {
      type: Sequelize.INTEGER,
      default: true,
    },
    totalcash: {
      type: Sequelize.INTEGER,
      default: true,
    },
    totalcredit: {
      type: Sequelize.INTEGER,
      default: true,
    },
    previous: {
      type: Sequelize.INTEGER,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = Daily_report;
