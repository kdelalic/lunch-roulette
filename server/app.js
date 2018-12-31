const express = require('express');
const axios = require('axios');

const app = express();
const cors = require('cors');

const port = 3001;

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/api/graphql/restaurants', (req, res) => {
    const {latitude, longitude, offset, limit} = req.query;

    axios({
        url: 'https://api.yelp.com/v3/graphql',
        method: 'post',
        headers: {
            Authorization:
                'Bearer tKcIaEyXmxDUFrtM3EYISnLxsI22snBqDH9x6yTAXnB_ZhAz-DB_k4BzIJGlcm9-EFO94wQVxQRuqFZp0M_I8EoDFDHlYXGeXmHD44Sk6LSM1LfUlfAu8ZInwk78W3Yx',
            'Content-Type': 'application/graphql'
        },
        data: `{
        search(term: "restaurants", latitude: ${latitude}, longitude: ${longitude}, limit: ${limit}, offset: ${offset}) {
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
    })
        .then(result => {
            res.send(result.data.data.search.business);
        })
        .catch(err => {
            console.log(`GET/api/graphql/restaurants ${err}`);
        });
});

app.get('/api/restaurants', (req, res) => {
    const {latitude, longitude, offset, limit} = req.query;
    const term = 'restaurants';

    const url =
        `https://api.yelp.com/v3/businesses/search` +
        `?term=${term}` +
        `&latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&offset=${offset}` +
        `&limit=${limit}`;

    console.log(url);

    axios({
        url,
        method: 'get',
        headers: {
            Authorization:
                'Bearer tKcIaEyXmxDUFrtM3EYISnLxsI22snBqDH9x6yTAXnB_ZhAz-DB_k4BzIJGlcm9-EFO94wQVxQRuqFZp0M_I8EoDFDHlYXGeXmHD44Sk6LSM1LfUlfAu8ZInwk78W3Yx'
        }
    })
        .then(result => {
            res.send(result.data.businesses);
        })
        .catch(err => {
            console.log(`GET/api/restaurants ${err}`);
        });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
