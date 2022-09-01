const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const request = require("request");
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

exports.getPendingUsers = async function (req, res) {
  try {
    const users = await User.findAll({
      where: { status: "pending" },

      attributes: { exclude: ["password"] },
      include: {
        model: Cnic,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
///////////////////////////verify cnic //////////////////////////////////////////
exports.reviewUserStatus = async function (req, res) {
  try {
    const update = {
      status: "approved",
    };
    const usertoken = await User.findOne({
      where: { id: req.params.id },
    });
    const user = await User.update(update, { where: { id: req.params.id } });
    const token = usertoken.device_token;
    const message = `Your identity is approved`;
    const title = `Message from Darzam`;
    notify(token, message, title);

    var options = {
      method: "POST",
      url: "https://api.veevotech.com/sendsms",
      qs: {
        // api_token: "1c2e1733b0e0c379422f8d61f09f808f6335116532",
        hash: process.env.OTP,

        // api_secret: "office_2020",
        receivenum: `${usertoken.mobile}`,
        sendernum: "Darzam",
        textmessage: `Your derzam Id has been verified.
    `,
      },
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.redirect("/admin/cnic_details/" + req.params.id);
    });

    // return res.status(200).json({
    //   status: "success",
    //   message: "status updated successfully",
    // });
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};

///////////////////////////reject cnic //////////////////////////////////////////
exports.rejectUserStatus = async function (req, res) {
  try {
    // const update = {
    //   status: "rejected",
    // };
    // const usertoken = await User.findOne({
    //   where: { id: req.params.id },
    // });
    // const user = await User.update(update, { where: { id: req.params.id } });
    // const token = usertoken.device_token;
    console.log(req.body);
    console.log(req.params);
    // const message = `Your CNIC is rejected please upload again. Reason: ${req.body.rejections}`;
    // const title = `Message from Darzam`;
    // notify(token, message, title);
    res.redirect("/admin/cnic_details/" + req.params.id);
    // return res.status(200).json({
    //   status: "success",
    //   message: "status updated successfully",
    // });
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
