const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const { recordLogin } = require('./historyController');

const SECRET = 'subscription_secret_key_2024';

const register = (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required.' });

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Hashing error.' });
    createUser(name, email, hashedPassword, phone, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already registered.' });
        return res.status(500).json({ message: 'Registration failed.' });
      }
      res.status(201).json({ message: 'Registration successful!' });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  findUserByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials.' });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
    
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      recordLogin(user.id, ipAddress, userAgent, () => {});
      
      const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET, { expiresIn: '24h' });
      res.json({ token, name: user.name });
    });
  });
};

module.exports = { register, login };
