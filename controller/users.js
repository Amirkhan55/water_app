const express = require("express");
const router = express.Router();
const db = require("../config/database");
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var fs = require("fs");

const Role = require("../models/role");

const { Op } = require("sequelize");

exports.register = async function (req, res) {
  try {
    var { name, email, mobile, password, gender } = req.body;
    // console.log(name, email, mobile, password);
    const alreadyExistsUser = await User.findOne({ where: { email } });

    if (alreadyExistsUser) {
      return res
        .status(409)
        .json({ message: "User with email already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const role = await Role.findAll({ where: { id: [1,3] }}).catch(err=>{
    //   res.send(err)
    // });

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      gender,

      profilePic: req.file.filename,
      imagepath: req.file.path,
    });
    res.status(201).json({
      status: "success",
      message: "registeration successful",
    });
    // console.log(user);

    // .catch((err) => res.send(err));
    //  user.addRole(role)
    // res.json({ message: "Thanks for registering" });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

/////////////////////////////////////////////////////.../LOGIN/.../////////////////////////////////////
exports.login = async function (req, res) {
  try {
    const { mobile } = req.query;

    var userWithmobile = await User.findOne({
      where: { mobile },
      include: {
        model: Role,
      },
    }).catch((err) => {
      //console.log("Error: ", err);
    });

    if (!userWithmobile) {
      const user = await User.create({
        mobile,

        roleId: 3,
      });
      res.status(201).json({
        status: "success",
        message: "registeration successful",
      });
    }

    const token = jwt.sign(
      {
        id: userWithEmail.id,
        email: userWithEmail.email,
        name: userWithEmail.name,
      },
      process.env.KEY,
      {
        expiresIn: 86400,
      }
    );
    // res.cookie("jwt", token);
    res.cookie("token", token);
    res.header("token", token);
    if (userWithEmail.role.isAdmin === true) {
      res.redirect("/users/dashboard");
    } else {
      res.status(200).json({
        status: "success",
        message: "Welcome " + userWithEmail.name,
        accessToken: token,
      });
    }

    // res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

///////////////////////////////////////////////////log out/////////////////////////////////////////

exports.logout = async function (req, res) {
  try {
    res.clearCookie("jwt");
    res.redirect("login");
  } catch (error) {
    res.send(error);
  }
};

///////////////////////////////////////////profile edit/////////////////////////////////////////
exports.update_profile = async function (req, res) {
  var { city, country, gender, email, name } = req.body;
  //console.log(req.body);
  const emailfind = await User.findOne({ where: { email: req.user.email } });
  if (emailfind || emailfind === null) {
    await User.update(
      { name, city, gender, email },
      { where: { id: req.user.id } }
    )
      .then(res.status(200).json("profile updated"))
      .catch((err) => {
        // console.log(err.message);
        res.send(err);
      });
  } else {
    res.status(401).json("Email already exists");
  }
};

////////////////////////////////////////////upload and update profile picture///////////////////

exports.update_profilePic = async function (req, res) {
  // res.send("hello");
  var base64Data = req.body.image;
  // let buff = Buffer.from(base64Data, "base64").toString("ascii");

  const file = `${Date.now()}.jpg`;
  const path = `./public/uploads/${file}`;
  const dbpath = path.slice(2);
  fs.writeFileSync(path, base64Data, "base64");
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  if (user.imagepath == null || user.imagepath <= 0) {
    await User.update(
      {
        profilePic: file,
        imagepath: dbpath,
      },
      { where: { id: req.user.id } }
    )
      .then(res.status(200).json("image updated"))
      .catch((err) => res.send(err));
  } else {
    const oldPath = user.imagepath;
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, async (err) => {
        if (err) {
          res.send(err);
        }
      });
      await User.update(
        {
          profilePic: file,
          imagepath: dbpath,
        },
        { where: { id: req.user.id } }
      )
        .then(res.status(200).json("image updated"))
        .catch((err) => res.send(err));
    }
  }
};

//////////////////////////////////////////CNIC ADD////////////////////////////////////////////////

exports.Cnic_register = async function (req, res) {
  var base64Data = req.body.image;

  // let buff = Buffer.from(base64Data, "base64").toString("utf-8");

  const file = `${Date.now()}.jpg`;
  const path = `./public/uploads/${file}`;
  const dbpath = path.slice(2);
  console.log(dbpath);
  fs.writeFileSync(path, base64Data, "base64");

  const cnic = await Cnic.findOne({
    where: { userId: req.user.id },
    include: [{ model: User }],
  });
  if (!cnic) {
    const cnicImage = await Cnic.create({
      // front_img: tempimg[0],
      front_img: file,
      imagepath: dbpath,
      // back_img: tempimg[1],
      userId: req.user.id,
    })
      .then(res.status(200).json({ message: "Thanks for adding CNIC" }))
      .catch((err) => res.send(err));
  } else {
    const oldPath = cnic.imagepath;
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, async (err) => {
        if (err) {
          res.send(err);
        }
      });
      await Cnic.update(
        {
          front_img: file,
          imagepath: dbpath,
        },
        { where: { userId: req.user.id } }
      )
        .then(res.status(200).json("Cnic updated"))
        .catch((err) => res.send(err));
    }
  }
  // } else {
  //   console.log("no file found");
  //   res.send("no file found");
  // }
};

exports.Cnic_register_back = async function (req, res) {
  var base64Data = req.body.image2;

  // let buff = Buffer.from(base64Data, "base64").toString("utf-8");

  const file = `${Date.now()}.jpg`;
  const path = `./public/uploads/${file}`;
  const dbpath = path.slice(2);

  fs.writeFileSync(path, base64Data, "base64");

  const cnic = await Cnic.findOne({
    where: { userId: req.user.id },
    include: [{ model: User }],
  });
  if (cnic.imagepath_back == null || cnic.imagepath_back <= 0) {
    const user = await Cnic.update(
      {
        // front_img: tempimg[0],
        back_img: file,
        imagepath_back: dbpath,
        // back_img: tempimg[1],
        // userId: req.user.id,
      },

      { where: { userId: req.user.id } }
    )
      .then(res.status(200).json({ message: "Thanks for adding CNIC" }))
      .catch((err) => res.send(err));
  } else {
    const oldPath = cnic.imagepath_back;
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, async (err) => {
        if (err) {
          res.send(err);
        }
      });
      await Cnic.update(
        {
          back_img: file,
          imagepath_back: dbpath,
        },
        { where: { userId: req.user.id } }
      )
        .then(res.status(200).json("Cnic updated"))
        .catch((err) => res.send(err));
    }
  }
  // // var tempimg = [];
  // // console.log(req.files);
  // // for (const file of req.files) {
  // //   tempimg.push(file.filename);
  // // // }
  // // if (req.file) {
  // console.log(req.file);
  // const cnic = await Cnic.findOne({
  //   where: { userId: req.user.id },
  //   include: [{ model: User }],
  // });
  // if (cnic.imagepath_back == null || cnic.imagepath_back <= 0) {
  //   const user = await Cnic.update(
  //     {
  //       // front_img: tempimg[0],
  //       back_img: req.file.filename,
  //       imagepath_back: req.file.path,
  //       // back_img: tempimg[1],
  //       // userId: req.user.id,
  //     },

  //     { where: { userId: req.user.id } }
  //   )
  //     .then(res.status(200).json({ message: "Thanks for adding CNIC" }))
  //     .catch((err) => res.send(err));
  // } else {
  //   const oldPath = cnic.imagepath_back;
  //   if (fs.existsSync(oldPath)) {
  //     fs.unlink(oldPath, async (err) => {
  //       if (err) {
  //         res.send(err);
  //       }
  //     });
  //     await Cnic.update(
  //       {
  //         back_img: req.file.filename,
  //         imagepath_back: req.file.path,
  //       },
  //       { where: { userId: req.user.id } }
  //     )
  //       .then(res.status(200).json("Cnic updated"))
  //       .catch((err) => res.send(err));
  //   }
  // }
  // // } else {
  // //   console.log("no file found");
  // //   res.send("no file found");
  // // }
};
exports.myCnic = async function (req, res) {
  try {
    const cnic = await Cnic.findOne({
      where: { userId: req.user.id },
      include: [{ model: User }],
    }).then((c) => {
      res.send(c);
    });
    // res.send(cnic);
  } catch (error) {
    res.send(error);
  }
};

////////////////////////////////////////profile view///////////////////////////////////////////////
exports.profile = async function (req, res) {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },

      attributes: { exclude: ["password"] },
    })
      .then((user) => {
        return res.send(user);
      })
      .catch((error) => {
        //console.log(error);
        res.send(error);
      });
  } catch (error) {
    //console.log(error);
    return res.send(error);
  }
};

exports.updateInfo = async (req, res, next) => {
  const { name, city, email, gender } = req.body;
  const alreadyExistsUser = await User.findOne({ where: { id: req.user.id } });
  let phonenumber = alreadyExistsUser.mobile;
  let username = `${name.split(" ")[0]}${phonenumber
    .toString()
    .slice(phonenumber.length - 4)}`;

  // console.log(req.body);
  const user = await User.update(
    { gender, username, name, city, email },

    { where: { id: req.user.id } }
  );
  return res.status(200).json({
    status: "success",
    message: "Information updated successfully",
  });
};

///////////////////////////contact us email//////////////////////////////////////////
exports.contactUs = async (req, res, next) => {
  var key =
    "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";
  try {
    const { message, email } = req.body;
    let transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "apikey", // generated ethereal user
        pass: key, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter
      .sendMail({
        from: "developer@derzam.com", // sender address
        to: "developer@derzam.com", // list of receivers
        subject: "Customer Query from " + req.body.email, // Subject line
        text: req.body.message, // plain text body
      })
      .then(res.send("success"))
      .catch((e) => {
        res.send(e);
      });
  } catch (error) {
    //console.log(error);
    return res.status(400).json(error.message);
  }
};
//////////////////////////////////////create ride/////////////////////////////////////
exports.createRide = async (req, res, next) => {
  //console.log("Hello");
  try {
    const car = await Car.findOne({
      where: { userId: req.user.id },
    });
    //console.log(req.body);
    const {
      fromCity,
      fromAddress,
      toCity,
      toAddress,
      date,
      pickupTime,
      dropoffTime,
      type,
      frontSeat,
      frontFare,
      backSeat,
      backFare,
      LargeFare,
      LargeParcelQuantity,
      mediumFare,
      mediumParcelQuantity,
      smallFare,
      smallParcelQuantity,
      note,
      carId,
    } = req.body;
    const userId = req.user.id;
    if (car) {
      const ride = await Ride.create({
        from: fromCity,
        fromAddress,
        to: toCity,
        toAddress,
        date,
        pickUpTime: date + ", " + pickupTime,
        dropTime: dropoffTime,
        type,
        frontSeat,
        frontFare,
        backSeat,
        totalseats: backSeat + frontSeat,
        backFare,
        LargeFare,
        LargeParcelQuantity,
        mediumFare,
        mediumParcelQuantity,
        smallFare,
        smallParcelQuantity,
        notes: note,
        carId,
        userId: req.user.id,
      });

      // const rideId = ride.id;
      return res.status(200).json({
        status: "success",
        message: "Ride created  ",
      });
    } else {
      return res.status(400).json("no car registered");
    }
  } catch (error) {
    // console.log(error.message);
    return res.status(400).json(error.message);
  }
};
/////////////////////////////////////////create car////////////////////////////////////////////
exports.createCar = async (req, res, next) => {
  let regNumber = req.body.licensePlate
    .replace(/_/g, "")
    .replace(/\s/g, "")
    .replace(/-/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "");

  const Findcar = await Car.findOne({
    where: { regNo: regNumber.toUpperCase() },
  });

  // if (Findcar) {
  //   return res.status(409).json({
  //     status: "error",
  //     message: "Car already registered",
  //   });
  // }
  const car = await Car.create({
    regNo: regNumber.toUpperCase(),
    seatCapacity: req.body.seatCapacity,
    make: req.body.carBrand,
    model: req.body.carModel,
    registrationYear: req.body.carYear,
    color: req.body.carColor,
    userId: req.user.id,
  });
  return res.status(200).json({
    status: "success",
    message: "Car created successfully",
  });
};
/////////////////////////////////////////mycar////////////////////////////////////////////
exports.myCar = async (req, res, next) => {
  const car = await Car.findAll({
    where: { userId: req.user.id },
  });

  return res.status(200).json(car);
};
/////////////////////////////////////////update car////////////////////////////////////////////
exports.updateCar = async (req, res, next) => {
  var { regNo, make, model, registrationYear, color } = req.body;
  let regNumber = req.body.licensePlate;
  const car = await Car.update(
    {
      regNo: regNumber.toUpperCase(),
      seatCapacity: req.body.seatCapacity,
      make: req.body.carBrand,
      model: req.body.carModel,
      registrationYear: req.body.carYear,
      color: req.body.carColor,
    },
    { where: { id: req.body.id } }
  );
  return res.status(200).json({
    status: "success",
    message: "Car updated successfully",
  });
};
/////////////////////////////////////////update car////////////////////////////////////////////
exports.deleteCar = async (req, res, next) => {
  const car = await Car.destroy({
    where: { [Op.and]: [{ userId: req.user.id }, { id: req.body.carId }] },
  });
  return res.status(200).json({
    status: "success",
    message: "Car deleted successfully",
  });
};

/////////////////////////////////////////////reviews by driver//////////////////////////////////////

exports.review_by_service_provider = async function (req, res) {
  //found job now update it
  try {
    //console.log(req.body);
    var review = await reviews.create({
      review: req.body.review,
      stars: req.body.stars,
      rideId: req.body.rideId,
      receiverId: req.body.userId,
      userId: req.user.id,
    });
    res.json("review submitted");
  } catch (error) {
    res.send(error);
  }
};

// /////////////////////////////////////review by User//////////////////////////////////
// exports.review_by_user = async function (req, res) {
//   try {
//     var review = await reviews
//       .create({
//         review: req.body.review,
//         stars: req.body.stars,
//         rideId: req.body.rideId,
//         receiverId: req.body.userId,
//         userId: req.user.id,
//       })
//       .then(res.send("Review Submitted"))
//       .catch((err) => {
//         res.send(err);
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

////////////////////////////////////////all reviews  update for customer//////////////////////////////////////
// exports.review_by_service_provider = async function (req, res) {
//   var job = await Ride.findOne({
//     where: { id: req.params.id },
//   }).catch((err) => res.send(err));

//   var review = await reviews
//     .update(
//       {
//         review_by_service_provider: req.body.review,
//         stars_by_service_provider: req.body.stars,
//       },
//       { where: { Ride: job.id } }
//     )
//     .then(res.send("Review Submitted"))
//     .catch((err) => res.send(err));
// };

////////////////////////////////////////////find all reviews for display on dashboard of user//////////////////////////

exports.allreviewsfordashboard = async function (req, res) {
  var review = await reviews
    .findAll({
      include: [
        {
          all: true,
        },
      ],
      where: { receiverId: req.user.id },
    })
    .catch((err) => res.send(err));

  res.json(review);
};
