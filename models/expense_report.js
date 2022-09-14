const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");
const Expense = db.define(
  "expense",
  {
    Fuel: {
      type: Sequelize.INTEGER,
      default: true,
    },
    Toll_tax: {
      type: Sequelize.INTEGER,
      default: true,
    },
    Pet_commision: {
      type: Sequelize.INTEGER,
      default: true,
    },
    Food: {
      type: Sequelize.INTEGER,
      default: true,
    },
    "bottle_issued0.5": {
      type: Sequelize.STRING,
      default: true,
    },
    "returned0.5": {
      type: Sequelize.STRING,
      default: true,
    },
    "sale0.5": {
      type: Sequelize.STRING,
      default: true,
    },
    "difference0.5": {
      type: Sequelize.STRING,
      default: true,
    },
    "bottle_issued1.5": {
      type: Sequelize.STRING,
      default: true,
    },
    "returned1.5": {
      type: Sequelize.STRING,
      default: true,
    },
    "sale1.5": {
      type: Sequelize.STRING,
      default: true,
    },
    "difference1.5": {
      type: Sequelize.STRING,
      default: true,
    },
    bottle_issued6: {
      type: Sequelize.STRING,
      default: true,
    },
    returned6: {
      type: Sequelize.STRING,
      default: true,
    },
    sale6: {
      type: Sequelize.STRING,
      default: true,
    },
    difference6: {
      type: Sequelize.STRING,
      default: true,
    },
    bottle_issued12: {
      type: Sequelize.STRING,
      default: true,
    },
    returned12: {
      type: Sequelize.STRING,
      default: true,
    },
    sale12: {
      type: Sequelize.STRING,
      default: true,
    },
    difference12: {
      type: Sequelize.STRING,
      default: true,
    },
    bottle_issued19: {
      type: Sequelize.STRING,
      default: true,
    },
    empty19: {
      type: Sequelize.STRING,
      default: true,
    },
    filled: {
      type: Sequelize.STRING,
      default: true,
    },
    sale19: {
      type: Sequelize.STRING,
      default: true,
    },
    total_Sale: {
      type: Sequelize.STRING,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = Expense;
