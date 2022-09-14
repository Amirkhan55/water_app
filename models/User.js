const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");

const Role = require("../models/role");
const Salesman = require("./salesman");
const Customer = require("./customer");
const Record = require("./records");
const expense = require("./expense_report");
const daily_Report = require("./daily_report");
const User = db.define(
  "user",
  {
    name: {
      type: Sequelize.STRING,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    mobile: {
      type: Sequelize.BIGINT,
    },
    password: {
      type: DataTypes.STRING(64),
    },
  },
  { timestamps: true }
);
///////////////////////one to one user and role////////////////
Role.hasMany(User);
User.belongsTo(Role);
///////////////////////one to one user and role////////////////
Role.hasMany(Salesman);
Salesman.belongsTo(Role);
///////////////////////one to many customer and saleman////////////////
Salesman.hasMany(Customer);
Customer.belongsTo(Salesman);
///////////////////////one to many saleman  and User////////////////
Salesman.hasOne(User);
User.belongsTo(Salesman);

///////////////////////one to many customer and records////////////////
Customer.hasMany(Record);
Record.belongsTo(Customer);

///////////////////////one to many salemn and daily report////////////////
Salesman.hasMany(daily_Report);
daily_Report.belongsTo(Salesman);
db.sync({ alter: true }).then(() => {
  console.log("All models created");
});

module.exports = User;
