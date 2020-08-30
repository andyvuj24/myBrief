"use strict";

var express = require("express");

var router = express.Router();

var Parser = require("rss-parser");
/* GET home page. */


router.get("/", function (req, res, next) {
  var parser = new Parser();

  (function _callee() {
    var feed, newsItems;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(parser.parseURL("https://www.reddit.com/r/worldnews/.rss"));

          case 2:
            feed = _context.sent;
            newsItems = [];
            feed.items.forEach(function (item, idx) {
              // console.log(item.title + ':' + item.link)
              newsItems.push({
                id: idx,
                text: item.title
              });
            }); // console.log(newsItems);

            res.render("index", {
              data: JSON.stringify(newsItems)
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  })();
});
router.get("/unread", function (req, res, next) {
  var imaps = require("imap-simple");

  var config;
  fs.readFile("config.json", function (err, data) {
    config = JSON.parse(data);
  });

  function getUnread() {
    if (!config) return;
    return imaps.connect(config).then(function (connection) {
      return connection.openBox("INBOX").then(function () {
        var searchCriteria = ["UNSEEN"];
        var fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: false
        };
        return connection.search(searchCriteria, fetchOptions).then(function (results) {
          var subjects = results.map(function (res) {
            return res.parts.filter(function (part) {
              return part.which === "HEADER";
            })[0].body.subject[0];
          }); // return { unread: subjects };

          return subjects;
        });
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  }

  getUnread().then(function (result) {
    return res.json(result);
  });
});
module.exports = router;