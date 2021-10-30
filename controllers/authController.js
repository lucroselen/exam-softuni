const express = require("express");
const { isAuth, isAlreadyLogged } = require("../middlewares/authMiddleware");
const router = express.Router();
const { TOKEN_COOKIE_NAME } = require("../config/constants");
const authServices = require("../services/authServices");
const { errorHandler } = require("../middlewares/errorHandler");

router.get("/register", isAlreadyLogged, (req, res) => {
  res.render("register", { title: "Register" });
});

router.get("/login", isAlreadyLogged, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  res.redirect("/");
});

router.post("/login", isAlreadyLogged, async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.render("login", { error: "You must fill in both fields!" });
      return;
    }
    let user = await authServices.login(email, password);

    if (!user) {
      res.render("login", { error: "Invalid email or password!" });
    } else {
      let token = await authServices.createToken(user);

      res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
      });

      res.redirect("/");
    }
  } catch (error) {
    res.render("login", { error: errorHandler(error) });
  }
});

router.post("/register", isAlreadyLogged, async (req, res) => {
  let { firstName, lastName, email, password, rePassword } = req.body;
  email = email.toLowerCase();

  try {
    if (firstName && lastName) {
      firstName =
        firstName[0].toUpperCase() + firstName.substring(1).toLowerCase();

      lastName =
        lastName[0].toUpperCase() + lastName.substring(1).toLowerCase();
    }

    if (password !== rePassword) {
      res.render("register", { error: "Both passwords must be the same!" });
    } else {
      await authServices.register(firstName, lastName, email, password);
      let user = await authServices.login(email, password);
      let token = await authServices.createToken(user);

      res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
      });

      res.redirect("/");
    }
  } catch (error) {
    res.render("register", { error: errorHandler(error) });
  }
});

module.exports = router;
