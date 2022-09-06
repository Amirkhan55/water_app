const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const request = require("request");
const Customer = require("../models/customer");
const Salesman = require("../models/salesman");
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    var token = jwt.sign({ id: user.id }, process.env.KEY, {
      expiresIn: 86400000,
    });

    res.cookie("token", token);
    user.password = undefined;
    req.user = user;

    //res.redirect("/admin/dashboard");
    // req.transfer('/admin/dashboard')
    res.status(200).send({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.getallCustomers = async function (req, res) {
  try {
    const users = await Customer.findAll({
      // include: {
      //   model: Cnic,
      // },
    });
    return res.status(200).json(users);
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
exports.getallSalesman = async function (req, res) {
  try {
    const users = await Salesman.findAll({
      // include: {
      //   model: Cnic,
      // },
    });
    return res.status(200).json(users);
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
exports.addCustomers = async function (req, res) {
  try {
    const { name, mobile, address, CNIC, salesmanId } = req.body;
    var App = await Customer.create({
      name,
      mobile,
      address,
      CNIC,
      salesmanId,
    })
      .then(res.status(200).send("Customer Created"))
      .catch((err) => {
        res.send(err);
      });
  } catch (error) {
    console.log(error);
  }
};
///////////////////////////verify cnic //////////////////////////////////////////
exports.delivered = async function (req, res) {
  try {
    const usertoken = await Customer.findOne({
      where: { id: req.params.id },
    });

    var options = {
      method: "POST",
      url: "https://api.veevotech.com/sendsms",
      qs: {
        // api_token: "1c2e1733b0e0c379422f8d61f09f808f6335116532",
        hash: process.env.OTP,

        // api_secret: "office_2020",
        receivenum: `${usertoken.mobile}`,
        sendernum: "J3",
        textmessage: `Your ${req.body.bottles} bottles have been delivered.
    `,
      },
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    });

    return res.status(200).json({
      status: "success",
      message: "delivered successfully",
    });
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};

//////////////////////////all rides posted by specific user///////////

exports.getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.findAll({
      where: { userId: req.params.id },
      include: [{ all: true, nested: true }],
    });

    res.render("one_user_rides", { data: rides, user: req.user });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
