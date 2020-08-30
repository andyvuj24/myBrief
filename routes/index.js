var express = require("express");
var router = express.Router();
var Parser = require("rss-parser");
let config = require("./config.json")

/* GET home page. */
router.get("/", function (req, res, next) {
  let parser = new Parser();

  (async () => {
    let feed = await parser.parseURL("https://www.reddit.com/r/worldnews/.rss");
    let newsItems = [];
    feed.items.forEach((item, idx) => {
      // console.log(item.title + ':' + item.link)
      newsItems.push({ id: idx, text: item.title });
    });
    // console.log(newsItems);
    res.render("index", { data: JSON.stringify(newsItems) });
  })();
});

router.get("/unread", function (req, res, next) {
  var imaps = require("imap-simple");
  function getUnread() {
    if (!config) return;
    return imaps.connect(config).then( (connection) => {
      return connection.openBox("INBOX").then(() => {
        var searchCriteria = ["UNSEEN"];

        var fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: false,
        };

        return connection
          .search(searchCriteria, fetchOptions)
          .then((results) => {
            var subjects = results.map((res) => {
              return res.parts.filter((part) => {
                return part.which === "HEADER";
              })[0].body.subject[0];
            });
            // return { unread: subjects };
            return subjects;
          });
      });
    }).catch(err => console.log(err));
  }

  getUnread().then((result) => res.json(result));
});

module.exports = router;
