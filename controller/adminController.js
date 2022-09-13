const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const request = require("request");
const Customer = require("../models/customer");
const Salesman = require("../models/salesman");
const Record = require("../models/records");
const { Op } = require("sequelize");
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

    res.header("token", token);
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
      where: { status: "active" },
      include: {
        model: Record,
        model: Salesman,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
exports.getallRecords = async function (req, res) {
  try {
    const records = await Record.findAll({
      where: { customerId: req.params.id },
      include: {
        all: true,
        nested: true,
      },
    });
    return res.status(200).json(records);
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
exports.getallSalesman = async function (req, res) {
  try {
    const users = await Salesman.findAll({
      //where: { id: !req.user.salesmanId },
      where: { [Op.not]: [{ id: req.user.salesmanId }] },
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
    const { name, mobile, address, CNIC, salesmanId, city } = req.body;
    var App = await Customer.create({
      name,
      mobile,
      address,
      CNIC,
      city,
      salesmanId,
      status: "active",
    }).then(res.status(200).send("Customer Created"));
  } catch (error) {
    console.log(error);
  }
};
exports.addSaleman = async function (req, res) {
  try {
    const { name, mobile, address, CNIC, city, area } = req.body;
    var saleman = await Salesman.create({
      name,
      mobile,
      address,
      area,
      city,
      CNIC,
      roleId: 2,
    });
    var user = await User.create({
      name,
      mobile,
      roleId: 2,
      salesmanId: saleman.id,
    }).then(res.status(200).send("Salesman Created"));
  } catch (error) {
    console.log(error);
  }
};

exports.delivered = async function (req, res) {
  try {
    const {
      bottles,
      payment,
      remaining,
      total,
      customerId,
      saleman,
      salemanNumber,
    } = req.body;
    console.log(req.body);
    const usertoken = await Customer.findOne({
      where: { id: customerId },
    });
    await Record.update({ remaining: 0 }, { where: { customerId } });
    var user = await Record.create({
      bottles,
      payment,
      remaining,
      total,
      customerId,
      saleman,
      salemanNumber,
    });

    var options = {
      method: "POST",
      url: "https://api.veevotech.com/sendsms",
      qs: {
        // api_token: "1c2e1733b0e0c379422f8d61f09f808f6335116532",
        hash: process.env.OTP,

        // api_secret: "office_2020",
        receivenum: `+${usertoken.mobile}`,
        sendernum: "J3",
        textmessage: `Your ${bottles} bottles have been delivered.
Payment made ${payment} Rs.
Remaining amount ${remaining} Rs.
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
////////////////////////////////customers of saleman //////////////////////////////////////
exports.salesmancustomers = async function (req, res) {
  try {
    const users = await Customer.findAll({
      where: { salesmanId: req.params.id },
      include: {
        model: Salesman,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
////////////////////////////////customers of  logged in saleman //////////////////////////////////////
exports.mycustomers = async function (req, res) {
  try {
    const users = await Customer.findAll({
      where: {
        salesmanId: req.user.salesmanId,
        status: "active",
      },
      include: {
        model: Salesman,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};

exports.myprofile = async function (req, res) {
  try {
    const user = await Salesman.findOne({
      where: { id: req.user.salesmanId },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

exports.delSalesman = async function (req, res) {
  try {
    const cutomers = await Customer.update(
      {
        salesmanId: 1,
      },
      { where: { salesmanId: req.body.id } }
    );
    const user = await User.destroy({
      where: { salesmanId: req.body.id },
    });
    const saleman = await Salesman.destroy({
      where: { id: req.body.id },
    });

    return res.status(200).json("Deleted");
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
exports.delCustomer = async function (req, res) {
  try {
    const users = await Customer.update(
      {
        status: "deactivated",
      },
      { where: { id: req.body.id } }
    );
    return res.status(200).json("deleted");
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};

exports.editCustomers = async function (req, res) {
  try {
    const { name, mobile, address, CNIC, salesmanId, city } = req.body;
    var App = await Customer.update(
      {
        name,
        mobile,
        address,
        CNIC,
        city,
        salesmanId,
      },
      { where: { id: req.body.id } }
    ).then(res.status(200).send("Customer Edited"));
  } catch (error) {
    console.log(error);
  }
};

exports.editSaleman = async function (req, res) {
  try {
    const { name, mobile, address, CNIC, salesmanId, city, area } = req.body;
    var App = await Salesman.update(
      {
        name,
        mobile,
        address,
        CNIC,
        city,
        area,
        roleId: 2,
      },
      { where: { id: req.body.id } }
    );
    var App = await User.update(
      {
        name,
        mobile,
        roleId: 2,
      },
      { where: { salesmanId: req.body.id } }
    ).then(res.status(200).send("Saleman Edited"));
  } catch (error) {
    console.log(error);
  }
};

exports.searchCustomer = async function (req, res) {
  var search = req.params.search;
  const user = await Customer.findAll({
    where: {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    },
  })
    .then((u) => {
      res.json(u);
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.searchSalesman = async function (req, res) {
  var search = req.params.search;
  const user = await Salesman.findAll({
    where: {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    },
  })
    .then((u) => {
      res.json(u);
    })
    .catch((error) => {
      console.log(error);
    });
};
