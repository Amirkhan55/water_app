const Sequelize = require("sequelize");
const db = require("../config/database");
const { DataTypes } = require("sequelize");

const Role = require("../models/role");

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
    password: {
      type: DataTypes.STRING(64),
    },
    mobile: {
      type: Sequelize.BIGINT,
    },
    gender: {
      type: DataTypes.STRING,
    },

    profilePic: {
      type: Sequelize.STRING,
    },
    device_token: {
      type: Sequelize.STRING,
    },
    imagepath: {
      type: Sequelize.STRING,
    },
  },
  { timestamps: true }
);
///////////////////////one to one user and role////////////////
Role.hasMany(User);
User.belongsTo(Role);

db.sync({ force: true }).then(() => {
  console.log("All models created");
});

module.exports = User;
