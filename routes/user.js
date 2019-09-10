import { Router } from 'express';
const router = Router();

// curl http://localhost:3000/users
router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.users));
});
// curl http://localhost:3000/users/1
router.get('/:userId', (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

// TODO:
// curl -X POST http://localhost:3000/users
router.post('/', (req, res) => {
  return res.send('POST HTTP method on user resource');
});
// curl -X PUT http://localhost:3000/users/1
router.put('/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});
// curl -X DELETE http://localhost:3000/users/1
router.delete('/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

export default router;
