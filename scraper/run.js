import { post, get } from "axios";
import { writeFile } from "fs";

// Make a request for a user with a given ID
get("https://www.dbq.edu/NewsandEvents/")
  .then(function (response) {
    // handle success
    console.log(response);
    writeFile("out.html", response, () => {});
  })
  .catch(function (error) {
    // handle error
    console.error(error);
  })
  .then(function () {
    console.log("All done!");
    // always executed
  });

//   axios.post('/user', {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
