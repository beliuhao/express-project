import 'dotenv/config';
// console.log('Hello Node.js project.');
// console.log(process.env.MY_SECRET);

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/users', (req, res) => {
  return res.send('GET HTTP method on user resource');
});
app.post('/users', (req, res) => {
  return res.send('POST HTTP method on user resource');
});
app.put('/users/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});
app.delete('/users/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
