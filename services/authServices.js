const User = require("../models/User");
const { jwtSign } = require("../utils/jwtUtils");
const { SECRET } = require("../config/constants");

const register = (username, password) => User.create({ username, password });

const login = (username, password) => {
  return User.findOne({ username })
    .then((user) => Promise.all([user.validatePassword(password), user]))
    .then(([isValid, user]) => {
      if (isValid) {
        return user;
      } else {
        throw { message: "Cannot find username or password" };
      }
    })
    .catch(() => null);
};

const createToken = function (user) {
  let payload = {
    _id: user._id,
    username: user.username,
  };

  return jwtSign(payload, SECRET);
};

let authServices = { register, login, createToken };
module.exports = authServices;
