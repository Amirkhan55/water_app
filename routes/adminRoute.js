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
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/admin");
});
router.get("/dashboard", autherization, async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).render("index", {
      user: req.user,
      data: data,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
///////////////////////////////all users list//////////////////////////////
router.get("/users_list", autherization, authAdmin, async function (req, res) {
  const user = await User.findAll({
    attributes: { exclude: ["password"] },
  });

  res.render("user_table", { data: user, user: req.user });
});

/////////////////////////////user cnic details//////////////////////////////
router.get(
  "/cnic_details/:id",
  autherization,
  authAdmin,
  async function (req, res) {
    const cnic = await Cnic.findOne({
      where: { userId: req.params.id },
      include: [{ model: User }],
    });
    res.render("cnic_table", { data: cnic, user: req.user });
  }
);

///////////////////////////user cnic table////////////////////////////////
router.get("/cnic_table", autherization, authAdmin, async function (req, res) {
  const cnic = await User.findAll({
    include: [{ model: Cnic }],
    attributes: { exclude: ["password"] },
  });
  res.render("user_nic_table", { data: cnic, user: req.user });
});

router.get(
  "/allCustomers",
  autherization,
  authAdmin,
  adminController.getallCustomers
);
router.get(
  "/allSalemans",
  autherization,
  authAdmin,
  adminController.getallSalesman
);
router.post(
  "/addCustomers",
  autherization,
  authAdmin,
  adminController.addCustomers
);

module.exports = router;
