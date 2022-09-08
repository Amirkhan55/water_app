const express = require("express");
const router = express.Router();
const db = require("../config/database");
const User = require("../models/User");

const Role = require("../models/role");
const Sequelize = require("sequelize");

const client = require("twilio")(
  "ACaddb23538b864eb961f5f7c3c6d47c52",
  "ab83e87ebf0ccc8821f5765a97fb1eb4"
);
const jwt = require("jsonwebtoken");
const userController = require("../controller/users");

const adminController = require("../controller/adminController");
const multer = require("../config/multer");
var {
  passport,
  authAdmin,
  authManager,
  auther,
  autherization,
} = require("../auth/passport-auth");

router.get("/", async function (req, res) {
  res.render("login");
});

router.post("/login", adminController.signin);

router.get(
  "/allCustomers",
  passport.authenticate("jwt", { session: false }),
  adminController.getallCustomers
);
router.get(
  "/allSalesmans",
  passport.authenticate("jwt", { session: false }),
  adminController.getallSalesman
);
router.get(
  "/allRecords/:id",
  passport.authenticate("jwt", { session: false }),
  adminController.getallRecords
);
router.post(
  "/addCustomers",
  passport.authenticate("jwt", { session: false }),
  adminController.addCustomers
);
router.post(
  "/addSalesmans",
  passport.authenticate("jwt", { session: false }),
  adminController.addSaleman
);
router.post(
  "/addRecord",
  passport.authenticate("jwt", { session: false }),
  adminController.delivered
);
router.get(
  "/salesmanCustomers/:id",
  passport.authenticate("jwt", { session: false }),
  adminController.salesmancustomers
);
router.get(
  "/mycustomers",
  passport.authenticate("jwt", { session: false }),
  adminController.mycustomers
);
router.get(
  "/myprofile",
  passport.authenticate("jwt", { session: false }),
  adminController.myprofile
);

module.exports = router;
