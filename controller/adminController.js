const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const request = require("request");
const Customer = require("../models/customer");
const Salesman = require("../models/salesman");
const Record = require("../models/records");
const { Op } = require("sequelize");
const Daily_report = require("../models/daily_report");
const Expense = require("../models/expense_report");
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
    return res.status(200).send(records);
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
      salesman,
      salesmanNumber,
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
      salesman,
      salesmanNumber,
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
      include: [
        {
          model: Salesman,
          nested: true,
        },
        // {
        //   model: Record,
        // },
      ],
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
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
    const daily_report = await Daily_report.update(
      {
        salesmanId: 1,
      },
      { where: { salesmanId: req.body.id } }
    );
    const expense_Report = await Expense.update(
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
      [Op.and]: [
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          roleId: 2,
        },
      ],
    },
  })
    .then((u) => {
      res.json(u);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.addDailyreport = async function (req, res) {
  try {
    const usertoken = await Customer.findOne({
      where: { id: req.body.customerId },
    });
    await Record.update(
      { previous: 0 },
      { where: { customerId: req.body.customerId } }
    );
    await Daily_report.update(
      { previous: 0 },
      { where: { salesmanId: req.user.salesmanId } }
    );

    var daily_Report = await Daily_report.create({
      Client: req.body.client,
      address: req.body.address,
      cash19: req.body.cash19,
      quantity19: req.body.quantity19,
      credit19: req.body.credit19,
      quantity12: req.body.quantity12,
      credit12: req.body.credit12,
      cash12: req.body.cash12,
      quantity6: req.body.quantity6,
      credit6: req.body.credit6,
      cash6: req.body.cash6,
      quantity1: req.body.quantity5,
      cash1: req.body.cash5,
      credit1: req.body.credit5,
      quantity0: req.body.quantity0,
      cash0: req.body.cash0,
      credit0: req.body.credit0,
      totalcash: req.body.totalcash,
      totalcredit: req.body.totalcredit,
      previous: req.body.previous,
      salesmanId: req.user.salesmanId,
      totalpaid: req.body.totalpaid,
      salesmanName: req.user.name,
    });

    console.log(req.body);

    var user = await Record.create({
      cash19: req.body.cash19,
      quantity19: req.body.quantity19,
      credit19: req.body.credit19,
      quantity12: req.body.quantity12,
      credit12: req.body.credit12,
      cash12: req.body.cash12,
      quantity6: req.body.quantity6,
      credit6: req.body.credit6,
      cash6: req.body.cash6,
      quantity1: req.body.quantity5,
      cash1: req.body.cash5,
      credit1: req.body.credit5,
      quantity0: req.body.quantity0,
      cash0: req.body.cash0,
      credit0: req.body.credit0,
      totalcash: req.body.totalcash,
      totalcredit: req.body.totalcredit,
      previous: req.body.previous,
      customerId: req.body.customerId,
      salesman: req.user.name,
      salesmanNumber: req.user.mobile,
      totalpaid: req.body.totalpaid,
    });
    //     var options = {
    //       method: "POST",
    //       url: "https://api.veevotech.com/sendsms",
    //       qs: {
    //         // api_token: "1c2e1733b0e0c379422f8d61f09f808f6335116532",
    //         hash: process.env.OTP,

    //         // api_secret: "office_2020",
    //         receivenum: `+${usertoken.mobile}`,
    //         sendernum: "J3",
    //         textmessage: `Your bottles have been delivered.
    // Payment made ${req.body.totalcash} Rs.
    // Remaining amount ${req.body.totalcredit} Rs.
    //         `,
    //       },
    //       headers: {
    //         "content-type": "application/json",
    //         "cache-control": "no-cache",
    //       },
    //     };

    //     request(options, function (error, response, body) {
    //       if (error) throw new Error(error);
    //     });

    return res.status(200).json({
      status: "success",
      message: "delivered successfully",
    });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
};
exports.addexpensereport = async function (req, res) {
  try {
    var expense_Report = await Expense.create({
      Fuel: req.body.Fuel,
      Toll_tax: req.body.Toll_tax,
      Pet_commision: req.body.Pet_commision,
      Food: req.body.Food,
      bottle_issued6: req.body.bottle_issued6,
      returned6: req.body.returned6,
      sale6: req.body.sale6,
      difference6: req.body.difference6,
      bottle_issued12: req.body.bottle_issued12,
      returned12: req.body.returned12,
      sale12: req.body.sale12,
      difference12: req.body.difference12,
      bottle_issued19: req.body.bottle_issued19,
      returned19: req.body.returned19,
      sale19: req.body.sale19,
      empty19: req.body.empty19,
      filled: req.body.filled,
      difference19: req.body.difference19,
      bottle_issued0: req.body.bottle_issued0,
      returned0: req.body.returned0,
      sale0: req.body.sale0,
      difference0: req.body.difference0,
      bottle_issued1: req.body.bottle_issued1,
      returned1: req.body.returned1,
      sale1: req.body.sale1,
      difference1: req.body.difference1,
      total_Sale: req.body.total_Sale,
      salesmanId: req.user.salesmanId,
      salesmanName: req.user.name,
    });

    console.log(req.body);

    return res.status(200).send(expense_Report);
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
};

exports.myexpense = async function (req, res) {
  try {
    const users = await Expense.findAll({
      where: {
        salesmanId: req.user.salesmanId,
      },
      include: {
        model: Salesman,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.allexpense = async function (req, res) {
  try {
    const users = await Expense.findAll({
      include: {
        model: Salesman,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.alldailyreport = async function (req, res) {
  try {
    const users = await Daily_report.findAll({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
