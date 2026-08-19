const jwt = require('jsonwebtoken');

const tokenIssue = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: 'email is required' });
  }
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  res.send({ 
    success: true, token });
};

module.exports = { tokenIssue };
