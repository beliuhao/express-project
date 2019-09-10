import uuidv4 from 'uuid/v4';
import { Router } from 'express';
const router = Router();

// curl http://localhost:3000/messages
router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.messages));
});
// curl http://localhost:3000/messages/xxx
router.get('/:messageId', (req, res) => {
  return res.send(req.context.models.messages[req.params.messageId]);
});
// curl -X POST -H "Content-Type:application/json" http://localhost:3000/messages -d '{"text":"Hi again, World"}'
router.post('/', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id
  };
  req.context.models.messages[id] = message;
  return res.send(message);
});
// curl -X PUT -H "Content-Type:application/json" http://localhost:3000/messages/1 -d '{"text":"Hi, Herman"}'
router.put('/:messageId', (req, res) => {
  const { [req.params.messageId]: message, ...otherMessages } = req.context.models.messages;
  const newMessage = {
    id: req.params.messageId,
    text: req.body.text,
    userId: req.context.me.id
  };
  if (message) {
    req.context.models.messages[req.params.messageId] = newMessage;
    return res.send(req.context.models.messages);
  } else {
    return res.send('Invalid msgId!!!');
  }
});
// curl -X DELETE http://localhost:3000/messages/1
router.delete('/:messageId', (req, res) => {
  const { [req.params.messageId]: message, ...otherMessages } = req.context.models.messages;
  req.context.models.messages = otherMessages;
  return res.send(message);
});

export default router;
