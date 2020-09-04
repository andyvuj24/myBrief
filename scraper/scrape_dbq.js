const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");

// Make a request for a user with a given ID

axios.get("https://www.dbq.edu/NewsandEvents/").then(function (response) {
    // handle success
    // console.log(response);
    // fs.writeFile("out.html", response.data, () => {});
    const $ = cheerio.load(response.data);
    const posts = $(".post-details");
    console.log(posts);
    const outPosts = posts.map((idx, el) => {
        return [[$(el).children("h4").children("a").text().trim(), $(el).children("h6").text().trim(), $(el).children("p").text().trim()]];
    }).toArray();
    const dataToWrite = JSON.stringify(outPosts);
    fs.writeFile("dbq_news_posts.json", dataToWrite, () => {console.log(`Wrote:\n${dataToWrite}`)});
  }).catch(function (error) {
    // handle error
    console.error(error);
  }).then(function () {
    console.log("All done!");
    // always executed
  });
