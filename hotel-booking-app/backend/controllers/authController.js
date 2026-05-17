const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../middleware/authMiddleware');


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (e) {
    console.error('Registration Error:', e);
    res.status(422).json("Registration failed");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(404).json('User not found');
    const passOk = await bcrypt.compare(password, userDoc.password);
    if (!passOk) return res.status(401).json('Wrong password');

    jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
      if (err) return res.status(500).json('Token error');
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' }).json(userDoc);
    });
  } catch (e) {
    res.status(500).json('Login failed');
  }
};

const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json(null);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.json(null);
    const user = await User.findById(userData.id);
    if(!user) return res.json(null);
    res.json({ name: user.name, email: user.email, _id: user._id });
  });
};

const logoutUser = (req, res) => {
  res.cookie('token', '').json(true);
};

module.exports = { registerUser, loginUser, getProfile, logoutUser };
