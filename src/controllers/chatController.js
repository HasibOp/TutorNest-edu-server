const chatServices = require('../services/chatServices');

const MAX_MESSAGE_LENGTH = 1000;

const sendMessage = async (req, res) => {
  try {
    const { message, interactionId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).send({ message: 'message is required' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).send({ message: 'message is too long' });
    }

    const result = await chatServices.sendMessage(message.trim(), interactionId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'failed to get a reply from the assistant' });
  }
};

module.exports = { sendMessage };
