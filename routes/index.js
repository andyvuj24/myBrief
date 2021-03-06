const express = require("express");
const router = express.Router();
const Parser = require("rss-parser");
const imaps = require("imap-simple");
const config = require("./config.json").config;

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

router.get("/unread", async (req, res, next) => {
  try {
    const connection = await imaps.connect(config)
    await connection.openBox("INBOX")
  
    const searchCriteria = ["UNSEEN"]
    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: false
    }

    const results = await connection.search(searchCriteria, fetchOptions)

    const subjects = results.map(
      ({ parts }) => parts.filter(
        ({which}) => which === 'HEADER'
      )[0].body.subject[0]
    )

    res.json(subjects)
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
