require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/points-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Create default user if not exists
async function createDefaultUser() {
  try {
    const existingUser = await User.findOne({ username: 'casimirdebonneval' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('wFsKw3gOFnGTx8CF', 10);
      await User.create({
        username: 'casimirdebonneval',
        password: hashedPassword,
        points: 0
      });
      console.log('Default user created');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
}

createDefaultUser();

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret');
    res.json({ token, points: user.points });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = user.userId;
    next();
  });
};

// Update points endpoint
app.post('/api/points', authenticateToken, async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.points = Math.max(0, points);
    await user.save();
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get points endpoint
app.get('/api/points', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 