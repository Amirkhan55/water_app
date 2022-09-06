const express = require("express");
const router = express.Router();
const db = require("../config/database");
const User = require("../models/User");
const Role = require("../models/role");
const Sequelize = require("sequelize");
var nodemailer = require("nodemailer");
var fs = require("fs");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const request = require("request");
const jwt = require("jsonwebtoken");
const userController = require("../controller/users");
const multer = require("../config/multer");
var {
  passport,
  authAdmin,
  authManager,
  authenticate,
} = require("../auth/passport-auth");

module.exports = router;
