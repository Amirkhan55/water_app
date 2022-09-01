require("dotenv").config();
const passport = require("passport");

const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/role");

var cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) token = req.cookies["token"];
  return token;
};

var headerExtractor = function (req) {
  var token = req.headers["token"];
  return token;
};
passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.KEY,
    },
    function (jwtPayload, done) {
      return User.findOne({ where: { id: jwtPayload.id } })
        .then((user) => {
          user;

          return done(null, user);
        })
        .catch((Error) => {
          return Error;
        });
    }
  )
);
const authAdmin = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    const verify = jwt.verify(token, process.env.KEY);

    const user = await User.findOne({
      where: { id: verify.id },
      include: {
        model: Role,
      },
    });
    // const userRole=  await user.getRoles()
    // let checkrole=userRole.some( e => e['name'] === 'admin')
    if (user.role.isAdmin === true) {
      next();
    } else {
      res.send("you are not authorized");
    }
  } catch (error) {}
};
const authManager = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    const verify = jwt.verify(token, process.env.KEY);

    const user = await User.findOne({
      where: { id: verify.id },
      include: {
        model: Role,
      },
    });
    // const userRole=  await user.getRoles()
    // let checkrole=userRole.some( e => e['name'] === 'admin')
    if (user.role.isManager === true) {
      next();
    } else {
      res.send("you are not authorized");
    }
  } catch (error) {}
};
async function checkForAdminPanel(user) {
  const userRole = await user.getRoles();
  return userRole.some((e) => e["name"] === "admin");
}

function initialize() {
  return passport.initialize();
}
function authenticate(req, res, next) {
  return passport.authenticate(
    "jwt",
    {
      session: false,
    },
    (err, user, info) => {
      if (err) {
        // console.log(err);
        return next(err);
      }
      if (!user) {
        return res.redirect("/users/login");
      }
      // Forward user information to the next middleware
      req.user = user;
      next();
    }
  )(req, res, next);
}
const autherization = async (req, res, next) => {
  const { authorization } = req.headers;
  // const token = req.cookies["token"];
  if (req && req.cookies) token = req.cookies["token"];
  if (!token) {
    res.send("Token is required");
  } else {
    const decoded = jwt.verify(token, process.env.KEY);

    await User.findOne({ where: { id: decoded.id } });

    if (!User) {
      return next(new ErrorHandler("No active user found with that id", 404));
    }

    req.user = User;

    next();
  }
};
module.exports = {
  passport,
  authAdmin,
  authManager,
  authenticate,
  autherization,
};
