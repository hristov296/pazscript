const request = require("request");
const cheerio = require("cheerio");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

brands = ["Samsung", "Acer", "AOC", "Agon", "LG", "MSI", "BenQ", "Dell", "Asus"];

db.defaults({ items: [] }).write();

// getListFromEdigital();
// checkAgainstPaz();
// updatePrices();
// sortmyDB();

// const plotFunction = `jQuery(${a}).plot(${b},{xaxis:{ticks:${c}},grid:{hoverable: true, clickable: true, mouseActiveRadius: 20, autoHighlight: true}, crosshair:{mode: 'x', color: '#000'}, series: {lines: { show: true},points: {show:true}}})`;

function checkAgainstPaz() {
  pazLink = "https://www.pazaruvaj.com/CategorySearch.php?st=";
  items = db
    .read()
    .get("items")
    .value();

  posts = db.get("items").value();
  items.forEach(el => {
    request(pazLink + el.id, function(err, response, body) {
      if (err) throw err;

      const $ = cheerio.load(body);

      href = $(".product-box-container > a").attr("href");
      post = db
        .get("items")
        .find({ id: el.id })
        .value();

      post.link = href;
      db.get("items")
        .find({ id: el.id })
        .set(post)
        .write();
    });
  });
}

function getListFromEdigital() {
  request(
    "https://edigital.bg/laptopi-it-produkti/monitori-prozhektori/monitori-c1067?filter%5Bsearch%5D=&filter%5Bspecification%5D%5B2552%5D%5B%5D=75944&filter%5Bspecification%5D%5B338%5D%5B%5D=13943&filter%5Bspecification%5D%5B338%5D%5B%5D=13945&filter%5Bspecification%5D%5B338%5D%5B%5D=105602&filter%5Bspecification%5D%5B338%5D%5B%5D=104989&filter%5Bspecification%5D%5B338%5D%5B%5D=13946&filter%5Bspecification%5D%5B664952%5D%5B%5D=106966&filter%5Border%5D=score&filter%5Blimit%5D=60",
    function(err, response, body) {
      if (err) throw err;

      items = [];
      const $ = cheerio.load(body);

      $(".product-list-wrap > li").each(function(i, el) {
        title = $(this)
          .find(".name")
          .text()
          .trim();
        link =
          "https://edigital.bg" +
          $(this)
            .find(".name > a")
            .attr("href");
        keywords = title.split(" ");
        words = keywords.filter(
          word => brands.includes(word) || RegExp("(?=.*[0-9])(?!.*hz)([a-z0-9-]{5,})", "i").test(word)
        );
        items.push({ id: words.join("-").toLowerCase(), title: title, link: link, keywords: words });
      });

      items.forEach(el => {
        db.get("items")
          .push(el)
          .write();
      });
      // db.write();
    }
  );
}

function sortmyDB() {
  items = db
    .read()
    .get("items")
    .value();

  items.sort((a, b) => {
    a = a.price.replace(/[отлв ]/g, "");
    b = b.price.replace(/[отлв ]/g, "");
    if (Number.parseInt(a) < Number.parseInt(b)) {
      return -1;
    } else {
      return 1;
    }
  });

  db.set("items", []).write();
  db.set("items", items).write();
}
