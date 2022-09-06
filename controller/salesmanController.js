const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const request = require("request");
const Customer = require("../models/customer");
const Salesman = require("../models/salesman");
const Record = require("../models/records");
///////////////////////////verify cnic //////////////////////////////////////////
exports.delivered = async function (req, res) {
  try {
    const { bottles, payment, remaining, total } = req.body;
    const user = await Customer.findOne({
      where: { id: req.params.id },
    });
    var App = await Record.create({
      bottles,
      payment,
      remaining,
      total,
      customerId: user.id,
    });

    var options = {
      method: "POST",
      url: "https://api.veevotech.com/sendsms",
      qs: {
        // api_token: "1c2e1733b0e0c379422f8d61f09f808f6335116532",
        hash: process.env.OTP,

        // api_secret: "office_2020",
        receivenum: `${user.mobile}`,
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
