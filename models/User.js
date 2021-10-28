const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username should not be empty!"],
    minLength: [5, "Username should be at least 5 characters long!"],
    validate: [
      /^[A-Z0-9]*$/i,
      "Username should consist only english letters and digits!",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password should not be empty!"],
    minLength: [5, "Password should be at least 5 characters long!"],
    validate: [
      /^[A-Z0-9]*$/i,
      "Password should consist only english letters and digits!",
    ],
  },
});

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next("Username is already taken!");
  } else {
    next(error);
  }
});
userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;

    next();
  });
});

userSchema.method("validatePassword", function (password) {
  return bcrypt.compare(password, this.password);
});
const User = mongoose.model("User", userSchema);

module.exports = User;
