const express = require("express");
const fs = require("fs");
const path = require("path");

const main = require("./utils.js");

const app = express();
app.set("view engine", "pug");
app.set("views", "./views");
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  if (main.getLastUpdate()) {
    main.updatePrices();
  }

  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) throw err;
    // console.log(JSON.parse(data).items);

    db = JSON.parse(data);

    res.render("index", {
      title: "Hey",
      message: "hello world",
      list: db.items,
    });
  });
});
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} in ${process.env.NODE_ENV}`));
