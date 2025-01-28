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

// MongoDB Connection with error logging
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Clean User Schema - no Firebase references
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  buttons: [{
    id: String,
    name: String,
    points: Number,
    type: String
  }]
});

// Remove ALL indexes except the default _id
userSchema.indexes().forEach(index => {
  if (index[0] !== '_id') {
    userSchema.index(index[0], false);
  }
});

const User = mongoose.model('User', userSchema);

// Create default user if not exists
async function createDefaultUser() {
  try {
    const existingUser = await User.findOne({ username: 'casimirdebonneval' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('pass', 10);
      await User.create({
        username: 'casimirdebonneval',
        password: hashedPassword,
        points: 0,
        buttons: []
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
    console.log('User data at login:', {
      points: user.points,
      buttons: user.buttons || []
    });
    
    res.json({ 
      token, 
      points: user.points,
      buttons: user.buttons || [] 
    });
  } catch (error) {
    console.error('Login error:', error);
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

// Get user data endpoint (points and buttons)
app.get('/api/user-data', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ points: user.points, buttons: user.buttons || [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update buttons endpoint
app.post('/api/buttons', authenticateToken, async (req, res) => {
  try {
    const { buttons } = req.body;
    console.log('Received buttons data:', buttons);

    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    user.buttons = buttons;
    const savedUser = await user.save();
    console.log('Saved buttons successfully:', savedUser.buttons);

    res.json({ buttons: savedUser.buttons });
  } catch (error) {
    console.error('Error saving buttons:', error);
    console.error('Error details:', {
      message: error.message,
      userId: req.userId,
      buttons: req.body.buttons
    });
    res.status(500).json({ error: 'Server error' });
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.username === username ? 
          'Username already exists' : 
          'Email already exists' 
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      points: 0,
      buttons: []
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 