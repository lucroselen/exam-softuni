const config = require("./config/config")[process.env.NODE_ENV];
const express = require("express");
const app = express();
const routes = require("./routes.js");
const path = require("path");
const cookieParser = require("cookie-parser");
require("./config/handlebars.js")(app);
const initDatabase = require("./config/database");
const { auth } = require("./middlewares/authMiddleware");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auth);
app.use(express.static(path.resolve("./static")));
app.use(routes);

initDatabase(config.DB_CONNECTION_STRING)
  .then(() => {
    app.listen(
      config.PORT,
      console.log(`Listening at http://localhost:${config.PORT}`)
    );
  })
  .catch((err) => {
    console.error(err);
  });
