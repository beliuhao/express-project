import 'dotenv/config';
// console.log('Hello Node.js project.');
// console.log(process.env.MY_SECRET);

import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';

import models from '../models';
import routes from '../routes';

const app = express();

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
app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
