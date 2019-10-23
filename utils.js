const request = require("request");
const cheerio = require("cheerio");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

brands = ["Samsung", "Acer", "AOC", "Agon", "LG", "MSI", "BenQ", "Dell", "Asus"];

db.defaults({ items: [] }).write();

const updatePrices = function() {
  items = db
    .read()
    .get("items")
    .value();

  Promise.all(
    items.map(el => {
      return new Promise((resolve, reject) => {
        request(el.link, function(err, response, body) {
          if (err) throw err;

          const $ = cheerio.load(body);

          jsFunc = $(".flotC > script").get()[0].children[0].data;
          regexp = /flotChart.setupFlot\((.*]]),(\[\[.*]]),(\[\[.*)\,\'flotchart/g;
          exec = regexp.exec(jsFunc);
          plotData = JSON.parse(exec[1]);
          plotData2 = JSON.parse(exec[2]);
          plotData3 = JSON.parse(exec[3].replace(/'/g, '"'));

          price = $(".product-details .price").text();
          db.get("items")
            .find({ id: el.id })
            .assign({ price: price })
            .assign({ ploty1: plotData })
            .assign({ ploty2: plotData2 })
            .assign({ plotx: plotData3 })
            .write();

          resolve();
        });
      });
    })
  ).then(() => {
    db.set("options.lastUpdate", new Date()).write();
    console.log("prices updated");
  });
};

exports.updatePrices = updatePrices;
