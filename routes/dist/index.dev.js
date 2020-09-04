"use strict";

var express = require("express");

var router = express.Router();

var Parser = require("rss-parser");

var imaps = require("imap-simple");

var config = require("./config.json").config;
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
router.get("/unread", function _callee2(req, res, next) {
  var connection, searchCriteria, fetchOptions, results, subjects;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(imaps.connect(config));

        case 3:
          connection = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(connection.openBox("INBOX"));

        case 6:
          searchCriteria = ["UNSEEN"];
          fetchOptions = {
            bodies: ["HEADER", "TEXT"],
            markSeen: false
          };
          _context2.next = 10;
          return regeneratorRuntime.awrap(connection.search(searchCriteria, fetchOptions));

        case 10:
          results = _context2.sent;
          subjects = results.map(function (_ref) {
            var parts = _ref.parts;
            return parts.filter(function (_ref2) {
              var which = _ref2.which;
              return which === 'HEADER';
            })[0].body.subject[0];
          });
          res.json(subjects);
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
module.exports = router;