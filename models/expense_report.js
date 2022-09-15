const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");
const Expense = db.define(
  "expense",
  {
    Fuel: {
      type: Sequelize.BIGINT,
    },
    Toll_tax: {
      type: Sequelize.BIGINT,
    },
    Pet_commision: {
      type: Sequelize.BIGINT,
    },
    Food: {
      type: Sequelize.BIGINT,
    },
    bottle_issued0: {
      type: Sequelize.BIGINT,
    },
    returned0: {
      type: Sequelize.BIGINT,
    },
    sale0: {
      type: Sequelize.BIGINT,
    },
    difference0: {
      type: Sequelize.BIGINT,
    },
    bottle_issued1: {
      type: Sequelize.BIGINT,
    },
    returned1: {
      type: Sequelize.BIGINT,
    },
    sale1: {
      type: Sequelize.BIGINT,
    },
    difference1: {
      type: Sequelize.BIGINT,
    },
    bottle_issued6: {
      type: Sequelize.BIGINT,
    },
    returned6: {
      type: Sequelize.BIGINT,
    },
    sale6: {
      type: Sequelize.BIGINT,
    },
    difference6: {
      type: Sequelize.BIGINT,
    },
    bottle_issued12: {
      type: Sequelize.BIGINT,
    },
    returned12: {
      type: Sequelize.BIGINT,
    },
    sale12: {
      type: Sequelize.BIGINT,
    },
    difference12: {
      type: Sequelize.BIGINT,
    },
    bottle_issued19: {
      type: Sequelize.BIGINT,
    },
    empty19: {
      type: Sequelize.BIGINT,
    },
    filled: {
      type: Sequelize.BIGINT,
    },
    sale19: {
      type: Sequelize.BIGINT,
    },
    total_Sale: {
      type: Sequelize.BIGINT,
    },
    salesmanName: {
      type: Sequelize.STRING,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = Expense;
