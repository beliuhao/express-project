import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import redis from 'redis';
import { promisify } from 'util';
import axios from 'axios';

import models from '../models';
import routes from '../routes';

const app = express();
const redisCli = redis.createClient({
  port: 6379, // replace with your port
  host: '127.0.0.1', // replace with your hostname or IP address
  password: process.env.REDIS_PWD // replace with your password
});

// const getAsync = promisify(redisCli.get).bind(redisCli);

redisCli.on('error', err => {
  console.log('Error ' + err);
});

// redisCli.set('string key', 'string val', redis.print);
// redisCli.hset('hash key', 'hashtest 1', 'some value', redis.print);
// redisCli.hset(['hash key', 'hashtest 2', 'some other value'], redis.print);
// redisCli.hkeys('hash key', function(err, replies) {
//   console.log(replies.length + ' replies:');
//   replies.forEach(function(reply, i) {
//     console.log('    ' + i + ': ' + reply);
//   });
//   redisCli.quit();
// });

// third-party Express middleware
app.use(cors());

// built-in Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// custom Express middleware
app.use((req, res, next) => {
  // do something
  // In between of the middleware function you could do anything now
  // eg, get authenticated user, then use it in the messages post route
  req.context = {
    models,
    me: models.users[1]
  };
  next();
});

// routes
app.use('/api/session', routes.session);
app.use('/api/users', routes.user);
app.use('/api/messages', routes.message);

// use redis as DB
// create an api/search route
app.get('/api/search/:query', (req, res) => {
  // Extract the query from url and trim trailing spaces
  const query = req.params.query.trim();
  // Build the postman API url
  const searchUrl = `https://postman-echo.com/get\?test\=${query}`;

  // Try fetching the result from Redis first in case we have it cached
  return redisCli.get(`postman:${query}`, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      const resultJSON = JSON.parse(result);
      return res.status(200).json(resultJSON);
    } else {
      console.log('!!!!!!!!!');
      // Key does not exist in Redis store
      // Fetch directly from postman API
      return axios
        .get(searchUrl)
        .then(response => {
          const responseJSON = response.data;
          // Save the postman API response in Redis store
          redisCli.setex(
            `postman:${query}`,
            3600,
            JSON.stringify({ source: 'Redis Cache', ...responseJSON })
          );
          // Send JSON response to redisCli
          return res.status(200).json({ source: 'postman API', ...responseJSON });
        })
        .catch(err => {
          return res.json(err);
        });
    }
  });
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
