const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");

const Role = require("../models/role");

const Salesman = db.define(
  "salesman",
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
    area: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    profilePic: {
      type: Sequelize.STRING,
    },
    imagepath: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: true }
);
module.exports = Salesman;
