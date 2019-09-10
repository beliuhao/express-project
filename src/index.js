import 'dotenv/config';
// console.log('Hello Node.js project.');
// console.log(process.env.MY_SECRET);

import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';

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
  req.me = users[1];
  next();
});

// curl http://localhost:3000/users
app.get('/users', (req, res) => {
  return res.send(Object.values(users));
});
app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});
// curl -X POST http://localhost:3000/users
app.post('/users', (req, res) => {
  return res.send('POST HTTP method on user resource');
});
// curl -X PUT http://localhost:3000/users/1
app.put('/users/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});
// curl -X DELETE http://localhost:3000/users/1
app.delete('/users/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

// curl http://localhost:3000/messages
app.get('/messages', (req, res) => {
  return res.send(messages);
});
// curl http://localhost:3000/messages/xxx
app.get('/messages/:msgId', (req, res) => {
  return res.send(messages[req.params.msgId]);
});
// curl -X POST -H "Content-Type:application/json" http://localhost:3000/messages -d '{"text":"Hi again, World"}'
app.post('/messages', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.me.id
  };
  messages[id] = message;
  return res.send(message);
});
// curl -X PUT -H "Content-Type:application/json" http://localhost:3000/messages/1 -d '{"text":"Hi, Herman"}'
app.put('/messages/:messageId', (req, res) => {
  const { [req.params.messageId]: message, ...otherMessages } = messages;
  const newMessage = {
    id: req.params.messageId,
    text: req.body.text,
    userId: req.me.id
  };
  if (message) {
    messages[req.params.messageId] = newMessage;
    return res.send(messages);
  } else {
    return res.send('Invalid msgId!!!');
  }
});
// curl -X DELETE http://localhost:3000/messages/1
app.delete('/messages/:messageId', (req, res) => {
  const { [req.params.messageId]: message, ...otherMessages } = messages;
  messages = otherMessages;
  return res.send(message);
});
// get authenticated user
app.get('/session', (req, res) => {
  return res.send(users[req.me.id]);
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
