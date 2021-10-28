const { TOKEN_COOKIE_NAME, SECRET } = require("../config/constants");
const jwt = require("jsonwebtoken");
//const courseServices = require("../services/courseServices");

exports.auth = function (req, res, next) {
  let token = req.cookies[TOKEN_COOKIE_NAME];

  if (!token) {
    return next();
  }

  jwt.verify(token, SECRET, function (err, decodedToken) {
    if (err) {
      res.clearCookie(TOKEN_COOKIE_NAME);
      return res.status(401).redirect("/login");
    }

    res.locals.user = decodedToken;
    req.user = decodedToken;

    next();
  });
};

exports.isAuth = function (req, res, next) {
  if (!req.user) {
    return res.status(401).redirect("/login");
  }

  next();
};

exports.isAlreadyLogged = function (req, res, next) {
  if (req.user) {
    return res.status(401).redirect("/");
  }

  next();
};

// exports.isOwner = async function (req, res, next) {
//   //let course = await courseServices.getOne(req.params.id);

//   if (course.owner._id.toString() == req.user._id) {
//     res.locals.isOwner = true;
//     next();
//   } else {
//     res.locals.isOwner = false;
//     res
//       .status(401)
//       .redirect(`/details/${req.params.id}?error=You are not the owner!`);
//   }
// };
