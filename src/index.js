import 'dotenv/config';
// console.log('Hello Node.js project.');
// console.log(process.env.MY_SECRET);

import express from 'express';
import cors from 'cors';

const app = express();

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch'
  },
  2: {
    id: '2',
    username: 'Dave Davids'
  }
};
let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1'
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2'
  }
};

app.use(cors());

// curl http://localhost:3000/users
app.get('/users', (req, res) => {
  return res.send(Object.values(users));
});
app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});
// curl - X POST http://localhost:3000
app.post('/users', (req, res) => {
  return res.send('POST HTTP method on user resource');
});
// curl - X PUT http://localhost:3000
app.put('/users/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});
// curl - X DELETE http://localhost:3000
app.delete('/users/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
