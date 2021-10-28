const handlebars = require("express-handlebars");
const useHandlebars = (app) => {
  app.engine(
    "hbs",
    handlebars({
      extname: "hbs",
    })
  );
  app.set("view engine", "hbs");
};

module.exports = useHandlebars;
