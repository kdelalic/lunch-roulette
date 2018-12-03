const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const port = 3001;

app.use(cors());

app.get('/api/restaurants', (req, res) => {
  
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  axios({
    url: 'https://api.yelp.com/v3/graphql',
    method: 'post',
    headers: { 'Authorization': 'Bearer tKcIaEyXmxDUFrtM3EYISnLxsI22snBqDH9x6yTAXnB_ZhAz-DB_k4BzIJGlcm9-EFO94wQVxQRuqFZp0M_I8EoDFDHlYXGeXmHD44Sk6LSM1LfUlfAu8ZInwk78W3Yx',
               'Content-Type': 'application/graphql' },
    data: 
      `{
        search(term: "burrito", latitude: `+ latitude + `, longitude: ` + longitude + `, limit: 50, sort_by: "distance") {
          business {
            name
            rating
            review_count
            location {
              address1
              city
            }
          }
        }
      }`
  }).then((result) => {
    let test = result.data.data.search.business;

    res.send(test);
  }).catch((err) => {
    console.log("GET/api/restaurants " + err);
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))

