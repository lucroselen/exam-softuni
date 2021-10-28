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
    let { username, password } = req.body;
    if (!username || !password) {
      res.render("login", { error: "You must fill in both fields!" });
      return;
    }
    let user = await authServices.login(username, password);

    if (!user) {
      res.render("login", { error: "Invalid username or password!" });
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
  let { username, password, rePassword } = req.body;

  try {
    if (password !== rePassword) {
      res.render("register", { error: "Both passwords must be the same!" });
    } else {
      await authServices.register(username, password);
      let user = await authServices.login(username, password);
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
