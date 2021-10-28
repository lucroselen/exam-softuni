const express = require("express");
const { isAuth, isOwner } = require("../middlewares/authMiddleware");
const { errorHandler } = require("../middlewares/errorHandler");
const router = express.Router();
const authServices = require("../services/authServices");

router.get("/", async (req, res) => {
  try {
    //let courses = await courseServices.getAll();

    res.render("home", { title: "Homepage" });
  } catch (error) {
    console.error(error);
    res.render("home", {
      title: "Homepage",
      error:
        "We are experiencing technical difficulties and are working to resolve them. Thank you for your understanding!",
    });
  }
});

module.exports = router;
