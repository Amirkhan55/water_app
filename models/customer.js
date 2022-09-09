const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");

const Role = require("../models/role");

const Customer = db.define(
  "customer",
  {
    name: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.BIGINT,
    },
    address: {
      type: Sequelize.STRING,
    },
    CNIC: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      default: "active",
    },
  },
  { timestamps: true }
);
module.exports = Customer;
