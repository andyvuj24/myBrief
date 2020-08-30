var express = require("express");
var router = express.Router();
var Parser = require("rss-parser");

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
    return imaps.connect(config).then(function (connection) {
      return connection.openBox("INBOX").then(function () {
        var searchCriteria = ["UNSEEN"];

        var fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: false,
        };

        return connection
          .search(searchCriteria, fetchOptions)
          .then(function (results) {
            var subjects = results.map(function (res) {
              return res.parts.filter(function (part) {
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
